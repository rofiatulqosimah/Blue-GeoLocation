import { View } from './View.js';

export class AuthView extends View {
  constructor(containerId) {
    super(containerId);
    this.isLoginMode = true;
  }

  render() {
    this.clearMessages();

    this.container.innerHTML = `
            <section class="auth-form fade-in">
                <h2>${this.isLoginMode ? 'Login' : 'Register'}</h2>
                <form id="auth-form">
                    ${
                      !this.isLoginMode
                        ? `
                        <div class="form-group">
                            <label for="name">Name</label>
                            <input type="text" id="name" required>
                        </div>
                    `
                        : ''
                    }
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" required>
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" id="password" required minlength="8">
                        <small class="form-text">Password must be at least 8 characters long</small>
                    </div>
                    ${
                      !this.isLoginMode
                        ? `
                        <div class="form-group">
                            <label for="confirm-password">Confirm Password</label>
                            <input type="password" id="confirm-password" required minlength="8">
                        </div>
                    `
                        : ''
                    }
                    <button type="submit" class="submit-button">
                        <i class="fas fa-${this.isLoginMode ? 'sign-in-alt' : 'user-plus'}"></i>
                        ${this.isLoginMode ? 'Login' : 'Register'}
                    </button>
                    <p class="auth-switch">
                        ${
                          this.isLoginMode
                            ? 'Don\'t have an account? <a href="#" id="switch-to-register">Register here</a>'
                            : 'Already have an account? <a href="#" id="switch-to-login">Login here</a>'
                        }
                    </p>
                </form>
            </section>
        `;

    this.setupEventListeners();
  }

  setupEventListeners() {
    const form = document.getElementById('auth-form');
    const switchLink = document.getElementById(
      this.isLoginMode ? 'switch-to-register' : 'switch-to-login'
    );

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = this.getFormData();

      if (!this.isLoginMode && formData.password !== formData.confirmPassword) {
        this.showError('Passwords do not match');
        return;
      }

      if (this.isLoginMode) {
        await this.presenter.login(formData.email, formData.password);
      } else {
        await this.presenter.register(
          formData.name,
          formData.email,
          formData.password
        );
      }
    });

    switchLink.addEventListener('click', (e) => {
      e.preventDefault();
      this.isLoginMode = !this.isLoginMode;
      this.render();
    });
  }

  getFormData() {
    const data = {
      email: document.getElementById('email').value,
      password: document.getElementById('password').value,
    };

    if (!this.isLoginMode) {
      data.name = document.getElementById('name').value;
      data.confirmPassword = document.getElementById('confirm-password').value;
    }

    return data;
  }

  setLoginMode(isLogin) {
    this.isLoginMode = isLogin;
    this.render();
  }
}
