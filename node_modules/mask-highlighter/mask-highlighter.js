import {html, render} from '../lit-html/lit-html.js';
/**
 * @typedef {Object} Area
 * @property {string} height : the height of rectangle
 * @property {string} width : the width of rectangle
 * @property {string} top : the top position of the rectangle in mask
 * @property {string} left : the left position of the rectangle in mask
 *
 * @typedef {Object} Position
 * @property {number} line : the number of the line (according to LINE_HEIGHT parameter)
 * @property {number} nbLines : the number of lines of the mask
 * @property {number} col : the number of the column (according to COL_WIDTH parameter)
 * @property {number} nbCols : the number of columns of the mask
 * @property {string} topMargin : the top margin position of the rectangle in mask (top margin is apply if line is set)
 * @property {string} leftMargin : the left margin position of the rectangle in mask (left margin is apply if col is set)
 */


/**
 * Class representing a Mask in webComponent
 *
 * It will expose properties :
 *  * {Area} area : the area of the rectangle of the mask
 *  * {Position} position : the position of the rectangle of the mask
 *  * {string} lineHeight : the height of a line if you want to play with lines and cols (Default value is 1.15em)
 *  * {string} colWidth : the width of a column if you want to play with lines and cols (Default value is 35px)
 *
 * It will expose thoses attributes :
 * Area Attributes
* * {string} height : the height of rectangle to apply to area
* * {stirng} width : the width of rectangle to apply to area
* * {string} top : the top position of rectangle to apply to area
* * {string} left : the left position of rectangle to apply to area
* Position Attributes
* * {number} line : the line number where the rectangle will start
* * {number} nb-lines : the number of line of the rectangle
* * {number} col : the col number where the rectangle will start
* * {number} nb-cols : the number of column of the rectangle
* * {string} top-margin : the top position before starting counting lines (top margin is apply if line is set)
* * {string} left-margin : the left position before starting counting columns (left margin is apply if col is set)
* Parameters Attributes
* * {string} line-height : the height of a line if you want to play with lines and cols (Default value is 1.15em)
* * {string} col-width : the width of a column if you want to play with lines and cols (Default value is 35px)
*/
export class MaskHighlighter extends HTMLElement {
	/**
	 * The name of custom tag for the component
	 */
	static get is() {
		return 'mask-highlighter'
	}

	/**
	 * Get the area
	 * @return {Area} the area
	 */
	get area() { return this._area;}
	/**
	 * Get the area
	 * @param {Area} the area to set
	 */
	set area(value) {this._area = value; this._updateArea(this._area);};

	/**
	 * Get the position
	 * @return {Position} the position
	 */
	get position() {return this._position;}
	/**
	 * Set the position
	 * @param {Position} the position to set
	 */
	set position(value) {this._position = value; this._updatePosition(this._position)}

	/**
	 * Get the lineHeight
	 * @return {string} the lineHeight
	 */
	get lineHeight(){return this._lineHeight;}
	/**
	 * @param {string} value : the lineHeight
	 */
	set lineHeight(value){
		if (this._lineHeight === value) return;
		this._lineHeight = value;
		this.setAttribute('line-height', value);
		this._updateFromPositionAndArea(this.position, this.area);
	}

	/**
	 * Get the colWidth
	 * @return {string} the coldWidth
	 */
	get colWidth(){return this._colWidth;}
	/**
	 * @param {string} value : the colWidth
	 */
	set colWidth(value){
		if (this._colWidth === value) return;
		this._colWidth = value;
		this.setAttribute('col-width', value);
		this._updateFromPositionAndArea(this.position, this.area);
	}

