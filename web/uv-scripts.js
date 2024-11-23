// Update search engine 
function updateSearchEngine() {
  const searchEngine = document.getElementById('search-engine').value;
  document.getElementById('uv-search-engine').value = searchEngine;
}

// Request fullscreen for iframe
function requestFullScreen(element) {
  var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullscreen;
  if (requestMethod) {
    requestMethod.call(element);
  } else if (typeof window.ActiveXObject !== "undefined") {
    var wscript = new ActiveXObject("WScript.Shell");
    if (wscript !== null) {
      wscript.SendKeys("{f11}");
    }
  }
}

// Load website into iframe
function loadWebsite(url) {
  const iframe = document.getElementById("webFrame");
  // Encode the URL using UV config
  iframe.src = __uv$config.prefix + __uv$config.encodeUrl(url);
  iframe.classList.add('active'); // Make iframe visible
  document.body.className = "fullScreen";
  requestFullScreen(document.body);
}

// Listen for Enter key to submit form
document.getElementById('uv-address').addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    e.preventDefault(); // Prevent page reload
    const input = document.getElementById('uv-address').value;

    let url;
    // Check if input is a URL or a search query
    if (input.startsWith('http://') || input.startsWith('https://')) {
      url = input;
    } else {
      const searchEngine = document.getElementById('uv-search-engine').value;
      url = searchEngine.replace('%s', encodeURIComponent(input));
    }

    loadWebsite(url); // Load the website in the iframe
  }
});
