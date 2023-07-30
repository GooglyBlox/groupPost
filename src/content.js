// This variable will hold the tweet link that corresponds to the clicked menu button
let clickedTweetLink = null;

// Attach click event listener to all menu buttons
function attachMenuButtonClickListener() {
  const menuButtons = document.querySelectorAll('div[data-testid="caret"]');
  menuButtons.forEach((button) => {
    button.addEventListener('click', function(event) {
      // Navigate up to the tweet article element
      let tweetElement = event.target.closest('article[role="article"]');
      
      // Find the tweet's link inside the corresponding tweet
      if (tweetElement) {
        const tweetLinkElement = tweetElement.querySelector('a[href*="/status/"]');
        if (tweetLinkElement) {
          clickedTweetLink = tweetLinkElement.href;
        }
      }
    });
  });
}

function changeMenuItem() {
    const menuItems = document.querySelectorAll('div[role="menuitem"]');
  
    for (const item of menuItems) {
      const spanElement = item.querySelector('span');
  
      if (spanElement && spanElement.textContent === "Embed Tweet") {
        spanElement.innerText = 'Post to Discord'; // Update the text to "Post to Discord"
  
        // Check if the item is already modified
        if (item.dataset.modified) continue;
  
        item.dataset.modified = "true"; // Mark the item as modified
  
        item.onclick = function(event) {
          event.stopPropagation();
          event.preventDefault();
        
          if (clickedTweetLink) {
            console.log("Tweet Link Captured:", clickedTweetLink); // Debugging line
        
            // Send the tweet URL to the background script
            chrome.runtime.sendMessage({ action: 'postTweet', url: clickedTweetLink }, (response) => {
              console.log("Background Response:", response); // Debugging line
            });
          } else {
            console.error("Tweet link not found");
          }
        };
      }
    }
  }
  
  // Continuously check and modify the menu item
  setInterval(attachMenuButtonClickListener, 1000);
  setInterval(changeMenuItem, 100);
  