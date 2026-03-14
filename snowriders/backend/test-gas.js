const url = 'https://script.google.com/macros/s/AKfycbxrbnP_YmIjNIKFL2XD10AfMLCEe6FQtLbCqY0tWbSrdrX59TcUcm2ieWe0lR-iqJgG/exec';

async function test() {
  try {
    const rawRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        recipient: 'test@example.com',
        subject: 'Test Subject',
        body: '<h1>Test Body!</h1>'
      }),
      redirect: 'follow'
    });

    console.log('Status:', rawRes.status);
    console.log('Type:', rawRes.type);
    console.log('Redirected:', rawRes.redirected);
    const text = await rawRes.text();
    console.log('Response Body:', text.substring(0, 300));
  } catch (e) {
    console.error('Fetch Error:', e);
  }
}
test();
