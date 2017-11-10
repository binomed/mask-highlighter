import {html, render} from './node_modules/lit-html/lit-html.js';



// Extend Polymer.Element base class
export class MaskHighlighter extends HTMLElement {
	static get is() {
		return 'mask-highlighter'
	}

	get area() { return this._area;}
	set area(value) {this._area = value; this._updateArea(this._area);};

	get position() {return this._position;}
	set position(value) {this._position = value; this._updatePosition(this._position)}

	render(){
		return html`
		<style>
			:host {
				display: block;
				position: relative;
				overflow: hidden;
				height: 100%;
				width: 100%;
			}
			svg.code {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
			}
			svg.code rect.mask_area {
				stroke: none;
				fill: rgba(63, 63, 63, 0.7);
				mask: url(#mask);
				width: 100%;
				height: 100%;
			}
			svg.mask-code {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
			}
			svg.mask-code mask#mask {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
			}
			svg.mask-code mask#mask rect.parent {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				stroke: none;
				fill: #ffffff;
			}
			svg.mask-code mask#mask rect.hole {
				stroke: none;
				fill: #000000;
				position: absolute;
				transition-property: all;
				transition-duration: 0.5s;
				width: 500px;
				height: 100px;
			}
		</style>


		<svg class="code">
			<use xlink:href="#mask_area" />
		</svg>

		<div style="display:none">
			<svg class="code">
				<rect id="mask_area" x="0" y="0" class="mask_area" />
			</svg>
		</div>
		<svg class="mask-code">
			<mask id="mask" x="0" y="0" width="100%" height="100%">
				<rect id="maskParent" x="0" y="0" width="${this.widthParent}" height="${this.heightParent}" class="parent" />
				<rect id="maskHole" class="hole" style="width:${this.widthToUse}; height:${this.heightToUse};" x="${this.topToUse}" y="${this.leftToUse}" />
			</mask>
		</svg>
		`;
	}

	invalidate() {
		if (!this.needsRender) {
		  this.needsRender = true;
		  Promise.resolve().then(() => {
			this.needsRender = false;
			render(this.render(), this.shadowRoot);
		  });
		}
	  }


	constructor() {
		super();
		this.attachShadow({mode: 'open'});
		this.widthParent = '100%';
		this.heightParent = '100%';
		this.widthToUse = '0';
		this.heightToUse = '0';
		this.topToUse = '0';
		this.leftToUse = '0';
	}

	connectedCallback() {
		this.invalidate();
	}

	static get observerAttributes() {
		return ['height', 'width', 'top', 'left', 'line', 'nbLines', 'col', 'nbCols', 'topMargin', 'leftMargin'];
	}

	attributeChangeCallback(attr, oldValue, newValue){
		switch(attr){
			case 'height' :
			case 'width' :
			case 'top' :
			case 'left' :
				const areaTmp = area;
				areaTmp[attr] = newValue;
				area = areaTmp;
			break;
			case 'line' :
			case 'nbLines' :
			case 'col' :
			case 'nbCols' :
			case 'topMargin' :
			case 'leftMargin' :
				const positionTmp = position;
				positionTmp[attr] = newValue;
				position = positionTmp;
			break;
		}
	}

	_updateArea(areaNew) {
		this._updateFromPositionAndArea(this.position, areaNew);
	}
	_updatePosition(newPosition) {
		this._updateFromPositionAndArea(newPosition, this.area);
	}
	_updateFromPositionAndArea(position, area) {
		const positionObject = {
			width: 0,
			height: 0,
			top: 0,
			left: 0
		};
		if (this._validateTopFromPosition(position)) {
			const margin = position.topMargin ? position.topMargin : 0;
			positionObject.top = `calc(${margin} + (${this.lineHeight} * ${Math.max(0, position.line - 1)}))`;
		} else if (this._validateTopFromArea(area)) {
			positionObject.top = area.top;
		}
		if (this._validateHeightFromPosition(position)) {
			positionObject.height = `calc(${this.lineHeight} * ${position.nbLines})`;
		} else if (this._validateHeightFromArea(area)) {
			positionObject.height = area.height;
		}
		if (this._validateLeftFromPosition(position)) {
			const margin = position.leftMargin ? position.leftMargin : 0;
			positionObject.left = `calc(${margin} + (${this.colWidth} * ${Math.max(0, position.col - 1)}))`;
		} else if (this._validateLeftFromArea(area)) {
			positionObject.left = area.left;
		}
		if (this._validateWidthFromPosition(position)) {
			positionObject.width = `calc(${this.colWidth} * ${position.nbCols})`;
		} else if (this._validateWidthFromArea(area)) {
			positionObject.width = area.width;
		}
		this._changeProperties(positionObject);
	}
	_validateTopFromPosition(position) {
		return this.lineHeight && position && position.line != undefined;
	}
	_validateHeightFromPosition(position) {
		return this.lineHeight && position && position.nbLines != undefined;
	}
	_validateLeftFromPosition(position) {
		return this.colWidth && position && position.col != undefined;
	}
	_validateWidthFromPosition(position) {
		return this.colWidth && position && position.nbCols != undefined;
	}
	_validateTopFromArea(area) {
		return area && area.top != undefined;
	}
	_validateHeightFromArea(area) {
		return area && area.height != undefined;
	}
	_validateLeftFromArea(area) {
		return area && area.left != undefined;
	}
	_validateWidthFromArea(area) {
		return area && area.width != undefined;
	}
	_changeProperties({
		width,
		height,
		top,
		left
	}) {
		if (!this.maskParent){
			this.maskParent = this.shadowRoot.querySelector('#maskParent');
			this.maskHole = this.shadowRoot.querySelector('#maskHole');
		}

		this.widthParent = '100%';
		this.heightParent = '100%';
		//this.maskParent.setAttribute('width', '100%');
		//this.maskParent.setAttribute('height', '100%');
		this.widthToUse = isFinite(String(width)) ? `${width}px` : width;
		this.heightToUse = isFinite(String(height)) ? `${height}px` : height;
		this.topToUse = isFinite(String(top)) ? `${top}px` : top;
		this.leftToUse = isFinite(String(left)) ? `${left}px` : left;
		/*const widthToUse = isFinite(String(width)) ? `${width}px` : width;
		const heightToUse = isFinite(String(height)) ? `${height}px` : height;
		const topToUse = isFinite(String(top)) ? `${top}px` : top;
		const leftToUse = isFinite(String(left)) ? `${left}px` : left;
		/*this.maskHole.style.width = `${widthToUse}`;
		this.maskHole.style.height = `${heightToUse}`;
		this.maskHole.setAttribute('y', `${topToUse}`);
		this.maskHole.setAttribute('x', `${leftToUse}`);*/
		this.invalidate();
	}
}
// Register custom element definition using standard platform API
customElements.define(MaskHighlighter.is, MaskHighlighter);