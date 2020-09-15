import FootNote from './src/foot-note.js';

(function() {
  
	if(!('customElements' in window)) {
		return false;
	}

	/* Define <foot-note> element */
	window.customElements.define('foot-note', FootNote);

	const definePromiseArray = [
		customElements.whenDefined('foot-note')
	];

	Promise.all(definePromiseArray)
	.then(() => {

		/* Web component: FootNote */
		/* Set index programmatically (optional) */
		const footnotes = document.querySelectorAll('foot-note');
		footnotes.forEach((note, index) => {
			if(!note.hasAttribute('index')) {
				note.setAttribute('index', index + 1);
			}
		});
		/* Add Event Listener (optional) */
		footnotes.forEach((note, index) => {
			note.addEventListener('footnote-on-toggle', (event) => {
				console.log("Footnote toggled. Visible: " + event.detail.visible);
			}, false);
			note.addEventListener('footnote-on-hide', (event) => {
				console.log("Footnote hidden. Visible: " + event.detail.visible);
			}, false);
		});
		
	})
	.catch(error => {
		console.error(error);
	});

})();