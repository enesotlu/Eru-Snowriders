const axios = require('axios');

async function testRegister() {
  try {
    const res = await axios.post('http://localhost:5005/api/auth/register', {
      name: 'Test',
      surname: 'User',
      studentNumber: `999${Math.floor(Math.random() * 100000)}`,
      department: 'Test Dept',
      phone: '1234567890',
      email: `test${Math.floor(Math.random() * 100000)}@gmail.com`,
      password: 'password123'
    });
    console.log('Success:', res.data);
  } catch (err) {
    if (err.response) {
      console.log('Error Data:', JSON.stringify(err.response.data, null, 2));
    } else {
      console.log('Error:', err.message);
    }
  }
}

testRegister();
