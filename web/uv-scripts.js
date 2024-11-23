"use strict";

// Error handling and URL handling function (supports non-https URLs)
function search(input, template) {
  try {
    // input is a valid URL: eg: https://example.com, https://example.com/test?q=param
    return new URL(input).toString();
  } catch (err) {
    // input was not a valid URL
  }

  try {
    // input is a valid URL when http:// is added to the start: eg: example.com
    const url = new URL(`http://${input}`);
    // only if the hostname has a TLD/subdomain
    if (url.hostname.includes(".")) return url.toString();
  } catch (err) {
    // input was not a valid URL
  }

  // input may have been a valid URL, however the hostname was invalid
  // Attempts to convert the input to a fully qualified URL have failed
  // Treat the input as a search query
  return template.replace("%s", encodeURIComponent(input));
}

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

// Service Worker Registration
const stockSW = "/web/uv-sw.js";
const swAllowedHostnames = ["localhost", "127.0.0.1"];

async function registerSW() {
  if (
    location.protocol !== "https:" &&
    !swAllowedHostnames.includes(location.hostname)
  )
    throw new Error("Service workers cannot be registered without https.");

  if (!navigator.serviceWorker)
    throw new Error("Your browser doesn't support service workers.");

  // Ultraviolet has a stock `sw.js` script.
  await navigator.serviceWorker.register(stockSW, {
    scope: __uv$config.prefix,
  });
}

// Register service worker on page load
document.addEventListener('DOMContentLoaded', function() {
  try {
    registerSW();
  } catch (error) {
    console.error('Service Worker registration failed:', error);
  }
});
