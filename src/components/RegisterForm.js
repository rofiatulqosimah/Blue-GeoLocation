export class RegisterForm {
  render() {
    return `
            <section class="auth-form fade-in">
                <h2>Register</h2>
                <form id="register-form">
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" required>
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" id="password" required>
                    </div>
                    <div class="form-group">
                        <label for="confirm-password">Confirm Password</label>
                        <input type="password" id="confirm-password" required>
                    </div>
                    <button type="submit">Register</button>
                    <p class="auth-switch">
                        Already have an account? <a href="#/login">Login here</a>
                    </p>
                </form>
            </section>
        `;
  }

  setupForm(authService) {
    const form = document.getElementById('register-form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirm-password').value;

      if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
      }

      try {
        await authService.register(email, password);
        window.location.hash = '#/login';
        alert('Registration successful! Please login.');
      } catch (error) {
        console.error('Registration failed:', error);
        alert('Registration failed. Please try again.');
      }
    });
  }
}
