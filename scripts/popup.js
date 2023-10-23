console.log("popup.js loaded");

class PopUp {
  constructor() {
    this.#registerEventListener();
  }

  draw() {
    const keywordsUl = document.getElementById("keywords");
    while (keywordsUl.firstChild) {
      keywordsUl.removeChild(keywordsUl.firstChild);
    }

    chrome.storage.local.get(["key"]).then((result) => {
      if (!result.key) {
        const li = document.createElement("li");
        li.appendChild(document.createTextNode("저장된 키워드가 없습니다."));
        keywordsUl.appendChild(li);
        this.#blurJobs();

        return;
      }

      const keywords = result.key;
      for (const keyword of keywords) {
        const li = document.createElement("li");
        let displayKeyword = keyword;
        const maxDisplayLength = 6;
        if (displayKeyword.length > maxDisplayLength) {
          displayKeyword =
            displayKeyword.substring(0, maxDisplayLength) + "...";
        }
        li.innerHTML = `
        <span class="keyword"> 
          ${displayKeyword} 
          <span class="tooltip"> 
            ${keyword}
          </span>
        </span>
        <button type="button" id="${keyword}">삭제</button>
        
      `;
        keywordsUl.appendChild(li);
      }

      this.#blurJobs();
    });
  }

  #registerEventListener() {
    document.getElementById("save").addEventListener("click", (e) => {
      e.preventDefault();
      const userInput = document.getElementById("userInput").value;
      document.getElementById("userInput").value = "";

      this.#setKeyword(userInput);
    });

    const keywordsUl = document.getElementById("keywords");
    keywordsUl.addEventListener("click", (e) => {
      const keyword = e.target.id;
      this.#removeKeyword(keyword);
    });
  }

  #blurJobs() {
    chrome.storage.local.get(["key"]).then((result) => {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        // Send a message to the content script of the active tab
        chrome.tabs.sendMessage(tabs[0].id, { data: result.key });
      });
    });
  }

  #setKeyword(keyword) {
    if (keyword.trim() === "") {
      return;
    }

    chrome.storage.local.get(["key"]).then((result) => {
      let value = [];
      if (result.key) {
        value = [...result.key];
      }

      if (!value.some((e) => e === keyword)) {
        value.push(keyword);
        chrome.storage.local.set({ key: value }).then((result) => {
          this.draw();
        });
      }
    });
  }

  #removeKeyword(keyword) {
    chrome.storage.local.get(["key"]).then((result) => {
      if (!result.key) {
        return;
      }

      const keywords = [...result.key];
      const filtered = keywords.filter((e) => e !== keyword);
      chrome.storage.local.set({ key: filtered }).then((result) => {
        this.draw();
      });
    });
  }
}

const popUp = new PopUp();
popUp.draw();