	/**
	 * Render the html
	 */
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
				fill: var(--mask-highlighter-bg-color, rgba(63, 63, 63, 0.7));
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
			<mask id="mask" x="0" y="0" width="${this.widthParent}" height="${this.heightParent}">
				<rect id="maskParent" x="0" y="0" width="${this.widthParent}" height="${this.heightParent}" class="parent" />
				<rect id="maskHole" class="hole" style="width:${this.widthToUse}; height:${this.heightToUse};" x="${this.leftToUse}" y="${this.topToUse}" />
			</mask>
		</svg>
		`;
	}

	/**
	 * Invalidate the component and re-render it
	 */
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
		// Default values
		this.lineHeight = '1.15em';
		this.colWidth = '35px';
	}

	connectedCallback() {
		//Bug fix to first rendering
		setTimeout(() => {
			this._updateFromPositionAndArea(this.position, this.area);
		}, 0);

	}

	static get observedAttributes() {
		return [
				// Area Attributes
				'height',
				'width',
				'top',
				'left',
				// Position Attributes
				'line',
				'nb-lines',
				'col',
				'nb-cols',
				'top-margin',
				'left-margin',
				// Parameters Attributes
				'line-height',
				'col-width'
			];
	}

	/**
	 *
	 * @param {string} attr
	 * @param {string} oldValue
	 * @param {string} newValue
	 */
	attributeChangedCallback(attr, oldValue, newValue){
		switch(attr){
			case 'height' :
			case 'width' :
			case 'top' :
			case 'left' :
				if (!this._area) this._area = {};
				const areaTmp = this.area;
				areaTmp[attr] = newValue;
				this.area = areaTmp;
				break;
			case 'line' :
			case 'nb-lines' :
			case 'col' :
			case 'nb-cols' :
			case 'top-margin' :
			case 'left-margin' :
				if (!this._position) this._position = {};
				const positionTmp = this.position;
				let attrFinal = attr;
				if (attr === 'nb-lines'){
					attrFinal = 'nbLines';
				}else if(attr === 'nb-cols'){
					attrFinal = 'nbCols';
				}else if(attr === 'top-margin'){
					attrFinal = 'topMargin';
				}else if(attr === 'left-margin'){
					attrFinal = 'leftMargin';
				}
				positionTmp[attrFinal] = newValue;
				this.position = positionTmp;
			break;
			case 'line-height':
				this['lineHeight'] = newValue;
			break;
			case 'col-width':
				this['colWidth'] = newValue;
			break;
		}
	}

	/**
	 * process the modification of Area
	 * @param {Area} areaNew
	 */
	_updateArea(areaNew) {
		this._updateFromPositionAndArea(this.position, areaNew);
	}

	/**
	 * Process the modification of Position
	 * @param {Position} newPosition
	 */
	_updatePosition(newPosition) {
		this._updateFromPositionAndArea(newPosition, this.area);
	}

	/**
	 * Process the modification of position & area
	 * @param {Position} position
	 * @param {Area} area
	 */
	_updateFromPositionAndArea(position, area) {
		const positionObject = {
			width: 0,
			height: 0,
			top: 0,
			left: 0
		};
		// We verify that position send are correct
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

	/**
	 * Validate the line attribute of the position attribute
	 * @param {Position} position
	 */
	_validateTopFromPosition(position) {
		return this.lineHeight && position && position.line != undefined;
	}

	/**
	 * Validate the nb-lines attribute of the position attribute
	 * @param {Position} position
	 */
	_validateHeightFromPosition(position) {
		return this.lineHeight && position && position.nbLines != undefined;
	}

	/**
	 * Validate the col attribute of the position attribute
	 * @param {Position} position
	 */
	_validateLeftFromPosition(position) {
		return this.colWidth && position && position.col != undefined;
	}

	/**
	 * Validate the nb-cols attribute of the position attribute
	 * @param {Position} position
	 */
	_validateWidthFromPosition(position) {
		return this.colWidth && position && position.nbCols != undefined;
	}

	/**
	 * Validate the top attribute of the area attribute
	 * @param {Area} area
	 */
	_validateTopFromArea(area) {
		return area && area.top != undefined;
	}

	/**
	 * Validate the height attribute of the area attribute
	 * @param {Area} area
	 */
	_validateHeightFromArea(area) {
		return area && area.height != undefined;
	}

	/**
	 * Validate the left attribute of the area attribute
	 * @param {Area} area
	 */
	_validateLeftFromArea(area) {
		return area && area.left != undefined;
	}

	/**
	 * Validate the width attribute of the area attribute
	 * @param {Area} area
	 */
	_validateWidthFromArea(area) {
		return area && area.width != undefined;
	}

	/**
	 * Apply all the changes to attributes to reflect on the dom
	 * @param {Area} param
	 */
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

		// We fore the width & height of parent do to a rendering bug and to be shure that even the
		// viewport change, the size of the component will follow thoses changes
		this.widthParent = '100%';
		this.heightParent = '100%';


		this.widthToUse = isFinite(String(width)) ? `${width}px` : width;
		this.heightToUse = isFinite(String(height)) ? `${height}px` : height;
		this.topToUse = isFinite(String(top)) ? `${top}px` : top;
		this.leftToUse = isFinite(String(left)) ? `${left}px` : left;
		// Invalidate the template to force a re-rendering
		this.invalidate();
	}
}
// Register custom element definition using standard platform API
customElements.define(MaskHighlighter.is, MaskHighlighter);