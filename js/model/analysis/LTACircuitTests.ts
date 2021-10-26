// Copyright 2019-2021, University of Colorado Boulder

/**
 * MNACircuit tests
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */


// modules
import LTACircuit from './LTACircuit.js';
import LTACapacitor from './LTACapacitor.js';
import LTAInductor from './LTAInductor.js';
import LTAResistiveBattery from './LTAResistiveBattery.js';
import MNAResistor from './mna/MNAResistor.js';

const ITERATIONS = 250;
QUnit.module( 'LTACircuit' );
const dt = 1 / 60;
const errorThreshold = 1E-2;

let id = 0;

const testVRCCircuit = ( v: number, r: number, c: number, assert: Assert ) => {
  const resistor = new MNAResistor( '1', '2', r );
  const battery = new LTAResistiveBattery( id++, '0', '1', v, 0 );
  const capacitor = new LTACapacitor( id++, '2', '0', 0.0, v / r, c );

  let circuit = new LTACircuit( [ resistor ], [ battery ], [ capacitor ], [] );

  for ( let i = 0; i < ITERATIONS; i++ ) {//takes 0.3 sec on my machine
    const t = i * dt;

    const companionSolution = circuit.solveItWithSubdivisions( dt );
    const voltage = companionSolution!.getVoltage( resistor.nodeId0, resistor.nodeId1 );
    const desiredVoltageAtTPlusDT = -v * Math.exp( -( t + dt ) / r / c );
    const error = Math.abs( voltage - desiredVoltageAtTPlusDT );
    assert.ok( error < errorThreshold ); // sample run indicates largest error is 1.5328E-7
    circuit = circuit.updateWithSubdivisions( dt );
  }
};

// This is for comparison with TestTheveninCapacitorRC
QUnit.test( 'testVRC991Eminus2', assert => {
  testVRCCircuit( 9, 9, 1E-2, assert );
} );

QUnit.test( 'test RC Circuit should have voltage exponentially decay with T RC for v 5 r 10 c 1E minus2', assert => {
  testVRCCircuit( 5.0, 10.0, 1.0E-2, assert );
} );

QUnit.test( 'test RC Circuit should have voltage exponentially decay with T RC for v 10 r 10 c 1E minus2', assert => {
  testVRCCircuit( 10.0, 10.0, 1.0E-2, assert );
} );

QUnit.test( 'test RC Circuit should have voltage exponentially decay with T RC for v 3  r 7  c 1Eminus1', assert => {
  testVRCCircuit( 3, 7, 1E-1, assert );
} );

QUnit.test( 'test RC Circuit should have voltage exponentially decay with T RC for v 3  r 7  c 100', assert => {
  testVRCCircuit( 3, 7, 100, assert );
} );

const testVRLCircuit = ( V: number, R: number, L: number, assert: Assert ) => {
  const resistor = new MNAResistor( '1', '2', R );
  const battery = new LTAResistiveBattery( id++, '0', '1', V, 0 );
  const inductor = new LTAInductor( id++, '2', '0', V, 0.0, L );
  let circuit = new LTACircuit( [ resistor ], [ battery ], [], [ inductor ] );

  // let x = '';
  for ( let i = 0; i < ITERATIONS; i++ ) {
    const t = i * dt;
    const solution = circuit.solveItWithSubdivisions( dt );
    const current = solution!.getCurrent( resistor )!;
    const expectedCurrent = V / R * ( 1 - Math.exp( -( t + dt ) * R / L ) );//positive, by definition of MNA.Battery
    const error = Math.abs( current - expectedCurrent );
    assert.ok( error < errorThreshold );
    // x += `${t}\t${expectedCurrent}\t${current}\t${error}\n`;
    circuit = circuit.updateWithSubdivisions( dt );
  }
  // console.log( V, R, L );
  // console.log( x );
  // console.log();
};

QUnit.test( 'test_RL_Circuit_should_have_correct_behavior_for_V_5_R_10_L_1', assert => {
  testVRLCircuit( 5, 10, 1, assert );
} );

QUnit.test( 'test_RL_Circuit_should_have_correct_behavior_for_V_3_R_11_L_2_5', assert => {
  testVRLCircuit( 3, 11, 2.5, assert );
} );

QUnit.test( 'test_RL_Circuit_should_have_correct_behavior_for_V_7_R_13_L_1E4', assert => {
  testVRLCircuit( 7, 13, 1E4, assert );
} );

QUnit.test( 'test_RL_Circuit_should_have_correct_behavior_for_V_7_R_13_L_1Eminus1', assert => {
  testVRLCircuit( 7, 13, 1E-1, assert );
} );