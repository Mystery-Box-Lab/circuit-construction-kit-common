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
  var Line = require( 'SCENERY/nodes/Line' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var CircuitConstructionKitBasicsConstants = require( 'CIRCUIT_CONSTRUCTION_KIT_BASICS/CircuitConstructionKitBasicsConstants' );

  // constants
  var WIRE_LINE_WIDTH = 12; // screen coordinates

  /**
   *
   * @constructor
   */
  function WireNode( circuitConstructionKitBasicsScreenView, circuitNode, wire ) {
    var wireNode = this;
    this.wire = wire;
    this.circuitElement = wire; // polymorphism with FixedLengthCircuitElementNode.  TODO: Common parent class?

    Line.call( this, 0, 0, 100, 100, {
      stroke: CircuitConstructionKitBasicsConstants.wireColor,
      lineWidth: WIRE_LINE_WIDTH,
      cursor: 'pointer',
      strokePickable: true,
      lineCap: 'round'
    } );

    var startListener = function( startPoint ) {
      wireNode.setPoint1( startPoint );
    };

    // There is a double nested property, since the vertex may change and the position may change
    var updateStartVertex = function( newStartVertex, oldStartVertex ) {
      oldStartVertex && oldStartVertex.positionProperty.unlink( startListener );
      newStartVertex.positionProperty.link( startListener );
    };
    wire.startVertexProperty.link( updateStartVertex );

    var endListener = function( endPoint ) {
      wireNode.setPoint2( endPoint );
    };
    var updateEndVertex = function( newEndVertex, oldEndVertex ) {
      oldEndVertex && oldEndVertex.positionProperty.unlink( endListener );
      newEndVertex.positionProperty.link( endListener );
    };
    wire.endVertexProperty.link( updateEndVertex );

    this.inputListener = new SimpleDragHandler( {
      start: function( event ) {
        circuitNode.startDrag( event.pointer.point, wire.startVertex, false );
        circuitNode.startDrag( event.pointer.point, wire.endVertex, false );
      },
      drag: function( event ) {
        circuitNode.drag( event.pointer.point, wire.startVertex, false );
        circuitNode.drag( event.pointer.point, wire.endVertex, false );
      },
      end: function( event ) {

        // If over the toolbox, then drop into it, and don't process further
        if ( circuitConstructionKitBasicsScreenView.canNodeDropInToolbox( wireNode ) ) {
          circuitConstructionKitBasicsScreenView.dropCircuitElementNodeInToolbox( wireNode );
          return;
        }

        circuitNode.endDrag( event, wire.startVertex );
        circuitNode.endDrag( event, wire.endVertex );
      }
    } );
    wire.interactive && wireNode.addInputListener( this.inputListener );
    this.disposeWireNode = function() {
      wireNode.inputListener.dragging && wireNode.inputListener.endDrag();

      wire.startVertexProperty.unlink( updateStartVertex );
      wire.endVertexProperty.unlink( updateEndVertex );
    };
  }

  return inherit( Line, WireNode, {
    dispose: function() {
      this.disposeWireNode();
    }
  } );
} );