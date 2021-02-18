/* 
	Web Component: NoteList
	
	Custom Element: <note-list></note-list>
	Shadow DOM: true, open
	Attributes: notetype, noterole, noteindex (empty), source, lang (default: "en-US")
	Slots: default

	Author: Roland Dreger, www.rolanddreger.net
	License: MIT

	Date: 17 Feb. 2021
*/

/* Configuration */
const TEMPLATE_ID = 'note-list-template';
const TEMPLATE_COMMENT = 'NoteList component template';
const SHADOW_DOM_MODE = 'open';
const FALLBACK_LANG = "en";


/* Internal identifier */
const isInternal = Symbol('isInternal');
const updateID = Symbol('updateID');
const getInternalProxy = Symbol('getInternalProxy');
const documentLang = Symbol('documentLang');
const translate = Symbol('translate');


class NoteList extends HTMLElement {
	
	static get observedAttributes() { 
		return ['notetype', 'noterole', 'noteindex', 'source', 'lang'];
	}

	static get translations() {
		return {
			"en-US": {
				"callElementAriaLabel": "Note call",
				"closeButtonAriaLabel": "Close"
			},
			"de-DE": {
				"callElementAriaLabel": "Notenaufruf",
				"closeButtonAriaLabel": "Schließen"
			},
			"fr-FR": {
				"callElementAriaLabel": "Appel de note",
				"closeButtonAriaLabel": "Fermer"  
			}
		};
	}

	/* Styles */
	static createStyles() {
		
		/* CSS */
		const styleString = document.createTextNode(`
			:host {
				contain: content;
				display: block;
				font-family: inherit;
				color: #000000;
				color: var(--note-list-font-color, #000000);
			}
			:host([hidden]) {
				display: none;
			}
			*,
			*::before,
			*::after {
				box-sizing: border-box;
			}
			.area {
				display: block;
			}
			.area ol,
			.area ul {
				list-style-position: inside;
				padding-left: 0;
			}
			:host([noteindex]) li {
				list-style-type: none;
			}
			:host([noteindex]) li::before {
				content: attr(value) ":";
				margin-right: 1ch;
			}
			@media (prefers-color-scheme: dark) {
				:host {
					color: #ffffff;
					color: var(--note-list-dark-font-color, #ffffff);
				}
			}		
		`);
		
		const style = document.createElement('style');
		style.setAttribute('type','text/css');
		style.appendChild(styleString);

		const styleFragment = document.createDocumentFragment();
		styleFragment.appendChild(style);

		return styleFragment;
	}

	/* Template */
	static createTemplate() {

		/* Slot element */
		const slot = document.createElement('slot');
		
		/* List element */
		const list = document.createElement('ol');
		list.setAttribute('id', 'list');
		list.classList.add('list');
		list.setAttribute('part', 'list');

		/* Area element */
		const area = document.createElement('note-list-area');
		area.setAttribute('id', 'area');
		area.classList.add('area');
		area.setAttribute('part', 'area');
		area.appendChild(slot);
		area.appendChild(list);
		
		/* Template */
		const templateFragment = document.createDocumentFragment();
		templateFragment.appendChild(area);

		return templateFragment;
	}

	/* Mount: Comment, Styles, Template -> Target Node */
	static mount(targetNode) {
		
		/* Comment */
		const comment = document.createComment(TEMPLATE_COMMENT);
		targetNode.appendChild(comment);
		
		/* Styles */
		const styleFragment = NoteList.createStyles();

		/* Template */
		const templateFragment = NoteList.createTemplate();
		const templateElement = document.createElement('template');
		templateElement.setAttribute('id', TEMPLATE_ID);
		templateElement.content.appendChild(styleFragment);
		templateElement.content.appendChild(templateFragment);
		
		/* Document */
		const templateNode = targetNode.appendChild(templateElement);

		return templateNode;
	}

	/* Livecycle hooks */
	constructor() {
		super();
		
		/* Shadow DOM */
		const root = this.attachShadow({ 
			mode: SHADOW_DOM_MODE
		});
		
		/* Template */
		const template = (document.getElementById(TEMPLATE_ID) || NoteList.mount(document.body));
		root.appendChild(template.content.cloneNode(true));

		/* NoteList Elements */
		this.areaElement = root.getElementById('area');
		this.listElement = root.getElementById('list');

		this[updateID] = null;
	}

	connectedCallback() {
		if(!this.isConnected) {
			return false;
		}
		/* Set up */
		this.update();
	}

	disconnectedCallback() {
		/* Clean up */
	}
	
	attributeChangedCallback(name, oldValue, newValue) {
		if(oldValue === newValue) {
			return true;
		}
		
		switch(name) {
			/* Attribute: notetype */
			case 'notetype':
				this.update();
				break;
			/* Attribute: noterole */
			case 'noterole':
				this.update();
				break;
			/* Attribute: noteindex */
			case 'noteindex':
				this.update();
				break;
			/* Attribute: source */
			case 'source':
				this.update();
				break;
			/* Attribute: lang */
			case 'lang':
				const language = (newValue || this[documentLang]);
				break;
		}
	}

	/* Getter/Setter */
	get notetype() {
		return (this.getAttribute('notetype') || "");
	}
	set notetype(value) {
		this.setAttribute('notetype', value);
	}

	get noterole() {
		return (this.getAttribute('noterole') || "");
	}
	set noterole(value) {
		this.setAttribute('noterole', value);
	}

