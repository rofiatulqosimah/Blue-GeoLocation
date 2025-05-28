export class LoginForm {
  render() {
    return `
            <section class="auth-form fade-in">
                <h2>Login</h2>
                <form id="login-form">
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" required>
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" id="password" required>
                    </div>
                    <button type="submit">Login</button>
                    <p class="auth-switch">
                        Don't have an account? <a href="#/register">Register here</a>
                    </p>
                </form>
            </section>
        `;
  }

  setupForm(authService) {
    const form = document.getElementById('login-form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      try {
        await authService.login(email, password);
        window.location.hash = '#/home';
      } catch (error) {
        console.error('Login failed:', error);
        alert('Login failed. Please check your credentials and try again.');
      }
    });
  }
}
