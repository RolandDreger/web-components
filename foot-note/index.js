import FootNote from './src/footNote.js';

/* Define <foot-note> */
window.customElements.define('foot-note', FootNote);

customElements.whenDefined('foot-note')
.then(_ => {
	/* Set index of footnotes programmatically (optional) */
	const sections = document.querySelectorAll('section');
	sections.forEach(section => {
		const footnotes = section.querySelectorAll('foot-note');
		footnotes.forEach((note, index) => {
			note.setAttribute('index', index + 1);
		});
	});
	/* Add Event Listener (optional) */
	sections.forEach(section => {
		const footnotes = section.querySelectorAll('foot-note');
		footnotes.forEach((note, index) => {
			note.addEventListener('footnote-on-toggle', (event) => {
				console.log("Footonote toggled. Visible: " + event.detail.visible);
			}, false);
			note.addEventListener('footnote-on-hide', (event) => {
				console.log("Footonote hidden. Visible: " + event.detail.visible);
			}, false);
		});
	});
})
.catch(error => {
	console.log(error);
});
