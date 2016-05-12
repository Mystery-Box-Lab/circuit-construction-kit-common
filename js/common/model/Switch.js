// Copyright 2015-2016, University of Colorado Boulder

/**
 *
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * TODO: Factor out duplicated code with Wire
 */
define( function( require ) {
  'use strict';

  // modules
  var circuitConstructionKit = require( 'CIRCUIT_CONSTRUCTION_KIT/circuitConstructionKit' );
  var inherit = require( 'PHET_CORE/inherit' );
  var CircuitElement = require( 'CIRCUIT_CONSTRUCTION_KIT/common/model/CircuitElement' );
  var CircuitConstructionKitConstants = require( 'CIRCUIT_CONSTRUCTION_KIT/CircuitConstructionKitConstants' );

  // constants
  var OPEN_RESISTANCE = 1E11;
  var MINIMUM_RESISTANCE = CircuitConstructionKitConstants.minimumResistance;

  /**
   *
   * @constructor
   */
  function Switch( startVertex, endVertex, resistivity, options ) {
    assert && assert( typeof resistivity === 'number' && resistivity >= 0, 'bad value for resistivity: ' + resistivity );
    var switchModel = this;
    CircuitElement.call( this, startVertex, endVertex, {
      resistance: CircuitConstructionKitConstants.minimumResistance,
      resistivity: resistivity,
      closed: false
    }, options );

    var updateResistance = function() {
      var length = switchModel.startVertex.position.minus( switchModel.endVertex.position ).magnitude();
      var javaLength = length / 990 * 15.120675866835684;
      switchModel.resistance = switchModel.closed ? Math.max( MINIMUM_RESISTANCE, javaLength * switchModel.resistivity ) :
                               OPEN_RESISTANCE;
      assert && assert( !isNaN( switchModel.resistance ) );
    };

    var updateLength = function() {
      switchModel.length = switchModel.startVertex.position.distance( switchModel.endVertex.position );
    };

    var vertexMovedListener = function() {
      updateResistance();
      updateLength();
    };
    this.vertexMovedEmitter.addListener( vertexMovedListener );
    vertexMovedListener();
    this.closedProperty.link( function() {
      updateResistance();
    } );
  }

  circuitConstructionKit.register( 'Switch', Switch );

  return inherit( CircuitElement, Switch, {
    dispose: function() {
      this.disposeSwitch();
      CircuitElement.prototype.dispose.call( this );
    },
    toStateObjectWithVertexIndices: function( getVertexIndex ) {
      return _.extend( {
        resistance: this.resistance,
        resistivity: this.resistivity
      }, CircuitElement.prototype.toStateObjectWithVertexIndices.call( this, getVertexIndex ) );
    }
  } );
} );