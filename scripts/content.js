/**
 * 1. 숨기고 싶은 공고 리스트를 가져온다.
 * 2. 현재 페이지의 모든 공고를 찾고, 리스트에 해당하는지 확인한다.
 * 3. 해당되면 폰트 칼라를 하얀색으로 변경한다.
 */

const toBeHide = ["주", "(주)"];
const posts = document.querySelectorAll(".post-list-corp");
for (let post of posts) {
  const companyName = post.childNodes[1].getAttribute("title");
  if (!toBeHide.some((e) => e === companyName)) {
    continue;
  }

  const targets = post.parentNode.querySelectorAll("p, a");
  console.log(targets);
  for (let target of targets) {
    if (target.style) {
      target.style.color = "white";
    }
  }
}
