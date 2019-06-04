/*global chrome*/
chrome.runtime.onMessage.addListener(fetchVideoUrl);

function fetchVideoUrl(request) {
  const { tweetId } = request;
  var init = {
    method: "GET",
    mode: "cors",
    origin: "https://twitter.com",
    headers: {
      Accept: "*/*"
    },
    referrer: "https://twitter.com"
  };
  fetch(`https://twitter-api-service.herokuapp.com/video/${tweetId}`, init)
    .then(response => {
      if (response.status === 200) return response.text();
      if (response.status === 404)
        alert("Sorry this video cannot be downloaded");
    })
    .then(response => videoDownloader(response))
    .catch(error => {
      alert("An error occurred while attempting to download video");
    });
}

function videoDownloader(url) {
  chrome.downloads.download({
    url
  });
}
