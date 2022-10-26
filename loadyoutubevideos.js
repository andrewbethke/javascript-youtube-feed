/**
 * A script for loading youtube videos into a webpage on load.
 * 
 * From https://github.com/andrewbethke/youtube-video-feed,
 * written by Andrew Bethke.
 */

const AUTH_KEY = "YOUR_API_KEY_HERE"; // Your Youtube API key. To get one, see https://developers.google.com/youtube/v3/getting-started
const VIDEO_COUNT = 6; // The number of videos to retrieve in the API call.
const PLAYLIST = "YOUR_PLAYLIST_HERE"; // The playlist ID to retrieve videos from

// The id of the parent element where you want the video tiles to go.
const PARENT_ID = "video-container";

// The id of the loading graphic that should disappear when videos load.
const LOADING_ID = "videos-loading";

// The following are the CSS classes that will be assigned to
// parts of every video's tile on the webpage.
const TILE_CLASS = "video-tile";
const LINK_CLASS = "video-link";
const HEADER_CLASS = "video-header";
const THUMBNAIL_CLASS = "video-thumbnail";
const DESCRIPTION_CLASS = "video-description";

// The resolution of the thumbnail to grab. 
// Supported values in order of quality from most to least:
// maxres, standard, high, medium, default

const THUMBNAIL_QUALITY = "standard";

/**
 * Helper function to create and open a new HTTP Request
 * @param {String} url The URL to request
 * @return The created XMLHttpRequest
 */
function createHttpRequest(url) {
    const req = new XMLHttpRequest();
    req.open("GET", url);
    return req;
}

/**
 * Creates one video tile and appends it to the end of the video container.
 * @param {Object} video 
 */
function makeSingleVideoTile(video) {
    const videoData = video.snippet;

    // Create the parent "tile" element
    const tile = document.createElement("div");
    tile.classList.add(TILE_CLASS);

    // Create the link that goes over the title and thumbnail.
    const link = document.createElement("a");
    link.href = `https://youtu.be/${videoData.resourceId.videoId}`;
    link.classList.add(LINK_CLASS);
    tile.appendChild(link);

    // Create the span element that contains the title of the video.
    const heading = document.createElement("span");
    heading.classList.add(HEADER_CLASS);
    heading.innerText = videoData.title;
    link.appendChild(heading);

    // Create the img element for the thumbnail.
    const thumbnail = document.createElement("img");
    thumbnail.classList.add(THUMBNAIL_CLASS);
    thumbnail.src = videoData.thumbnails[THUMBNAIL_QUALITY].url;
    link.appendChild(thumbnail);

    // Create the span element that contains the description.
    const description = document.createElement("span");
    description.classList.add(DESCRIPTION_CLASS);
    description.innerText = videoData.description;
    link.appendChild(description);

    // Finally, add the tile to the end of the video container.
    document.getElementById(PARENT_ID).appendChild(tile);
}

/**
 * Fills in video tiles for all of the videos retrieved.
 * @param {String} json The raw PlaylistItem JSON returned by the YouTube API
 */
function makeVideoTiles(json) {
    // First, make the loading element invisible.
    document.getElementById(LOADING_ID).style.display = "none";
    // Parse the raw JSON
    const videoData = JSON.parse(json);
    // Make a tile for each video.
    videoData.items.forEach(makeSingleVideoTile);
}

/**
 * Creates and handles the video HTTP Request.
 * Calls makeVideoTiles when Request loads.
 */
function getVideos() {
    const request = createHttpRequest(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=${VIDEO_COUNT}&playlistId=${PLAYLIST}&key=${AUTH_KEY}`
    );

    // Setup error handling; output error data to console
    // and change "loading" graphic to "error."
    request.onerror = function (err) {
        console.log(`Error loading videos. Here's what we know: ${err}`);
    }

    // Call makeVideoTiles on successful load.
    request.onloadend = function () {
        if (request.status == 200) {
            makeVideoTiles(request.response);
        }
    }

    // Now that we're done with setup, send the Request.
    request.send();
}