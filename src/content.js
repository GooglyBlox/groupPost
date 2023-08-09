function handleTwitter() {
  let clickedTweetLink = null;

  function attachMenuButtonClickListener() {
    console.log("Attaching menu button click listeners");
    const menuButtons = document.querySelectorAll('div[data-testid="caret"]');
    menuButtons.forEach((button) => {
      if (button.dataset.listenerAdded) return;
      button.addEventListener('click', function (event) {
        let tweetElement = event.target.closest('article[role="article"]');
        if (tweetElement) {
          const tweetLinkElement = tweetElement.querySelector('a[href*="/status/"]');
          if (tweetLinkElement) {
            clickedTweetLink = tweetLinkElement.href;
            console.log("Clicked tweet link found:", clickedTweetLink);
          }
        }
      });
      button.dataset.listenerAdded = "true";
    });
  }

  function changeMenuItem() {
    console.log("Changing menu items");
    const menuItems = document.querySelectorAll('div[role="menuitem"]');

    for (const item of menuItems) {
      const spanElement = item.querySelector('span');

      if (spanElement && spanElement.textContent === "Embed post") {
        spanElement.innerText = 'Post to Discord';
        if (item.dataset.modified) continue;
        item.dataset.modified = "true";

        item.onclick = function (event) {
          event.stopPropagation();
          event.preventDefault();

          if (clickedTweetLink) {
            console.log("Sending tweet link to Discord:", clickedTweetLink);
            chrome.runtime.sendMessage({ action: 'postTweet', url: clickedTweetLink }, (response) => {});
          } else {
            console.error("Tweet link not found");
          }
        };
      }
    }
  }

  const observer = new MutationObserver(attachMenuButtonClickListener);
  observer.observe(document.body, { childList: true, subtree: true });

  setInterval(changeMenuItem, 100);
}



function handleInstagram() {
  function changeMenuItem() {
    const buttons = document.querySelectorAll('button._a9--._a9_1');
    const embedButton = buttons[4];

    if (embedButton && embedButton.textContent.trim() === "Embed" && !embedButton.dataset.modified) {
      embedButton.textContent = 'Post to Discord';
      embedButton.dataset.modified = "true";

      embedButton.onclick = function(event) {
        event.stopPropagation();
        event.preventDefault();

        const copyLinkButton = Array.from(buttons).find(btn => btn.textContent.trim() === "Copy link");
        if (copyLinkButton) copyLinkButton.click();

        new Promise(res => setTimeout(res, 100))
          .then(() => navigator.clipboard.readText())
          .then(copiedLink => {
            if (!chrome.runtime) {
              console.error("Chrome runtime is not available");
              return;
            }

            if (copiedLink && copiedLink.includes('instagram.com')) {
              copiedLink = copiedLink.replace('instagram.com', 'ddinstagram.com');
            }

            if (copiedLink) {
              chrome.runtime.sendMessage({ action: 'postInstagram', url: copiedLink }, (response) => {});
            } else {
              console.error("Link not found");
            }
          });
      };
    }
  }

  setInterval(changeMenuItem, 100);
}

function handleTikTok() {
  function changeMenuItem() {
    const embedButton = document.querySelector('a[data-e2e="video-share-embed"]');

    if (embedButton && embedButton.querySelector('.tiktok-1qov91f-SpanShareText').textContent === "Embed") {
      embedButton.querySelector('.tiktok-1qov91f-SpanShareText').textContent = 'Post to Discord';
      embedButton.onclick = async function (event) {
        event.stopPropagation();
        event.preventDefault();

        const copyLinkButton = document.querySelector('a[data-e2e="video-share-copy"]');
        if (copyLinkButton) {
          copyLinkButton.click();

          await new Promise(res => setTimeout(res, 500));

          const copiedLink = await navigator.clipboard.readText();
          if (copiedLink) {
            console.log("Copied link:", copiedLink);
            chrome.runtime.sendMessage({ action: 'postTikTok', url: copiedLink }, (response) => {});
          } else {
            console.error("Video URL not found");
          }
        }
      };
    }
  }

  setInterval(changeMenuItem, 100);
}



if (window.location.hostname === 'twitter.com') {
  handleTwitter();
} else if (window.location.hostname.includes('instagram.com')) {
  handleInstagram();
} else if (window.location.hostname.includes('tiktok.com')) {
  handleTikTok();
}
