import FootNote from './src/footNote.js';


if('customElements' in window) {

	/* Define <foot-note> */
	window.customElements.define('foot-note', FootNote);

	customElements.whenDefined('foot-note')
	.then(_ => {

		/* Set index of footnotes programmatically (optional) */
		/* Example: Document */
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

}