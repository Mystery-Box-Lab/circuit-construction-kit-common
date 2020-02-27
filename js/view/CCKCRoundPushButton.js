// Copyright 2019, University of Colorado Boulder

/**
 * Base type for buttons that appear in the CircuitElementEditPanels
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import merge from '../../../phet-core/js/merge.js';
import PhetColorScheme from '../../../scenery-phet/js/PhetColorScheme.js';
import RoundPushButton from '../../../sun/js/buttons/RoundPushButton.js';
import circuitConstructionKitCommon from '../circuitConstructionKitCommon.js';

class CCKCRoundPushButton extends RoundPushButton {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {
    super( merge( {
      baseColor: PhetColorScheme.BUTTON_YELLOW,
      minXMargin: 10,
      minYMargin: 10,

      // TODO(phet-io): These elements will need to be members of a PhetioGroup
      phetioState: false,
      phetioComponentOptions: {
        phetioState: false
      }
    }, options ) );
  }
}

circuitConstructionKitCommon.register( 'CCKCRoundPushButton', CCKCRoundPushButton );
export default CCKCRoundPushButton;