/* eslint-disable */
var img = new Image();
window.phetImages.push( img );
img.src = 'data:image/png;base64,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';
export default img;
