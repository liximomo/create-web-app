import Transformer from './Transformer';
import { HELPER_RULE } from '../HelperTypes';

class RuleTransformer extends Transformer {
  static transform(output) {

  }

  constructor(value) {
    super(value);
    this.$$typeof = HELPER_RULE;
  }
}
