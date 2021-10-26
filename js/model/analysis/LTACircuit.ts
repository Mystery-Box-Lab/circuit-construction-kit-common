// Copyright 2019-2021, University of Colorado Boulder

/**
 * There are two parts to solving a dynamic circuit:
 * 1. Splitting up dynamic components such as capacitors and inductors into their respective linear companion models.
 * 2. Adjusting the dt so that integration steps are accurate.  This is done through TimestepSubdivisions.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import CCKCQueryParameters from '../../CCKCQueryParameters.js';
import LTAStateSet from './LTAStateSet.js';
import circuitConstructionKitCommon from '../../circuitConstructionKitCommon.js';
import MNACircuit from './mna/MNACircuit.js';
import TimestepSubdivisions from './TimestepSubdivisions.js';
import LTASolution from './LTASolution.js';
import LTAState from './LTAState.js';
import LTAInductor from './LTAInductor.js';
import LTACapacitor from './LTACapacitor.js';
import MNASolution from './mna/MNASolution.js';
import LTAResistiveBattery from './LTAResistiveBattery.js';
import MNABattery from './mna/MNABattery.js';
import MNAResistor from './mna/MNAResistor.js';
import MNACurrent from './mna/MNACurrent.js';
import CoreModel from './CoreModel.js';

type DistanceParams = { getCharacteristicArray: () => number[]; };

class LTACircuit {
  private readonly ltaResistors: MNAResistor[];
  private readonly ltaBatteries: LTAResistiveBattery[];
  readonly ltaCapacitors: LTACapacitor[];
  readonly ltaInductors: LTAInductor[];

  constructor( ltaResistors: MNAResistor[],
               ltaBatteries: LTAResistiveBattery[],
               ltaCapacitors: LTACapacitor[],
               ltaInductors: LTAInductor[] ) {

    // @private
    this.ltaResistors = ltaResistors;
    this.ltaBatteries = ltaBatteries;
    this.ltaCapacitors = ltaCapacitors;
    this.ltaInductors = ltaInductors;
  }

  /**
   * Solving the companion model is the same as propagating forward in time by dt.
   *
   * @param {number} dt
   * @returns {LTASolution}
   * @public
   */
  solvePropagate( dt: number ) {

    const companionBatteries: MNABattery[] = [];
    const companionResistors: MNAResistor[] = [];
    const currentCompanions: { element: CoreModel, getValueForSolution: ( solution: MNASolution ) => number }[] = [];

    // Node indices that have been used
    let syntheticNodeIndex = 0;

    // Each resistive battery is a resistor in series with a battery
    this.ltaBatteries.forEach( resistiveBatteryAdapter => {
      const newNode = 'syntheticNode' + ( syntheticNodeIndex++ );

      const idealBattery = new MNABattery( resistiveBatteryAdapter.node0, newNode, resistiveBatteryAdapter.voltage ); // final LinearCircuitSolver.Battery
      const idealResistor = new MNAResistor( newNode, resistiveBatteryAdapter.node1, resistiveBatteryAdapter.resistance ); // LinearCircuitSolver.Resistor
      companionBatteries.push( idealBattery );
      companionResistors.push( idealResistor );

      // We need to be able to get the current for this component
      currentCompanions.push( {
        element: resistiveBatteryAdapter,
        getValueForSolution: ( solution: MNASolution ) => {
          return solution.getSolvedCurrent( idealBattery );
        }
      } );
    } );

    // Add companion models for capacitor

    // TRAPEZOIDAL: battery and resistor in series.
    // We use trapezoidal rather than backward Euler because we do not model current sources and it seems to work well.
    // See http://circsimproj.blogspot.com/2009/07/companion-models.html
    // Veq = V + dt*I/2/C;
    // Req = dt/2/C
    this.ltaCapacitors.forEach( ltaCapacitor => {
      assert && assert( dt >= 0, 'dt should be non-negative' );

      const newNode1 = 'syntheticNode' + ( syntheticNodeIndex++ );
      const newNode2 = 'syntheticNode' + ( syntheticNodeIndex++ );

      const companionResistance = dt / 2.0 / ltaCapacitor.capacitance;
      const resistanceTerm = CCKCQueryParameters.capacitorResistance;

      // The capacitor is modeled as a battery in series with a resistor.  Hence the voltage drop across the capacitor
      // is equal to the voltage drop across the battery plus the voltage drop across the resistor.
      // V = Vbattery + Vresistor.  We need to solve for the voltage across the battery to use it in the companion
      // model, so we have Vbattery = V-Vresistor.  The magnitude of the voltage drop across the resistor is given by
      // |V|=|IReq| and sign is unchanged since the conventional current flows from high to low voltage.
      const companionVoltage = ltaCapacitor.voltage - companionResistance * ltaCapacitor.current;

      const battery = new MNABattery( ltaCapacitor.node0, newNode1, companionVoltage );
      const resistor = new MNAResistor( newNode1, newNode2, companionResistance );
      const resistor2 = new MNAResistor( newNode2, ltaCapacitor.node1, resistanceTerm );

      companionBatteries.push( battery );
      companionResistors.push( resistor );
      companionResistors.push( resistor2 );

      ltaCapacitor.capacitorVoltageNode1 = newNode2;

      // We need to be able to get the current for this component. In series, so the current is the same through both.
      currentCompanions.push( {
        element: ltaCapacitor,
        getValueForSolution: ( solution: MNASolution ) => solution.getCurrentForResistor( resistor )
      } );
    } );

    // See also http://circsimproj.blogspot.com/2009/07/companion-models.html, which reports:
    // Req = 2L/dt
    // Veq = -2Li/dt-v
    // See najm page 279 and Pillage page 86
    this.ltaInductors.forEach( ltaInductor => {

      // In series
      const newNode = 'syntheticNode' + ( syntheticNodeIndex++ );

      const companionResistance = 2 * ltaInductor.inductance / dt;
      const companionVoltage = -ltaInductor.voltage - companionResistance * ltaInductor.current;

      const battery = new MNABattery( ltaInductor.node0, newNode, companionVoltage );
      const resistor = new MNAResistor( newNode, ltaInductor.node1, companionResistance );
      companionBatteries.push( battery );
      companionResistors.push( resistor );

      // we need to be able to get the current for this component
      // in series, so current is same through both companion components
      currentCompanions.push( {
        element: ltaInductor,
        // TODO: This sign looks very wrong https://github.com/phetsims/circuit-construction-kit-common/issues/758
        getValueForSolution: ( solution: MNASolution ) => -solution.getCurrentForResistor( resistor )
      } );
    } );

    const newBatteryList = companionBatteries;
    const newResistorList = [ ...this.ltaResistors, ...companionResistors ];
    const newCurrentList: MNACurrent[] = []; // Placeholder for if we add other circuit elements in the future

    const mnaCircuit = new MNACircuit( newBatteryList, newResistorList, newCurrentList );

    const mnaSolution = mnaCircuit.solve();
    return new LTASolution( this, mnaSolution, currentCompanions );
  }

  /**
   * @param {TimestepSubdivisions} timestepSubdivisions
   * @param {number} dt
   * @returns {LTAStateSet}
   * @public
   */
  solveWithSubdivisions( timestepSubdivisions: TimestepSubdivisions<LTAState>, dt: number ) {
    const steppable = {
      update: ( a: { update: ( dt: number ) => LTAState; }, dt: number ) => a.update( dt ),
      distance: ( a: DistanceParams, b: DistanceParams ) => euclideanDistance( a.getCharacteristicArray(), b.getCharacteristicArray() )
    };

    // Turning the error threshold too low here can fail the inductor tests in MNATestCase
    const x = timestepSubdivisions.stepInTimeWithHistory( new LTAState( this, null ), steppable, dt );
    return new LTAStateSet( x );
  }

  /**
   * @param {number} dt
   * @returns {LTAStateSet}
   * @private
   */
  solveWithSubdivisions2( dt: number ) {
    return this.solveWithSubdivisions( new TimestepSubdivisions(), dt );
  }

  /**
   * @param {number} dt
   * @returns {LTACircuit}
   * @private
   */
  updateWithSubdivisions( dt: number ) {
    return this.solveWithSubdivisions2( dt ).getFinalState().ltaCircuit;
  }

  /**
   * @param {number} dt
   * @returns {LTASolution}
   * @public (unit-tests)
   */
  solveItWithSubdivisions( dt: number ) {
    return this.solveWithSubdivisions2( dt ).getFinalState().ltaSolution;
  }

  /**
   * @param {number} dt
   * @returns {LTACircuit}
   * @public
   */
  update( dt: number ) {
    return this.updateCircuit( this.solvePropagate( dt ) );
  }

  /**
   * Applies the specified solution to the circuit.
   *
   * @param {LTASolution} solution
   * @returns {LTACircuit}
   * @public
   */
  updateCircuit( solution: LTASolution ) {
    const updatedCapacitors = this.ltaCapacitors.map( ltaCapacitor => {
      // TODO: This may have something to do with it?  https://github.com/phetsims/circuit-construction-kit-common/issues/758
      return new LTACapacitor(
        ltaCapacitor.id,
        ltaCapacitor.node0,
        ltaCapacitor.node1,
        solution.getVoltage( ltaCapacitor.node0, ltaCapacitor.capacitorVoltageNode1! ),
        solution.getCurrentForCompanion( ltaCapacitor ),
        ltaCapacitor.capacitance );
    } );
    const updatedInductors = this.ltaInductors.map( ltaInductor => {

      // TODO: This may have something to do with it? https://github.com/phetsims/circuit-construction-kit-common/issues/758
      return new LTAInductor(
        ltaInductor.id,
        ltaInductor.node0,
        ltaInductor.node1,
        solution.getVoltage( ltaInductor.node0, ltaInductor.node1 ),
        solution.getCurrentForCompanion( ltaInductor ),
        ltaInductor.inductance
      );
    } );

    return new LTACircuit( this.ltaResistors, this.ltaBatteries, updatedCapacitors, updatedInductors );
  }
}

/**
 * @param {number[]} x
 * @param {number[]} y
 * @returns {number}
 */
const euclideanDistance = ( x: number[], y: number[] ) => {
  assert && assert( x.length === y.length, 'Vector length mismatch' );
  let sumSqDiffs = 0;
  for ( let i = 0; i < x.length; i++ ) {
    sumSqDiffs += Math.pow( x[ i ] - y[ i ], 2 );
  }
  return Math.sqrt( sumSqDiffs );
};

circuitConstructionKitCommon.register( 'LTACircuit', LTACircuit );
export default LTACircuit;