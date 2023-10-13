class Page {
  constructor() {
    const that = this;
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.data) {
        const toBeHide = message.data;
        that.#updateWithHide(toBeHide);
      }
    });
  }

  update() {
    chrome.storage.local.get(["key"]).then((result) => {
      this.#updateWithHide(result.key);
    });
  }

  #updateWithHide(toBeHide) {
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
}

const page = new Page();
page.update();
