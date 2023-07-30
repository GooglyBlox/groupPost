function displayWebhooks() {
  chrome.storage.sync.get('webhooks', function(data) {
    var webhooksDiv = document.getElementById('webhooks');
    webhooksDiv.innerHTML = '';
    var webhooks = data.webhooks || [];
    webhooks.forEach(function(webhook, index) {
      var div = document.createElement('div');
      var truncatedWebhook = webhook.length > 40 ? webhook.substring(0, 40) + '...' : webhook;
      div.textContent = truncatedWebhook;
      
      var removeButton = document.createElement('button');
      removeButton.textContent = 'Remove';
      removeButton.onclick = function() {
        webhooks.splice(index, 1);
        chrome.storage.sync.set({ 'webhooks': webhooks }, displayWebhooks);
      };
      
      div.appendChild(removeButton);
      webhooksDiv.appendChild(div);
    });
  });
}

document.addEventListener('DOMContentLoaded', function() {
  displayWebhooks();

  document.getElementById('addWebhook').addEventListener('click', function() {
    var newWebhook = document.getElementById('newWebhook').value;
    if (newWebhook.startsWith('https://discord.com/api/webhooks/')) {
      chrome.storage.sync.get('webhooks', function(data) {
        var webhooks = data.webhooks || [];
        webhooks.push(newWebhook);
        chrome.storage.sync.set({ 'webhooks': webhooks }, function() {
          var confirmationMessage = document.getElementById('confirmationMessage');
          confirmationMessage.textContent = "Webhook added successfully!";
          
          document.getElementById('newWebhook').value = '';

          displayWebhooks();
        });
      });
    } else {
      alert('Invalid webhook URL! It must start with https://discord.com/api/webhooks/');
    }
  });
});
