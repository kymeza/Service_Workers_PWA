const publicVapidKey = 'BBTa8_u4mz4y3Jjnk5VtoiYmQg3RSS9uWhoVSEZ8eEUPBs1tJbNajmZwFkKNLHiLk3D67eJO1wP493MoRWbaR9Q';

// Check for service worker
if ('serviceWorker' in navigator) {
  send().catch(error => console.error(error));
}

// Register Service Worker, Register Push, Send Push
async function send() {
  // Register Service Worker
  console.log('Registering service worker...');
  const register = await navigator.serviceWorker.register('/service-worker.js', {
    scope: '/'
  });
  console.log('Service Worker Registered...');

  // Register Push
  console.log('Registering Push...');
  const subscription = await register.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
  });
  console.log('Push Registered...');

  // Send Push Notification
  console.log('Sending Push...');
  await fetch('/subscribe', {
    method: 'POST',
    body: JSON.stringify(subscription),
    headers: {
      'content-type': 'application/json'
    }
  });
  console.log(JSON.stringify(subscription));
  console.log('Push Sent...');
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
