console.log("popup.js loaded");

/**
 * 이벤트 등록
 */
document.getElementById("save").addEventListener("click", (e) => {
  e.preventDefault();
  const userInput = document.getElementById("userInput").value;
  document.getElementById("userInput").value = "";

  setKeyword(userInput);
});

const keywordsUl = document.getElementById("keywords");
keywordsUl.addEventListener("click", (e) => {
  const keyword = e.target.id;
  console.log(keyword);
  removeKeyword(keyword);
});

/**
 * 저장된 리스트를 보여줌
 */
updateKeyword();

function onClickDelete(keyword) {
  console.log(keyword);
}

function setKeyword(keyword) {
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
      chrome.storage.local.set({ key: value });
    }

    updateKeyword();
  });
}

function removeKeyword(keyword) {
  chrome.storage.local.get(["key"]).then((result) => {
    if (!result.key) {
      return;
    }

    const keywords = [...result.key];
    const filtered = keywords.filter((e) => e !== keyword);
    chrome.storage.local.set({ key: filtered });

    updateKeyword();
  });
}

function updateKeyword() {
  const keywordsUl = document.getElementById("keywords");

  while (keywordsUl.firstChild) {
    keywordsUl.removeChild(keywordsUl.firstChild);
  }

  chrome.storage.local.get(["key"]).then((result) => {
    if (result.key) {
      const keywords = result.key;
      for (const keyword of keywords) {
        const li = document.createElement("li");
        let displayKeyword = keyword;
        if (displayKeyword.length > 9) {
          displayKeyword = displayKeyword.substring(0, 9) + "...";
        }
        li.innerHTML = `
        <span> ${displayKeyword} </span>
        <button type="button" id="${keyword}">삭제</button>
      `;
        keywordsUl.appendChild(li);
      }
    } else {
      const li = document.createElement("li");
      li.appendChild(document.createTextNode("저장된 키워드가 없습니다."));
      keywordsUl.appendChild(li);
    }
  });
}
