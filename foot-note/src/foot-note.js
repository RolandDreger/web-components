/* 
	Web Component: FootNote
	
	Custom Element: <foot-note></foot-note>
	Shadow DOM: true, open
	Attributes: index, visible (empty) 
	Slots: default

	Author: Roland Dreger, www.rolanddreger.net
	License: MIT

	Date: 11 Jan. 2021
*/

/* Configuration */
const TEMPLATE_ID = 'foot-note-template';
const TEMPLATE_COMMENT = 'FootNote component template';
const SHADOW_DOM_MODE = 'open';
const VISIBLE_CHANGED_EVENT_NAME = 'visible-changed';
const CALL_ARIA_LABEL = 'Call note';
const MARKER_ARIA_LABEL = 'Marker note';
const CLOSE_BUTTON_ARIA_LABEL = 'Close';
const CALL_OPENING_BRACKET = '[';
const CALL_CLOSING_BRACKET = ']';

/* Internal identifier */
const isInternal = Symbol('isInternal');
const watchEsc = Symbol('watchEsc');
const getInternalHandler = Symbol('getInternalHandler');
const handleKeydownDocumentInternal = Symbol('handleKeydownDocumentInternal');

class FootNote extends HTMLElement {
	
	static get observedAttributes() { 
		return ['index', 'visible']; 
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
		closeButton.setAttribute('aria-label', CLOSE_BUTTON_ARIA_LABEL);
		closeButton.setAttribute('title', CLOSE_BUTTON_ARIA_LABEL);
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
		
		/* Note Event Listener */
		if(this.callElement) {
			const handleClickInternal = this[getInternalHandler](this.toggle);
			this.callElement.addEventListener('click', handleClickInternal);
		}
		if(this.closeElement) {
			const handleClickInternal = this[getInternalHandler](this.hide);
			this.closeElement.addEventListener('click', handleClickInternal);
		}

		/* Document Event Handler */
		this[handleKeydownDocumentInternal] = this[getInternalHandler](this[watchEsc]);
	}

	connectedCallback() {
		if(!this.isConnected) {
			return false;
		}
	}

	disconnectedCallback() {
		/* Clean up: remove event listener */
		this.hide();
	}
	
	attributeChangedCallback(name, oldValue, newValue) {
		if(oldValue === newValue) {
			return true;
		}
		switch(name) {
			/* Attribute: index */
			case 'index':
				this.callElement.textContent = newValue;
				this.callElement.setAttribute('href', '#' + this.tagName + '-' + newValue);
				this.callElement.setAttribute('aria-label', CALL_ARIA_LABEL + ' ' + newValue);
				this.markerElement.textContent = newValue;
				this.markerElement.setAttribute('aria-label', MARKER_ARIA_LABEL + ' ' + newValue);
				break;
			/* Attribute: visible */
			case 'visible':
				this.visible = this.hasAttribute('visible');
				if(this.visible) {
					this.areaElement.classList.add('visible');
					this.areaElement.setAttribute('aria-hidden', "false");
					this.closeElement.setAttribute('tabindex', '0');
					document.addEventListener('keydown', this[handleKeydownDocumentInternal]);
					this.areaElement.focus();
				} else {
					this.areaElement.classList.remove('visible');
					this.areaElement.setAttribute('aria-hidden', "true");
					this.closeElement.setAttribute('tabindex', '-1');
					document.removeEventListener('keydown', this[handleKeydownDocumentInternal]);
				}
				break;
		}
	}

	/* Getter/Setter */
	get index() {
		return this.getAttribute('index');
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

	[getInternalHandler](externalHandler) {
		const context = this;
		return function internalHandler() {
			context[isInternal] = true;
			externalHandler.apply(context, arguments);
			context[isInternal] = false;
		};
	}
}

export { FootNote as default };