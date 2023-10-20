class Page {
  #toBeHideList;
  #prevHideList;
  #displayTargets;

  constructor() {
    this.#prevHideList = [];
    this.#displayTargets = [];
    this.#toBeHideList = [];
    const that = this;
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      const toBeHide = message.data;
      that.#updateInternel(toBeHide).then(() => {
        that.draw();
      });
    });
  }

  run() {
    this.update().then(() => {
      this.draw();
    });
  }

  async update() {
    const result = await chrome.storage.local.get(["key"]);
    this.#prevHideList = [...result.key];
    await this.#updateInternel(result.key);
  }

  draw() {
    this.#display();
    this.#hide();
  }

  #display() {
    const posts = document.querySelectorAll(".post-list-corp");
    for (let post of posts) {
      const companyName = post.childNodes[1].getAttribute("title");
      if (!this.#displayTargets.some((e) => e === companyName)) {
        continue;
      }

      const targets = post.parentNode.querySelectorAll("p, a");
      for (let target of targets) {
        if (target.style) {
          target.style.color = "black";
        }
      }
    }
  }

  #hide() {
    const posts = document.querySelectorAll(".post-list-corp");
    for (let post of posts) {
      const companyName = post.childNodes[1].getAttribute("title");
      if (!this.#toBeHideList.some((e) => e === companyName)) {
        continue;
      }
      console.log("hide", post);
      const targets = post.parentNode.querySelectorAll("p, a, span, button");
      for (let target of targets) {
        if (target.style) {
          target.style.backgroundColor = "white";
          target.style.color = "white";
        }
      }
    }
  }

  async #updateInternel(toBeHide) {
    const result = await chrome.storage.local.get(["key"]);
    // 그릴 대상
    if (!this.#isPrevHideListEqual(result.key)) {
      this.#displayTargets = this.#prevHideList.filter(
        (e) => !result.key.find((comp) => comp === e)
      );
    }

    // 숨길 대상
    this.#toBeHideList = [...toBeHide];
    this.#prevHideList = [...result.key];
  }

  #isPrevHideListEqual(toBeHide) {
    if (this.#prevHideList.length !== toBeHide.length) {
      return false;
    }

    return this.#prevHideList.every((e, index) => e === toBeHide[index]);
  }
}

const page = new Page();
page.run();
