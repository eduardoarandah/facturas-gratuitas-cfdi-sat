// inyectar script directo en el dom
// https://stackoverflow.com/a/9517879/4581363
// Underlying cause:
// Content scripts are executed in an "isolated world" environment.
//
// Solution:
// Inject the code into the page using DOM - that code will be able to access functions/variables of the page context ("main world") or expose functions/variables to the page context (in your case it's the state() method).
//
// Note in case communication with the page script is needed:
// Use DOM CustomEvent handler. Examples: one, two, and three.
//
// Note in case chrome API is needed in the page script:
// Since chrome.* APIs can't be used in the page script, you have to use them in the content script and send the results to the page script via DOM messaging (see the note above).
var s = document.createElement("script");
s.src = chrome.runtime.getURL("inject-in-dom.js");
(document.head || document.documentElement).appendChild(s);
