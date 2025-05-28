import { View } from './View.js';

export class HomeView extends View {
  constructor(containerId) {
    super(containerId);
  }

  render() {
    const template = `
            <div class="home-container">
                <section class="hero">
                    <h2>Welcome to Blue GeoLocation</h2>
                    <p>Share your stories and discover places around you</p>
                </section>

                <section class="features">
                    <h3>Key Features</h3>
                    <div class="features-grid">
                        <div class="feature-card">
                            <i class="fas fa-map-marker-alt"></i>
                            <h4>Location Sharing</h4>
                            <p>Share your stories with precise location data</p>
                        </div>
                        <div class="feature-card">
                            <i class="fas fa-camera"></i>
                            <h4>Photo Stories</h4>
                            <p>Add photos to your stories to make them more engaging</p>
                        </div>
                        <div class="feature-card">
                            <i class="fas fa-compass"></i>
                            <h4>Nearby Places</h4>
                            <p>Discover interesting places around your location</p>
                        </div>
                        <div class="feature-card">
                            <i class="fas fa-bell"></i>
                            <h4>Notifications</h4>
                            <p>Stay updated with push notifications</p>
                        </div>
                    </div>
                </section>

                <section class="get-started">
                    <h3>Get Started</h3>
                    <div class="steps">
                        <div class="step">
                            <div class="step-number">1</div>
                            <h4>Create an Account</h4>
                            <p>Sign up to start sharing your stories</p>
                        </div>
                        <div class="step">
                            <div class="step-number">2</div>
                            <h4>Enable Location</h4>
                            <p>Allow location access to enhance your experience</p>
                        </div>
                        <div class="step">
                            <div class="step-number">3</div>
                            <h4>Share Stories</h4>
                            <p>Start sharing your experiences with the world</p>
                        </div>
                    </div>
                </section>
            </div>
        `;

    this.container.innerHTML = template;
  }
}
