// Copyright 2020-2021, University of Colorado Boulder

/**
 * Circuits schematic mode can be rendered as IEC or IEEE
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
import Property from '../../../axon/js/Property.js';
import CCKCQueryParameters from '../CCKCQueryParameters.js';
import circuitConstructionKitCommon from '../circuitConstructionKitCommon.js';
import SchematicType from './SchematicType.js';

const schematicTypeProperty = new Property<SchematicType>( CCKCQueryParameters.schematicStandard );

circuitConstructionKitCommon.register( 'schematicTypeProperty', schematicTypeProperty );
export default schematicTypeProperty;