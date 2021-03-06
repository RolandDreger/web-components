# `<foot-note>`

Web component that creates a custom element with the HTML tag `<foot-note>`. The element is displayed in the footer after clicking on the footnote call.

<img src="https://github.com/RolandDreger/web-components/raw/master/foot-note/foot-note_web_component.png" title="Footnote web component" alt="Screenshot foot-note web component">


## Demo

[Check it life!](https://rolanddreger.github.io/web-component-demo/foot-note/) 


## Install

```javascript
import FootNote from './src/foot-note.js';

if('customElements' in window) {
	window.customElements.define('foot-note', FootNote);
}
```


## Usage (Document HTML)
### Manual footnote index

**`<foot-note index="1">`**`<strong>15: Footnotes, indexes, contents, and outlines.</strong> U.S. Government Printing Office Style Manual.  Retrieved October 26, 2015.`**`</foot-note>`**

### Programmatically footnote index (optional)

**`<foot-note>`**`<strong>15: Footnotes, indexes, contents, and outlines.</strong> U.S. Government Printing Office Style Manual.  Retrieved October 26, 2015.`**`</foot-note>`**

#### JavaScript example 1: Document

```javascript
const footnotes = document.querySelectorAll('foot-note');
footnotes.forEach((note, index) => {
	if(!note.hasAttribute('index')) {
		note.setAttribute('index', index + 1);
	}
});
```

#### JavaScript example 2: Sections
```javascript
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


## Style (Document CSS)
### Custom properties
```css
--footnote-theme-color: teal;
--footnote-call-vertical-align: super;
--footnote-call-font-size: 0.8rem;
--footnote-area-color: white;
--footnote-dark-area-color: black;
--footnote-max-width: 58rem;
--footnote-line-heigth: 1.4;
--footnote-font-size: 1rem;
--footnote-font-color: black;
--footnote-dark-font-color: white;
--footnote-call-opening-bracket: "[";
--footnote-call-closing-bracket: "]";
```

### Pseudoelement: part
```css
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
```css
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

## Shortcuts

| Key | Description            |
| --- | ---------------------- |
| ESC | Hide note with ESC key.|


## Options

| Attribute | Options  | Default | Description                                              | 
| --------- | -------- | ------- | -------------------------------------------------------- | 
| `index`   | *String* | unset   | Footnote index: can be set manually or via Javascript.   | 
| `visible` | Empty    | unset   | If the attribute has been set, the element is displayed. |
| `lang`    | *String* | unset   | Language support for aria-label, title, ...              |


## Methods

| Prototype      | Parameters | Returns | Description                   | 
| ------------   | ---------- | ------- | ----------------------------- | 
| `hide() `      | Event      | Nothing | Hide element (close button).  | 
| `hideAll()`    | None       | Nothing | Hide all elements.            |
| `hideOthers()` | None       | Nothing | Hide all elements but this.   |
| `toggle()`     | Event      | Nothing | Toggle visibility of element. |


## Events

| Event                | Description                                     | 
| -------------------- | ----------------------------------------------- | 
| `visible-changed`    | Triggered when the attribute `visible` changes. | 

### Event Listener (optional)
```javascript
const footnotes = document.querySelectorAll('foot-note');
footnotes.forEach((note, index) => {
	note.addEventListener('visible-changed', (event) => {
		console.log(`Footnote ${note.getAttribute('index')}: visible = ${event.detail.visible}`);
	}, false);
});
```


## License

[MIT](https://github.com/RolandDreger/web-components/blob/master/MIT-LICENSE.md)


## Author

Roland Dreger, www.rolanddreger.net

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=roland%2edreger%40a1%2enet&lc=AT&item_name=Roland%20Dreger%20%2f%20Donation%20for%20script%20development%20Kirby-Data-Importer&currency_code=EUR&bn=PP%2dDonationsBF%3abtn_donateCC_LG%2egif%3aNonHosted)
