/* eslint-disable */
import simLauncher from '../../joist/js/simLauncher.js';
const mipmaps = [
  {
    "width": 50,
    "height": 80,
    "url": "data:image/png;base64,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"
  },
  {
    "width": 25,
    "height": 40,
    "url": "data:image/png;base64,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"
  },
  {
    "width": 13,
    "height": 20,
    "url": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAUCAYAAABWMrcvAAAAAklEQVR4AewaftIAAAKWSURBVJ3B20tTcQAH8O/vtyPTNi9hm7GcjVGLnTO3hiY0n0Q0CcNLaPnUg10w0Gxagi+xEkMalvawJP+AQNGXSKgHTSzygnhhunyodFIkvdRcZ+726wTHOEhI9PkQKDidzoZwOOziOC6uUqkQDoehVqsT9fX1/R6PZwN72e12b35+vsfv96dAobS09LQgCE+MRuM1KFmt1geCIFzEPnief1RQUFALCXU4HOWUUub3+59hH2NjY25RFMvwG8/zff39/Xr8A7PZ3Nvc3CxwhJBkS0vLFiSr99urk7HoBQIcgISBgXDcPN/50AOJxWKZHB4erqEajSYJWTK2085lZr3WmC0DGrNlQGM+8ZTF466V7jY3JFVVVR/T0tK0nCiKBLuS7Gfix/eMozfuvoBstdttAyHHIRkcHCxSqVSfaTQapR0dHWZIshynGpPxePVKV2sn/mDYFQqFBLfbPUQNBsPQ6OjodUiO1FwKHj5TW5OMxc6udN1sxR6pqalcU1PTFzo+Pv6GMaZpaGg4BskhV+nXTJuzEQTnoMDzfHMkEvkACYVEp9P5FhcXb0FmrLv8nnIpScgYCGGM2dfW1nohIZCZTKYrlZWV5cXFxesmkwk5oW9lOlfJq+DcdN7bl2M278jzq4FAYAoSCtn8/PxIXl7eeUppGyGkLS2/0E4IaSM5hrqMk0XaQCAwBRmFLJFIAIzhbxhjUKL4DxxkiUQitri0FA5ubmrXNzbg3N6GwWDA3OwslpeXt6Gggszr9e6Ioli4sLBgFUUROXo9UtVqTExMYHp6+nEwGJyEjINCRUXFnUgkUpKbm3tQr9dDm54Om8220tfXdw8KKijMzMxs+Xy+T4IgZBmNxlB2dvY7u8Nxu6enZxMKvwAR4vWul4WLSAAAAABJRU5ErkJggg=="
  },
  {
    "width": 7,
    "height": 10,
    "url": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAKCAYAAAB4zEQNAAAAAklEQVR4AewaftIAAAEPSURBVE3BsUsCURwH8O/9fHdCeqeDOMWJcRC8B5cE/QFlg5NIDg1B0KhTxE2BTY39A/0FDREN0VRTpER7dJhBhoQ0CBlUvpN3vcChz8eA5vt+U0oZ/0kmk9ZoNLobDAb34Jw3hRA+/hFC7EFjRBSfblWmKiq3gJgZjN1snly/cs7XyTRNpeTPTiJtP6UWFi+h4mqxWHybTCZ5iqKIZf2Vw+n4Y+3r5dkE0Xev1ysFQXBBUsph5eConBGlfRBVAQNKKavRaHxSt9s9q9Vq9Qd7/iq3vVsfLq1uADiHxqDZ6XTOMIxSYi4FK5Mdh2HYh8ag3bbb/ccwBBGh0+m8Y4ZBc1235XnesuM4+UKhcIyZX4OTYJopVBmpAAAAAElFTkSuQmCC"
  },
  {
    "width": 4,
    "height": 5,
    "url": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAFCAYAAABirU3bAAAAAklEQVR4AewaftIAAABbSURBVGPU1tYO+AMELCwsnFevXl3NUmyhKWGhLMfw9P2nH1m/flkxP/jDJBOspSD49ONXUT2/sDUsoWHh+v8DAnKEX77cG+zi8ovl1OnTl+Xk5RmfPn16gwEIAFDOJZxJl+psAAAAAElFTkSuQmCC"
  }
];
mipmaps.forEach( mipmap => {
  mipmap.img = new Image();
  const unlock = simLauncher.createLock( mipmap.img );
  mipmap.img.onload = unlock;
  mipmap.img.src = mipmap.url; // trigger the loading of the image for its level
  mipmap.canvas = document.createElement( 'canvas' );
  mipmap.canvas.width = mipmap.width;
  mipmap.canvas.height = mipmap.height;
  const context = mipmap.canvas.getContext( '2d' );
  mipmap.updateCanvas = () => {
    if ( mipmap.img.complete && ( typeof mipmap.img.naturalWidth === 'undefined' || mipmap.img.naturalWidth > 0 ) ) {
      context.drawImage( mipmap.img, 0, 0 );
      delete mipmap.updateCanvas;
    }
  };
} );
export default mipmaps;