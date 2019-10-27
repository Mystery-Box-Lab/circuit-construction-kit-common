// Copyright 2019, University of Colorado Boulder

/**
 * TODO: Documentation
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const ACVoltage = require( 'CIRCUIT_CONSTRUCTION_KIT_COMMON/model/ACVoltage' );
  const Battery = require( 'CIRCUIT_CONSTRUCTION_KIT_COMMON/model/Battery' );
  const Capacitor = require( 'CIRCUIT_CONSTRUCTION_KIT_COMMON/model/Capacitor' );
  const CCKCQueryParameters = require( 'CIRCUIT_CONSTRUCTION_KIT_COMMON/CCKCQueryParameters' );
  const circuitConstructionKitCommon = require( 'CIRCUIT_CONSTRUCTION_KIT_COMMON/circuitConstructionKitCommon' );
  const DynamicCircuit = require( 'CIRCUIT_CONSTRUCTION_KIT_COMMON/model/DynamicCircuit' );
  const Fuse = require( 'CIRCUIT_CONSTRUCTION_KIT_COMMON/model/Fuse' );
  const Inductor = require( 'CIRCUIT_CONSTRUCTION_KIT_COMMON/model/Inductor' );
  const LightBulb = require( 'CIRCUIT_CONSTRUCTION_KIT_COMMON/model/LightBulb' );
  const ModifiedNodalAnalysisCircuitElement = require( 'CIRCUIT_CONSTRUCTION_KIT_COMMON/model/ModifiedNodalAnalysisCircuitElement' );
  const Resistor = require( 'CIRCUIT_CONSTRUCTION_KIT_COMMON/model/Resistor' );
  const SeriesAmmeter = require( 'CIRCUIT_CONSTRUCTION_KIT_COMMON/model/SeriesAmmeter' );
  const Switch = require( 'CIRCUIT_CONSTRUCTION_KIT_COMMON/model/Switch' );
  const TimestepSubdivisions = require( 'CIRCUIT_CONSTRUCTION_KIT_COMMON/model/TimestepSubdivisions' );
  const Wire = require( 'CIRCUIT_CONSTRUCTION_KIT_COMMON/model/Wire' );

  // constants
  const errorThreshold = 1E-5;
  const minDT = 1E-5;
  const timestepSubdivisions = new TimestepSubdivisions( errorThreshold, minDT );

  class ResistiveBatteryAdapter extends DynamicCircuit.ResistiveBattery {
    constructor( c, battery ) {
      super( c.vertexGroup.array.indexOf( battery.startVertexProperty.value ), c.vertexGroup.array.indexOf( battery.endVertexProperty.value ), battery.voltageProperty.value, battery.internalResistanceProperty.value );

      // @public (read-only)
      this.battery = battery;
    }

    applySolution( result ) {

      //don't set voltage on the battery; that actually changes its nominal voltage
      // TODO: we don't need this, right?
      // this.battery.setMNACurrent( result.getInstantaneousCurrent( this ) );
      this.battery.currentProperty.value = result.getTimeAverageCurrent( this );
    }
  }

  class ResistorAdapter extends ModifiedNodalAnalysisCircuitElement {
    constructor( c, resistor ) {
      super(
        c.vertexGroup.array.indexOf( resistor.startVertexProperty.value ),
        c.vertexGroup.array.indexOf( resistor.endVertexProperty.value ),
        resistor,
        resistor.resistanceProperty.value
      );
      this.resistor = resistor;
    }

    applySolution( solution ) {
      this.resistor.currentProperty.value = solution.getTimeAverageCurrent( this );

      // TODO: is this necessary?  Where would it be used?
      //use average since it doesn't feed back in to the MNA solution
      // this.resistor.setVoltageDrop( solution.getTimeAverageVoltage( this ) );
      // this.resistor.setMNACurrent( solution.getInstantaneousCurrent( this ) ); // TODO: only used for capacitors and inductors
    }
  }

  class CapacitorAdapter extends DynamicCircuit.DynamicCapacitor {

    constructor( c, capacitor ) {
      const dynamicCircuitCapacitor = new DynamicCircuit.Capacitor(
        c.vertexGroup.array.indexOf( capacitor.startVertexProperty.value ),
        c.vertexGroup.array.indexOf( capacitor.endVertexProperty.value ),
        capacitor.capacitanceProperty.value
      );
      super( dynamicCircuitCapacitor, new DynamicCircuit.DynamicElementState( capacitor.mnaVoltageDrop, capacitor.mnaCurrent ) );
      this._capacitor = capacitor;
    }

    applySolution( solution ) {
      this._capacitor.currentProperty.value = solution.getTimeAverageCurrent( this.capacitor );
      this._capacitor.mnaCurrent = solution.getInstantaneousCurrent( this.capacitor );
      // this._capacitor.setVoltageDrop( solution.getTimeAverageVoltage( this.capacitor ) ); // TODO: is this needed?
      this._capacitor.mnaVoltageDrop = solution.getInstantaneousVoltage( this.capacitor );
    }
  }

  class InductorAdapter extends DynamicCircuit.DynamicInductor {

    constructor( c, inductor ) {
      const dynamicCircuitInductor = new DynamicCircuit.Inductor(
        c.vertexGroup.array.indexOf( inductor.startVertexProperty.value ),
        c.vertexGroup.array.indexOf( inductor.endVertexProperty.value ),
        inductor.inductanceProperty.value
      );

      //todo: sign error
      super( dynamicCircuitInductor, new DynamicCircuit.DynamicElementState( inductor.mnaVoltageDrop, -inductor.mnaCurrent ) );
      this._inductor = inductor;
    }

    applySolution( solution ) {

      // TODO: differentiate this.inductor from this._inductor.  They are very different types
      this._inductor.currentProperty.value = -solution.getTimeAverageCurrent( this.inductor );//todo: sign error
      this._inductor.mnaCurrent = -solution.getInstantaneousCurrent( this.inductor );
      // this._inductor.setVoltageDrop( solution.getTimeAverageVoltage( this.inductor ) ); // TODO: is this needed?
      this._inductor.mnaVoltageDrop = solution.getInstantaneousVoltage( this.inductor );
    }
  }

  class ModifiedNodalAnalysisAdapter {

    // TODO: Rename and documentation
    static apply( circuit, dt ) {
      const resistiveBatteryAdapters = [];
      const resistorAdapters = [];
      const capacitorAdapters = [];
      const inductorAdapters = [];
      for ( let i = 0; i < circuit.circuitElements.length; i++ ) {
        const branch = circuit.circuitElements.get( i );
        if ( branch instanceof Battery ) {
          branch.passProperty.reset(); // also resets the internalResistance for the first pass computation
          resistiveBatteryAdapters.push( new ResistiveBatteryAdapter( circuit, branch ) );
        }
        else if ( branch instanceof Resistor ||
                  branch instanceof Fuse ||
                  branch instanceof Wire ||
                  branch instanceof LightBulb ||
                  branch instanceof SeriesAmmeter ||

                  // Since no closed circuit there; see below where current is zeroed out
                  ( branch instanceof Switch && branch.closedProperty.value ) ) {
          resistorAdapters.push( new ResistorAdapter( circuit, branch ) );
        }
        else if ( branch instanceof Switch && !branch.closedProperty.value ) {

          // no element for an open switch
        }
        else if ( branch instanceof Capacitor ) {
          capacitorAdapters.push( new CapacitorAdapter( circuit, branch ) );
        }
        else if ( branch instanceof ACVoltage ) {
          resistiveBatteryAdapters.push( new ResistiveBatteryAdapter( circuit, branch ) );
        }
        else if ( branch instanceof Inductor ) {
          inductorAdapters.push( new InductorAdapter( circuit, branch ) );
        }
        else {
          assert && assert( false, 'Type not found: ' + branch.constructor.name );
        }
      }

      const dynamicCircuit = new DynamicCircuit( [], resistorAdapters, resistiveBatteryAdapters, capacitorAdapters, inductorAdapters );
      let circuitResult = dynamicCircuit.solveWithSubdivisions( timestepSubdivisions, dt );

      // if any battery exceeds its current threshold, increase its resistance and run the solution again.
      // see https://github.com/phetsims/circuit-construction-kit-common/issues/245
      let needsHelp = false;
      resistiveBatteryAdapters.forEach( batteryAdapter => {
        if ( circuitResult.getTimeAverageCurrent( batteryAdapter ) > CCKCQueryParameters.batteryCurrentThreshold ) {
          batteryAdapter.battery.passProperty.value = 2;
          batteryAdapter.resistance = batteryAdapter.battery.internalResistanceProperty.value;
          needsHelp = true;
        }
      } );
      if ( needsHelp ) {
        circuitResult = dynamicCircuit.solveWithSubdivisions( timestepSubdivisions, dt );
      }

      resistiveBatteryAdapters.forEach( batteryAdapter => batteryAdapter.applySolution( circuitResult ) );
      resistorAdapters.forEach( resistorAdapter => resistorAdapter.applySolution( circuitResult ) );
      capacitorAdapters.forEach( capacitorAdapter => capacitorAdapter.applySolution( circuitResult ) );
      inductorAdapters.forEach( inductorAdapter => inductorAdapter.applySolution( circuitResult ) );

      // zero out currents on open branches
      for ( let i = 0; i < circuit.circuitElements.length; i++ ) {
        const branch = circuit.circuitElements.get( i );
        if ( branch instanceof Switch && !branch.closedProperty.value ) {
          branch.currentProperty.value = 0.0;
          // sw.setVoltageDrop( 0.0 );
        }
      }

      // Apply the node voltages to the vertices
      circuit.vertexGroup.forEach( ( vertex, i ) => {

        // Unconnected vertices like those in the black box may not have an entry in the matrix, so mark them as zero.
        // TODO: should this average over states?
        const v = circuitResult.resultSet.states[ 0 ].state.solution.getNodeVoltage( i );
        vertex.voltageProperty.set( v || 0 );
      } );
    }
  }

  return circuitConstructionKitCommon.register( 'ModifiedNodalAnalysisAdapter', ModifiedNodalAnalysisAdapter );
} );