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

function hasButton(target) {
  if (target.closest(".css-1dbjc4n.r-19i43ro") === null) return;
  const tweet = target
    .closest(".css-1dbjc4n.r-19i43ro")
    .nextSibling.querySelectorAll(
      "div.css-1dbjc4n.r-1iusvr4.r-18u37iz.r-16y2uox.r-1h0z5md"
    )[4];

  return !!tweet;
}

async function downloadVideo(event) {
  event.preventDefault();
  const link = event.target
    .closest(".css-1dbjc4n.r-18u37iz.r-1wtj0ep.r-156q2ks.r-1mdbhws")
    .previousSibling.querySelectorAll(
      "a.css-4rbku5.css-18t94o4.css-901oao.r-1re7ezh.r-1loqt21.r-1q142lx.r-1qd0xha.r-a023e6.r-16dba41.r-ad9z0x.r-bcqeeo.r-3s2u2q.r-qvutc0"
    )[0];
  const href = (link && link.href) || (await getPromotedTweetId(event));
  const tweetId = href && href.split("/")[5];
  chrome.runtime.sendMessage({
    tweetId
  });
}

function getPromotedTweetId(event) {
  return new Promise(resolve => {
    event.currentTarget.previousSibling
      .querySelector(
        ".css-1dbjc4n.r-sdzlij.r-1p0dtai.r-xoduu5.r-1d2f490.r-xf4iuw.r-u8s1d.r-zchlnj.r-ipm5af.r-o7ynqc.r-6416eg"
      )
      .click();
    setTimeout(async () => {
      document
        .querySelectorAll(
          ".css-1dbjc4n.r-1loqt21.r-18u37iz.r-1j3t67a.r-9qu9m4.r-o7ynqc.r-1j63xyz.r-13qz1uu"
        )[2]
        .click();
      const text = await navigator.clipboard.readText();
      const tweetId = text.includes("?") ? text.split("?")[0] : text;
      resolve(tweetId);
    }, 500);
  });
}

function injectButton(target) {
  if (target.closest(".css-1dbjc4n.r-19i43ro") === null) return;
  const tweet = target
    .closest(".css-1dbjc4n.r-19i43ro")
    .nextSibling.querySelectorAll(
      "div.css-1dbjc4n.r-1iusvr4.r-18u37iz.r-16y2uox.r-1h0z5md"
    )[3];

  if (hasButton(target)) return;

  const btnRoot = document.createElement("div");
  btnRoot.classList.add(
    "download__btn",
    "css-1dbjc4n",
    "r-1iusvr4",
    "r-18u37iz",
    "r-16y2uox",
    "r-1h0z5md"
  );
  btnRoot.onclick = downloadVideo;
  tweet.after(btnRoot);
  const darkMode =
    document.querySelector("body").style.backgroundColor === "rgb(24, 36, 48)";

  ReactDOM.render(<DownloadButton darkMode={darkMode} />, btnRoot);
}
