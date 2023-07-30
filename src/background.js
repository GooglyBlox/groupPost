chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Received request in background script:", request); // Debugging line
  
    if (request.action === 'postTweet') {
      // Retrieve the saved webhooks
      chrome.storage.sync.get('webhooks', function(data) {
        var webhooks = data.webhooks || [];
  
        // Send the tweet URL to each webhook
        webhooks.forEach(function(webhook) {
          fetch(webhook, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: request.url })
          });
        });
  
        sendResponse({ success: true }); // Response to content script
      });
    }
  });
  