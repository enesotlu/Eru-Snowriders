// Global fetch is available in Node 24

async function test() {
  const baseUrl = 'http://localhost:5005/api/auth';
  
  console.log('--- Testing Registration ---');
  try {
    const regRes = await fetch(`${baseUrl}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test',
        surname: 'User',
        studentNumber: '123456789',
        department: 'Computer Engineering',
        phone: '05551112233',
        email: 'testuser@gmail.com',
        password: 'password123'
      })
    });
    const regData = await regRes.json();
    console.log('Registration Status:', regRes.status);
    console.log('Registration Response:', regData);
  } catch (err) {
    console.error('Registration Error:', err.message);
  }

  console.log('\n--- Testing Forgot Password ---');
  try {
    const start = Date.now();
    const forgotRes = await fetch(`${baseUrl}/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'testuser@gmail.com' })
    });
    const duration = (Date.now() - start) / 1000;
    const forgotData = await forgotRes.json();
    console.log(`Forgot Password Status: ${forgotRes.status} (Took ${duration}s)`);
    console.log('Forgot Password Response:', forgotData);
  } catch (err) {
    console.error('Forgot Password Error:', err.message);
  }

  console.log('\n--- Testing Resend Code ---');
  try {
    const resendRes = await fetch(`${baseUrl}/resend-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'testuser@gmail.com' })
    });
    const resendData = await resendRes.json();
    console.log('Resend Code Status:', resendRes.status);
    console.log('Resend Code Response:', resendData);
  } catch (err) {
    console.error('Resend Code Error:', err.message);
  }
}

test();
