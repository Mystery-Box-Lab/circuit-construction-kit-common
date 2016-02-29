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
  var circuitConstructionKitBasics = require( 'CIRCUIT_CONSTRUCTION_KIT_BASICS/circuitConstructionKitBasics' );
  var FixedLengthComponentNode = require( 'CIRCUIT_CONSTRUCTION_KIT_BASICS/common/view/FixedLengthComponentNode' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var ResistorColors = require( 'CIRCUIT_CONSTRUCTION_KIT_BASICS/common/view/ResistorColors' );

  // images
  var resistorImage = require( 'mipmap!CIRCUIT_CONSTRUCTION_KIT_BASICS/resistor.png' );

  /**
   *
   * @constructor
   */
  function ResistorNode( circuitNode, resistor ) {
    this.resistor = resistor;
    FixedLengthComponentNode.call( this, circuitNode, resistor, resistorImage );

    var imageWidth = this.imageNode.width;
    var bandWidth = 10;
    var bandHeight = 40;
    var inset = 40;
    var availableBandSpace = imageWidth - 2 * inset;
    var remainingSpace = availableBandSpace - 4 * bandWidth;// max is 4 bands, even though they are not always shown
    var bandSeparation = remainingSpace / 3;
    var y = this.imageNode.height / 2;
    var colorBands = [
      new Rectangle( 0, 0, bandWidth, bandHeight, { x: inset + (bandWidth + bandSeparation) * 0, centerY: y } ),
      new Rectangle( 0, 0, bandWidth, bandHeight, { x: inset + (bandWidth + bandSeparation) * 1, centerY: y } ),
      new Rectangle( 0, 0, bandWidth, bandHeight, { x: inset + (bandWidth + bandSeparation) * 2, centerY: y } ),
      new Rectangle( 0, 0, bandWidth, bandHeight, { x: inset + (bandWidth + bandSeparation) * 3, centerY: y } )
    ];
    resistor.resistanceProperty.link( function( resistance ) {
      var colors = ResistorColors.toThreeColors( resistance );
      for ( var i = 0; i < colorBands.length; i++ ) {
        colorBands[ i ].fill = colors[ i ];// Last one could be null
      }
    } );
    for ( var i = 0; i < colorBands.length; i++ ) {
      this.imageNode.addChild( colorBands[ i ] );
    }
  }

  circuitConstructionKitBasics.register( 'ResistorNode', ResistorNode );

  return inherit( FixedLengthComponentNode, ResistorNode );
} );