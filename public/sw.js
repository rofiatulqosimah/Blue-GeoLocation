importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.3.0/workbox-sw.js');

// Initialize Workbox
workbox.setConfig({
  debug: false
});

// Cache the Google Fonts stylesheets with a stale-while-revalidate strategy
workbox.routing.registerRoute(
  /^https:\/\/fonts\.googleapis\.com/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'google-fonts-stylesheets',
  })
);

// Cache the underlying font files with a cache-first strategy for 1 year
workbox.routing.registerRoute(
  /^https:\/\/fonts\.gstatic\.com/,
  new workbox.strategies.CacheFirst({
    cacheName: 'google-fonts-webfonts',
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 365,
        maxEntries: 30,
      }),
    ],
  })
);

// Cache images with a cache-first strategy
workbox.routing.registerRoute(
  /\.(?:png|jpg|jpeg|svg|gif)$/,
  new workbox.strategies.CacheFirst({
    cacheName: 'images',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      }),
    ],
  })
);

// Cache CSS, JS, and Web Worker files with a stale-while-revalidate strategy
workbox.routing.registerRoute(
  /\.(?:js|css)$/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'static-resources',
  })
);

// Cache HTML files with a network-first strategy
workbox.routing.registerRoute(
  /\.html$/,
  new workbox.strategies.NetworkFirst({
    cacheName: 'html-cache',
  })
);

// Import and initialize Firebase
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDZIY7TUGOP5bENOpki7d9tVNybKKrVzD4",
  authDomain: "fia-fia-fia.firebaseapp.com",
  projectId: "fia-fia-fia",
  storageBucket: "fia-fia-fia.firebasestorage.app",
  messagingSenderId: "867735575696",
  appId: "1:867735575696:web:09a5061f46c7d46dee4c15",
  measurementId: "G-CWMRBP4VZ5"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/images/icon-192.png',
    badge: '/images/icon-192.png'
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle push notifications
self.addEventListener('push', function(event) {
  console.log('Push message received:', event);
  if (event.data) {
    const payload = event.data.json();
    const options = {
      body: payload.notification.body,
      icon: payload.notification.icon || '/images/icon-192.png',
      image: payload.notification.image,
      badge: '/images/icon-192.png',
      data: payload.data,
      vibrate: [200, 100, 200]
    };

    event.waitUntil(
      self.registration.showNotification(payload.notification.title, options)
    );
  }
}); 