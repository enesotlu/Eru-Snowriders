require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

async function runTest() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eru-snowriders');
    console.log('✅ Connected to MongoDB');

    const testEmail = 'admin_test_user@snowriders.com';
    const testPassword = 'password123';

    // Cleanup previous test user if exists
    await User.deleteOne({ email: testEmail });

    // Create a new admin user (isVerified will be false by default if we don't set it)
    const adminUser = new User({
      name: 'Test',
      surname: 'Admin',
      studentNumber: '1234567890',
      department: 'Test Dept',
      phone: '5551234567',
      email: testEmail,
      password: testPassword,
      role: 'admin',
      isVerified: false // Testing the bypass logic explicitly
    });
    await adminUser.save();
    console.log('✅ Created test admin user with isVerified: false');

    // Attempt login via the normal user login endpoint (/api/auth/login)
    console.log('\n--- Testing Normal Login Endpoint with Admin Credentials ---');
    const response = await fetch('http://localhost:5005/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: testPassword })
    });
    const data = await response.json();

    if (response.ok && data.success) {
      console.log('✅ SUCCESS: Admin successfully logged in from normal user endpoint!');
      console.log('Token Received:', data.token ? 'Yes' : 'No');
      console.log('Returned User Role:', data.user.role);
    } else {
      console.error('❌ FAILED: Admin could not log in from normal user endpoint.');
      console.error('Response Status:', response.status);
      console.error('Response Data:', data);
    }

    // Attempt login via the admin login endpoint (/api/auth/admin-login) for comparison
    console.log('\n--- Testing Admin Login Endpoint with Admin Credentials ---');
    const adminResponse = await fetch('http://localhost:5005/api/auth/admin-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: testPassword })
    });
    const adminData = await adminResponse.json();

    if (adminResponse.ok && adminData.success) {
      console.log('✅ SUCCESS: Admin successfully logged in from admin endpoint!');
    } else {
      console.error('❌ FAILED: Admin could not log in from admin endpoint.');
      console.error('Response Status:', adminResponse.status);
      console.error('Response Data:', adminData);
    }

    // Cleanup
    await User.deleteOne({ email: testEmail });
    console.log('\n✅ Cleaned up test user');

    process.exit(0);
  } catch (err) {
    console.error('Test error:', err);
    process.exit(1);
  }
}

runTest();
