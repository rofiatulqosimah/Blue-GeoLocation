export class Hero {
  render() {
    return `
            <section class="hero fade-in">
                <h2>Welcome to Blue GeoLocation</h2>
                <p>Share your stories with the world and discover amazing places!</p>
                <button onclick="window.location.hash='#/add'">Share Your Story</button>
            </section>
        `;
  }
}
