import React from "react";
import ReactDOM from "react-dom";
import DownloadButton from "./downloadButton";

/*global chrome*/
document.addEventListener("DOMNodeInserted", DOMNodeInserted, false);

function DOMNodeInserted(event) {
  if (typeof event.target.querySelectorAll !== "function") return;
  const videos = event.target && event.target.querySelectorAll("video");
  if (!videos || videos.length === 0) return;
  videos.forEach(video => injectButton(video));
}


async function downloadVideo(event) {
  event.preventDefault();
    const tweet = event.currentTarget
      .parentElement
      .parentElement
      .previousSibling
      .querySelector("a.r-111h2gw.r-1loqt21.r-1q142lx.r-1qd0xha.r-a023e6.r-16dba41.r-ad9z0x.r-bcqeeo.r-3s2u2q.r-qvutc0.css-4rbku5.css-18t94o4.css-901oao")
  const href = (tweet && tweet.href) || window.location.href || await getPromotedTweetId(event);
  const tweetId = href && href.split("/")[5];
  chrome.runtime.sendMessage({
    tweetId
  });
}

function getPromotedTweetId(event) {
  return new Promise(resolve => {
    event.currentTarget.previousSibling
      .click();
    setTimeout(async () => {
      document
        .querySelectorAll(
          "css-1dbjc4n.r-1loqt21.r-18u37iz.r-1ny4l3l.r-1j3t67a.r-9qu9m4.r-o7ynqc.r-6416eg.r-13qz1uu"
        )[2]
        .click();
      const text = await navigator.clipboard.readText();
      const tweetLink = text.includes("?") ? text.split("?")[0] : text;
      const tweetId = tweetLink.split("/")[5];
      resolve(tweetId);
    }, 500);
  });
}

function injectButton(target) {
  const tweetContent = target.closest(".css-1dbjc4n.r-18bvks7.r-1ylenci.r-1phboty.r-rs99b7.r-156q2ks.r-1udh08x")
  && target.closest(".css-1dbjc4n.r-18bvks7.r-1ylenci.r-1phboty.r-rs99b7.r-156q2ks.r-1udh08x")
  .parentElement.parentElement.parentElement;
  const query = '.css-1dbjc4n.r-1oszu61.r-1kfrmmb.r-1efd50x.r-5kkj8d.r-18u37iz.r-ahm1il.r-a2tzq0';
  const actionIcons  = tweetContent.querySelector(query) || tweetContent.nextSibling;
  if (actionIcons === null) return;
  if (actionIcons.childNodes.length > 4) return;

  const btnRoot = document.createElement("div");
  btnRoot.classList.add(
    "download__btn",
    "css-1dbjc4n",
    "r-18u37iz",
    "r-1h0z5md"
  );
  btnRoot.onclick = downloadVideo;
  actionIcons.childNodes[3].after(btnRoot);
  const darkMode =
    document.querySelector("body").style.backgroundColor === "rgb(24, 36, 48)";

  ReactDOM.render(<DownloadButton darkMode={darkMode} />, btnRoot);
}