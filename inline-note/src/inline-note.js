/* 
	Web Component: InlineNote
	
	Custom Element: <inline-note></inline-note>
	Shadow DOM: true, open
	Attributes: index, visible (empty), lang (default: "en-US")
	Slots: default

	Author: Roland Dreger, www.rolanddreger.net
	License: MIT

	Date: 7 Feb. 2021
*/

/* Configuration */
const TEMPLATE_ID = 'inline-note-template';
const TEMPLATE_COMMENT = 'InlineNote component template';
const SHADOW_DOM_MODE = 'open';
const VISIBLE_CHANGED_EVENT_NAME = 'visible-changed';
const FALLBACK_LANG = "en";
const ICON_COLOR = "#ffffff";
const DARK_ICON_COLOR = "#000000";

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

/* Icons */
const getIcon = (iconName) => {
	return (fillColor) => {
		fillColor = fillColor.replace(/#/,"%23");
		const icons = {
			eyeOn:`data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z' fill='${fillColor}'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M21.8944 11.5528C19.7362 7.23635 15.9031 5 12 5C8.09687 5 4.26379 7.23635 2.10557 11.5528C1.96481 11.8343 1.96481 12.1657 2.10557 12.4472C4.26379 16.7637 8.09687 19 12 19C15.9031 19 19.7362 16.7637 21.8944 12.4472C22.0352 12.1657 22.0352 11.8343 21.8944 11.5528ZM12 17C9.03121 17 5.99806 15.3792 4.12966 12C5.99806 8.62078 9.03121 7 12 7C14.9688 7 18.0019 8.62078 19.8703 12C18.0019 15.3792 14.9688 17 12 17Z' fill='${fillColor}'/%3E%3C/svg%3E`,
			eyeOff:`data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M4.70711 3.29289C4.31658 2.90237 3.68342 2.90237 3.29289 3.29289C2.90237 3.68342 2.90237 4.31658 3.29289 4.70711L5.71706 7.13127C4.28639 8.20737 3.03925 9.68543 2.10557 11.5528C1.96481 11.8343 1.96481 12.1657 2.10557 12.4472C4.26379 16.7637 8.09687 19 12 19C13.5552 19 15.0992 18.645 16.5306 17.9448L19.2929 20.7071C19.6834 21.0976 20.3166 21.0976 20.7071 20.7071C21.0976 20.3166 21.0976 19.6834 20.7071 19.2929L4.70711 3.29289ZM15.0138 16.428L13.2934 14.7076C12.9018 14.8951 12.4631 15 12 15C10.3431 15 9 13.6569 9 12C9 11.5369 9.10495 11.0982 9.29237 10.7066L7.14838 8.56259C5.98778 9.3794 4.94721 10.5214 4.12966 12C5.99806 15.3792 9.03121 17 12 17C13.0134 17 14.0343 16.8112 15.0138 16.428Z' fill='${fillColor}'/%3E%3Cpath d='M18.5523 13.8955C19.0353 13.3402 19.4784 12.7088 19.8703 12C18.0019 8.62078 14.9687 7 12 7C11.888 7 11.7759 7.00231 11.6637 7.00693L9.87939 5.22258C10.5774 5.07451 11.2875 5 12 5C15.9031 5 19.7362 7.23635 21.8944 11.5528C22.0352 11.8343 22.0352 12.1657 21.8944 12.4472C21.3504 13.5352 20.7 14.491 19.9689 15.3121L18.5523 13.8955Z' fill='${fillColor}'/%3E%3C/svg%3E`,
			accept:`data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M20.6644 5.25259C21.0772 5.61951 21.1143 6.25158 20.7474 6.66437L10.0808 18.6644C9.89099 18.8779 9.61898 19 9.33334 19C9.04771 19 8.7757 18.8779 8.58593 18.6644L3.2526 12.6644C2.88568 12.2516 2.92286 11.6195 3.33565 11.2526C3.74843 10.8857 4.3805 10.9229 4.74742 11.3356L9.33334 16.4948L19.2526 5.33564C19.6195 4.92286 20.2516 4.88568 20.6644 5.25259Z' fill='${fillColor}'/%3E%3C/svg%3E`,
			reject:`data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z' fill='${fillColor}'/%3E%3C/svg%3E`		
		};
		return icons[iconName];
	};
};


class InlineNote extends HTMLElement {
	
	static get observedAttributes() { 
		return ['index', 'lang', 'visible']; 
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
				color: var(--inline-note-font-color, #000000);
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
			.call {
				cursor: pointer;
				margin-right: 0.4rem;
				vertical-align: baseline;
				vertical-align: var(--inline-note-call-vertical-align, baseline); 
				font-size: var(--inline-note-call-font-size, inherit);
				color: #000000;
				color: var(--inline-note-call-font-color, #000000);
				text-decoration: underline dotted 1px;
			}
			.call::before {
				content: var(--inline-note-call-opening-bracket, "["); 
			}
			.call::after {
				content: var(--inline-note-call-closing-bracket, "]"); 
			}
			.call:hover,
			.call:focus {
				text-decoration: underline;
			}
			.area {
				display: none;
				position: relative;
				padding-top: var(--inline-note-vertical-unit, 0.1rem);
  			padding-bottom: var(--inline-note-vertical-unit, 0.1rem);
				margin-left: 0.4rem;
				margin-right: 0.4rem;
				border-radius: var(--inline-note-border-radius, 0.2rem);
				box-shadow: 0.4rem 0 0 var(--inline-note-area-color, #f2f2f2), -0.4rem 0 0 var(--inline-note-area-color, #f2f2f2);
				-webkit-box-decoration-break: clone;
  			-o-box-decoration-break: clone;
				box-decoration-break: clone;
				text-decoration: none;
				background: var(--inline-note-theme-color, #000000);
			}
			.area::before {
				content: "";
				padding: var(--inline-note-vertical-unit, 0.1rem) 0.4rem;
				border-top-left-radius: var(--inline-note-border-radius, 0.2rem);
				border-bottom-left-radius: var(--inline-note-border-radius, 0.2rem);
				box-shadow: -0.4rem 0 0 var(--inline-note-theme-color, #000000);
			}
			.area::after {
				content: "";
				padding: var(--inline-note-vertical-unit, 0.1rem) 0.4rem;
				border-top-right-radius: var(--inline-note-border-radius, 0.2rem);
				border-bottom-right-radius: var(--inline-note-border-radius, 0.2rem);
				box-shadow: 0.4rem 0 0 var(--inline-note-theme-color, #000000);
			}
			.visible {
				display: inline;
			}
			.element {
				padding: var(--inline-note-vertical-unit, 0.1rem) calc(2 * 0.4rem);
				background-color: var(--inline-note-area-color, #f2f2f2);
			}
			.element::before {
				content: "";
				background-color:  var(--inline-note-theme-color, #000000);
				padding-left: calc(2 * 0.4rem);
				clip-path: polygon(0 0, 0 100%, 100% 50%);
				margin-right: 0.4rem;
				margin-left: -1.3rem;
			}
			.button {	
				display: inline-block;
				overflow: hidden;
				vertical-align: middle;
				padding: calc(2 * 0.4rem) 2rem;
				margin-top: -0.6rem;
				margin-bottom: -0.5rem;
				border: none;
				text-decoration: none;
				cursor: pointer;
				background-color: transparent;
				background-size: contain;
				background-repeat: no-repeat;
				background-position: center;
				-webkit-appearance: none;
				-moz-appearance: none;
			}
			.button + .button {
				border-left: solid 1px rgba(255, 255, 255, 1);
			}
			.area .button:first-child {
				margin-left: calc(-3 * 0.4rem);
			}
			.area .button:last-child {
				margin-right: calc(-3 * 0.4rem);
			}
			.close {
				background-image: url("${getIcon("eyeOff")(ICON_COLOR)}");
			}
			@media (prefers-color-scheme: dark) {
				:host {
					color: #ffffff;
					color: var(--inline-note-dark-font-color, #ffffff);
				}
				.call {
					color: #ffffff;
					color: var(--inline-note-dark-call-font-color, #ffffff);
				}
				.area {
					box-shadow: 0.4rem 0 0 var(--inline-note-dark-area-color, #000000), -0.4rem 0 0 var(--inline-note-dark-area-color, #000000);
					background: var(--inline-note-dark-theme-color, #ffffff);
				}
				.area::before {
					box-shadow: -0.4rem 0 0 var(--inline-note-dark-theme-color, #ffffff);
				}
				.area::after {
					box-shadow: 0.4rem 0 0 var(--inline-note-dark-theme-color, #ffffff);
				}
				.element {
					background-color: #000000;
					background-color: var(--inline-note-dark-area-color, #000000);
				}
				.element::before {
					background-color:  var(--inline-note-dark-theme-color, #ffffff);
				}
				.close {
					background-image: url("${getIcon("eyeOff")(DARK_ICON_COLOR)}");
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

		/* Note call */
		const call = document.createElement('a');
		call.setAttribute('id', 'call');
		call.classList.add('call');
		call.setAttribute('part', 'call');
		call.setAttribute('role', 'doc-noteref');
		call.setAttribute('aria-controls', 'element');
		
		/* Slot */
		const slot = document.createElement('slot');
		
		/* Note element */
		const element = document.createElement('note-element');
		element.setAttribute('id', 'element');
		element.classList.add('element');
		element.setAttribute('part', 'element');
		element.setAttribute('role', 'region');
		element.setAttribute('aria-live', 'polite');
		element.appendChild(slot);

		/* Close button */
		const closeButton = document.createElement('button');
		closeButton.setAttribute('id', 'close-button');
		closeButton.classList.add('button');
		closeButton.classList.add('close');
		closeButton.setAttribute('part', 'close-button');
		closeButton.setAttribute('tabindex', '-1');

		/* Note area */
		const area = document.createElement('note-area');
		area.setAttribute('id', 'area');
		area.classList.add('area');
		area.setAttribute('part', 'area');
		area.setAttribute('role', 'doc-footnote');
		area.setAttribute('aria-hidden', 'true');
		area.appendChild(element);
		area.appendChild(closeButton);
		
		/* Template */
		const templateFragment = document.createDocumentFragment();
		templateFragment.appendChild(call);
		templateFragment.appendChild(area);

		return templateFragment;
	}

	/* Mount: Comment, Styles, Template -> Target Node */
	static mount(targetNode) {
		
		/* Comment */
		const comment = document.createComment(TEMPLATE_COMMENT);
		targetNode.appendChild(comment);
		
		/* Styles */
		const styleFragment = InlineNote.createStyles();

		/* Template */
		const templateFragment = InlineNote.createTemplate();
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
		const template = (document.getElementById(TEMPLATE_ID) || InlineNote.mount(document.body));
		root.appendChild(template.content.cloneNode(true));

		/* Note Elements */
		this.areaElement = root.getElementById('area');
		this.callElement = root.getElementById('call');
		this.elementElement = root.getElementById('element');
		this.closeElement = root.getElementById('close-button');
		
		/* Event Handler */
		this[handleClickCallElement] = this[getInternalProxy](this.toggle);
		this[handleClickCloseElement] = this[getInternalProxy](this.hide);
		this[handleKeydownDocument] = this[getInternalProxy](this[watchEsc]);
		
		/* Event Listener */
		this.callElement.addEventListener('click', this[handleClickCallElement]);
		this.closeElement.addEventListener('click', this[handleClickCloseElement]);
	}

	connectedCallback() {
		if(!this.isConnected) {
			return false;
		}
		/* Set up */
		const language = (this.lang || this[documentLang]);
		this.closeElement.setAttribute('aria-label', this[translate]("closeButtonAriaLabel", language));
		this.closeElement.setAttribute('title', this[translate]("closeButtonAriaLabel", language));
	}

	disconnectedCallback() {
		/* Clean up */
		this.hide(); /* <- Remove event listener */
	}
	
	attributeChangedCallback(name, oldValue, newValue) {
		if(oldValue === newValue) {
			return true;
		}
		
		let language;
		let indexSuffix;
		let callElementAriaLabelValue;

		switch(name) {
			/* Attribute: index */
			case 'index':
				language = (this.lang || this[documentLang]);
				indexSuffix = (newValue || "");
				let tagName = (this.tagName || "");
				let hrefValue = '#' + this[clearUpID](tagName + "-" + indexSuffix);
				this.callElement.setAttribute('href', hrefValue);
				callElementAriaLabelValue = this[translate]("callElementAriaLabel", language) + ": " + indexSuffix;
				this.callElement.setAttribute('aria-label', callElementAriaLabelValue);
				this.callElement.textContent = (newValue || "");
				break;
			/* Attribute: visible */
			case 'visible':
				if(newValue !== null) {
					this.areaElement.classList.add('visible');
					this.areaElement.setAttribute('aria-hidden', "false");
					this.closeElement.setAttribute('tabindex', '0');
					document.addEventListener('keydown', this[handleKeydownDocument]);
					this.areaElement.focus();
				} else {
					this.areaElement.classList.remove('visible');
					this.areaElement.setAttribute('aria-hidden', "true");
					this.closeElement.setAttribute('tabindex', '-1');
					document.removeEventListener('keydown', this[handleKeydownDocument]);
				}
				break;
			/* Attribute: lang */
			case 'lang':
				language = (newValue || this[documentLang]);
				indexSuffix = (this.index || "");
				callElementAriaLabelValue = this[translate]("callElementAriaLabel", language) + ": " + indexSuffix
				this.callElement.setAttribute('aria-label', callElementAriaLabelValue);
				this.closeElement.setAttribute('aria-label', this[translate]("closeButtonAriaLabel", language));
				this.closeElement.setAttribute('title', this[translate]("closeButtonAriaLabel", language));
				break;
		}
	}

	/* Getter/Setter */
	get index() {
		return (this.getAttribute('index') || "");
	}
	set index(value) {
		this.setAttribute('index', value);
	}

	get visible() {
		return this.hasAttribute('visible');
	}
	set visible(value) {
		const isVisible = Boolean(value);
		const hasChanged = (this.visible !== isVisible);
		if(!hasChanged) {
			return false;
		}
		if(isVisible) {
			this.setAttribute('visible', '');	
		} else {
			this.removeAttribute('visible');
		}
		if(this[isInternal]) {
			const visibleChangedEvent = new CustomEvent(
				VISIBLE_CHANGED_EVENT_NAME, 
				{ 
					bubbles: true,
					cancelable: true,
					composed: true,
					detail: { 
						visible: this.visible
					}
				}
			);
			this.dispatchEvent(visibleChangedEvent);
		}
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
	toggle(event) {
		if(event && event instanceof Event) {
			event.preventDefault();
		}
		this.visible = !this.visible;
	}

	hide(event) {
		if(this.visible !== false) {
			this.visible = false;
		}
	}

	hideOthers() {
		const visibleNotes = document.querySelectorAll(this.tagName + '[visible]');
		visibleNotes.forEach(note => {
			if(note === this) {
				return false;
			}
			note.removeAttribute('visible');
		});
	}

	hideAll() {
		const visibleNotes = document.querySelectorAll(this.tagName + '[visible]');
		visibleNotes.forEach(note => {
			note.removeAttribute('visible');
		});
	}

	[watchEsc](event) {
		if(!event || !(event instanceof Event)) {
			return false;
		}
		if(event.key === 'Escape' || event.key === 'Esc') {
			this.hide(event);
		}
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
		
		const translationsProxy = new Proxy(InlineNote.translations, {
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

	[clearUpID](input) {
		if(typeof input !== "string") { 
			throw new TypeError(`Argument [input] must be a string: ${typeof input}`); 
		}

		const SEPARATOR = "-";

		const cutWhitespaceRegExp = new RegExp("(^\\s+)|(\\s+$)", "ig");
		const trimWhitespaceRegExp = new RegExp("\\s+", "ig");
		const forbiddenCharsRegExp = new RegExp("[^a-z0-9 \\-]", "ig");
		
		let output = input.toLowerCase();
		
		/* Replace special characters */
		output = output.replace(/[Ä]/g, "Ae");
		output = output.replace(/[ä]/g, "ae");
		output = output.replace(/[Ö]/g, "Oe");
		output = output.replace(/[ö]/g, "oe");
		output = output.replace(/[Ü]/g, "Ue");
		output = output.replace(/[ü]/g, "ue");
		output = output.replace(/[ß]/gi, "ss");
		output = output.replace(/[ẞ]/gi, "SS");
		output = output.replace(/[áàâåāąăæ]/gi, "a");
		output = output.replace(/[çćčċ]/gi, "c");
		output = output.replace(/[ďđ]/gi, "d");
		output = output.replace(/[éèêëęēĕėě]/gi, "e");
		output = output.replace(/[ģĝğġ]/gi, "g");
		output = output.replace(/[ĥħ]/gi, "h");
		output = output.replace(/[íìîïīĩĭį]/gi, "i");
		output = output.replace(/[ĵ]/gi, "j");
		output = output.replace(/[ķ]/gi, "k");
		output = output.replace(/[łĺļľ]/gi, "l");
		output = output.replace(/[ñńňņŋ]/gi, "n");
		output = output.replace(/[óòôōŏőøœ]/gi, "o");
		output = output.replace(/[ŕřŗ]/gi, "r");
		output = output.replace(/[śšŝşș]/gi, "s");
		output = output.replace(/[ţțťŧ]/gi, "t");
		output = output.replace(/[úùûůūųũŭű]/gi, "u");
		output = output.replace(/[ŵ]/gi, "w");
		output = output.replace(/[ÿýŷ]/gi, "y");
		output = output.replace(/[źżž]/gi, "z");
		output = output.replace(forbiddenCharsRegExp, "");
		
		/* Whitespace */
		output = output.replace(cutWhitespaceRegExp, "");
		output = output.replace(trimWhitespaceRegExp, SEPARATOR);
		
		return output;
	}
}

export { InlineNote as default };