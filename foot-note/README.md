# Web Component: `<foot-note>`
[![License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](http://badges.mit-license.org)

Web component that creates a custom element with the HTML tag `<foot-note>`. The element is displayed in the footer after clicking on the footnote call.

<img src="https://github.com/RolandDreger/web-components/raw/master/foot-note/foot-note_web_component.png" title="Footnote web component" alt="Footnote web component">

# Installation

```
import FootNote from './src/footNote.js';

if('customElements' in window) {
	window.customElements.define('foot-note', FootNote);
}
```

# Usage (Document HTML)

## Manual footnote index
```
<foot-note index="1"><strong>15: Footnotes, indexes, contents, and outlines.</strong> U.S. Government Printing Office Style Manual.  Retrieved October 26, 2015.</foot-note>
```

## Programmatically footnote index
```
<foot-note><strong>15: Footnotes, indexes, contents, and outlines.</strong> U.S. Government Printing Office Style Manual.  Retrieved October 26, 2015.</foot-note>
```

### JavaScript example 1: Document

```
const footnotes = document.querySelectorAll('foot-note');
footnotes.forEach((note, index) => {
	if(!note.hasAttribute('index')) {
		note.setAttribute('index', index + 1);
	}
});
```

### JavaScript example 2: Sections
```
const sections = document.querySelectorAll('section');
sections.forEach(section => {
	const footnotes = section.querySelectorAll('foot-note');
	footnotes.forEach((note, index) => {
		if(!note.hasAttribute('index')) {
			note.setAttribute('index', index + 1);
		}
	});
});
```


## Shortcuts

Hide note with ESC key.

## Style (Document CSS)

### Custom properties
```
--footnote-theme-color: teal;
--footnote-max-width: 58rem;
--footnote-line-heigth: 1.4;
--footnote-font-size: 1rem;
```

### Pseudoelement: part
```
foot-note::part(call) {
	/* Custom styles: Footnote call */
}
foot-note::part(area) {
	/* Custom styles: Footnote area */
}
foot-note::part(marker) {
	/* Custom styles: Footnote marker */
}
foot-note::part(element) {
	/* Custom styles: Footnote element */
}
foot-note::part(button) {
	/* Custom styles: Close button */
}
```

### Fallback (JavaScript disabled)
```
foot-note:not(:defined) {
	/* Custom styles */
}
foot-note:not(:defined)::before {
	counter-increment: foot-note;                  
  	content: "[" counter(foot-note);
	/* Custom styles */
}
foot-note:not(:defined)::after {             
  	content: "]";
	/* Custom styles */
}
```

## License

[MIT](http://www.opensource.org/licenses/mit-license.php)

## Author

Roland Dreger, www.rolanddreger.net

[PayPal](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=roland%2edreger%40a1%2enet&lc=AT&item_name=Roland%20Dreger%20%2f%20Donation%20for%20script%20development%20Kirby-Data-Importer&currency_code=EUR&bn=PP%2dDonationsBF%3abtn_donateCC_LG%2egif%3aNonHosted) Link 
