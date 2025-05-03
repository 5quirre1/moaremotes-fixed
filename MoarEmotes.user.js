// ==UserScript==
// @name         MoarEmotes
// @namespace    http://tampermonkey.net/
// @version      2025-04-29
// @description  Have
// @author       zav
// @match        https://pikidiary.lol/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pikidiary.lol
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    fetch('https://raw.githubusercontent.com/ozgq/moaremotes/refs/heads/main/emotes.json') // those NEW EMOTES JUST DROPPED.
        .then(response => {
            if (!response.ok) {
                throw new Error(`Oops: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Fetched Data:", data);
            console.log("Found images:");
            const startIndex = (Array.isArray(data) && data.length > 0 && Array.isArray(data[0]) && data[0].includes('original')) ? 1 : 0;

            for (let i = startIndex; i < data.length; i++) {
                const imageUrl = Array.isArray(data[i]) ? data[i][0] : data[i];
                loadEmotes(imageUrl);
            }
            console.log(`\nFound ${data.length - startIndex} images.`);
            return data;
        })
        .catch(error => {
            console.error("Oops:", error);
            return [];
        });
    // REGARDING THIS FUNCTION:
    // I HATE THE SPLIT FUNCTION IN JAVASCRIPT. IT SUCKS. AND DID NOT WANT TO WORK.
    // I HAVE RECENTLY FOUND THAT IT WAS A PARSING ERROR REGARDING MY FETCHING METHODS. I'M A LITTLE REMEDIAL RIGHT NOW. BE NICE.
    function loadEmotes(link) {
        console.log("called with:", link, typeof link);
        const emotesContainer = document.querySelector(".dropdown-cont");
        const image = document.createElement("img");
        let filenameWithoutExtension = "";

        const match = link.match(/\/(\d+)\.gif$/); // Regex to capture only digits before .gif

        if (match && match[1]) {
            filenameWithoutExtension = match[1];
        } else {
            console.warn("Could not extract filename using regex:", link);
            const code = link.replace(/\D/g, "");
            filenameWithoutExtension = code;
        }

        image.src = link;
        image.alt = "Emote"; // for shits and giggles bro.
        image.style.cursor = "pointer";
        image.style.marginRight = "5px";

        image.onclick = function() {
            if (!window.__cfRLUnblockHandlers) return false; // idk why jax does this but its okay
            insertEmote(`:${filenameWithoutExtension}:`);
    };

    emotesContainer.appendChild(image);
}
})();
