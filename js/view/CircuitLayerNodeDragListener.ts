// Copyright 2020-2022, University of Colorado Boulder

/**
 * Guards against dragging immobile CircuitElementNodes and VertexNodes.
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { DragListener, DragListenerOptions, Node, PressListenerEvent } from '../../../scenery/js/imports.js';
import circuitConstructionKitCommon from '../circuitConstructionKitCommon.js';
import Vertex from '../model/Vertex.js';
import CircuitLayerNode from './CircuitLayerNode.js';

export default class CircuitLayerNodeDragListener extends DragListener {
  private readonly circuitLayerNode: CircuitLayerNode;
  private readonly vertexGetters: ( () => Vertex )[];

  /**
   * @param circuitLayerNode
   * @param vertexGetters
   * @param [providedOptions]
   */
  public constructor( circuitLayerNode: CircuitLayerNode, vertexGetters: ( () => Vertex )[], providedOptions?: DragListenerOptions<DragListener> ) {
    super( providedOptions );

    this.circuitLayerNode = circuitLayerNode;
    this.vertexGetters = vertexGetters;
  }

  /**
   * Overrides press to add a side effect to mutate Vertex.isDragging.  Cannot use canStartPress instead due to this side
   * effect.
   * @param event
   * @param [targetNode] - If provided, will take the place of the targetNode for this call. Useful for
   *                              forwarded presses.
   * @param [callback] - to be run at the end of the function, but only on success
   */
  public override press( event: PressListenerEvent, targetNode: Node | undefined, callback: () => void ): boolean {

    const vertices = this.vertexGetters.map( vertexGetter => vertexGetter() );

    const allVerticesDraggable = _.every( vertices, vertex => this.circuitLayerNode.canDragVertex( vertex ) );
    if ( allVerticesDraggable ) {

      const success = super.press( event, targetNode, callback );

      if ( success ) {
        vertices.forEach( vertex => this.circuitLayerNode.setVerticesDragging( vertex ) );
        return true;
      }
    }
    return false;
  }
}

circuitConstructionKitCommon.register( 'CircuitLayerNodeDragListener', CircuitLayerNodeDragListener );