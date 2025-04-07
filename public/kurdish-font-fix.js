// This script helps detect and fix Kurdish font loading issues
(function() {
  // Check if the Kurdish font is loaded
  function checkFontLoaded() {
    console.log('Checking Kurdish font loading...');
    
    // Create a test element with the Kurdish font
    const testEl = document.createElement('span');
    testEl.style.fontFamily = 'NizarBukra, sans-serif';
    testEl.style.fontSize = '0';
    testEl.style.visibility = 'hidden';
    testEl.textContent = 'Test';
    document.body.appendChild(testEl);
    
    // Check if the font is loaded
    const fontLoaded = document.fonts && document.fonts.check 
      ? document.fonts.check('0px "NizarBukra"') 
      : true; // Default to true if we can't check
    
    document.body.removeChild(testEl);
    
    if (!fontLoaded) {
      console.warn('Kurdish font not loaded. Attempting to load it manually...');
      loadKurdishFont();
    } else {
      console.log('Kurdish font loaded successfully.');
    }
  }
  
  // Load the Kurdish font manually
  function loadKurdishFont() {
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = '/kurdish-font/kurdish-font.css';
    document.head.appendChild(fontLink);
    
    console.log('Kurdish font loading manually initiated.');
  }
  
  // Run the check when the page loads
  window.addEventListener('load', function() {
    // Wait a moment to let other scripts run
    setTimeout(checkFontLoaded, 1000);
  });
})(); 