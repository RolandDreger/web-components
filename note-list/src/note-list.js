/* 
	Web Component: NoteList
	
	Custom Element: <note-list></note-list>
	Shadow DOM: true, open
	Attributes: lang (default: "en-US")
	Slots: default

	Author: Roland Dreger, www.rolanddreger.net
	License: MIT

	Date: 14 Feb. 2021
*/

/* Configuration */
const TEMPLATE_ID = 'note-list-template';
const TEMPLATE_COMMENT = 'NoteList component template';
const SHADOW_DOM_MODE = 'open';
const FALLBACK_LANG = "en";


/* Internal identifier */
const isInternal = Symbol('isInternal');
const watchEsc = Symbol('watchEsc');
const getInternalProxy = Symbol('getInternalProxy');
const handleClickCallElement = Symbol('handleClickCallElement');
const handleClickCloseElement = Symbol('handleClickCloseElement');
const handleKeydownDocument = Symbol('handleKeydownDocument');
const documentLang = Symbol('documentLang');
const translate = Symbol('translate');
const clearUpID = Symbol('clearUpID');




class NoteList extends HTMLElement {
	
	static get observedAttributes() { 
		return ['lang'];
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
				font-family: inherit;
				color: #000000;
				color: var(--note-list-font-color, #000000);
			}
			:host([visible]) .area {
				
			}
			:host([hidden]) {
				display: none;
			}
			::slotted(*) {
				/* Elements in slot e.g. Links */
			}
			*,
			*::before,
			*::after {
				box-sizing: border-box;
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

		/* Slot */
		const slot = document.createElement('slot');
		
		/* Note element */
		const area = document.createElement('section');
		area.setAttribute('id', 'area');
		area.classList.add('area');
		area.setAttribute('part', 'area');
		area.setAttribute('role', 'doc-footnotes');
		area.appendChild(slot);

		

		
		
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
		// this.areaElement = root.getElementById('area');
		
		
		/* Event Handler */
		// this[handleClickCallElement] = this[getInternalProxy](this.toggle);
		
		
		/* Event Listener */
		// this.callElement.addEventListener('click', this[handleClickCallElement]);
		
	}

	connectedCallback() {
		if(!this.isConnected) {
			return false;
		}
		/* Set up */
		const language = (this.lang || this[documentLang]);
		// this.closeElement.setAttribute('aria-label', this[translate]("closeButtonAriaLabel", language));
		// this.closeElement.setAttribute('title', this[translate]("closeButtonAriaLabel", language));
	}

	disconnectedCallback() {
		/* Clean up */
		// this.hide(); /* <- Remove event listener */
	}
	
	attributeChangedCallback(name, oldValue, newValue) {
		if(oldValue === newValue) {
			return true;
		}
		
		let language;
		let indexSuffix;
		let callElementAriaLabelValue;

		switch(name) {
			/* Attribute: lang */
			case 'lang':
				language = (newValue || this[documentLang]);
				// indexSuffix = (this.index || "");
				// callElementAriaLabelValue = this[translate]("callElementAriaLabel", language) + ": " + indexSuffix
				// this.callElement.setAttribute('aria-label', callElementAriaLabelValue);
				// this.closeElement.setAttribute('aria-label', this[translate]("closeButtonAriaLabel", language));
				// this.closeElement.setAttribute('title', this[translate]("closeButtonAriaLabel", language));
				break;
		}
	}

	/* Getter/Setter */
	// get index() {
	// 	return (this.getAttribute('index') || "");
	// }
	// set index(value) {
	// 	this.setAttribute('index', value);
	// }

	

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
	// toggle(event) {
	// 	if(event && event instanceof Event) {
	// 		event.preventDefault();
	// 	}
	// 	this.visible = !this.visible;
	// }

	
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