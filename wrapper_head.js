// ==UserScript==
// @name        WADO
// @namespace   WADO
// @match       https://saint-luke.net
// @grant       none
// @version     1.0
// @author      cloudkucooland
// @run-at         document-start
// ==/UserScript==

window.addEventListener('beforescriptexecute', function(e) {
	// drop host script
	src = e.target.src;
	if (src.search(/webui\.js/) != -1) {
		e.preventDefault();
		e.stopPropagation();
		window.removeEventListener(e.type, arguments.callee, true);
		console.log("drop main.js from the host");
	};
}, true);
function ready( fn ) {
  setTimeout(fn, 2000);
};

function addCSS(css) {
	var s = document.createElement('style');
	s.textContent = css;
	document.head.appendChild(s);
}

ready(() => {
  console.log('creating app');
  document.getElementById('app').remove();
