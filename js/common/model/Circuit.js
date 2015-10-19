// Copyright 2002-2015, University of Colorado Boulder

/**
 * A collection of circuit components in the play area, not necessarily connected.  (For instance it could be 2 logical
 * circuits).
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var Wire = require( 'CIRCUIT_CONSTRUCTION_KIT_BASICS/common/model/Wire' );
  var Battery = require( 'CIRCUIT_CONSTRUCTION_KIT_BASICS/common/model/Battery' );
  var LightBulb = require( 'CIRCUIT_CONSTRUCTION_KIT_BASICS/common/model/LightBulb' );
  var SnapContext = require( 'CIRCUIT_CONSTRUCTION_KIT_BASICS/common/model/SnapContext' );
  var Connection = require( 'CIRCUIT_CONSTRUCTION_KIT_BASICS/common/model/Connection' );
  var OOCircuit = require( 'CIRCUIT_CONSTRUCTION_KIT_BASICS/common/model/modified-nodal-analysis/OOCircuit' );

  /**
   *
   * @constructor
   */
  function Circuit() {

    this.wires = new ObservableArray();
    this.batteries = new ObservableArray();
    this.lightBulbs = new ObservableArray();

    // Keep track of which terminals are connected to other terminals
    this.connections = new ObservableArray();

    // Some wires for testing
    this.wires.push( new Wire() );
    this.wires.push( new Wire() );
    this.wires.push( new Wire() );

    this.lightBulbs.push( new LightBulb() );
    
    this.batteries.push( new Battery() );
  }

  return inherit( Object, Circuit, {

    // @public
    solve: function() {

      // These are just to keep lint from complaining, so that we can load these dependencies into the module system
      // for qunit tests
      new OOCircuit().solve();
    },

    // @public
    wireTerminalDragged: function( wire, terminalPositionProperty ) {
      for ( var i = 0; i < this.connections.getArray().length; i++ ) {
        var connection = this.connections.getArray()[ i ];
        if ( connection.isConnectedTo( wire, terminalPositionProperty ) ) {
          connection.setPosition( terminalPositionProperty.get() );
        }
      }
    },

    // If the proposed connection was made, would the wires overlap?  If so, do not allow them to connect.
    wouldOverlap: function( wire1, terminalPositionProperty1, wire2, terminalPositionProperty2 ) {
      return this.isConnected(
        wire1, wire1.getOppositeTerminalPositionProperty( terminalPositionProperty1 ),
        wire2, wire2.getOppositeTerminalPositionProperty( terminalPositionProperty2 )
      );
    },

    isConnected: function( wire1, terminalPositionProperty1, wire2, terminalPositionProperty2 ) {

      // see if any pre-existing connections will work
      for ( var i = 0; i < this.connections.getArray().length; i++ ) {
        var connection = this.connections.getArray()[ i ];
        if ( connection.isConnectedTo( wire1, terminalPositionProperty1 ) && connection.isConnectedTo( wire2, terminalPositionProperty2 ) ) {
          return true;
        }
      }
    },

    // @public
    connect: function( wire1, terminalPositionProperty1, wire2, terminalPositionProperty2 ) {

      var connected = false;

      // see if any pre-existing connections will work
      for ( var i = 0; i < this.connections.getArray().length; i++ ) {
        var connection = this.connections.getArray()[ i ];
        if ( connection.isConnectedTo( wire1, terminalPositionProperty1 ) ) {
          connection.addBranch( wire2, terminalPositionProperty2 );
          connected = true;
          break;
        }
        else if ( connection.isConnectedTo( wire2, terminalPositionProperty2 ) ) {
          connection.addBranch( wire1, terminalPositionProperty1 );
          connected = true;
          break;
        }
      }
      if ( !connected ) {
        this.connections.add( new Connection()
          .addBranch( wire1, terminalPositionProperty1 )
          .addBranch( wire2, terminalPositionProperty2 )
        );
      }
    },

    // @public
    getSnapContext: function() {
      return new SnapContext( this );
    }
  } );
} );