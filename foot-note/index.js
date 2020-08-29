import FootNote from './src/footNote.js';

/* Define <foot-note> */
window.customElements.define('foot-note', FootNote);


/* 
	Set index of footnotes programmatically: 
	The index attribute of footnote elements can be omitted. 
	Alternatively, the attribute index="1" can be set in the footnote elements. 
	The attribute visible controls the visibility. 
*/
const sections = document.querySelectorAll('section');
sections.forEach(section => {
	const footnotes = section.querySelectorAll('foot-note');
	footnotes.forEach((note, index) => {
		note.setAttribute('index', index + 1);
	});
});
	