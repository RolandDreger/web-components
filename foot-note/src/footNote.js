/* 
	Web Component:	FootNote
	
	Custom Element:	<foot-note></foot-note>
	Shadow DOM:			true, open
	Attributes:			index, visible (empty) 
	Slots:					default	

	Author:					Roland Dreger, www.rolanddreger.net
	License:				MIT

	Date: 					12 Sept. 2020
*/


class FootNote extends HTMLElement {
	
	/* 
		Properties:
		index		->	Type: String
		visible	->	Type: Boolean

		Methods:
		hide		->	Hide element with close button.
		toggle	->	Toggle visibility of element.
	*/

	static get observedAttributes() { 
		return ['index', 'visible']; 
	}

	/* Template */
	static createTemplate() {

		
		const template = document.createDocumentFragment();
		
		/* Slot */
		const slot = document.createElement('slot');
		
		/* Note call */
		const call = document.createElement('a');
		call.classList.add('call');
		call.setAttribute('part','call');
		call.setAttribute('role','doc-noteref');
		
		/* Note marker */
		const marker = document.createElement('sup');
		marker.classList.add('marker');
		marker.setAttribute('part','marker');
		
		/* Note element (content) */
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
		
		template.appendChild(call);
		template.appendChild(area);
		
		return template;
	}

	/* Styles */
	static createStyles() {
		const styles = document.createDocumentFragment();

		const styleElement = document.createElement('style');
		styleElement.setAttribute('type','text/css');

		const styleText = document.createTextNode(`
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
		
		styleElement.appendChild(styleText);
		styles.appendChild(styleElement);

		return styles;
	}

	/* Livecycle hooks */
	constructor(/* element */) {
		super();
		
		const root = this.attachShadow({ 
			mode: 'open'
		});
		
		/* Styles */
		const styles = FootNote.createStyles();
		root.appendChild(styles);
		
		/* Template */
		const template = FootNote.createTemplate();
		root.appendChild(template);

		/* Properties */
		this.area = root.querySelector('.area');
		this.call = root.querySelector('.call');
		this.marker = root.querySelector('.marker');
		this.element = root.querySelector('.element');
		this.button = root.querySelector('.button');
		
		/* Event handler: bind */
		this.toggle = this.toggle.bind(this);
		this.hide = this.hide.bind(this);
		this._watchEsc = this._watchEsc.bind(this);
	}

	connectedCallback() {
		if(this.call.isConnected) {
			this.call.addEventListener('click', this.toggle);
		}
		if(this.button.isConnected) {
			this.button.addEventListener('click', this.hide);
		}
	}

	disconnectedCallback() {
		if(this.call) {
			this.call.removeEventListener('click', this.toggle);
		}
		if(this.button) {
			this.button.removeEventListener('click', this.hide);
		}
	}
	
	attributeChangedCallback(name, oldValue, newValue) {
		if(oldValue === newValue) {
			return true;
		}
		switch(name) {
			/* Attribute: index */
			case 'index':
				this.call.textContent = newValue;
				this.call.setAttribute('href','#footnote-' + newValue);
				this.call.setAttribute('aria-label','Call footnote ' + newValue);
				this.marker.textContent = newValue;
				this.marker.setAttribute('aria-label','Marker footnote ' + newValue);
				break;
			/* Attribute: visible */
			case 'visible':
				this.visible = this.hasAttribute('visible');
				if(this.visible) {
					this._wasFocused = document.activeElement;
					this.area.classList.add('visible');
					this.area.setAttribute('aria-hidden', "false");
					this.button.setAttribute('tabindex','0');
					document.addEventListener('keydown', this._watchEsc);
					this.area.focus();
				} else {
					this._wasFocused && this._wasFocused.focus && this._wasFocused.focus();
					this.area.classList.remove('visible');
					this.area.setAttribute('aria-hidden', "true");
					this.button.setAttribute('tabindex','-1');
					document.removeEventListener('keydown', this._watchEsc);
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
		this._hideAll();
		this.visible = !this.visible;
		const toggleEvent = new CustomEvent('footnote-on-toggle', { 
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
		const hideEvent = new CustomEvent('footnote-on-hide', { 
			bubbles: true,
			cancelable: true,
			composed: true,
			detail: { 
				visible: this.visible 
			}
		});
		this.dispatchEvent(hideEvent);
	}

	_hideAll() {
		const openNotes = document.querySelectorAll('foot-note[visible]');
		openNotes.forEach(note => {
			if(note === this) {
				return false;
			}
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