import { MapService } from './services/MapService.js';
import { NotificationService } from './services/NotificationService.js';
import { Router } from './services/Router.js';

import { StoryModel } from './models/StoryModel.js';
import { UserModel } from './models/UserModel.js';

import { StoryListView } from './views/StoryListView.js';
import { AddStoryView } from './views/AddStoryView.js';
import { AuthView } from './views/AuthView.js';
import { HomeView } from './views/HomeView.js';

import { StoryPresenter } from './presenters/StoryPresenter.js';
import { AuthPresenter } from './presenters/AuthPresenter.js';
import { AddStoryPresenter } from './presenters/AddStoryPresenter.js';

if ('serviceWorker' in navigator) {
  let cleanupInterval;
  window.addEventListener('load', async () => {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
      }

      // Register the new service worker
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });
      console.info('ServiceWorker registration successful:', registration);

      // Wait for the service worker to be ready
      await navigator.serviceWorker.ready;
      console.info('Service worker is active and ready');
    } catch (err) {
      console.error('ServiceWorker registration failed:', err);
    }
  });

  window.addEventListener('unload', () => {
    if (cleanupInterval) {
      clearInterval(cleanupInterval);
    }
  });
}

class App {
  constructor() {
    this.router = new Router();
    this.mapService = new MapService();
    this.notificationService = new NotificationService();

    this.storyModel = new StoryModel();
    this.userModel = new UserModel();

    this.homeView = new HomeView('content');
    this.storyListView = new StoryListView('content');
    this.addStoryView = new AddStoryView('content');
    this.authView = new AuthView('content');

    this.storyListView.setMapService(this.mapService);

    this.storyPresenter = new StoryPresenter(
      this.storyModel,
      this.storyListView,
      this.router
    );
    this.addStoryPresenter = new AddStoryPresenter(
      this.addStoryView,
      this.storyModel
    );
    this.authPresenter = new AuthPresenter(
      this.userModel,
      this.authView,
      this.router,
      this.notificationService
    );

    this.addStoryView.setPresenter(this.addStoryPresenter);

    this.initializeApp();
  }

  initializeApp() {
    this.setupNavigation();
    this.setupRoutes();
    this.updateNavigationState();

    this.authStateListener = () => {
      this.updateNavigationState();
    };
    window.addEventListener('auth-state-changed', this.authStateListener);
  }

  setupNavigation() {
    const hamburgerButton = document.getElementById('hamburgerButton');
    const navigationDrawer = document.getElementById('navigationDrawer');
    const navList = navigationDrawer.querySelector('ul');

    const logoutButton = document.createElement('button');
    logoutButton.textContent = 'Logout';
    logoutButton.className = 'nav-button';
    logoutButton.id = 'logoutButton';

    this.logoutHandler = () => {
      if (confirm('Are you sure you want to logout?')) {
        this.authPresenter.logout();
      }
    };
    logoutButton.addEventListener('click', this.logoutHandler);

    this.logoutButton = logoutButton;

    this.hamburgerHandler = () => {
      navigationDrawer.classList.toggle('open');
    };
    this.documentClickHandler = (e) => {
      if (
        !navigationDrawer.contains(e.target) &&
        !hamburgerButton.contains(e.target)
      ) {
        navigationDrawer.classList.remove('open');
      }
    };

    hamburgerButton.addEventListener('click', this.hamburgerHandler);
    document.addEventListener('click', this.documentClickHandler);
  }

  cleanup() {
    window.removeEventListener('auth-state-changed', this.authStateListener);
    document.removeEventListener('click', this.documentClickHandler);

    const hamburgerButton = document.getElementById('hamburgerButton');
    if (hamburgerButton) {
      hamburgerButton.removeEventListener('click', this.hamburgerHandler);
    }

    if (this.logoutButton) {
      this.logoutButton.removeEventListener('click', this.logoutHandler);
    }

    this.mapService.destroy();
    this.notificationService.cleanup?.();

    this.storyListView.cleanup?.();
    this.addStoryView.cleanup?.();
    this.authView.cleanup?.();
    this.homeView.cleanup?.();
  }

  updateNavigationState() {
    const navigationDrawer = document.getElementById('navigationDrawer');
    const navList = navigationDrawer.querySelector('ul');
    const existingLogoutButton = document.getElementById('logoutButton');
    const loginLink = navList.querySelector('a[href="#/login"]');

    if (this.userModel.isUserAuthenticated()) {
      if (!existingLogoutButton) {
        const li = document.createElement('li');
        li.appendChild(this.logoutButton);
        navList.appendChild(li);
      }

      if (loginLink) {
        loginLink.parentElement.remove();
      }
    } else {
      if (existingLogoutButton) {
        existingLogoutButton.parentElement.remove();
      }

      if (!loginLink) {
        const li = document.createElement('li');
        li.innerHTML =
          '<a href="#/login"><i class="fas fa-sign-in-alt"></i> Login</a>';
        navList.appendChild(li);
      }
    }
  }

  setupRoutes() {
    this.router.addRoute('/home', () => {
      this.addStoryView.cleanup();
      this.homeView.render();
    });

    this.router.addRoute('/stories', () => {
      this.addStoryView.cleanup?.();
      this.storyListView.render([]);
      this.storyPresenter.loadStories();
    });

    this.router.addRoute('/add', () => {
      this.addStoryPresenter.initialize();
      this.addStoryView.render();
    });

    this.router.addRoute('/login', () => {
      this.authView.setLoginMode(true);
      this.authView.render();
    });

    this.router.addRoute('/register', () => {
      this.authView.setLoginMode(false);
      this.authView.render();
    });

    const path = this.router.getCurrentPath() || '/home';
    this.router.navigate(path);
  }
}

const app = new App();

window.addEventListener('unload', () => {
  app.cleanup();
});
