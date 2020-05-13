/* eslint-disable */
import simLauncher from '../../joist/js/simLauncher.js';
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
    "url": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAoCAYAAAALz1FrAAAAAklEQVR4AewaftIAAARWSURBVLXBb2jUZQDA8e/z/H7Pc7fT3Zw//8xN/JPa2k5EydqL1EQiTHqjUNCsKCKpeZiBRYTtOqkXhjiyzSbqCyEqxRfWi9LI0iK0zEHqLV24/rgKnO7P3aa3+/d0Y4Lzdne7qX0+gvxqgXkMSQIGsIEkQ2ygB9gBpMhBkN2TwEKgHdhDfo8BDwFXgQYK9AawkbFbA7wHzGUUm4EnuH0zgQbgXnJ4FVjLnSsHtjGMxZBlwDygiTsXARSwGviBYd4FbO6udwCHNAn4gCiQ4O46BKwjTQKrgQPcfT8DmjQJWMAF/h8p0mwgSQ6h4PrXQSwWgglkYeA6xhzzBZoayC4GzLOA5cBxMoSC/q8FvAhiigAv4AAO4AAO4AjBLIFYU7figUU7vz31KSPdB5TZQJwMoaD/aQErDKLRF2jcQB7nguv3SiOeCwX9fl+gsZFbGUBLQJFBwDQEAviOUcwPNL1goEtgljFSEXBRAoYMBg4Zw2UwW1u3+BcyGkEUIRQjOcAJCQgy+AKNvwnMmwIcY8zBULCuhttjgJgErgFLyFAdaNoLvCZgEshPzgX9DzN2gjQJ7AEeIYvqQNNuI8QrArwCPgptqVtJ4ZYA10mTQA9gkYOvvnGfEamXAAVyd2uwbjGFeRTYRZpkyPfAJnLw1e88iGAD4DXIrYxOAgIIkyYZ8hVQCjjk4KtvPIAxR8EsYHSbgGPcILnpALCRPAyiD4Eiv3KgBDjKDZKbfgE6gWe4M+uBjxlGcqsdQBXwILdnHXAJCDGMZKS3gaeAuYxBz7WoF5gKNJNBkMWRl0tPCeQiISwjpERKC6VsPOM9wpnkyPKK8qRtK6IDUVrPhujtjlqpVIyklPtWftDxPBlssrDploCFAZKAkSA1xMdDwoJkqS1kApG8DvEuSFxGAkZMtshCMorOqI/28GIG/fjPfAaSilgCDp9TFMomjzNdSzndNQklDROL+mi5MhH1RzGTezUn/rKYXWpx/mol7rhDqftXcpHkUVlyhtp7vmHplA62n1/As1Vn6QzDpV7N5lVR6g+XEI5aKGuAfGzycFm9DJrlbcFfGWec6ubxqr8pq5jBeJckuLKP/o5Wensuk4+kQBXjLjDI644xoSjJoFlOjELYZHHxipVKmRRgI4QbaRfjKiql2CpjQMzEVrOxlU00fo2OpKCzt41k7F+kTsTJwiaLTUfGfRGJRO53uSzh9RbhOCVUVExjjppDtaimz1OFUopwIszxeB8nf++mra070t/fv4ssJFmEw+GAy+VqYwxcLteX0Wj0J7KQ5KCU2iOEMBTAsqxut9u9hRwkOUQikW1KqTMUwOPxfN7e3h4iB5s8amtrP6ypqXnf7Xa73G43Ho+H4uJivF4vWmsqpk9nallZR8P27QHysMmjubl5V+3atULZ9gatdaXWWmqt0VqjtR5QWp90HOet/fv3/0keggKdbmlZrZRarrUu0Vp3WJb12cwZM05RgP8AhxdEYPnPnn4AAAAASUVORK5CYII="
  },
  {
    "width": 13,
    "height": 20,
    "url": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAUCAYAAABWMrcvAAAAAklEQVR4AewaftIAAAIHSURBVI3BT0hTcQDA8e/v7edcjG3N3jZEcy5zjUbBEGJCdSgwCKGgUOkPeqpoQecImg+6mNdah+jYJbp16NChKElDKApfiKBJ0BxJtc2Rk/15vdqrnlLk5yP4Yw/QA1SBOiBokMA8MMEGh4Cz/NtJ4Bg2EWCE/zsBHMQyAihszjAmBagBdTanikkCdSy6lnoAIiJAYDL4wZiLp28N0VACejCdwqRrqX5du/SSDXQt9VTXUhdoOArsVwDBT2ISDKeuXbyCnRAfhRAhGvzApAIomOLpm58FxjkQgzNaapS/E0BNAfLAAUy705lphHEGxHFdS51nPQE4MCnAQ6AbS/xaZgaM+wZGH+udBiYwKTTMAoP8JqpCoGAprq5tAWrAPCaB5c6Qd7TD70xK2WR4PGFfe8f2bWpQWXg9vRxezn9b6r89dRiLxLLDXwwAR1ZWu6iLZTodzRRKW6OV8itcVLCT2KxUIswV2nGWJQtvvbSpkmKhi2DzLHYSG0/Te3oCi0hXG927uvF4vbzJz1Mus47EMrXoWvpUqhqOppAIhPdiuPvweXw8K9Qofnj+FRuJ5eqj8nWXyzXc2urcuS/godMRoiz96Gu+ypN37gwU+EXBJhaL3R0YGKgnk0lUVcXf0kKyt/dFNpu9h40Dm1wuNzE+Pl6PRqPuYDD4RQ0EHicSics3xsby2HwH/RiZV+8qDEAAAAAASUVORK5CYII="
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