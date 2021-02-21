# `<note-list>`

Web component that creates a custom element with the HTML tag `<note-list>`. The element collects all notes with the specified tag name and displays their contents in a list.

<img src="https://github.com/RolandDreger/web-components/raw/master/note-list/note-list_web_component.png" title="Note list web component" alt="Screenshot note-list web component">


## Demo

[Check it life with `<foot-note>`!](https://rolanddreger.github.io/web-component-demo/foot-note/)

[Check it life with `<inline-note`>!](https://rolanddreger.github.io/web-component-demo/inline-note/) 


## Install

```javascript
import NoteList from './src/note-list.js';

if('customElements' in window) {
	window.customElements.define('note-list', NoteList);
}
```


## Usage (Document HTML)
```html
<section id="footnotes" role="doc-endnotes" aria-labelledby="note-list-label">
	<note-list notetype="foot-note" noterole="doc-endnote" noteindex source="target">
		<h3 id="note-list-label">References:</h3>
	</note-list>
</section>
```

If notes have the same index, only one list entry is created, but one backlink for each of them. The `source` attribute can be used to select a specific text section in the document. This allows more than one `<note-list>` element to be inserted. If the `noteindex` attribute is set, the index value of the note is taken.


## Style (Document CSS)
### Custom properties
```css
--note-list-font-color: #000000;
--note-list-dark-font-color: #ffffff;
```

### Pseudoelement: part
```css
note-list::part(area) {			
	/* Custom styles: Note list area */
}
note-list::part(list) {			
	/* Custom styles: Note list list */
}
note-list::part(list-item) {			
	/* Custom styles: Note list list item */
}
note-list::part(backlink) {			
	/* Custom styles: Backlink to note */
}
```


## Options

| Attribute   | Options  | Default | Description                                                                     | 
| ----------- | -------- | ------- | ------------------------------------------------------------------------------- |  
| `notetype`  | *String* | unset   | Tag name of the notes for the list                                              |
| `noterole`  | *String* | unset   | Aria role for list items                                                        |
| `noteindex` | empty    | unset   | Get value of note `index` attribute for list number                             |
| `source`    | *String* | unset   | ID of source element, e.g. <section id="target">                                |
| `sort`      | *String* | unset   | Sort notes by `index` attribute. Values: `text` or `number`.                    |
| `lang`      | *String* | unset   | Language support for aria-label, title, ... and for sorting. (default: "en-US") |


## Methods

| Prototype    | Parameters                   | Returns | Description       | 
| ------------ | ---------------------------- | ------- | ----------------- | 
| `update() `  | delay (Number, Milliseconds) | Nothing | Update note list  | 


## Events

| Event         | Description                         | 
| ------------- | ----------------------------------- | 
| `update-done` | Triggered when list update is done. | 



## License

[MIT](https://github.com/RolandDreger/web-components/blob/master/MIT-LICENSE.md)


## Author

Roland Dreger, www.rolanddreger.net

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=roland%2edreger%40a1%2enet&lc=AT&item_name=Roland%20Dreger%20%2f%20Donation%20for%20script%20development%20Kirby-Data-Importer&currency_code=EUR&bn=PP%2dDonationsBF%3abtn_donateCC_LG%2egif%3aNonHosted)
