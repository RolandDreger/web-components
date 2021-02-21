import FootNote from './src/foot-note.js';
import NoteList from './../note-list/src/note-list.js';

(function() {
	
	/* Check: Custom elements supported? */
	if(!('customElements' in window)) {
		return false;
	}

	/* Check: <foot-note> already defined? */
	if(window.customElements.get('foot-note')) {
		return false;
	}
	
	/* Define <foot-note> element */
	window.customElements.define('foot-note', FootNote);
	window.customElements.define('note-list', NoteList);

	const definePromiseArray = [
		customElements.whenDefined('foot-note'),
		customElements.whenDefined('note-list')
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
		/* Notes */
		footnotes.forEach((note, index) => {
			note.addEventListener('visible-changed', (event) => {
				console.log(`Footnote ${note.getAttribute('index')}: visible = ${event.detail.visible}`);
			}, false);
		});
		/* Note list */
		document.addEventListener('update-done', (event) => {
			console.log(`Update done`, event.detail);
		}, false);

	})
	.catch(error => {
		console.error(error);
	});

})();