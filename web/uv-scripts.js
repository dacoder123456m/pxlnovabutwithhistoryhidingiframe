document.addEventListener('DOMContentLoaded', function() {
    console.log("uv-scripts.js loaded");

    const urlInput = document.getElementById("urlInput");
    const searchForm = document.getElementById("searchForm");

    // Check if the elements exist
    if (!urlInput) {
        console.error("Error: urlInput element not found.");
        return;
    }
    if (!searchForm) {
        console.error("Error: searchForm element not found.");
        return;
    }

    // Function to handle loading of websites in the iframe
    function loadWebsite(url) {
        const iframe = document.getElementById("webFrame");
        console.log("Attempting to load URL:", url);

        // Check if the input is a valid URL
        if (isValidURL(url)) {
            console.log("Input is a valid URL:", url);
        } else {
            console.log("Input is not a valid URL, proceeding as a search query");
            url = `https://duckduckgo.com/?q=${encodeURIComponent(url)}`;
        }

        console.log("Final URL to load:", url);

        // Set iframe properties
        iframe.style.width = "100vw";
        iframe.style.height = "100vh";
        iframe.allowFullscreen = true;

        // Load the URL into the iframe
        iframe.src = url;
        console.log("Website loading in iframe with URL:", url);

        // Handle iframe load
        iframe.onload = function() {
            console.log("Iframe content loaded:", url);
        };

        // Handle iframe error
        iframe.onerror = function(error) {
            console.error("Failed to load website in iframe:", error);
            iframe.src = "error_page.html"; // Fallback page
            console.log("Iframe fallback to error page.");
        };
    }

    // Function to check if a URL is valid
    function isValidURL(url) {
        try {
            new URL(url);
            return true;
        } catch (e) {
            return false;
        }
    }

    // Event listener for form submission or URL input
    searchForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const userInput = urlInput.value.trim();
        console.log("User input:", userInput);

        if (userInput) {
            loadWebsite(userInput);
        } else {
            console.log("No URL provided.");
        }
    });

    // Sample user input for debugging
    let sampleInput = "https://www.example.com";
    console.log("Testing with sample input:", sampleInput);
    loadWebsite(sampleInput);

    // Simulate user input change
    urlInput.addEventListener("input", function() {
        const userInput = urlInput.value;
        console.log("User input changed:", userInput);
    });
});

console.log("uv-scripts.js initialized");
