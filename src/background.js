chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Received request in background script:", request);

  if ((request.action === 'postTweet' || request.action === 'postInstagram' || request.action === 'postTikTok') &&
      (request.url.includes('twitter.com') || request.url.includes('instagram.com') || request.url.includes('tiktok.com'))) {
    
    chrome.storage.sync.get('webhooks', function(data) {
      var webhooks = data.webhooks || [];

      webhooks.forEach(function(webhook) {
        fetch(webhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: request.url })
        });
      });

      sendResponse({ success: true });
    });

    return true;
  }
});
