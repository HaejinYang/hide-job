class Page {
  #prevHideList;
  constructor() {
    this.#prevHideList = [];
    const that = this;
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      const toBeHide = message.data;
      that.#updateWithHide(toBeHide);
    });
  }

  update() {
    chrome.storage.local.get(["key"]).then((result) => {
      this.#prevHideList = [...result.key];
      this.#updateWithHide(result.key);
    });
  }

  #updateWithHide(toBeHide) {
    chrome.storage.local.get(["key"]).then((result) => {
      // 다시 진하게 할 대상 탐색
      let display = [];
      if (!this.#isPrevHideListEqual(result.key)) {
        display = this.#prevHideList.filter(
          (e) => !result.key.find((comp) => comp === e)
        );
      }

      // 갱신
      const posts = document.querySelectorAll(".post-list-corp");
      for (let post of posts) {
        const companyName = post.childNodes[1].getAttribute("title");
        if (display.some((e) => e === companyName)) {
          const targets = post.parentNode.querySelectorAll("p, a");
          for (let target of targets) {
            if (target.style) {
              target.style.color = "black";
            }
          }
        } else {
          if (!toBeHide.some((e) => e === companyName)) {
            continue;
          }

          const targets =
            post.parentNode.querySelectorAll("p, a, span, button");
          for (let target of targets) {
            if (target.style) {
              target.style.backgroundColor = "white";
              target.style.color = "white";
            }
          }
        }
      }

      this.#prevHideList = [...result.key];
    });
  }

  #isPrevHideListEqual(toBeHide) {
    if (this.#prevHideList.length !== toBeHide.length) {
      return false;
    }

    return this.#prevHideList.every((e, index) => e === toBeHide[index]);
  }
}

const page = new Page();
page.update();
