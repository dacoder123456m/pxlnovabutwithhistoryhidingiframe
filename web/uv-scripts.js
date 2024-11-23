document.addEventListener('DOMContentLoaded', function () {
    console.log("uv-scripts.js loaded");

    // Grab the input fields and form
    const urlInput = document.getElementById("uv-address");
    const searchForm = document.getElementById("uv-form");
    const searchEngineSelect = document.getElementById("search-engine");
    const iframe = document.getElementById("webFrame");

    // Check if the elements are available in the DOM
    if (!urlInput || !searchForm || !searchEngineSelect || !iframe) {
        console.error("Error: One or more essential DOM elements are missing.");
        return;
    }

    // Function to request fullscreen for the iframe
    function requestFullScreen(element) {
        var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullscreen;
        if (requestMethod) {
            requestMethod.call(element);
            console.log("Fullscreen requested for", element);
        } else if (typeof window.ActiveXObject !== "undefined") {
            var wscript = new ActiveXObject("WScript.Shell");
            if (wscript !== null) {
                wscript.SendKeys("{f11}");
                console.log("Fullscreen request triggered via ActiveX");
            }
        }
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

        // Check if __uv__ is defined and retry if necessary
        function checkUVConfig() {
            if (typeof __uv__ !== 'undefined' && __uv__.config) {
                // If UV is available, encode the URL and prefix it correctly
                const encodedUrl = __uv__.config.encodeUrl(url);
                const proxifiedUrl = __uv__.config.prefix + encodedUrl;
                iframe.src = proxifiedUrl;
                console.log("UV proxified URL:", proxifiedUrl);
            } else {
                console.log("UV configuration not found. Retrying...");
                setTimeout(checkUVConfig, 1000); // Retry every second
            }
        }

        checkUVConfig();

        // Set iframe properties and make it visible
        iframe.style.width = "100vw";
        iframe.style.height = "100vh";
        iframe.allowFullscreen = true;
        iframe.onload = function () {
            console.log("Iframe content loaded:", url);
            // Request fullscreen when iframe loads
            requestFullScreen(iframe);
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

    // Set up event listener for Enter key to submit the form and load the website
    urlInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent page reload
            const input = urlInput.value.trim();
            let url;

            // Check if input is a URL or a search query
            if (input.startsWith('http://') || input.startsWith('https://')) {
                url = input;
            } else {
                const searchEngine = searchEngineSelect.value;
                url = searchEngine.replace('%s', encodeURIComponent(input));
            }

            loadWebsite(url); // Load the website in the iframe
        }
    });

    console.log("uv-scripts.js initialized");
});
