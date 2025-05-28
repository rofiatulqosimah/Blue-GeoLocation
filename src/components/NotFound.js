export class NotFound {
  render() {
    return `
            <section class="not-found fade-in">
                <h2>404 - Page Not Found</h2>
                <p>Sorry, the page you're looking for doesn't exist.</p>
                <a href="#/home" class="button">Go to Home</a>
            </section>
        `;
  }
}
