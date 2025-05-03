// ==UserScript==
// @name         MoarEmotes
// @namespace    http://tampermonkey.net/
// @version      2025-04-29
// @description  Extended Emote List for Pikidiary
// @author       zav
// @match        https://pikidiary.lol/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pikidiary.lol
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    fetch('https://gist.githubusercontent.com/JustAGoodUsername/d0cfebb32023bec097b3e471a041905b/raw/fd54e0d07b69a8f5d4f7b8f33149d26f276c4344/emotes.json')
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

        const match = link.match(/\/([^/]+)\.(png|gif|jpeg)$/); // Regex to capture only digits before .gif/.png/.etc

        if (match && match[1]) {
            filenameWithoutExtension = match[1];
        } else {
            console.warn(`Could not extract filename using regex: ${link}.`);
        }

        image.src = link;
        image.alt = "Emote";
        image.style.cursor = "pointer";
        image.style.marginRight = "5px";

        image.onclick = function() {
            if (!window.__cfRLUnblockHandlers) return false; // idk why jax does this but its okay
            insertEmote(`:${filenameWithoutExtension}:`);
    };

    emotesContainer.appendChild(image);
}
})();
