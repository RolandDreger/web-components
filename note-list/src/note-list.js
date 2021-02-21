/* 
	Web Component: NoteList
	
	Custom Element: <note-list></note-list>
	Shadow DOM: true, open
	Attributes: notetype, noterole, noteindex (empty), source, lang (default: "en-US")
	Slots: default

	Author: Roland Dreger, www.rolanddreger.net
	License: MIT

	Date: 21 Feb. 2021
*/

/* Configuration */
const TEMPLATE_ID = 'note-list-template';
const TEMPLATE_COMMENT = 'NoteList component template';
const SHADOW_DOM_MODE = 'open';
const UPDATE_DONE_EVENT_NAME = 'update-done';
const DEFAULT_DEBOUNCE_DELAY = 300;
const FALLBACK_LANG = "en";
const SORT_OPTIONS = {
	ignorePunctuation: true
};


/* Internal identifier */
const isInternal = Symbol('isInternal');
const getDebounceProxy = Symbol('getDebounceProxy');
const getInternalProxy = Symbol('getInternalProxy');
const documentLang = Symbol('documentLang');
const translate = Symbol('translate');
const getID = Symbol('getID');


class NoteList extends HTMLElement {
	
	static get observedAttributes() { 
		return ['notetype', 'noterole', 'noteindex', 'source', 'sort', 'lang'];
	}

	static get translations() {
		return {
			"en-US": {
				"backlinkAriaLabel": "Back to content"
			},
			"de-DE": {
				"backlinkAriaLabel": "Zurück zum Inhalt"
			},
			"fr-FR": {
				"backlinkAriaLabel": "Retour au contenu"
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

		/* Update Method */
		this.update = this[getDebounceProxy](this.update);
	}

	connectedCallback() {
		if(!this.isConnected) {
			return;
		}
		if(!this.notetype) {
			throw new Error(`<note-list> needs an attribute [notetype] in order to be created.`);
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
			/* Attribute: sort */
			case 'sort':
				this.update();
				break;
			/* Attribute: lang */
			case 'lang':
				this.update();
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
			return;
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

	get sort() {
		return (this.getAttribute('sort') || "");
	}
	set sort(value) {
		this.setAttribute('sort', value);
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
	update() {
		let detailObj = {};
		try {
			const result = this.build();
			detailObj['status'] = 'OK';
			detailObj['result'] = result;
		} catch(error) {
			detailObj['status'] = 'ERROR';
			detailObj['error'] = error;
		} finally {
			const updateEvent = new CustomEvent(
				UPDATE_DONE_EVENT_NAME, 
				{ 
					bubbles: true, 
					cancelable: true, 
					composed: true,
					detail: detailObj
				}
			);
			this.dispatchEvent(updateEvent);
		}
	}

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
			throw new Error(`Attribute [notetype] must be defined for <note-list>.`);
		}
		let sourceNode = document;
		if(!!this.source) {
			sourceNode = document.getElementById(this.source);
			if(!sourceNode) {
				throw new Error(`Source element for <note-list> does not exist. ID: ${this.source}`);
			}
		} 
		const listItemObj = {};
		const noteNodeList = sourceNode.querySelectorAll(noteType);
		const noteElementArray = [...noteNodeList];
		const sortType = this.sort.toLowerCase();
		switch(sortType) {
			case 'number':
				noteElementArray.sort((a, b) => {
						return a.index.localeCompare(b.index, undefined, { 'numeric': true, ...SORT_OPTIONS });
				});
				break;
			case 'text':
				const lang = this.lang || this[documentLang];
				noteElementArray.sort((a, b) => {
					return a.index.localeCompare(b.index, lang, SORT_OPTIONS);
				});
				break;
		}
		noteElementArray.forEach((noteElement, i) => {
			const noteIndex = noteElement.getAttribute('index');
			if(!noteIndex) {
				return;
			}
			let listNode;
			/* Check: Identical entries? */
			if(!listItemObj.hasOwnProperty(noteIndex)) {
				/* List item */
				const listItemElement = document.createElement('li');
				listItemElement.setAttribute('part', 'list-item');
				if(this.noteindex) {
					listItemElement.setAttribute('value', noteIndex);
				}
				const noteRole = this.noterole;
				if(noteRole) {
					listItemElement.setAttribute('role', noteRole);
				}
				const slotNodes = noteElement.childNodes;
				slotNodes.forEach((node) => {
					const clonedNode = node.cloneNode(true);
					if(clonedNode instanceof HTMLElement && clonedNode.hasAttribute('id')) {
						clonedNode.removeAttribute('id');
					}
					listItemElement.appendChild(clonedNode);
				});
				listNode = list.appendChild(listItemElement);
				listItemObj[noteIndex] = listNode;
			} else {
				listNode = listItemObj[noteIndex];
			} 
			/* Backlink */
			var hrefValue = '#';
			if(noteElement.hasAttribute('id')) {
				hrefValue += noteElement.getAttribute('id');
			} else {
				const noteID = 'ref-' + this[getID]() + '-' + i;
				noteElement.setAttribute('id', noteID);
				hrefValue += noteID;
			}
			const backlinkAriaLabel = this[translate]("backlinkAriaLabel");
			const backlink = document.createElement('a');
			backlink.setAttribute('href', hrefValue);
			backlink.setAttribute('title', backlinkAriaLabel);
			backlink.setAttribute('aria-label', backlinkAriaLabel);
			backlink.setAttribute('part', 'backlink');
			backlink.classList.add('backlink');
			backlink.textContent = "↩";
			listNode.appendChild(backlink);
		});
		return list;
	}

	[getID]() {
		return parseInt(Math.random() * Date.now()).toString(36);
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

	[getDebounceProxy](repetitiveHandler, context) {
		if(!repetitiveHandler || !(repetitiveHandler instanceof Function)) {
			return null;
		}
		let timeoutID;
		context = (context || this);
		return new Proxy(repetitiveHandler, {
			apply(target, thisArg, args) {
				let delay = (args[0] || DEFAULT_DEBOUNCE_DELAY || 0);
				clearTimeout(timeoutID);
				timeoutID = setTimeout(function() { 
					Reflect.apply(target, context, args);
				}, delay);
			}
		});
	}

	[translate](term, lang) {
		if(!term || typeof term !== "string") { 
			throw new TypeError(`Argument [term] must be a string: ${typeof term}`); 
		}
		if(!lang || typeof lang !== "string") { 
			lang = (this.lang || this[documentLang]); 
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