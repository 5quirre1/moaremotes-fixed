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

    window.addEventListener('load', function() {
        fetch('https://raw.githubusercontent.com/JustAGoodUsername/moaremotes-ext/refs/heads/patch-2/emotes.json')
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
                    if (imageUrl) {
                        loadEmotes(imageUrl);
                    }
                }

                console.log(`\nFound ${data.length - startIndex} images.`);
            })
            .catch(error => {
                console.error("Oops:", error);
            });
    });
    
    // REGARDING THIS FUNCTION:
    // I HATE THE SPLIT FUNCTION IN JAVASCRIPT. IT SUCKS. AND DID NOT WANT TO WORK.
    // I HAVE RECENTLY FOUND THAT IT WAS A PARSING ERROR REGARDING MY FETCHING METHODS. I'M A LITTLE REMEDIAL RIGHT NOW. BE NICE.

    function loadEmotes(link) {
        console.log("Processing emote:", link);

        const emotesContainer = document.querySelector(".dropdown-cont");
        if (!emotesContainer) {
            console.error("emotes container not found!");
            return;
        }

        const image = document.createElement("img");

        let emoteCode = "";
        const match = link.match(/\/([^/]+)\.(png|gif|jpe?g)$/i); // Regex to capture only digits before .gif/.png/.etc

        if (match && match[1]) {
            emoteCode = match[1];
        } else {
            const segments = link.split('/');
            const lastSegment = segments[segments.length - 1];
            emoteCode = lastSegment.split('.')[0];
            console.warn(`using fallback filename extraction for: ${link}`);
        }

        image.src = link;
        image.alt = emoteCode;
        image.title = `:${emoteCode}:`;
        image.style.cursor = "pointer";
        image.style.marginRight = "5px";
        image.style.maxHeight = "32px";
        
        image.onclick = function() {
            if (window.__cfRLUnblockHandlers === undefined || window.__cfRLUnblockHandlers) {
                insertEmote(`:${emoteCode}:`);
            }
        };

        emotesContainer.appendChild(image);
    }

    function insertEmote(emoteCode) {
        if (typeof window.insertEmote === 'function') {
            window.insertEmote(emoteCode);
        } else {
            const activeElement = document.activeElement;
            if (activeElement && (activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'INPUT')) {
                const start = activeElement.selectionStart;
                const end = activeElement.selectionEnd;
                const text = activeElement.value;
                activeElement.value = text.substring(0, start) + emoteCode + text.substring(end);
                activeElement.selectionStart = activeElement.selectionEnd = start + emoteCode.length;
                activeElement.focus();

                const event = new Event('input', { bubbles: true });
                activeElement.dispatchEvent(event);
            } else {
                console.error("could not find insertEmote function or active input element");
            }
        }
    }
})();
