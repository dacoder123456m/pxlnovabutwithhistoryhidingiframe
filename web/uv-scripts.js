document.addEventListener('DOMContentLoaded', function () {
    console.log("uv-scripts.js loaded");

    // Grab the input fields and form
    const urlInput = document.getElementById("uv-address");
    const searchForm = document.getElementById("uv-form");
    const searchEngineSelect = document.getElementById("search-engine");
    const iframe = document.getElementById("webFrame");

    // Check if the elements are available in the DOM
    if (!urlInput) {
        console.error("Error: uv-address input not found.");
        return;
    }
    if (!searchForm) {
        console.error("Error: uv-form not found.");
        return;
    }
    if (!searchEngineSelect) {
        console.error("Error: search-engine select not found.");
        return;
    }
    if (!iframe) {
        console.error("Error: iframe not found.");
        return;
    }

    // Function to load the website in the iframe
    function loadWebsite(url) {
        console.log("Attempting to load URL:", url);

        // Validate URL format
        if (isValidURL(url)) {
            console.log("Valid URL:", url);
        } else {
            console.log("Input is not a valid URL, proceeding as a search query.");
            // Use the selected search engine
            const searchUrl = searchEngineSelect.value.replace("%s", encodeURIComponent(url));
            console.log("Search URL:", searchUrl);
            url = searchUrl;
        }

        // Set iframe properties and load the URL
        iframe.style.width = "100vw";
        iframe.style.height = "100vh";
        iframe.allowFullscreen = true;
        iframe.src = url;
        console.log("Website loading in iframe with URL:", url);

        // Handle iframe load
        iframe.onload = function () {
            console.log("Iframe content loaded:", url);
        };

        // Handle iframe error
        iframe.onerror = function (error) {
            console.error("Error loading website:", error);
            iframe.src = "error_page.html"; // Fallback page if loading fails
            console.log("Iframe fallback to error page.");
        };
    }

    // Function to check if a URL is valid
    function isValidURL(url) {
        try {
            new URL(url); // Try to create a URL object, which will throw an error if invalid
            return true;
        } catch (e) {
            return false;
        }
    }

    // Event listener for form submission
    searchForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent default form submission behavior
        const userInput = urlInput.value.trim();
        console.log("User input:", userInput);

        if (userInput) {
            loadWebsite(userInput);
        } else {
            console.log("No URL or search query provided.");
        }
    });

    // Monitor user input in the address field
    urlInput.addEventListener("input", function () {
        const userInput = urlInput.value;
        console.log("User input changed:", userInput);
    });

    // Set up a sample test to verify functionality
    let sampleInput = "https://www.example.com";
    console.log("Testing with sample input:", sampleInput);
    loadWebsite(sampleInput);
    
    // Debugging message when the DOM is fully loaded
    console.log("DOM is fully loaded, ready to interact.");
});

console.log("uv-scripts.js initialized");
