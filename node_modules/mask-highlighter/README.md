# MaskHighlighter

> A webcomponent to show a mask over content to highlight. The content to highlight is in a rectangle.
>
> Needs lit-html as dependancy

## Doc & demo

[https://github.com/binomed/mask-highlighter](https://github.com/binomed/mask-highlighter/tree/master/demo)


```html
<mask-highlighter
	top="5px"
	left="5px"
	width="10px"
	height="10px"></mask-highlighter>
```


## Install

Install it using npm as ES6 Module

```sh
$ npm install mask-highlighter --save
```

or download [zip](https://github.com/binomed/mask-highlighter/archive/1.0.1.zip)

## Usage

1. Import Web Components' polyfill (if needed):

```html
<script src="bower_components/webcomponentsjs/webcomponents.min.js"></script>
```

2. Import the component

```html
<script type="module" src="../mask-highlighter.js"></script>
```

3. Start using it
```html
<mask-highlighter></mask-highlighter>
```

## Expose attributes & properties

It will expose properties :
 * {Area} area : the area of the rectangle of the mask
 * {Position} position : the position of the rectangle of the mask
 * {string} lineHeight : the height of a line if you want to play with lines and cols (Default value is 1.15em)
 * {string} colWidth : the width of a column if you want to play with lines and cols (Default value is 35px)

It will expose thoses attributes :
Area Attributes
* {string} height : the height of rectangle to apply to area
* {stirng} width : the width of rectangle to apply to area
* {string} top : the top position of rectangle to apply to area
* {string} left : the left position of rectangle to apply to area
Position Attributes
* {number} line : the line number where the rectangle will start
* {number} nb-lines : the number of line of the rectangle
* {number} col : the col number where the rectangle will start
* {number} nb-cols : the number of column of the rectangle
* {string} top-margin : the top position before starting counting lines (top margin is apply if line is set)
* {string} left-margin : the left position before starting counting columns (left margin is apply if col is set)
Parameters Attributes
* {string} line-height : the height of a line if you want to play with lines and cols (Default value is 1.15em)
* {string} col-width : the width of a column if you want to play with lines and cols (Default value is 35px)


### Styling

The following custom properties are available for styling.

| Custom property | Description | Default |
| --- | --- | --- |
| `--mask-highlighter-bg-color` | Mask color | rgba(63,63,63,0.7) |



## License

[MIT License](http://opensource.org/licenses/MIT)