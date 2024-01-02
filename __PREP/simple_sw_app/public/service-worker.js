self.addEventListener('push', event => {
    const data = event.data.json();
    console.log('Push received...');
    self.registration.showNotification(data.title, {
      body: 'Notified by Service Worker',
      icon: 'icon.png'
    });
  });
  

  self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open('v1').then((cache) => {
        return cache.addAll([
          '/index.html',
          '/main.js',
          '/style.css',
          '/offline.html', 
        ]);
      })
    );
  });
  
  self.addEventListener('activate', (event) => {
    const cacheWhitelist = ['v1'];
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
  });

  
  self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          // Return the cached response if found
          if (response) {
            return response;
          }
          // Try to fetch the resource from the network
          return fetch(event.request).catch(() => {
            // If both the network and cache miss, return the offline page
            if (event.request.mode === 'navigate') {
              return caches.match('/offline.html');
            }
          });
        })
    );
  });
  
  
  
  

  self.addEventListener('sync', (event) => {
    if (event.tag == 'myFirstSync') {
      event.waitUntil(doSomeBackgroundSync());
    }
  });
  
  function doSomeBackgroundSync() {
    // Your sync logic here
  }

  self.addEventListener('message', (event) => {
    console.log(`The client sent me a message: ${event.data}`);
  });

  
  self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    // Handle the notification click
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((windowClients) => {
        for (let i = 0; i < windowClients.length; i++) {
          const client = windowClients[i];
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  });
  

  self.addEventListener('notificationclose', (event) => {
    // Perform some action in response to notification being closed
  });
  

  self.addEventListener('pushsubscriptionchange', (event) => {
    event.waitUntil(
      self.registration.pushManager.subscribe(event.oldSubscription.options)
      .then((subscription) => {
        // Send the new subscription details to the server via the API
      })
    );
  });

  
