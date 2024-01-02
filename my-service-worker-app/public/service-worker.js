self.addEventListener('push', event => {
    const data = event.data.json();
    console.log('Push received...');
    self.registration.showNotification(data.title, {
      body: 'Notified by Service Worker',
      icon: 'icon.png'
    });
  });