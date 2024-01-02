const publicVapidKey = "BEDDMlyo3fZMHt5CVYg8fas4x8wzZ6eRBXGayeL5qBJoaQ35D6x_xqsJr4NuDxO4kG_MFEZbaGf7NBl1J3GGBM4";
const registration = '';

// Check for service worker
if ('serviceWorker' in navigator)  {
    try  {
        registerServiceWorker();
        registerPushManger();
    }
    catch (e) {
        console.log('Service worker registration failed', e);
    }
}

async function registerServiceWorker() {
    try {
        registration = await navigator.serviceWorker.register('/service-worker.js');
    } catch (e) {
        console.log('Service worker registration failed', e);
    }
}

async function registerPushManger() {
    //register push notifications
    console.log('Registering Push...');
    const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
    });
    console.log(subscription);
    console.log('Push Registered...');
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