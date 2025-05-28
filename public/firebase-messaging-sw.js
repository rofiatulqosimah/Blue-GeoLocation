self.addEventListener('install', (event) => {
  console.log('Service Worker installing.');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating.');
  event.waitUntil(self.clients.claim());
});

// Import and initialize the Firebase SDK
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