/* 
	Web Component: FootNote
	
	Custom Element: <foot-note></foot-note>
	Shadow DOM: true, open
	Attributes: index, visible (empty) 
	Slots: default

	Author: Roland Dreger, www.rolanddreger.net
	License: MIT

	Date: 16 Sept. 2020
*/


/* Configuration */
const COMPONENT_TAG_NAME = 'foot-note';
const TEMPLATE_ID = 'foot-note-template';
const TEMPLATE_COMMENT = 'FootNote component template';
const SHADOW_DOM_MODE = 'open';
const TOGGLE_EVENT_NAME = 'footnote-on-toggle';
const HIDE_EVENT_NAME = 'footnote-on-hide';

class FootNote extends HTMLElement {

	static get observedAttributes() { 
		return ['index', 'visible']; 
	}

	/* Styles */
	static createStyles() {
		
		/* CSS */
		const styleString = document.createTextNode(`
			:host {
				font-family: inherit;
				contain: content;
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
				font-size: 0.8rem;
				text-decoration: none;
			}
			.call::before {
				content: "[";
			}
			.call::after {
				content: "]";
			}
			.call:hover {
				text-decoration: underline;
			}
			.call:focus {
				font-weight: bolder;
			}
			.area {
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
				transition: all 0.4s ease-in-out;
			}
			@media (max-width: 30rem) {
				.area {
					flex-direction: column;
					padding: 1rem 2rem 1rem 2rem;
				}
			}
			.visible {
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
			@media (max-width: 30rem) {
				.marker {
					margin: 0 0 0.5rem 0;
				}
				.close {
					margin: 0.5rem 0 0 0;
				}
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
		call.classList.add('call');
		call.setAttribute('part','call');
		call.setAttribute('role','doc-noteref');
		
		/* Note marker */
		const marker = document.createElement('sup');
		marker.classList.add('marker');
		marker.setAttribute('part','marker');
		
		/* Slot */
		const slot = document.createElement('slot');
		
		/* Note element */
		const element = document.createElement('div');
		element.classList.add('element');
		element.setAttribute('part','element');
		element.appendChild(slot);

		/* Close button */
		const button = document.createElement('button');
		button.classList.add('button');
		button.classList.add('close');
		button.setAttribute('part','button');
		button.setAttribute('aria-label','Close');
		button.setAttribute('title','Close');
		button.setAttribute('tabindex','-1');

		/* Note area */
		const area = document.createElement('aside');
		area.classList.add('area');
		area.setAttribute('part','area');
		area.setAttribute('role','doc-footnote');
		area.setAttribute('aria-hidden','true');
		area.appendChild(marker);
		area.appendChild(element);
		area.appendChild(button);
		
		/* Template */
		const templateFragment = document.createDocumentFragment();
		templateFragment.appendChild(call);
		templateFragment.appendChild(area);

		return templateFragment;
	}

	static render() {

		/* Comment */
		const comment = document.createComment(TEMPLATE_COMMENT);
		document.body.appendChild(comment);
		
		/* Styles */
		const styleFragment = FootNote.createStyles();

		/* Template */
		const templateFragment = FootNote.createTemplate();
		const templateElement = document.createElement('template');
		templateElement.setAttribute('id', TEMPLATE_ID);
		templateElement.content.appendChild(styleFragment);
		templateElement.content.appendChild(templateFragment);
		
		/* Document */
		const templateNode = document.body.appendChild(templateElement);

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
		const template = (document.getElementById(TEMPLATE_ID) || FootNote.render());
		root.appendChild(template.content.cloneNode(true));

		/* Properties */
		this.$area = root.querySelector('.area');
		this.$call = root.querySelector('.call');
		this.$marker = root.querySelector('.marker');
		this.$element = root.querySelector('.element');
		this.$button = root.querySelector('.button');
		
		/* Event handler */
		this._toggle = this.toggle.bind(this);
		this._hide = this.hide.bind(this);
		this.__watchEsc = this._watchEsc.bind(this);
	}

	connectedCallback() {
		if(this.$call.isConnected) {
			this.$call.addEventListener('click', this._toggle);
		}
		if(this.$button.isConnected) {
			this.$button.addEventListener('click', this._hide);
		}
	}

	disconnectedCallback() {
		if(this.$call) {
			this.$call.removeEventListener('click', this._toggle);
		}
		if(this.$button) {
			this.$button.removeEventListener('click', this._hide);
		}
	}
	
	attributeChangedCallback(name, oldValue, newValue) {
		if(oldValue === newValue) {
			return true;
		}
		switch(name) {
			/* Attribute: index */
			case 'index':
				this.$call.textContent = newValue;
				this.$call.setAttribute('href','#' + COMPONENT_TAG_NAME + '-' + newValue);
				this.$call.setAttribute('aria-label','Call note ' + newValue);
				this.$marker.textContent = newValue;
				this.$marker.setAttribute('aria-label','Marker note ' + newValue);
				break;
			/* Attribute: visible */
			case 'visible':
				this.visible = this.hasAttribute('visible');
				if(this.visible) {
					this._wasFocused = document.activeElement;
					this.$area.classList.add('visible');
					this.$area.setAttribute('aria-hidden', "false");
					this.$button.setAttribute('tabindex','0');
					document.addEventListener('keydown', this.__watchEsc);
					this.$area.focus();
				} else {
					if(this._wasFocused && this._wasFocused.focus) {
						this._wasFocused.focus();
					}
					this.$area.classList.remove('visible');
					this.$area.setAttribute('aria-hidden', "true");
					this.$button.setAttribute('tabindex','-1');
					document.removeEventListener('keydown', this.__watchEsc);
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
		if(isVisible) {
			this.setAttribute('visible', '');	
		} else {
			this.removeAttribute('visible');
		}
	}

	/* Methods */
	toggle(event) {
		if(event && event instanceof Event) {
			event.preventDefault();
		}
		this.hideOthers();
		this.visible = !this.visible;
		const toggleEvent = new CustomEvent(TOGGLE_EVENT_NAME, { 
			bubbles: true,
			cancelable: true,
			composed: true,
			detail: { 
				visible: this.visible 
			}
		});
		this.dispatchEvent(toggleEvent);
	}

	hide(event) {
		if(this.visible !== false) {
			this.visible = false;
		}
		const hideEvent = new CustomEvent(HIDE_EVENT_NAME, { 
			bubbles: true,
			cancelable: true,
			composed: true,
			detail: { 
				visible: this.visible 
			}
		});
		this.dispatchEvent(hideEvent);
	}

	hideOthers() {
		const openNotes = document.querySelectorAll(COMPONENT_TAG_NAME + '[visible]');
		openNotes.forEach(note => {
			if(note === this) {
				return false;
			}
			note.removeAttribute('visible');
		});
	}

	hideAll() {
		const openNotes = document.querySelectorAll(COMPONENT_TAG_NAME + '[visible]');
		openNotes.forEach(note => {
			note.removeAttribute('visible');
		});
	}

	_watchEsc(event) {
		if(!event || !(event instanceof Event)) {
			return false;
		}
		if(event.key === 'Escape') {
			this.hide();
		}
	}
}

export { FootNote as default };
