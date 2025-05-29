export class NotFoundView {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  render() {
    this.container.innerHTML = `
      <div class="not-found-container">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>Oops! The page you're looking for doesn't exist.</p>
        <a href="#/home" class="btn-primary">Back to Home</a>
      </div>
    `;
  }

  cleanup() {
    this.container.innerHTML = '';
  }
} 