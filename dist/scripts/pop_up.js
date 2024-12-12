// popup.js
class Popup {
  constructor() {
    this.popup = document.getElementById('popup');
    this.messageElement = this.popup.querySelector('.popup-message');
    this.closeButton = this.popup.querySelector('.popup-close');

    // Close popup when clicking the close button
    this.closeButton.addEventListener('click', () => this.hide());

    // Close popup when clicking outside
    this.popup.addEventListener('click', (e) => {
      if (e.target === this.popup) {
        this.hide();
      }
    });

    // Close popup when pressing Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isVisible()) {
        this.hide();
      }
    });
  }
  show(message, title = 'Error') {
    this.popup.querySelector('.popup-header').textContent = title;
    this.messageElement.textContent = message;
    this.popup.style.display = 'block';
    this.closeButton.focus();
  }
  hide() {
    this.popup.style.display = 'none';
  }
  isVisible() {
    return this.popup.style.display === 'block';
  }
}

// Initialize the popup
const errorPopup = new Popup();

// Global function to show errors
function showError(message, title = 'Error') {
  errorPopup.show(message, title);
}
