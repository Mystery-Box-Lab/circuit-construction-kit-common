/* eslint-disable */
import simLauncher from '../../joist/js/simLauncher.js';

const image = new Image();
const unlock = simLauncher.createLock( image );
image.onload = unlock;
image.src = 'data:image/png;base64,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';
export default image;