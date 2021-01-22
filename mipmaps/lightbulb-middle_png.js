/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';

const mipmaps = [
  {
    "width": 194,
    "height": 315,
    "url": "data:image/png;base64,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"
  },
  {
    "width": 97,
    "height": 158,
    "url": "data:image/png;base64,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"
  },
  {
    "width": 49,
    "height": 79,
    "url": "data:image/png;base64,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"
  },
  {
    "width": 25,
    "height": 40,
    "url": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAoCAYAAAALz1FrAAAAAklEQVR4AewaftIAAAPDSURBVL3Bf4iedQEA8M/3+7zPc7vjfZ/3zndr5YQF28LbK6GwVEisJCL/PKEgVyCEU+7CFlhEHS/6Yn8YwZHsrpWTCKLaMJKI/dESz4k1UEHxDpG20XbLPMv0Lt3s8u7phZOcd+97d/vRfT7Bym7HDovmUaCEeYtKeBMPYUEHQXtfxLU4iQNWdis+idcxYo2+jb0u3G34PrZbxTC+4OJtxQg+poNvYLdLdyV+4DyJRTdjB0Zdun8hxQCedp7voeTyegA1LRF1vIN3XV6PYY+WiAEccvk9i0xLRIKX/X8saClhXgeT9w99C7uEoldb4RzG643REe3NYUeCT+NJS0w2B/9QBHeGED6EHDXUUEMNNcJHKW4b+swnrht74plfWe5qfLiE/1hiojn0ZYpbgrCv3hi9xwommkOPBMUdk82hr9Ubo/t8UIEsIrVE4CMIOGoV1zRGv1oU4Z+42XLdOBFRWO4xvFYoHpxsDl5rFSF4B6nlavhTRLBEvTH6Z8J3ArWCRyeagze4OAXmIs7iJkvUG6OP4JuBjUH45URz8FMuXNAScQCf1Ua9MfYwvk6RB+Hnk83Bz1u7m3BOS8SbSHRQb4z9rODuQpESHp5oDu6yNp/Dj7VEi57CvTq4pjH2aBDuKcjxoNVFBMxqiRb9Hn2o6aDeGD0UeJzwcau7F+PeE73vEPZaQaF4iyK1sitRxePeE73vBfwdX3FphvAL54k+6CH043oXZw+mMOk80XL34UvY7gLMnP13js3Yb4mgjeHh4acr5fJ1fX1971Z7e1WrVdXeXtVyOc0r5Sy/ovZ2CMH8/LzXpqf97cxUz19fecVbb589sOeuu+62REkbMcYNMcZuSyWJmGZaKiEE/5OUxKSkpUsb0TqI1kG0DqJ1EK2Dkjamp6fnZ2dmzMzMKL/xhjzP5dWqK/r6bNq0ycaNG8UkMTc359SpU6bOnDH96qvmWrRR0saRI0d+OzU1tStJkpDnuVqtZsuWLbZt22bnzp36+/ulaWp2dtb4+Lhjx445fvz4THd394+0EbVx8uTJB3p7e19yAXp6en53+vTp57URdZDn+U+SJFmwBqVS6fWtW7fep4OogxMnTvywXC4/bw0qlcqvjx49elwHJSsYGBjYd8ONN451b9iwoaurS09Pj0qlIs9zaZbZctVVNm/e/JeDBw9+9/DhwzopWcH+/ft/evvu3TEtlfZmWdafZVmSZZksy6RZdi5N0z/meT48MjLyDysI1ujZ5567NUvTW9I0rWZdXWcWFhZ+s2P79hetwX8BmSv+qJg8NW0AAAAASUVORK5CYII="
  },
  {
    "width": 13,
    "height": 20,
    "url": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAUCAYAAABWMrcvAAAAAklEQVR4AewaftIAAAHRSURBVJ3BQWhSYQDA8f/3KcHGHKgv3cEx58haztMQ3qE6dNghioICYyvaKZuHQYcOBUl7R/G8nbpHdOvmQQMXEh19czMwPfTIy4aMIGLufT3yUW+jaOz3E/yRBuaBAWADgiE/0AY2OeYqcJ9/uwPcxGMaWOb/bgNXcC0DkpN5gEMCh4DNyQxw+AEbl7mWfyNgGqEEvwgcn1KF9bsMfQPmcSziMI389S0j/4FjzLX8uy0j/4iha8AlCQgcAuoKzpjGylO8BBaIKENBoC4BiSNVWN8VqIcCkTWN/Av+TgCHEugDl3GkChsfFeoecMs0VnIcJQAfDgm8Bc7hmitsmMBrEAsctQRs4pAM7QBZflMDUBLX/vcfI8Ah0MYhcOVyuecXZ2czU/G4PRUOhrSx0bPjM+dbn+u1mWaz+XXp8ZMFXH5c0Wh0QghxA4caG2dkchIhxAVbm0BpexIPySlITsGPq91uWzvb20prtUQ8HieTyRAIBKhWq3Q6nT08fLgajUbti2UtWpYVllISi8VQSlEulw8qlcqzfr9v4pJ4JBKJl9ls1tZ1HU3TCIZC6Lpe63a7r/Dw4dHr9d4Xi8WDZDI5GolEdsOaVp5Lp1dLpdI+Hj8BtxuMfeusE5cAAAAASUVORK5CYII="
  }
];
mipmaps.forEach( mipmap => {
  mipmap.img = new Image();
  const unlock = asyncLoader.createLock( mipmap.img );
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