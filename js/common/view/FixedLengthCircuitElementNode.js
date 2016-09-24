// Copyright 2015-2016, University of Colorado Boulder
// TODO: Review, document, annotate, i18n, bring up to standards

/**
 *
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var circuitConstructionKitCommon = require( 'CIRCUIT_CONSTRUCTION_KIT_COMMON/circuitConstructionKitCommon' );
  var CircuitConstructionKitConstants = require( 'CIRCUIT_CONSTRUCTION_KIT_COMMON/CircuitConstructionKitConstants' );
  var Property = require( 'AXON/Property' );
  var TandemDragHandler = require( 'TANDEM/scenery/input/TandemDragHandler' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var CircuitElementNode = require( 'CIRCUIT_CONSTRUCTION_KIT_COMMON/common/view/CircuitElementNode' );
  var Matrix3 = require( 'DOT/Matrix3' );
  var Node = require( 'SCENERY/nodes/Node' );

  // phet-io modules
  var TNode = require( 'ifphetio!PHET_IO/types/scenery/nodes/TNode' );

  /**
   * @param {CircuitConstructionKitScreenView} circuitConstructionKitScreenView
   * @param circuitNode - Null if an icon is created
   * @param circuitElement
   * @param {Node} contentNode - the node that will display the component
   * @param {number} contentScale - the scale factor to apply to the image for the size in the play area (icons are automatically scaled up)
   * @param options
   * @constructor
   */
  function FixedLengthCircuitElementNode( circuitConstructionKitScreenView, circuitNode, circuitElement, contentNode,
                                          contentScale, tandem, options ) {

    var self = this;

    // Capture the original dimensions of the content node, without the highlight node
    var contentNodeHeight = contentNode.height;

    var highlightParent = new Node();

    var scratchMatrix = new Matrix3();
    var scratchMatrix2 = new Matrix3();
    options = _.extend( {
      icon: false,
      updateLayout: function( startPosition, endPosition ) {
        var angle = endPosition.minus( startPosition ).angle();

        // Update the node transform in a single step, see #66
        scratchMatrix.setToTranslation( startPosition.x, startPosition.y )
          .multiplyMatrix( scratchMatrix2.setToRotationZ( angle ) )
          .multiplyMatrix( scratchMatrix2.setToScale( contentScale ) )
          .multiplyMatrix( scratchMatrix2.setToTranslation( 0, -contentNodeHeight / 2 ) );
        contentNode.setMatrix( scratchMatrix );
        highlightNode && highlightParent.setMatrix( scratchMatrix.copy() );
      },
      highlightOptions: {}
    }, options );

    // Add highlight (but not for icons)
    if ( circuitNode ) {
      var inset = -FixedLengthCircuitElementNode.HIGHLIGHT_INSET;
      var w = options.contentWidth || contentNode.width;
      var h = options.contentHeight || contentNode.height;
      var highlightNode = new Rectangle(
        inset,
        inset,
        w / contentScale - inset * 2,
        h / contentScale - inset * 2,
        8 / contentScale,
        8 / contentScale,
        _.extend( options.highlightOptions, {
          stroke: CircuitConstructionKitConstants.highlightColor,
          lineWidth: CircuitConstructionKitConstants.highlightLineWidth / contentScale / contentScale,
          scale: contentScale,
          pickable: false
        } )
      );

      highlightParent.children = [ highlightNode ];
      circuitNode.highlightLayer.addChild( highlightParent );

      this.highlightParent = highlightParent;
    }

    // Relink when start vertex changes
    var multilink = null;
    var relink = function() {
      multilink && multilink.dispose();
      multilink = Property.multilink( [
        circuitElement.startVertex.positionProperty,
        circuitElement.endVertex.positionProperty
      ], options.updateLayout );
    };
    relink();

    var moveToFront = function() {

      // Components outside the black box do not move in front of the overlay
      if ( circuitElement.interactive ) {
        self.moveToFront();
        self.circuitElement.moveToFrontEmitter.emit();
        self.circuitElement.startVertex.moveToFrontEmitter.emit();
        self.circuitElement.endVertex.moveToFrontEmitter.emit();
      }
    };
    circuitElement.connectedEmitter.addListener( moveToFront );
    circuitElement.vertexSelectedEmitter.addListener( moveToFront );

    circuitElement.startVertexProperty.lazyLink( relink );
    circuitElement.endVertexProperty.lazyLink( relink );

    CircuitElementNode.call( this, circuitElement, {
      cursor: 'pointer',
      children: [
        contentNode
      ]
    } );

    var pickableListener = function( interactive ) {
      self.pickable = interactive;
    };
    circuitElement.interactiveProperty.link( pickableListener );

    // Use whatever the start node currently is (it can change), and let the circuit manage the dependent vertices
    var p = null;
    var didDrag = false;
    if ( !options.icon ) {
      this.inputListener = new TandemDragHandler( {
        allowTouchSnag: true,
        tandem: tandem.createTandem( 'inputListener' ), // TODO: some input listeners are 'dragHandler' let's be consistent
        start: function( event ) {
          p = event.pointer.point;
          circuitElement.interactive && circuitNode.startDrag( event.pointer.point, circuitElement.endVertex, false );
          didDrag = false;
        },
        drag: function( event ) {
          circuitElement.interactive && circuitNode.drag( event.pointer.point, circuitElement.endVertex, false );
          didDrag = true;
        },
        end: function( event ) {

          // If over the toolbox, then drop into it, and don't process further
          if ( circuitConstructionKitScreenView.canNodeDropInToolbox( self ) ) {
            circuitConstructionKitScreenView.dropCircuitElementNodeInToolbox( self );
            return;
          }

          if ( !circuitElement.interactive ) {
            return;
          }

          circuitNode.endDrag( event, circuitElement.endVertex, didDrag );

          // Only show the editor when tapped, not on every drag.
          self.maybeSelect( event, circuitNode, p );

          didDrag = false;
        }
      } );
      contentNode.addInputListener( this.inputListener );
    }

    if ( circuitNode ) {
      var updateSelectionHighlight = function( lastCircuitElement ) {
        var showHighlight = lastCircuitElement === circuitElement;
        highlightNode.visible = showHighlight;
      };
      circuitNode.circuit.selectedCircuitElementProperty.link( updateSelectionHighlight );
    }

    // Update after the highlight exists
    options.updateLayout(
      circuitElement.startVertex.position,
      circuitElement.endVertex.position
    );

    this.disposeFixedLengthCircuitElementNode = function() {
      if ( self.inputListener && self.inputListener.dragging ) {
        self.inputListener.endDrag();
      }
      multilink && multilink.dispose();
      multilink = null; // Mark null so it doesn't get disposed again in relink()

      updateSelectionHighlight && circuitNode.circuit.selectedCircuitElementProperty.unlink( updateSelectionHighlight );

      circuitElement.connectedEmitter.removeListener( moveToFront );
      circuitElement.vertexSelectedEmitter.removeListener( moveToFront );

      circuitElement.interactiveProperty.unlink( pickableListener );

      circuitNode && circuitNode.highlightLayer.removeChild( highlightParent );

      circuitElement.startVertexProperty.unlink( relink );
      circuitElement.endVertexProperty.unlink( relink );

      tandem.removeInstance( this );
    };

    tandem.addInstance( this, TNode );
  }

  circuitConstructionKitCommon.register( 'FixedLengthCircuitElementNode', FixedLengthCircuitElementNode );

  return inherit( CircuitElementNode, FixedLengthCircuitElementNode, {
    dispose: function() {
      this.disposeFixedLengthCircuitElementNode();
      CircuitElementNode.prototype.dispose.call( this );
    }
  }, {
    HIGHLIGHT_INSET: 10
  } );
} );
