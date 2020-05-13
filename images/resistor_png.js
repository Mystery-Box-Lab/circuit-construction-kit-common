/* eslint-disable */
import simLauncher from '../../joist/js/simLauncher.js';
const image = new Image();
const unlock = simLauncher.createLock( image );
image.onload = unlock;
image.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAAAsCAYAAACHUEHxAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpCNEM5Mzg1QjI5RjIxMUU3QTk5MUI1MkE1N0U2RTQzRiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpCNEM5Mzg1QzI5RjIxMUU3QTk5MUI1MkE1N0U2RTQzRiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkI0QzkzODU5MjlGMjExRTdBOTkxQjUyQTU3RTZFNDNGIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkI0QzkzODVBMjlGMjExRTdBOTkxQjUyQTU3RTZFNDNGIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+CLMnGAAACCJJREFUeNrsnXts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';
export default image;