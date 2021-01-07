/* 
	Web Component: FootNote
	
	Custom Element: <foot-note></foot-note>
	Shadow DOM: true, open
	Attributes: index, visible (empty) 
	Slots: default

	Author: Roland Dreger, www.rolanddreger.net
	License: MIT

	Date: 07 Jan. 2021
*/

/* Configuration */
const TEMPLATE_ID = 'foot-note-template';
const TEMPLATE_COMMENT = 'FootNote component template';
const SHADOW_DOM_MODE = 'open';
const TOGGLE_EVENT_NAME = 'footnote-on-toggle';
const HIDE_EVENT_NAME = 'footnote-on-hide';
const CALL_ARIA_LABEL = 'Call note';
const MARKER_ARIA_LABEL = 'Marker note';
const CLOSE_BUTTON_ARIA_LABEL = 'Close';

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
				vertical-align: var(--footnote-call-vertical-align, super); 
				font-size: var(--footnote-call-font-size, 0.8rem);
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
			@media (max-width: 30rem) {
				.area {
					flex-direction: column;
					padding: 1rem 2rem 1rem 2rem;
				}
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
		call.setAttribute('id','call');
		call.classList.add('call');
		call.setAttribute('part','call');
		call.setAttribute('role','doc-noteref');
		
		/* Note marker */
		const marker = document.createElement('sup');
		marker.setAttribute('id','marker');
		marker.classList.add('marker');
		marker.setAttribute('part','marker');
		
		/* Slot */
		const slot = document.createElement('slot');
		
		/* Note element */
		const element = document.createElement('div');
		element.setAttribute('id','element');
		element.classList.add('element');
		element.setAttribute('part','element');
		element.appendChild(slot);

		/* Close button */
		const button = document.createElement('button');
		button.setAttribute('id','button');
		button.classList.add('button');
		button.classList.add('close');
		button.setAttribute('part','button');
		button.setAttribute('aria-label',CLOSE_BUTTON_ARIA_LABEL);
		button.setAttribute('title',CLOSE_BUTTON_ARIA_LABEL);
		button.setAttribute('tabindex','-1');

		/* Note area */
		const area = document.createElement('aside');
		area.setAttribute('id','area');
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

	static mount(targetNode) {
		
		/* Comment */
		const comment = document.createComment(TEMPLATE_COMMENT);
		targetNode.appendChild(comment);
		
		/* Styles */
		const styleFragment = FootNote.createStyles();

		/* Template */
		const templateFragment = FootNote.createTemplate();
		const templateElement = document.createElement('template');
		templateElement.setAttribute('id',TEMPLATE_ID);
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

		/* Note elements */
		this.areaElement = root.getElementById('area');
		this.callElement = root.getElementById('call');
		this.markerElement = root.getElementById('marker');
		this.elementElement = root.getElementById('element');
		this.buttonElement = root.getElementById('button');
		
		/* Event handler */
		this.toggle = this.toggle.bind(this);
		this.hide = this.hide.bind(this);
		this._watchEsc = this._watchEsc.bind(this);
	}

	connectedCallback() {
		if(!this.isConnected) {
			return false;
		}
		if(this.callElement && this.callElement.isConnected) {
			this.callElement.addEventListener('click',this.toggle); //direkt this.toggle.bind(this), addEventListener in den constructor
		}
		if(this.buttonElement && this.buttonElement.isConnected) {
			this.buttonElement.addEventListener('click',this.hide); //direkt bind()
		}
		//<a slot="index">1</a> wenn vorhanden, dann Inhalt als Attribut
		// wenn Attribute target -> fetch content
	}

	disconnectedCallback() {
		if(this.callElement) {
			this.callElement.removeEventListener('click',this.toggle); // braucht man nicht
		}
		if(this.buttonElement) {
			this.buttonElement.removeEventListener('click',this.hide); // braucht man nicht
		}
	}
	
	attributeChangedCallback(name, oldValue, newValue) {
		if(oldValue === newValue) {
			return true;
		}
		switch(name) {
			/* Attribute: index */
			case 'index':
				this.callElement.textContent = newValue;
				this.callElement.setAttribute('href','#' + this.tagName + '-' + newValue);
				this.callElement.setAttribute('aria-label',CALL_ARIA_LABEL + ' ' + newValue);
				this.markerElement.textContent = newValue;
				this.markerElement.setAttribute('aria-label',MARKER_ARIA_LABEL + ' ' + newValue);
				break;
			/* Attribute: visible */
			case 'visible':
				this.visible = this.hasAttribute('visible');
				if(this.visible) {
					this.areaElement.classList.add('visible');
					this.areaElement.setAttribute('aria-hidden',"false");
					this.buttonElement.setAttribute('tabindex','0');
					document.addEventListener('keydown',this._watchEsc);
					this.areaElement.focus();
				} else {
					this.areaElement.classList.remove('visible');
					this.areaElement.setAttribute('aria-hidden',"true");
					this.buttonElement.setAttribute('tabindex','-1');
					document.removeEventListener('keydown',this._watchEsc);
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

	/* Methods (Prototype) */
	toggle(event) {
		if(event && event instanceof Event) {
			event.preventDefault();
		}
		this.hideOthers();
		this.visible = !this.visible;
		const toggleEvent = new CustomEvent( // Event in visible setter statt hier
			TOGGLE_EVENT_NAME, 
			{ 
				bubbles: true,
				cancelable: true,
				composed: true,
				detail: { 
					visible: this.visible 
				}
			}
		);
		this.dispatchEvent(toggleEvent);
	}

	hide(event) {
		if(this.visible !== false) {
			this.visible = false;
		}
		const hideEvent = new CustomEvent( // Event in visible setter statt hier
			HIDE_EVENT_NAME, 
			{ 
				bubbles: true,
				cancelable: true,
				composed: true,
				detail: { 
					visible: this.visible 
				}
			}
		);
		this.dispatchEvent(hideEvent);
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

	_watchEsc(event) { // watchEsc als Symbol
		if(!event || !(event instanceof Event)) {
			return false;
		}
		const { target } = event;
		if(event.key === 'Escape' || event.key === 'Esc') {
			// hat den keyboard focus -> element wenn Fußnote dann currentTarget.hide() (bind kann im constructor dann entfernt werden)
			this.hide();
		}
	}
}

export { FootNote as default };