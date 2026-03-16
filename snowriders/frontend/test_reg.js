async function test() {
  try {
    const res = await fetch('http://localhost:5005/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test',
        surname: 'User',
        studentNumber: `999${Math.floor(Math.random() * 100000)}`,
        department: 'Test Dept',
        phone: '1234567890',
        email: `test${Math.floor(Math.random() * 100000)}@gmail.com`,
        password: 'password123'
      })
    });
    console.log('STATUS:', res.status);
    const text = await res.text();
    console.log('BODY:', text);
  } catch (err) {
    console.log('HATA:', err.message);
  }
}
test();
