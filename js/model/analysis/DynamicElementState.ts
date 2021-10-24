// Copyright 2021, University of Colorado Boulder
class DynamicElementState {
  readonly voltage: number; // the voltage drop v1-v0
  readonly current: number; // the conventional current as it moves from node 0 to node 1

  constructor( voltage: number, current: number ) {
    this.voltage = voltage;
    this.current = current;
  }
}

export default DynamicElementState;