	get noteindex() {
		return this.hasAttribute('noteindex');
	}
	set noteindex(value) {
		const isNoteindex = Boolean(value);
		const hasChanged = (this.noteindex !== isNoteindex);
		if(!hasChanged) {
			return false;
		}
		if(isNoteindex) {
			this.setAttribute('noteindex', '');	
		} else {
			this.removeAttribute('noteindex');
		}
	}

	get source() {
		return (this.getAttribute('source') || "");
	}
	set source(value) {
		this.setAttribute('source', value);
	}

	get [documentLang]() {
		return (
			document.body.getAttribute("xml:lang") ||
			document.body.getAttribute("lang") ||
			document.documentElement.getAttribute("xml:lang") || 
			document.documentElement.getAttribute("lang") || 
			FALLBACK_LANG
		);
	}

	/* Methods (Prototype) */
	/* Update list (debounced)  */
	update(delay = 0) {
		clearTimeout(this[updateID]);
		this[updateID] = setTimeout(() => { 
				this.build();
			}, 
			delay, 
			arguments
		);
	}

	/* Build list */
	build() {
		if(!this.listElement) {
			throw new Error(`List element is not defined.`);
		}
		const list = this.listElement;
		while(list.hasChildNodes()) {  
			list.removeChild(list.firstChild);
		}
		const noteType = this.notetype;
		if(!noteType) {
			throw new Error(`Attribute [notetype] must be defined.`);
		}
		let sourceNode = document;
		if(!!this.source) {
			const sourceNodeSelector = '#' + this.source;
			sourceNode = document.querySelector(sourceNodeSelector);
			if(!sourceNode) {
				throw new Error(`Source element for <note-list> does not exist. ID: ${this.source}`);
			}
		} 
		const notes = sourceNode.querySelectorAll(noteType);
		notes.forEach((note) => {
			const listItem = document.createElement('li');
			listItem.setAttribute('part', 'list-item');
			if(this.noteindex) {
				listItem.setAttribute('value', note.index);
			}
			const noteRole = this.noterole;
			if(noteRole) {
				listItem.setAttribute('role', noteRole);
			}
			const slotNodes = note.childNodes;
			slotNodes.forEach((node) => {
				const clonedNode = node.cloneNode(true);
				if(clonedNode instanceof HTMLElement && clonedNode.hasAttribute('id')) {
					clonedNode.removeAttribute('id');
				}
				listItem.appendChild(clonedNode);
			});
			list.appendChild(listItem);
		});

		console.log("Updating ...", notes);
	}

	
	[getInternalProxy](externalHandler, context) {
		if(!externalHandler || !(externalHandler instanceof Function)) {
			return null;
		}
		context = (context || this);
		return new Proxy(externalHandler, {
			apply(target, thisArg, args) {
				context[isInternal] = true;
				try {
					Reflect.apply(target, context, args);
				} catch(error) {
					console.error(error);
				} finally {
					context[isInternal] = false;
				}
			}
		});
	}

	[translate](term, lang) {
		if(!term || typeof term !== "string") { 
			throw new TypeError(`Argument [term] must be a string: ${typeof term}`); 
		}
		if(!lang || typeof lang !== "string") { 
			throw new TypeError(`Argument [lang] must be a string: ${typeof lang}`); 
		}
		const languageCodes = {
			'en': 'en-US',
			'en-us': 'en-US',
			'cs': 'cs-CZ',
			'cs-cz': 'cs-CZ',
			'da': 'da-DK',
			'da-dk': 'da-DK',
			'de': 'de-DE',
			'de-de': 'de-DE',
			'es': 'es-ES',
			'es-es': 'es-ES',
			'fi': 'fi-FI',
			'fi-fi': 'fi-FI',
			'fr': 'fr-FR',
			'fr-fr': 'fr-FR',
			'it': 'it-IT',
			'it-it': 'it-IT',
			'ja': 'ja-JP',
			'ja-jp': 'ja-JP',
			'ko': 'ko-KR',
			'ko-kr': 'ko-KR',
			'nb': 'nb-NO',
			'nb-no': 'nb-NO',
			'nl': 'nl-NL',
			'pl': 'pl-PL',
			'pl-pl': 'pl-PL',
			'nl-nl': 'nl-NL',
			'pt': 'pt-BR',
			'pt-br': 'pt-BR',
			'ru': 'ru-RU',
			'ru-ru': 'ru-RU',
			'sv': 'sv-SE',
			'sv-se': 'sv-SE',
			'tr': 'tr-TR',
			'tr-tr': 'tr-TR',
			'zh-cn': 'zh-CN',
			'zh-hans-cn': 'zh-CN',
			'zh-hans': 'zh-CN',
			'zh-tw': 'zh-TW',
			'zh-hant-tw': 'zh-TW',
			'zh-hant': 'zh-TW'
		};
		
		const languageCodesProxy = new Proxy(languageCodes, {
			get(target, code) {
				code = code.toLowerCase();
				if(target.hasOwnProperty(code)) {
					return target[code];
				} else {
					return target['en'];
				}
			}
		});
		
		const translationsProxy = new Proxy(NoteList.translations, {
			get(target, code) {
				if(target.hasOwnProperty(code)) {
					return target[code];
				} else {
					return target['en-US'];
				}
			}
		});
		
		const translation = translationsProxy[languageCodesProxy[lang]][term];
		if(!translation) {
			throw new Error(`No translation available: ${term}`);
		}

		return translation;
	}
}

export { NoteList as default };