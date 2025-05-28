export class Alert {
  constructor() {
    this.container = document.createElement('div');
    this.container.className = 'alerts-container';
    document.body.appendChild(this.container);
    this.timeout = null;
  }

  show(message, type = 'info', duration = 3000) {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    const alertElement = document.createElement('div');
    alertElement.className = `alert alert--${type}`;

    const icon = this.getIconForType(type);
    alertElement.innerHTML = `
      <div class="alert__content">
        <div class="alert__message">
          <i class="fas ${icon}"></i>
          <span>${message}</span>
        </div>
        <button class="alert__close" aria-label="Close">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;

    // Add click handler for close button
    const closeButton = alertElement.querySelector('.alert__close');
    closeButton.addEventListener('click', () => {
      alertElement.classList.remove('alert--visible');
      setTimeout(() => alertElement.remove(), 300);
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
    });

    this.container.appendChild(alertElement);

    // Add visible class after a short delay for animation
    setTimeout(() => alertElement.classList.add('alert--visible'), 10);

    if (duration > 0) {
      this.timeout = setTimeout(() => {
        alertElement.classList.remove('alert--visible');
        setTimeout(() => alertElement.remove(), 300);
      }, duration);
    }
  }

  getIconForType(type) {
    const icons = {
      success: 'fa-check-circle',
      error: 'fa-exclamation-circle',
      warning: 'fa-exclamation-triangle',
      info: 'fa-info-circle',
    };
    return icons[type] || icons.info;
  }

  showSuccess(message, duration = 3000) {
    this.show(message, 'success', duration);
  }

  showError(message, duration = 5000) {
    this.show(message, 'error', duration);
  }

  showWarning(message, duration = 5000) {
    this.show(message, 'warning', duration);
  }

  showInfo(message, duration = 3000) {
    this.show(message, 'info', duration);
  }

  clear() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.container.innerHTML = '';
  }
}
