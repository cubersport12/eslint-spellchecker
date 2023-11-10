import { Rule } from 'eslint';
import type { TextNode, AttributeValueNode } from 'es-html-parser';

const meta: Rule.RuleMetaData = {
  docs: {
    description: 'enforce consistent array types',
    category: 'Best Practices',
    recommended: true
  },
  fixable: null,
  schema: [],
  type: 'problem',
  hasSuggestions: true
};

const create = (context: Rule.RuleContext) => {
  return {
    [['Text', 'AttributeValue'].join(',')](
      node: TextNode | AttributeValueNode
    ) {
      console.info('---------------------- node', node.value);
    }
  };
};

export const SpellcheckRule: Rule.RuleModule = {
  create: create as any,
  meta
};
