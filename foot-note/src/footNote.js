/* 
	Web Component:	FootNote
	Custom Element:	<foot-note></foot-note>
	Shadow DOM:			true, closed
	Attributes:			index, visible (empty) 
	Slots:					default	
*/
class FootNote extends HTMLElement {

	constructor(/* element */) {
		super();
		
		this.root = this.attachShadow({ 
			mode: 'closed' 
		});
		
		/* Styles */
		const styles = FootNote.createStyles();
		this.root.appendChild(styles);
		
		/* Template */
		const template = FootNote.createTemplate();
		this.root.appendChild(template);

		/* Properties */
		this.area = this.root.querySelector('.area');
		this.call = this.root.querySelector('.call');
		this.marker = this.root.querySelector('.marker');
		this.button = this.root.querySelector('.button');
		this.slots = this.root.querySelectorAll('slot');
		
		/* Methods bind */
		this.toggle = this.toggle.bind(this);
		this.hide = this.hide.bind(this);
		this.hideAll = this.hideAll.bind(this);
		this._watchEsc = this._watchEsc.bind(this);
	}

	static createTemplate() {
		const template = document.createDocumentFragment();
		const slot = document.createElement('slot');
		
		const call = document.createElement('a');
		call.classList.add('call');
		call.setAttribute('part','call');
		call.setAttribute('role','doc-noteref');

		const marker = document.createElement('div');
		marker.classList.add('marker');
		marker.setAttribute('part','marker');

		const element = document.createElement('div');
		element.classList.add('element');
		element.setAttribute('part','element');
		element.appendChild(slot);
		
		const button = document.createElement('button');
		button.classList.add('button');
		button.classList.add('close');
		button.setAttribute('part','button');
		button.setAttribute('aria-label','Close');
		button.setAttribute('title','Close');

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

	static createStyles() {
		const styles = document.createDocumentFragment();

		const styleElement = document.createElement('style');
		styleElement.setAttribute('type','text/css');

		const styleText = document.createTextNode(`
			:host {
				font-family: inherit;
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
			.area {
				position: fixed;
				bottom: 0;
				left: 50%;
				transform: translateX(-50%);
				display: flex;
				flex-direction: row;
				flex-wrap: nowrap;
				justify-content: space-between;
				align-items: center;
				border-top-color: #000000;
				border-top: 1px solid var(--footnote-theme-color, #000000);
				width: 100%;
				max-width: var(--footnote-max-width, 58rem);
				margin-bottom: -100%;
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
			}
			.marker,
			.close {
				flex: 0 0 auto;
				display: flex;
				justify-content: center;
				align-items: center;
				min-width: 1.8rem;
				height: 1.8rem;
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
	
	connectedCallback() {
		if(!this.call.isConnected || !this.button.isConnected) {
			return false;
		}
		/* EventListeners: add */
		this.call.addEventListener('click', this.toggle);
		this.button.addEventListener('click', this.hide);
	}

	disconnectedCallback() {
		/* EventListeners: remove */
		this.call.removeEventListener('click', this.toggle);
		this.button.removeEventListener('click', this.hide);
	}

	static get observedAttributes() { 
		return ['index', 'visible']; 
	}
	
	/* ShadowDOM sync */
	attributeChangedCallback(name, oldValue, newValue) {
		if(oldValue === newValue) {
			return true;
		}
		switch(name) {
			/* Attribute: index */
			case 'index':
				this.call.textContent = newValue;
				this.call.setAttribute('href','#footnote-' + newValue);
				this.call.setAttribute('aria-label','Footnote ' + newValue + ' call');
				this.marker.textContent = newValue;
				this.marker.setAttribute('aria-label','Footnote ' + newValue + ' marker');
				break;
			/* Attribute: visible */
			case 'visible':
				this.visible = this.hasAttribute('visible');
				this.area.setAttribute('aria-hidden', !this.visible);
				if(this.visible) {
					this._wasFocused = document.activeElement;
					this.area.classList.add('visible');
					document.addEventListener('keydown', this._watchEsc);
					this.focus();
				} else {
					this._wasFocused && this._wasFocused.focus && this._wasFocused.focus();
					this.area.classList.remove('visible');
					document.removeEventListener('keydown', this._watchEsc);
				}
				break;
		}
	}

	/* Attributes sync */
	get index() {
		return this.getAttribute('index');
	}
	set index(value) {
		this.setAttribute('index', value);
	}
	get visible() {
		return this.hasAttribute('visible');
	}
	set visible(isVisible) {
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
		this.hideAll();
		this.visible = !this.visible;
		const toggleEvent = new CustomEvent('footnote-on-toggle', { 
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
			detail: { 
				visible: this.visible 
			}
		});
		this.dispatchEvent(hideEvent);
	}

	hideAll() {
		const openNotes = document.querySelectorAll('foot-note[visible]');
		openNotes.forEach(note => {
			if(note === this) {
				return false;
			}
			note.removeAttribute('visible');
		});
	}

	_watchEsc(event) {
		if(event.key === 'Escape') {
			this.hide();
		}
	}
}

export { FootNote as default };