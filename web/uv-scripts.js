"use strict";

/**
 * Utility function to check if the input is a valid URL and return the appropriate formatted URL.
 * If not a valid URL, it will be treated as a search query and passed to the search engine template.
 * @param {string} input
 * @param {string} template
 * @returns {string} Fully qualified URL or search query URL.
 */
function search(input, template) {
  try {
    // Check if input is a valid URL (https:// or http://)
    return new URL(input).toString();
  } catch (err) {
    console.log("Input is not a valid URL, proceeding as a search query.");
  }

  try {
    // Add "http://" if no protocol is provided
    const url = new URL(`http://${input}`);
    if (url.hostname.includes(".")) return url.toString();
  } catch (err) {
    console.log("Still not a valid URL, treating as search query.");
  }

  // If not a valid URL, return the search query URL formatted with the template
  return template.replace("%s", encodeURIComponent(input));
}

/**
 * Update the search engine URL in the config based on the input in the search box.
 */
function updateSearchEngine() {
  const searchEngine = document.getElementById('search-engine').value;
  document.getElementById('uv-search-engine').value = searchEngine;
}

/**
 * Request fullscreen for an element.
 * @param {Element} element
 */
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

/**
 * Load the website into the iframe. If the input URL is a valid URL, load it.
 * If it's not, treat it as a search query and perform a search.
 * @param {string} url
 */
function loadWebsite(url) {
  const iframe = document.getElementById("webFrame");
  const encodedUrl = __uv$config.prefix + __uv$config.encodeUrl(url);
  console.log("Loading URL:", encodedUrl); // Check the final URL
  iframe.src = encodedUrl;
  iframe.classList.add('active');
  document.body.className = "fullScreen";
  requestFullScreen(document.body);
}

/**
 * Listen for the form submit event and prevent default form submission behavior.
 */
document.getElementById('uv-form').addEventListener('submit', function (e) {
  e.preventDefault(); // Prevent form from submitting and reloading the page

  const input = document.getElementById('uv-address').value;
  console.log("User input:", input);  // Log the input for debugging

  let url;

  // Check if the input is a valid URL
  if (input.startsWith('http://') || input.startsWith('https://')) {
    url = input; // Use the URL directly
  } else {
    const searchEngine = document.getElementById('uv-search-engine').value;
    url = search(input, searchEngine); // Format the search query
  }

  console.log("Final URL to load:", url);  // Log the final URL to load

  loadWebsite(url); // Load the website in the iframe
});

/**
 * Error handling function to register the Service Worker only if conditions are met.
 * Only registers the service worker for HTTPS and allowed local hostnames.
 */
async function registerSW() {
  // Ensure service workers are registered only under HTTPS and on allowed hostnames
  if (location.protocol !== "https:" && !["localhost", "127.0.0.1"].includes(location.hostname)) {
    throw new Error("Service workers cannot be registered without https.");
  }

  if (!navigator.serviceWorker) {
    throw new Error("Your browser doesn't support service workers.");
  }

  // Register the service worker if conditions are met
  const stockSW = "/web/uv-sw.js";
  await navigator.serviceWorker.register(stockSW, {
    scope: __uv$config.prefix,
  });
}

// Initialize Service Worker Registration on page load
window.addEventListener("load", () => {
  try {
    registerSW();
  } catch (err) {
    console.error("Service Worker Registration Error:", err.message);
  }
});

/**
 * Fix for non-string values in `split()` method to prevent errors.
 */
function safeSplit(input, delimiter) {
  // Check if the input is a string
  if (typeof input === 'string') {
    return input.split(delimiter);
  } else {
    console.error("Input is not a valid string:", input);
    return []; // Return an empty array or handle error as needed
  }
}

/**
 * Example usage of `safeSplit` to handle non-string values.
 */
document.addEventListener("DOMContentLoaded", function() {
  try {
    // Sample image element that might have a srcset
    const imgElement = document.querySelector('img');
    if (imgElement && imgElement.src) {
      const srcSet = safeSplit(imgElement.src, ',');
      console.log('Processed srcSet:', srcSet);
    }
  } catch (e) {
    console.error("Error processing elements:", e);
  }
});
