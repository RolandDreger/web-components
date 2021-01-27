﻿/* 
	Web Component: FootNote
	
	Custom Element: <foot-note></foot-note>
	Shadow DOM: true, open
	Attributes: index, visible (empty) 
	Slots: default

	Author: Roland Dreger, www.rolanddreger.net
	License: MIT

	Date: 27 Jan. 2021
*/

/* Configuration */
const TEMPLATE_ID = 'foot-note-template';
const TEMPLATE_COMMENT = 'FootNote component template';
const SHADOW_DOM_MODE = 'open';
const VISIBLE_CHANGED_EVENT_NAME = 'visible-changed';
const CALL_OPENING_BRACKET = '[';
const CALL_CLOSING_BRACKET = ']';
const FALLBACK_LANG = "en";

/* Internal identifier */
const isInternal = Symbol('isInternal');
const watchEsc = Symbol('watchEsc');
const getInternalProxy = Symbol('getInternalProxy');
const handleClickCallElement = Symbol('handleClickCallElement');
const handleClickCloseElement = Symbol('handleClickCloseElement');
const handleKeydownDocument = Symbol('handleKeydownDocument');
const translate = Symbol('translate');

class FootNote extends HTMLElement {
	
	static get observedAttributes() { 
		return ['index', 'lang', 'visible']; 
	}

