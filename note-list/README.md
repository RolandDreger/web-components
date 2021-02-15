# `<note-list>`

Web component that creates a custom element with the HTML tag `<inline-note>`. The element is displayed inline after clicking on the inline-note call.

<img src="https://github.com/RolandDreger/web-components/raw/master/inline-note/inline-note_web_component.png" title="Inline note web component" alt="Screenshot inline-note web component">


## Demo

[Check it life!](https://rolanddreger.github.io/web-component-demo/inline-note/) 


## Install

```javascript
import InlineNote from './src/inline-note.js';

if('customElements' in window) {
	window.customElements.define('inline-note', InlineNote);
}
```


## Usage (Document HTML)
### Manual inline note index

**`<inline-note index="Begeja et al., 2010">`**`Bugeja, Michael and Daniela V. Dimitrova (2010). Vanishing Act: The Erosion of Online Footnotes and Implications for Scholarship in the Digital Age. Duluth, Minnesota: Litwin Books. ISBN 978-1-936117-14-7`**`</inline-note>`**


## Style (Document CSS)
### Custom properties
```css
--inline-note-theme-color: teal;
--inline-note-font-color: #000000;
--inline-note-call-font-color: teal;
--inline-note-area-color: #f2f2f2; 
--inline-note-vertical-unit: 0;
--inline-note-border-radius: 0.2rem;
--inline-note-call-vertical-align: baseline;
--inline-note-call-font-size: inherit;
--inline-note-dark-theme-color: mediumturquoise;
--inline-note-dark-area-color: #464646;
--inline-note-dark-font-color: #fffff;
--inline-note-dark-call-font-color: mediumturquoise;
--inline-note-call-opening-bracket: "(";
--inline-note-call-closing-bracket: ")";
```

### Pseudoelement: part
```css
inline-note::part(call) {
	/* Custom styles: Inline note call */
}
inline-note::part(area) {
	/* Custom styles: Inline note area */
}
inline-note::part(element) {
	/* Custom styles: Inline note element */
}
inline-note::part(button) {
	/* Custom styles: Close button */
}
```

### Fallback (JavaScript disabled)
```css
inline-note:not(:defined) {
	color: #000000;
	color: var(--inline-note-theme-color, #000000);
}
inline-note:not(:defined)::before {
	padding-right: 0.5rem;
	color: #000000;
	color: var(--inline-note-theme-color, #000000);
	text-decoration: none;
	counter-increment: inline-note;                  
	content: "(→"; /* attr(index) */
}
inline-note:not(:defined)::after {             
	content: ")";
}
```

## Shortcuts

| Key | Description             |
| --- | ----------------------- |
| ESC | Hide notes with ESC key.|


## Options

| Attribute   | Options  | Default | Description                                                    | 
| ----------- | -------- | ------- | -------------------------------------------------------------- |  
| `notetype`  | *String* | unset   | Note tag name                                                  |
| `noterole`  | *String* | unset   | Note aria role in list                                         |
| `noteindex` | empty    | unset   | Get list number from note index attribute                      |
| `source`    | *String* | unset   | ID of source element, e.g. <section id="target">               |
| `lang`      | *String* | unset   | Language support for aria-label, title, ... (default: "en-US") |


## Methods

| Prototype      | Parameters | Returns | Description                   | 
| ------------   | ---------- | ------- | ----------------------------- | 
| `update() `    | None       | Nothing | Update list                   | 


## Events

| Event                | Description                                     | 
| -------------------- | ----------------------------------------------- | 
| `visible-changed`    | Triggered when the attribute `visible` changes. | 

### Event Listener (optional)
```javascript
const inlineNotes.forEach((note, index) => {
	inlineNotes.addEventListener('visible-changed', (event) => {
		console.log(`Inline note ${note.getAttribute('index')}: visible = ${event.detail.visible}`);
	}, false);
});
```


## License

[MIT](https://github.com/RolandDreger/web-components/blob/master/MIT-LICENSE.md)


## Author

Roland Dreger, www.rolanddreger.net

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=roland%2edreger%40a1%2enet&lc=AT&item_name=Roland%20Dreger%20%2f%20Donation%20for%20script%20development%20Kirby-Data-Importer&currency_code=EUR&bn=PP%2dDonationsBF%3abtn_donateCC_LG%2egif%3aNonHosted)
