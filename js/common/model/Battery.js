// Copyright 2015, University of Colorado Boulder

/**
 *
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var FixedLengthComponent = require( 'CIRCUIT_CONSTRUCTION_KIT_BASICS/common/model/FixedLengthComponent' );
  var Vertex = require( 'CIRCUIT_CONSTRUCTION_KIT_BASICS/common/model/Vertex' );

  /**
   *
   * @constructor
   */
  function Battery( position, voltage ) {
    FixedLengthComponent.call( this, 146, new Vertex( position.x - 50, position.y ), new Vertex( position.x + 50, position.y ), {
      voltage: voltage
    } );
  }

  return inherit( FixedLengthComponent, Battery );
} );