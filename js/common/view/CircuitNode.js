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
  var Node = require( 'SCENERY/nodes/Node' );
  var WireNode = require( 'CIRCUIT_CONSTRUCTION_KIT_BASICS/common/view/WireNode' );
  var BatteryNode = require( 'CIRCUIT_CONSTRUCTION_KIT_BASICS/common/view/BatteryNode' );
  var CCKLightBulbNode = require( 'CIRCUIT_CONSTRUCTION_KIT_BASICS/common/view/CCKLightBulbNode' );
  var ResistorNode = require( 'CIRCUIT_CONSTRUCTION_KIT_BASICS/common/view/ResistorNode' );
  var VertexNode = require( 'CIRCUIT_CONSTRUCTION_KIT_BASICS/common/view/VertexNode' );
  var Vector2 = require( 'DOT/Vector2' );
  var FixedLengthCircuitElement = require( 'CIRCUIT_CONSTRUCTION_KIT_BASICS/common/model/FixedLengthCircuitElement' );

  /**
   *
   * @param {Circuit} circuit
   * @param {CircuitConstructionKitBasicsScreenView} circuitConstructionKitBasicsScreenView - for dropping circuit element back into the toolbox
   * @constructor
   */
  function CircuitNode( circuit, circuitConstructionKitBasicsScreenView ) {
    Node.call( this );
    this.circuit = circuit;
    var circuitNode = this;

    this.batteryNodes = [];
    this.lightBulbNodes = [];
    this.wireNodes = [];
    this.resistorNodes = [];
    this.vertexNodes = [];

    var addWireNode = function( wire ) {
      var wireNode = new WireNode( circuitNode, wire );
      circuitNode.wireNodes.push( wireNode );
      circuitNode.addChild( wireNode );

      // Vertices should be in front
      // HACK ALERT TODO TODO TODO
      // The problem is that when loading from a state object the circuit element is created before the vertex nodes
      circuitNode.getVertexNode( wire.startVertex ) && circuitNode.getVertexNode( wire.startVertex ).moveToFront();
      circuitNode.getVertexNode( wire.endVertex ) && circuitNode.getVertexNode( wire.endVertex ).moveToFront();
    };
    circuit.wires.addItemAddedListener( addWireNode );
    circuit.wires.forEach( addWireNode );

    // TODO: Heavily duplicated with other removal listeners
    circuit.wires.addItemRemovedListener( function( wire ) {
      var wireNode = circuitNode.getWireNode( wire );

      circuitNode.removeChild( wireNode );

      var index = circuitNode.wireNodes.indexOf( wireNode );
      if ( index > -1 ) {
        circuitNode.wireNodes.splice( index, 1 );
      }
      wireNode.dispose();

      assert && assert( circuitNode.getWireNode( wire ) === null, 'should have been removed' );
    } );

    var addBatteryNode = function( battery ) {
      var batteryNode = new BatteryNode( circuitConstructionKitBasicsScreenView, circuitNode, battery );
      circuitNode.batteryNodes.push( batteryNode );
      circuitNode.addChild( batteryNode );
    };
    circuit.batteries.addItemAddedListener( addBatteryNode );
    circuit.batteries.forEach( addBatteryNode );

    // TODO: Heavily duplicated with other removal listeners
    circuit.batteries.addItemRemovedListener( function( battery ) {
      var batteryNode = circuitNode.getBatteryNode( battery );

      circuitNode.removeChild( batteryNode );

      var index = circuitNode.batteryNodes.indexOf( batteryNode );
      if ( index > -1 ) {
        circuitNode.batteryNodes.splice( index, 1 );
      }
      batteryNode.dispose();

      assert && assert( circuitNode.getBatteryNode( battery ) === null, 'should have been removed' );
    } );

    var addCCKLightBulbNode = function( lightBulb ) {
      var lightBulbNode = new CCKLightBulbNode( circuitConstructionKitBasicsScreenView, circuitNode, lightBulb );
      circuitNode.lightBulbNodes.push( lightBulbNode );
      circuitNode.addChild( lightBulbNode );
    };
    circuit.lightBulbs.addItemAddedListener( addCCKLightBulbNode );
    circuit.lightBulbs.forEach( addCCKLightBulbNode );
    // TODO: Heavily duplicated with other removal listeners
    circuit.lightBulbs.addItemRemovedListener( function( lightBulb ) {
      var lightBulbNode = circuitNode.getCCKLightBulbNode( lightBulb );

      circuitNode.removeChild( lightBulbNode );

      var index = circuitNode.lightBulbNodes.indexOf( lightBulbNode );
      if ( index > -1 ) {
        circuitNode.lightBulbNodes.splice( index, 1 );
      }
      lightBulbNode.dispose();

      assert && assert( circuitNode.getCCKLightBulbNode( lightBulb ) === null, 'should have been removed' );
    } );

    // TODO: When an item is dropped in the toolbox, remove it from the model
    var addResistorNode = function( resistor ) {
      var resistorNode = new ResistorNode( circuitConstructionKitBasicsScreenView, circuitNode, resistor );
      circuitNode.resistorNodes.push( resistorNode );
      circuitNode.addChild( resistorNode );
    };
    circuit.resistors.addItemAddedListener( addResistorNode );
    circuit.resistors.forEach( addResistorNode );

    // TODO: Heavily duplicated with other removal listeners
    circuit.resistors.addItemRemovedListener( function( resistor ) {
      var resistorNode = circuitNode.getResistorNode( resistor );

      circuitNode.removeChild( resistorNode );

      var index = circuitNode.resistorNodes.indexOf( resistorNode );
      if ( index > -1 ) {
        circuitNode.resistorNodes.splice( index, 1 );
      }
      resistorNode.dispose();

      assert && assert( circuitNode.getResistorNode( resistor ) === null, 'should have been removed' );
    } );

    var addVertexNode = function( vertex ) {
      var vertexNode = new VertexNode( circuitNode, vertex );
      circuitNode.vertexNodes.push( vertexNode );
      circuitNode.addChild( vertexNode );
    };
    circuit.vertices.addItemAddedListener( addVertexNode );
    circuit.vertices.addItemRemovedListener( function( vertex ) {
      var vertexNode = circuitNode.getVertexNode( vertex );

      circuitNode.removeChild( vertexNode );

      var index = circuitNode.vertexNodes.indexOf( vertexNode );
      if ( index > -1 ) {
        circuitNode.vertexNodes.splice( index, 1 );
      }
      vertexNode.dispose();

      assert && assert( circuitNode.getVertexNode( vertex ) === null, 'vertex node should have been removed' );
    } );
    circuit.vertices.forEach( addVertexNode );
  }

  return inherit( Node, CircuitNode, {
    // TODO: Duplicated
    getWireNode: function( wire ) {
      for ( var i = 0; i < this.wireNodes.length; i++ ) {
        var wireNode = this.wireNodes[ i ];
        if ( wireNode.wire === wire ) {
          return wireNode;
        }
      }
      return null;
    },
    // TODO: Duplicated
    getCCKLightBulbNode: function( lightBulb ) {
      for ( var i = 0; i < this.lightBulbNodes.length; i++ ) {
        var lightBulbNode = this.lightBulbNodes[ i ];
        if ( lightBulbNode.lightBulb === lightBulb ) {
          return lightBulbNode;
        }
      }
      return null;
    },
    getBatteryNode: function( battery ) {
      for ( var i = 0; i < this.batteryNodes.length; i++ ) {
        var batteryNode = this.batteryNodes[ i ];
        if ( batteryNode.battery === battery ) {
          return batteryNode;
        }
      }
      return null;
    },
    getResistorNode: function( resistor ) {
      for ( var i = 0; i < this.resistorNodes.length; i++ ) {
        var resistorNode = this.resistorNodes[ i ];
        if ( resistorNode.resistor === resistor ) {
          return resistorNode;
        }
      }
      return null;
    },
    getVertexNode: function( vertex ) {
      for ( var i = 0; i < this.vertexNodes.length; i++ ) {
        var vertexNode = this.vertexNodes[ i ];
        if ( vertexNode.vertex === vertex ) {
          return vertexNode;
        }
      }
      return null;
    },
    getAllDropTargets: function( vertices ) {
      var allDropTargets = [];

      for ( var i = 0; i < vertices.length; i++ ) {
        var vertex = vertices[ i ];
        var targetVertex = this.circuit.getDropTarget( vertex );
        if ( targetVertex ) {
          allDropTargets.push( { src: vertex, dst: targetVertex } );
        }
      }
      return allDropTargets;
    },
    getBestDropTarget: function( vertices ) {
      var allDropTargets = this.getAllDropTargets( vertices );
      if ( allDropTargets ) {
        var sorted = _.sortBy( allDropTargets, function( dropTarget ) {
          return dropTarget.src.unsnappedPosition.distance( dropTarget.dst.position );
        } );
        return sorted[ 0 ];
      }
      else {
        return null;
      }
    },
    startDrag: function( point, vertex, okToRotate ) {

      // If it is the edge of a fixed length circuit element, the element rotates and moves toward the mouse
      var vertexNode = this.getVertexNode( vertex ); // TODO: use event.currentTarget?
      vertexNode.startOffset = vertexNode.globalToParentPoint( point ).minus( vertex.unsnappedPosition );
    },
    drag: function( point, vertex, okToRotate ) {
      var vertexNode = this.getVertexNode( vertex ); // TODO: Is this too expensive?  Probably!
      var position = vertexNode.globalToParentPoint( point ).minus( vertexNode.startOffset );

      // If it is the edge of a fixed length circuit element, the element rotates and moves toward the mouse
      var neighbors = this.circuit.getNeighborCircuitElements( vertex );

      // Find all vertices connected by fixed length nodes.
      var vertices = this.circuit.findAllFixedVertices( vertex );

      if ( okToRotate && (neighbors.length === 1 && neighbors[ 0 ] instanceof FixedLengthCircuitElement) ) {

        vertex.position = position;
        vertex.unsnappedPosition = position;

        var oppositeVertex = neighbors[ 0 ].getOppositeVertex( vertex );

        // Find the new relative angle
        var angle = vertex.position.minus( oppositeVertex.position ).angle();

        // Maintain fixed length
        var length = neighbors[ 0 ].length;
        var relative = Vector2.createPolar( length, angle + Math.PI );
        var oppositePosition = vertex.position.plus( relative );
        var originalOppositePosition = oppositeVertex.position;
        oppositeVertex.position = oppositePosition;
        oppositeVertex.unsnappedPosition = oppositePosition;

        // Find all vertices connected by fixed length nodes.
        var vertexSubset = this.circuit.findAllFixedVertices( vertex );
        var exclude = [ vertex, oppositeVertex ];
        for ( var i = 0; i < exclude.length; i++ ) {
          var e = exclude[ i ];
          var index = vertexSubset.indexOf( e );
          if ( index > -1 ) {
            vertexSubset.splice( index, 1 );
          }
        }

        this.translateVertexGroup( vertexSubset, oppositePosition.minus( originalOppositePosition ), [ vertex ], vertices );
      }
      else {
        this.translateVertexGroup( vertices, position.minus( vertex.unsnappedPosition ), vertices, vertices );
      }

      // TODO: Keep in bounds
    },

    /**
     * Translate a group of vertices, used when dragging by a circuit element or by a one-neighbor vertex
     * @param {Array.<Vertex>} vertices
     * @param {Vector2} unsnappedDelta
     */
    translateVertexGroup: function( vertices, unsnappedDelta, attachableVertices, verticesToUpdateOnSnap ) {

      // Update the unsnapped position of the entire subgraph, i.e. where it would be if no matches are proposed.
      // Must do this before calling getBestDropTarget, because the unsnapped positions are used for target matching
      for ( var i = 0; i < vertices.length; i++ ) {
        vertices[ i ].unsnappedPosition = vertices[ i ].unsnappedPosition.plus( unsnappedDelta );
      }

      // Is there a nearby vertex any of these could snap to?  If so, move to its location temporarily.
      // Find drop targets for *any* of the dragged vertices
      var bestDropTarget = this.getBestDropTarget( attachableVertices );
      var delta = Vector2.ZERO;
      if ( bestDropTarget ) {
        delta = bestDropTarget.dst.unsnappedPosition.minus( bestDropTarget.src.unsnappedPosition );
      }

      for ( i = 0; i < verticesToUpdateOnSnap.length; i++ ) {
        verticesToUpdateOnSnap[ i ].position = verticesToUpdateOnSnap[ i ].unsnappedPosition.plus( delta );
      }
    },
    endDrag: function( event, vertex ) {

      var vertexNode = this.getVertexNode( vertex ); // TODO: Is this too expensive?  Probably!

      // Find all vertices connected by fixed length nodes.
      var vertices = this.circuit.findAllFixedVertices( vertex );

      var bestDropTarget = this.getBestDropTarget( vertices );
      if ( bestDropTarget ) {
        this.circuit.connect( bestDropTarget.src, bestDropTarget.dst );

        // Set the new reference point for next drag
        for ( var i = 0; i < vertices.length; i++ ) {
          vertices[ i ].unsnappedPosition = vertices[ i ].position;
        }
      }
      vertexNode.startOffset = null;

      // Signify that something has been dropped in the play area.
      // TODO: Don't signify this if something dropped in the toolbox // TODO: Why not?
      this.circuit.circuitElementDroppedEmitter.emit();
    }
  } );
} );