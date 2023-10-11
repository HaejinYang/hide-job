console.log("popup.js loaded");

document.getElementById("submit").addEventListener("click", (e) => {
  e.preventDefault();
  const userInput = document.getElementById("userInput").value;
  document.getElementById("userInput").value = "";

  chrome.storage.local.get(["key"]).then((result) => {
    let value = [];
    if (result.key) {
      value = [...result.key];
    } else {
      value.push(userInput);
    }

    value.push(userInput);
    chrome.storage.local.set({ key: value }).then(() => {
      console.log("value is set : ", value);
    });
  });
});
