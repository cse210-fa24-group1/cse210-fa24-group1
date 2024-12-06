// logout.js

document.addEventListener('DOMContentLoaded', () => {
  const logoutLink = document.getElementById('logout-link');

  logoutLink.addEventListener('click', (e) => {
    e.preventDefault();

    // Remove current session
    localStorage.removeItem('currentSession');

    // Remove all cookies
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
    }

    // Redirect to login page
    window.location.href = '../index.html';
  });
});
