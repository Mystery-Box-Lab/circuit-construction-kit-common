// Copyright 2019-2021, University of Colorado Boulder

/**
 * Takes a Circuit, creates a corresponding LTACircuit, solves the LTACircuit and applies the results back
 * to the original Circuit.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import CCKCQueryParameters from '../../CCKCQueryParameters.js';
import circuitConstructionKitCommon from '../../circuitConstructionKitCommon.js';
import Capacitor from '../Capacitor.js';
import LTACircuit from './LTACircuit.js';
import Fuse from '../Fuse.js';
import Inductor from '../Inductor.js';
import LightBulb from '../LightBulb.js';
import Resistor from '../Resistor.js';
import SeriesAmmeter from '../SeriesAmmeter.js';
import Switch from '../Switch.js';
import TimestepSubdivisions from './TimestepSubdivisions.js';
import VoltageSource from '../VoltageSource.js';
import Wire from '../Wire.js';
import Circuit from '../Circuit.js';
import LTAState from './LTAState.js';
import Vertex from '../Vertex.js';
import CircuitElement from '../CircuitElement.js';
import CCKCConstants from '../../CCKCConstants.js';
import LTAResistiveBattery from './LTAResistiveBattery.js';
import LTAInductor from './LTAInductor.js';
import CCKCUtils from '../../CCKCUtils.js';
import LTACapacitor from './LTACapacitor.js';
import MNAResistor from './mna/MNAResistor.js';

// constants
const TIMESTEP_SUBDIVISIONS = new TimestepSubdivisions<LTAState>();

let id = 0;

class LinearTransientAnalysis {

  /**
   * Solves the system with Modified Nodal Analysis, and apply the results back to the Circuit.
   * @param {Circuit} circuit
   * @param {number} dt
   * @public
   */
  static solveModifiedNodalAnalysis( circuit: Circuit, dt: number ) {

    const resistiveBatteryAdapters = [];
    const resistorAdapters = [];
    const dynamicCapacitors = [];
    const dynamicInductors = [];

    // Identify CircuitElements that are not in a loop with a voltage source. They will have their currents zeroed out.
    const nonParticipants = [];
    const participants = [];
    const backwardMap = new Map<any, CircuitElement>();
    for ( let i = 0; i < circuit.circuitElements.length; i++ ) {
      const circuitElement = circuit.circuitElements[ i ];

      const inLoop = circuit.isInLoop( circuitElement );

      if ( inLoop ) {
        participants.push( circuitElement );
        if ( circuitElement instanceof VoltageSource ) {
          const dynamicCircuitResistiveBattery = new LTAResistiveBattery(
            id++,
            circuitElement.startVertexProperty.value.index + '',
            circuitElement.endVertexProperty.value.index + '',
            circuitElement.voltageProperty.value,
            circuitElement.internalResistanceProperty.value
          );
          backwardMap.set( dynamicCircuitResistiveBattery, circuitElement );
          resistiveBatteryAdapters.push( dynamicCircuitResistiveBattery );
        }
        else if ( circuitElement instanceof Resistor ||
                  circuitElement instanceof Fuse ||
                  circuitElement instanceof Wire ||
                  circuitElement instanceof LightBulb ||
                  circuitElement instanceof SeriesAmmeter ||

                  // Since no closed circuit there; see below where current is zeroed out
                  ( circuitElement instanceof Switch && circuitElement.closedProperty.value ) ) {

          // If a resistor goes to 0 resistance, then we cannot compute the current through as I=V/R.  Therefore,
          // simulate a small amount of resistance.
          const resistance = circuitElement.resistanceProperty.value || CCKCConstants.MINIMUM_RESISTANCE;

          const resistorAdapter = new MNAResistor( circuitElement.startVertexProperty.value.index + '',
            circuitElement.endVertexProperty.value.index + '', null, resistance );
          backwardMap.set( resistorAdapter, circuitElement );
          resistorAdapters.push( resistorAdapter );
        }
        else if ( circuitElement instanceof Switch && !circuitElement.closedProperty.value ) {

          // no element for an open switch
        }
        else if ( circuitElement instanceof Capacitor ) {

          const dynamicCapacitor = new LTACapacitor(
            id++,
            circuitElement.startVertexProperty.value.index + '',
            circuitElement.endVertexProperty.value.index + '',
            circuitElement.mnaVoltageDrop,
            circuitElement.mnaCurrent,
            circuitElement.capacitanceProperty.value
          );
          dynamicCapacitors.push( dynamicCapacitor );
          backwardMap.set( dynamicCapacitor, circuitElement );
        }
        else if ( circuitElement instanceof Inductor ) {

          const dynamicInductor = new LTAInductor(
            id++,
            circuitElement.startVertexProperty.value.index + '',
            circuitElement.endVertexProperty.value.index + '',
            circuitElement.mnaVoltageDrop,
            circuitElement.mnaCurrent,
            circuitElement.inductanceProperty.value
          );
          backwardMap.set( dynamicInductor, circuitElement );
          dynamicInductors.push( dynamicInductor );
        }
        else {
          assert && assert( false, `Type not found: ${circuitElement.constructor.name}` );
        }
      }
      else {
        nonParticipants.push( circuitElement );
      }
    }

    const dynamicCircuit = new LTACircuit( resistorAdapters, resistiveBatteryAdapters, dynamicCapacitors, dynamicInductors );
    let circuitResult = dynamicCircuit.solveWithSubdivisions( TIMESTEP_SUBDIVISIONS, dt );

    // if any battery exceeds its current threshold, increase its resistance and run the solution again.
    // see https://github.com/phetsims/circuit-construction-kit-common/issues/245
    let needsHelp = false;

    resistorAdapters.forEach( resistorAdapter => {
      if ( resistorAdapter.circuitElement instanceof LightBulb && resistorAdapter.circuitElement.real ) {

        // @ts-ignore
        resistorAdapter.resistance = 1.0;
        needsHelp = true;
      }
    } );

    resistiveBatteryAdapters.forEach( batteryAdapter => {
      if ( Math.abs( circuitResult.getTimeAverageCurrentForCoreModel( batteryAdapter ) ) > CCKCQueryParameters.batteryCurrentThreshold ) {
        const battery = backwardMap.get( batteryAdapter ) as VoltageSource;
        batteryAdapter.resistance = battery.internalResistanceProperty.value;
        needsHelp = true;
      }
    } );

    resistorAdapters.forEach( resistorAdapter => {
      if ( resistorAdapter.circuitElement instanceof LightBulb && resistorAdapter.circuitElement.real ) {

        const logWithBase = ( value: number, base: number ) => Math.log( value ) / Math.log( base );

        const dV = circuitResult.getFinalState().dynamicCircuitSolution!.getVoltage( resistorAdapter.nodeId0, resistorAdapter.nodeId1 );
        const V = Math.abs( dV );

        const base = 2;

        // I = ln(V)
        // V=IR
        // V=ln(V)R
        // R = V/ln(V)

        // Adjust so it looks good in comparison to a standard bulb
        const coefficient = 3;

        // shift by base so at V=0 the log is 1
        resistorAdapter.resistance = 10 + coefficient * V / logWithBase( V + base, base );
        resistorAdapter.circuitElement.resistanceProperty.value = resistorAdapter.resistance;
      }
    } );

    if ( needsHelp ) {
      // TODO: Could this be causing https://github.com/phetsims/circuit-construction-kit-common/issues/758 ?
      circuitResult = dynamicCircuit.solveWithSubdivisions( TIMESTEP_SUBDIVISIONS, dt );
    }

    resistiveBatteryAdapters.forEach( batteryAdapter => {
      const circuitElement = backwardMap.get( batteryAdapter ) as VoltageSource;
      circuitElement.currentProperty.value = circuitResult.getTimeAverageCurrentForCoreModel( batteryAdapter );
    } );
    resistorAdapters.forEach( resistorAdapter => {
      const circuitElement = backwardMap.get( resistorAdapter )!;
      circuitElement.currentProperty.value = circuitResult.getTimeAverageCurrent( resistorAdapter );
    } );
    dynamicCapacitors.forEach( dynamicCapacitor => {
      const capacitor = backwardMap.get( dynamicCapacitor ) as Capacitor;
      capacitor.currentProperty.value = circuitResult.getTimeAverageCurrentForCoreModel( dynamicCapacitor );
      capacitor.mnaCurrent = CCKCUtils.clampMagnitude( circuitResult.getInstantaneousCurrentForCoreModel( dynamicCapacitor ) );
      capacitor.mnaVoltageDrop = CCKCUtils.clampMagnitude( circuitResult.getInstantaneousVoltageForCoreModel( dynamicCapacitor ) );

      assert && assert( Math.abs( capacitor.mnaCurrent ) < 1E100, 'mnaCurrent out of range' );
      assert && assert( Math.abs( capacitor.mnaVoltageDrop ) < 1E100, 'mnaVoltageDrop out of range' );
    } );
    dynamicInductors.forEach( dynamicInductor => {

      const inductor = backwardMap.get( dynamicInductor ) as Inductor;

      // TODO: This line is seemingly wrong https://github.com/phetsims/circuit-construction-kit-common/issues/758
      inductor.currentProperty.value = -circuitResult.getTimeAverageCurrentForCoreModel( dynamicInductor );
      inductor.mnaCurrent = CCKCUtils.clampMagnitude( circuitResult.getInstantaneousCurrentForCoreModel( dynamicInductor ) );
      inductor.mnaVoltageDrop = CCKCUtils.clampMagnitude( circuitResult.getInstantaneousVoltageForCoreModel( dynamicInductor ) );
      assert && assert( Math.abs( inductor.mnaCurrent ) < 1E100, 'mnaCurrent out of range' );
      assert && assert( Math.abs( inductor.mnaVoltageDrop ) < 1E100, 'mnaVoltageDrop out of range' );
    } );

    // zero out currents on open branches
    nonParticipants.forEach( circuitElement => circuitElement.currentProperty.set( 0 ) );

    const solvedVertices: Vertex[] = [];
    const unsolvedVertices: Vertex[] = [];

    // Apply the node voltages to the vertices
    circuit.vertexGroup.forEach( vertex => {
      const voltage = circuitResult.getFinalState().dynamicCircuitSolution!.getNodeVoltage( vertex.index + '' );

      if ( typeof voltage === 'number' ) {
        vertex.voltageProperty.set( voltage );
        solvedVertices.push( vertex );
      }
      else {

        // Unconnected vertices like those in the black box may not have an entry in the matrix, so mark them as zero.
        // Other vertices will be visited in the search below.
        vertex.voltageProperty.set( 0 );
        unsolvedVertices.push( vertex );
      }
    } );

    // compute voltages for open branches
    // for each connected component, start at a known voltage and depth first search the graph.
    const visitVoltage = ( startVertex: Vertex, circuitElement: CircuitElement, endVertex: Vertex ) => {

      // If we already know the voltage from the matrix solution, skip it.
      if ( !solvedVertices.includes( endVertex ) ) {

        const sign = startVertex === circuitElement.startVertexProperty.value ? 1 : -1;

        // compute end voltage from start voltage
        if ( circuitElement instanceof Resistor || circuitElement instanceof Wire || circuitElement instanceof LightBulb ||
             ( circuitElement instanceof Switch && circuitElement.closedProperty.value ) || circuitElement instanceof Fuse ||
             circuitElement instanceof SeriesAmmeter
        ) {

          // In the general case, we would need V=IR to compute the voltage drop, but we know the current across the
          // non-participants is 0, so the voltage drop across them is also zero
          endVertex.voltageProperty.value = startVertex.voltageProperty.value;
          solvedVertices.push( endVertex );
        }
        else if ( circuitElement instanceof VoltageSource ) {
          endVertex.voltageProperty.value = startVertex.voltageProperty.value + sign * circuitElement.voltageProperty.value;
          solvedVertices.push( endVertex );
        }
        else if ( circuitElement instanceof Capacitor || circuitElement instanceof Inductor ) {
          endVertex.voltageProperty.value = startVertex.voltageProperty.value + sign * circuitElement.mnaVoltageDrop;
          solvedVertices.push( endVertex );
        }
        else if ( circuitElement instanceof Switch && !circuitElement.closedProperty.value ) {
          // for an open switch, the node voltages are independent
        }
        else {
          assert && assert( false, 'unknown circuit element type: ' + circuitElement.constructor.name );
        }
      }
    };

    const visited: Vertex[] = [];
    const dfs = ( vertex: Vertex, visit: ( v: Vertex, circuitElement: CircuitElement, opposite: Vertex ) => void ) => {
      visited.push( vertex );
      circuit.circuitElements.forEach( circuitElement => {
        if ( circuitElement.containsVertex( vertex ) ) {
          const opposite = circuitElement.getOppositeVertex( vertex );
          if ( !visited.includes( opposite ) && !( circuitElement instanceof Switch && !circuitElement.closedProperty.value ) ) {
            visit( vertex, circuitElement, opposite );
            dfs( opposite, visit );
          }
        }
      } );
    };

    // Start visiting from the solved vertices, since they have the ground truth.  Have to visit each to make sure
    // we traveled to all disconnected components
    const allVertices = [ ...solvedVertices, ...unsolvedVertices ];
    allVertices.forEach( vertex => {
      if ( !visited.includes( vertex ) ) {
        dfs( vertex, visitVoltage );
      }
    } );

    // Depth first search across the circuit to ensure current conserved at each vertex
    // circuit.checkCurrentConservation( 'before' );
    const locked = [ ...nonParticipants ];
    const visitCurrent = ( vertex: Vertex ) => circuit.conserveCurrent( vertex, locked );
    visited.length = 0;
    allVertices.forEach( vertex => dfs( vertex, visitCurrent ) );
    // circuit.checkCurrentConservation( 'after' );
  }
}

circuitConstructionKitCommon.register( 'LinearTransientAnalysis', LinearTransientAnalysis );
export default LinearTransientAnalysis;