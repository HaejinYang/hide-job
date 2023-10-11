console.log("content.js load");

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.data) {
    const toBeHide = message.data;
    const posts = document.querySelectorAll(".post-list-corp");
    for (let post of posts) {
      const companyName = post.childNodes[1].getAttribute("title");
      if (!toBeHide.some((e) => e === companyName)) {
        continue;
      }

      const targets = post.parentNode.querySelectorAll("p, a");
      for (let target of targets) {
        if (target.style) {
          target.style.color = "white";
        }
      }
    }
  }
});
