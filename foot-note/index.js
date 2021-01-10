import FootNote from './src/foot-note.js';

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
			note.addEventListener('visible-changed', (event) => {
				console.log(`Footnote ${note.getAttribute('index')}: visible = ${event.detail.visible}`);
			}, false);
		});
		
	})
	.catch(error => {
		console.error(error);
	});

})();