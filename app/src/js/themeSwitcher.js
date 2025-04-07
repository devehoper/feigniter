function setTheme(theme) {
  const body = document.body;
  body.classList.remove('theme-default', 'theme-dark'); // Remove existing theme classes
  body.classList.add(`theme-${theme}`); // Add the selected theme class
  localStorage.setItem('theme', theme); // Save the theme preference

  // Dynamically load the theme stylesheet
  const themeLink = document.getElementById('theme-stylesheet');
  themeLink.href = `path/to/themes/${theme}.css`; // Update the path to the theme file
}

// Load the saved theme on page load
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme') || 'default';
  setTheme(savedTheme);
});
