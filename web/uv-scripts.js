// uv-scripts.js

console.log("uv-scripts.js loaded");

// Helper function to check if the URL is valid
function isValidURL(string) {
  try {
    new URL(string);
    return true;
  } catch (err) {
    return false;
  }
}

// Update search engine in hidden input field based on selection
function updateSearchEngine() {
  const searchEngine = document.getElementById("search-engine").value;
  const searchEngineInput = document.getElementById("uv-search-engine");

  console.log("Search engine selected:", searchEngine);
  
  // Update the hidden search engine input value
  searchEngineInput.value = searchEngine;
  console.log("Updated hidden input value:", searchEngineInput.value);
}

// Handle form submission (pressing Enter)
document.getElementById("uv-form").addEventListener("submit", function (e) {
  e.preventDefault();  // Prevent default form submission behavior
  const inputElement = document.getElementById("uv-address");
  let userInput = inputElement.value.trim();

  console.log("User input:", userInput);

  if (isValidURL(userInput)) {
    console.log("Input is a valid URL:", userInput);
    loadWebsite(userInput); // Directly load the URL if it's valid
  } else {
    console.log("Input is not a valid URL, proceeding as search query.");
    performSearch(userInput); // Treat as search query
  }
});

// Function to load a website into iframe
function loadWebsite(url) {
  const iframe = document.getElementById("webFrame");

  if (!iframe) {
    console.error("Error: iframe element not found!");
    return;
  }

  console.log("Final URL to load:", url);

  // Attempt to load the URL in the iframe
  try {
    iframe.src = url;  // Set the iframe's source to the given URL
    console.log("Website loading in iframe with URL:", url);
  } catch (error) {
    console.error("Error loading website:", error);
  }
}

// Function to perform a search query
function performSearch(query) {
  const searchEngine = document.getElementById("uv-search-engine").value;

  // Format the search URL based on the selected search engine
  const searchURL = searchEngine.replace("%s", encodeURIComponent(query));

  console.log("Final search URL to load:", searchURL);

  const iframe = document.getElementById("webFrame");

  if (!iframe) {
    console.error("Error: iframe element not found for search query!");
    return;
  }

  // Attempt to load the search URL in the iframe
  try {
    iframe.src = searchURL;
    console.log("Search query loading in iframe with URL:", searchURL);
  } catch (error) {
    console.error("Error loading search in iframe:", error);
  }
}

// Log when the iframe content has loaded
document.getElementById("webFrame").addEventListener("load", function () {
  console.log("Iframe content loaded:", this.src);
});

// Log any errors encountered in the iframe
document.getElementById("webFrame").addEventListener("error", function (e) {
  console.error("Error loading iframe content:", e);
});

// Debugging user input handling
const inputElement = document.getElementById("uv-address");
inputElement.addEventListener("input", function (e) {
  console.log("User input changed:", e.target.value);
});

// Debugging search engine change
document.getElementById("search-engine").addEventListener("change", function (e) {
  console.log("Search engine changed:", e.target.value);
});

// Additional Debugging: Service Worker or fetch issues
function debugServiceWorker(url) {
  console.log("Attempting to fetch URL via service worker:", url);

  // Sample fetch request (adjust based on actual service worker implementation)
  fetch(url)
    .then(response => {
      console.log("Service Worker response received:", response);
      return response.text();
    })
    .then(data => {
      console.log("Service Worker data:", data);
    })
    .catch(error => {
      console.error("Service Worker fetch error:", error);
    });
}

// Call this function for testing service worker fetch
debugServiceWorker("/web/uv/service/hvtrs8%2F-wuw%2Cezaopne%2Ccmm");
