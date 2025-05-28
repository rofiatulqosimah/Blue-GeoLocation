import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { firebaseConfig } from '../config/firebase-config.js';
import { ApiService } from './ApiService.js';

export class NotificationService {
  constructor() {
    this.apiService = new ApiService();
    this.app = initializeApp(firebaseConfig);
    this.messaging = getMessaging(this.app);
    this.setupMessageListener();
  }

  setupMessageListener() {
    onMessage(this.messaging, (payload) => {
      console.log('Message received:', payload);
      this.showNotification(
        payload.notification.title,
        {
          body: payload.notification.body,
          icon: '/images/icon-192.png'
        }
      );
    });
  }

  async requestPermission() {
    if (!('Notification' in window)) {
      throw new Error('This browser does not support notifications');
    }

    try {
      const permission = await Notification.requestPermission();
      console.log('Notification permission status:', permission);
      return permission;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      throw error;
    }
  }

  async subscribe() {
    try {
      const permission = await this.requestPermission();
      if (permission !== 'granted') {
        throw new Error('Notification permission denied');
      }

      // Wait for service worker registration
      console.log('Waiting for service worker registration...');
      const registration = await navigator.serviceWorker.ready;
      console.log('Service Worker ready, proceeding with FCM registration');

      // Get FCM token
      console.log('Requesting FCM token...');
      const token = await getToken(this.messaging, {
        vapidKey: 'BLeV_DXiuQbEKrc6mKEQXprswKy9FZ1Snu6haEwCshJc-7iMc8Y_l8fd6fjbEIaZGvBDkD5I1-9omNlw_knapL4'
      });

      if (!token) {
        throw new Error('No FCM registration token available');
      }

      console.log('FCM Token obtained:', token);
      localStorage.setItem('fcmToken', token);
      return token;
    } catch (error) {
      console.error('Failed to subscribe to notifications:', error);
      throw error;
    }
  }

  async unsubscribe() {
    try {
      localStorage.removeItem('fcmToken');
    } catch (error) {
      console.error('Failed to unsubscribe from notifications:', error);
      throw error;
    }
  }

  showNotification(title, options = {}) {
    if (!('Notification' in window)) {
      return;
    }

    if (Notification.permission === 'granted') {
      new Notification(title, options);
    }
  }

  cleanup() {
    // Cleanup any listeners or resources
  }
}
