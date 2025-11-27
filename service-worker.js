// This event handles clicks on notifications
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  // This looks for an open window matching the app's URL
  // If one is found, it focuses it.
  // If not, it opens a new one.
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If a client is already open, focus it
      if (clientList.length > 0) {
        let client = clientList[0];
        for (let i = 0; i < clientList.length; i++) {
          if (clientList[i].focused) {
            client = clientList[i];
          }
        }
        return client.focus();
      }
      // Otherwise, open a new window
      return clients.openWindow('/');
    })
  );
});

// This is for actual push notifications from a server (infrastructure setup)
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : { title: 'Cảnh Báo Triều Cường', body: 'Có thông tin cảnh báo mới.' };
  const options = {
    body: data.body,
    icon: '/vite.svg',
    badge: '/vite.svg',
  };
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// A simple install event to log when the service worker is installed
self.addEventListener('install', event => {
  console.log('Service Worker installing.');
  // Skip waiting to ensure the new service worker activates immediately
  self.skipWaiting();
});

// A simple activate event to log when the service worker is activated
self.addEventListener('activate', event => {
  console.log('Service Worker activating.');
  // Take control of all pages under its scope immediately
  return self.clients.claim();
});
