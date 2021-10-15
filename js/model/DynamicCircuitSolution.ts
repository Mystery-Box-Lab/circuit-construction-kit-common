import DynamicCircuit from './DynamicCircuit';
import ModifiedNodalAnalysisSolution from './ModifiedNodalAnalysisSolution';
import ModifiedNodalAnalysisCircuitElement from './ModifiedNodalAnalysisCircuitElement';
import CapacitorAdapter from './CapacitorAdapter.js';
import InductorAdapter from './InductorAdapter.js';

class DynamicCircuitSolution {
  circuit: DynamicCircuit;
  mnaSolution: ModifiedNodalAnalysisSolution;
  currentCompanions: any;

  /**
   * @param {DynamicCircuit} circuit
   * @param {ModifiedNodalAnalysisSolution} mnaSolution
   * @param {{element:ModifiedNodalAnalysisCircuitElement,getValueForSolution(ModifiedNodalAnalysisSolution):number}[]} currentCompanions
   * @constructor
   */
  constructor( circuit: DynamicCircuit, mnaSolution: ModifiedNodalAnalysisSolution, currentCompanions: any ) {
    // @public
    this.circuit = circuit;
    this.mnaSolution = mnaSolution;
    this.currentCompanions = currentCompanions;
  }

  /**
   * @param {number} nodeIndex - index
   * @returns {number}
   * @public
   */
  getNodeVoltage( nodeIndex: number | string ) {
    return this.mnaSolution.getNodeVoltage( nodeIndex );
  }

  /**
   * @param {ModifiedNodalAnalysisCircuitElement|CapacitorAdapter|InductorAdapter} element
   * @returns {number}
   * @public
   */
  getCurrent( element: ModifiedNodalAnalysisCircuitElement | CapacitorAdapter | InductorAdapter ) {

    // For resistors with r>0, Ohm's Law gives the current.  For components with no resistance (like closed switch or
    // 0-resistance battery), the current is given by the matrix solution.
    // @ts-ignore
    if ( element.hasOwnProperty( 'currentSolution' ) && element.currentSolution !== null ) {
      // @ts-ignore
      return element.currentSolution;
    }

    // Support
    const companion = _.find( this.currentCompanions, c => c.element === element ||
                                                           c.element.dynamicCircuitCapacitor === element ||
                                                           c.element.dynamicCircuitInductor === element );

    if ( companion ) {
      return companion.getValueForSolution( this.mnaSolution );
    }
    else {
      return this.mnaSolution.getCurrentForResistor( element );
    }
  }

  /**
   * @param {ModifiedNodalAnalysisCircuitElement} element
   * @returns {number}
   * @public
   */
  getVoltage( element: ModifiedNodalAnalysisCircuitElement ) {
    return this.getNodeVoltage( element.nodeId1 ) - this.getNodeVoltage( element.nodeId0 );
  }
}

export default DynamicCircuitSolution;