	static get translations() {
		/* "en-US": default language */
		return {
			"en-US": {
				"callElementAriaLabel": "Note call",
				"markerElementAriaLabel": "Note marker",
				"closeButtonAriaLabel": "Close"
			},
			"de-DE": {
				"callElementAriaLabel": "Notenaufruf",
				"markerElementAriaLabel": "Notenzeichen",
				"closeButtonAriaLabel": "Schließen"
			},
			"fr-FR": {
				"callElementAriaLabel": "Appel de note",
				"markerElementAriaLabel": "Marqueur de notes",
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
				color: var(--footnote-font-color, #000000);
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
				color: #000000;
				color: var(--footnote-theme-color, #000000);
				vertical-align: super;
				vertical-align: var(--footnote-call-vertical-align, super); 
				font-size: var(--footnote-call-font-size, 0.8rem);
				text-decoration: none;
			}
			.call::before {
				content: "${CALL_OPENING_BRACKET}";
			}
			.call::after {
				content: "${CALL_CLOSING_BRACKET}";
			}
			.call:hover {
				text-decoration: underline;
			}
			.call:focus {
				font-weight: bolder;
			}
			.area {
				visibility: hidden;
				position: fixed;
				bottom: 0;
				left: 50%;
				transform: translateX(-50%);
				display: flex;
				flex-direction: row;
				flex-wrap: nowrap;
				justify-content: space-between;
				align-items: stretch;
				border-top-color: #000000;
				border-top: 1px solid var(--footnote-theme-color, #000000);
				width: 100%;
				max-width: var(--footnote-max-width, 58rem);
				max-height: 100%;
				min-height: 0;
				margin-bottom: -100%;
				overflow-y: auto;
				opacity: 0;
				padding: 2rem 4rem 2rem 4rem;
				font-size: var(--footnote-font-size, 1rem);
				line-height: var(--footnote-line-heigth, 1.4);
				background-color: #ffffff;
				background-color: var(--footnote-area-color, #ffffff);
				transition: all 0.4s ease-in-out;
			}
			.visible {
				visibility: visible;
				margin-bottom: 0;
				opacity: 1;
			}
			.element {
				flex: 1 1 auto;
				min-height: 0;
				overflow-y: auto;
			}
			.marker,
			.close {
				flex: 0 0 auto;
				align-self: center;
				display: flex;
				justify-content: center;
				align-items: center;
				min-width: 1.8rem;
				height: 1.8rem;
				min-height: 0;
				padding: 0.4rem;
				border-radius: 1rem;
				text-align: center;
				font-size: 1rem;
				line-height: 1.4;
				color: #ffffff;
				background-color: #000000;
				background-color: var(--footnote-theme-color, #000000);
			}
			.marker {
				margin-right: 1.6rem;
			}
			.close {
				margin-left: 1.6rem;
			}
			.button {	
				position: relative;
				border: none;
				text-decoration: none;
				text-align: center;
				cursor: pointer;
				-webkit-appearance: none;
				-moz-appearance: none;
			}
			.close:before, 
			.close:after {
				position: absolute;
				left: 50%;
				top: 50%;
				content: ' ';
				height: 0.8rem;
				width: 2px;
				margin-top: -0.4rem;
				margin-left: -1px;
				background-color: #ffffff;
			}
			.close:before {
				transform: rotate(45deg);
			}
			.close:after {
				transform: rotate(-45deg);
			}
			@media (prefers-color-scheme: dark) {
				:host {
					color: #ffffff;
					color: var(--footnote-dark-font-color, #ffffff);
				}
				.area {
					background-color: #000000;
					background-color: var(--footnote-dark-area-color, #000000);
				}
			}
			@media (max-width: 30rem) {
				.area {
					flex-direction: column;
					padding: 1rem 2rem 1rem 2rem;
				}
				.marker {
					margin: 0 0 0.5rem 0;
				}
				.close {
					margin: 0.5rem 0 0 0;
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
		
		/* Note marker */
		const marker = document.createElement('sup');
		marker.setAttribute('id', 'marker');
		marker.classList.add('marker');
		marker.setAttribute('part', 'marker');
		
		/* Slot */
		const slot = document.createElement('slot');
		
		/* Note element */
		const element = document.createElement('div');
		element.setAttribute('id', 'element');
		element.classList.add('element');
		element.setAttribute('part', 'element');
		element.appendChild(slot);

		/* Close button */
		const closeButton = document.createElement('button');
		closeButton.setAttribute('id', 'close-button');
		closeButton.classList.add('button');
		closeButton.classList.add('close');
		closeButton.setAttribute('part', 'close-button');
		closeButton.setAttribute('tabindex', '-1');

		/* Note area */
		const area = document.createElement('aside');
		area.setAttribute('id', 'area');
		area.classList.add('area');
		area.setAttribute('part', 'area');
		area.setAttribute('role', 'doc-footnote');
		area.setAttribute('aria-hidden', 'true');
		area.appendChild(marker);
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
		const styleFragment = FootNote.createStyles();

		/* Template */
		const templateFragment = FootNote.createTemplate();
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
		const template = (document.getElementById(TEMPLATE_ID) || FootNote.mount(document.body));
		root.appendChild(template.content.cloneNode(true));

		/* Note Elements */
		this.areaElement = root.getElementById('area');
		this.callElement = root.getElementById('call');
		this.markerElement = root.getElementById('marker');
		this.elementElement = root.getElementById('element');
		this.closeElement = root.getElementById('close-button');
		
		/* Event Handler */
		this[handleClickCallElement] = this[getInternalProxy](this.toggle);
		this[handleClickCloseElement] = this[getInternalProxy](this.hide);
		this[handleKeydownDocument] = this[getInternalProxy](this[watchEsc]);
		
		/* Event Listener */
		if(this.callElement) {
			this.callElement.addEventListener('click', this[handleClickCallElement]);
		}
		if(this.closeElement) {
			this.closeElement.addEventListener('click', this[handleClickCloseElement]);
		}
	}

	connectedCallback() {
		if(!this.isConnected) {
			return false;
		}
		/* Set up */
		const language = (this.lang || document.documentElement.getAttribute("lang") || FALLBACK_LANG);
		if(this.closeElement) {
			this.closeElement.setAttribute('aria-label', this[translate]("closeButtonAriaLabel", language));
			this.closeElement.setAttribute('title', this[translate]("closeButtonAriaLabel", language));
		}
		const indexAriaSuffix = (this.index && ` ${this.index}`) || "";
		if(this.callElement) {
			this.callElement.setAttribute('aria-label', this[translate]("callElementAriaLabel", language) + indexAriaSuffix);
		}
		if(this.markerElement) {
			this.markerElement.setAttribute('aria-label', this[translate]("markerElementAriaLabel", language) + indexAriaSuffix);
		}
	}

	disconnectedCallback() {
		/* Clean up */
		this.hide(); /* <- Remove event listener */
	}
	
	attributeChangedCallback(name, oldValue, newValue) {
		if(oldValue === newValue) {
			return true;
		}
		let tagName;
		let language;
		let indexHrefSuffix;
		let indexAriaSuffix;
		switch(name) {
			/* Attribute: index */
			case 'index':
				tagName = ((this.tagName && this.tagName.toLowerCase()) || "");
				language = (this.lang || document.documentElement.getAttribute("lang") || FALLBACK_LANG);
				indexHrefSuffix = ((newValue && `-${newValue}`) || "");
				indexAriaSuffix = ((newValue && ` ${newValue}`) || "");
				this.callElement.textContent = newValue;
				this.callElement.setAttribute('href', '#' + tagName + indexHrefSuffix);
				this.callElement.setAttribute('aria-label', this[translate]("callElementAriaLabel", language) + indexAriaSuffix);
				this.markerElement.textContent = newValue;
				this.markerElement.setAttribute('aria-label', this[translate]("markerElementAriaLabel", language) + indexAriaSuffix);
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
				language = (newValue || document.documentElement.getAttribute("lang") || FALLBACK_LANG);
				indexAriaSuffix = ((this.index && ` ${this.index}`) || "");
				this.callElement.setAttribute('aria-label', this[translate]("callElementAriaLabel", language) + indexAriaSuffix);
				this.markerElement.setAttribute('aria-label', this[translate]("markerElementAriaLabel",language) + indexAriaSuffix);
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

	/* Methods (Prototype) */
	toggle(event) {
		if(event && event instanceof Event) {
			event.preventDefault();
		}
		this.hideOthers();
		this.visible = !this.visible;
	}

	hide(event) {
		if(this.visible !== false) {
			this.visible = false;
		}
	}

	hideOthers() {
		const openNotes = document.querySelectorAll(this.tagName + '[visible]');
		openNotes.forEach(note => {
			if(note === this) {
				return false;
			}
			note.removeAttribute('visible');
		});
	}

	hideAll() {
		const openNotes = document.querySelectorAll(this.tagName + '[visible]');
		openNotes.forEach(note => {
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
		
		const translationsProxy = new Proxy(FootNote.translations, {
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

export { FootNote as default };