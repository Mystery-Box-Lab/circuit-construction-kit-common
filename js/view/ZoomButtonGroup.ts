// Copyright 2017-2022, University of Colorado Boulder

/**
 * The panel that appears in the bottom left which can be used to zoom in and out on the circuit. Exists for the life
 * of the sim and hence does not require a dispose implementation.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import NumberProperty from '../../../axon/js/NumberProperty.js';
import { combineOptions } from '../../../phet-core/js/optionize.js';
import MagnifyingGlassZoomButtonGroup, { MagnifyingGlassZoomButtonGroupOptions } from '../../../scenery-phet/js/MagnifyingGlassZoomButtonGroup.js';
import PhetColorScheme from '../../../scenery-phet/js/PhetColorScheme.js';
import RectangularButton from '../../../sun/js/buttons/RectangularButton.js';
import Tandem from '../../../tandem/js/Tandem.js';
import circuitConstructionKitCommon from '../circuitConstructionKitCommon.js';

// constants
const ZOOMED_IN = 1;
const ZOOMED_OUT = 0.5;
const BUTTON_SPACING = 20;

export default class ZoomButtonGroup extends MagnifyingGlassZoomButtonGroup {
  public static readonly ZOOMED_IN = ZOOMED_IN;
  public static readonly ZOOMED_OUT = ZOOMED_OUT;

  public constructor( selectedZoomProperty: NumberProperty, providedOptions?: MagnifyingGlassZoomButtonGroupOptions ) {
    providedOptions = combineOptions<MagnifyingGlassZoomButtonGroupOptions>( {
      spacing: BUTTON_SPACING,
      tandem: Tandem.REQUIRED,
      buttonOptions: {
        buttonAppearanceStrategy: RectangularButton.ThreeDAppearanceStrategy,
        baseColor: PhetColorScheme.BUTTON_YELLOW
      },
      magnifyingGlassNodeOptions: {
        scale: 0.7
      },
      touchAreaXDilation: 9,
      touchAreaYDilation: 10
    }, providedOptions );
    super( selectedZoomProperty, providedOptions );
  }
}

circuitConstructionKitCommon.register( 'ZoomButtonGroup', ZoomButtonGroup );