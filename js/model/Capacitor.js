// Copyright 2019, University of Colorado Boulder

/**
 * Model for a capacitor.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const CCKCConstants = require( 'CIRCUIT_CONSTRUCTION_KIT_COMMON/CCKCConstants' );
  const circuitConstructionKitCommon = require( 'CIRCUIT_CONSTRUCTION_KIT_COMMON/circuitConstructionKitCommon' );
  const FixedCircuitElement = require( 'CIRCUIT_CONSTRUCTION_KIT_COMMON/model/FixedCircuitElement' );
  const NumberProperty = require( 'AXON/NumberProperty' );

  // constants
  const CAPACITOR_LENGTH = CCKCConstants.CAPACITOR_LENGTH;

  class Capacitor extends FixedCircuitElement {

    /**
     * @param {Vertex} startVertex
     * @param {Vertex} endVertex
     * @param {Tandem} tandem
     * @param {Object} [options]
     */
    constructor( startVertex, endVertex, tandem, options ) {
      options = _.extend( {
        capacitance: CCKCConstants.DEFAULT_CAPACITANCE
      }, options );

      super( startVertex, endVertex, CAPACITOR_LENGTH, tandem, options );

      // @public {Property.<number>} the capacitance in farads
      this.capacitanceProperty = new NumberProperty( options.capacitance );

      // TODO: factor out to a parent type for Capacitor and Inductor
      this.mnaVoltageDrop = 0;
      this.mnaCurrent = 0;
    }

    /**
     * Get the properties so that the circuit can be solved when changed.
     * @override
     * @returns {Property.<*>[]}
     * @public
     */
    getCircuitProperties() {
      return [ this.capacitanceProperty ];
    }

    /**
     * Get all intrinsic properties of this object, which can be used to load it at a later time.
     * @returns {Object}
     * @public
     */
    toIntrinsicStateObject() {
      const parent = super.toIntrinsicStateObject();
      return _.extend( parent, {
        capacitance: this.capacitanceProperty.value
      } );
    }
  }

  return circuitConstructionKitCommon.register( 'Capacitor', Capacitor );
} );