// Copyright 2016, University of Colorado Boulder

/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Text = require( 'SCENERY/nodes/Text' );

  function BlackBoxNode( width, height, options ) {
    Node.call( this, {
      children: [
        new Rectangle( 0, 0, width, height, 20, 20, { fill: 'black' } ),
        new Text( '?', { fontSize: 82, centerX: width / 2, centerY: height / 2, fill: 'white' } )
      ]
    } );
    this.mutate( options );
  }

  return inherit( Node, BlackBoxNode, {} );
} );