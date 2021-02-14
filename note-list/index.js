import NoteList from './src/note-list.js';

(function() {
	
	/* Check: Custom elements supported? */
	if(!('customElements' in window)) {
		return false;
	}

	/* Check: <note-list> already defined? */
	if(window.customElements.get('note-list')) {
		return false;
	}
	
	/* Define <note-list> element */
	window.customElements.define('note-list', NoteList);

	const definePromiseArray = [
		customElements.whenDefined('note-list')
	];

	Promise.all(definePromiseArray)
	.then(() => {

		/* Web component: NoteList */
		
		
	})
	.catch(error => {
		console.error(error);
	});

})();