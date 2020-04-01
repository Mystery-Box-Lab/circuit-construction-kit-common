/* eslint-disable */
const img = new Image();
window.phetImages.push( img );
img.src = 'data:image/png;base64,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';
export default img;
