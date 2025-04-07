// Add this script to fix navigation issues across environments
(function() {
  // Fix for Next.js client-side navigation
  window.addEventListener('DOMContentLoaded', function() {
    // Find all character card links
    const fixNavigation = function() {
      // Fix all links with class 'character-link'
      document.querySelectorAll('.character-link, [data-character-id]').forEach(function(link) {
        if (link.getAttribute('data-navigation-fixed')) return; // Already fixed
        
        link.setAttribute('data-navigation-fixed', 'true');
        
        const characterId = link.getAttribute('data-character-id') || 
                            link.getAttribute('href')?.split('/').pop();
        
        if (!characterId) return; // Skip if no ID
        
        // Remove existing click listeners by cloning
        const newLink = link.cloneNode(true);
        link.parentNode.replaceChild(newLink, link);
        
        // Add direct navigation
        newLink.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          window.location.href = `/chat/${characterId}`;
          return false;
        });
      });
    };
    
    // Run immediately
    fixNavigation();
    
    // Also run after any DOM changes
    const observer = new MutationObserver(fixNavigation);
    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });
  });
  
  // Patch the router.push method if it exists
  if (window.next && window.next.router && window.next.router.push) {
    const originalPush = window.next.router.push;
    window.next.router.push = function(url, options) {
      // For chat URLs, use direct navigation
      if (typeof url === 'string' && url.startsWith('/chat/')) {
        window.location.href = url;
        return Promise.resolve(true);
      }
      // Otherwise use the original method
      return originalPush.call(this, url, options);
    };
  }
})(); 