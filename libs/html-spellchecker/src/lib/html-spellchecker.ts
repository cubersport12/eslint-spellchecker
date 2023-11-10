import { Rule } from 'eslint';
import type { TextNode, AttributeValueNode } from 'es-html-parser';

const meta: Rule.RuleMetaData = {
  docs: {
    description: 'enforce consistent array types',
    category: 'Best Practices',
    recommended: true
  },
  schema: [
    {
      type: 'object',
      properties: {
        matchWordRegex: { type: 'string' },
        dicPath: { type: 'string' }
      }
    }
  ],
  type: 'problem',
  hasSuggestions: true
};

const getDefaultOptions = () => ({
  matchWordRegex: '[А-Яа-я]+',
  dicPath: undefined
});

const create = (context: Rule.RuleContext) => {
  const options: ReturnType<typeof getDefaultOptions> = Object.assign(
    getDefaultOptions(),
    { ...(context.options[0] || {}) }
  );
  if (!options.dicPath) {
    throw new Error('dicPath not found');
  }
  return {
    [['Text', 'AttributeValue'].join(',')](
      node: TextNode | AttributeValueNode
    ) {
      const regex = new RegExp(options.matchWordRegex, 'g');
      const result = node.value.match(regex)?.filter((x) => Boolean(x));
      if (!result || result.length === 0) {
        return;
      }
    }
  };
};

export const SpellcheckRule: Rule.RuleModule = {
  create: create as any,
  meta
};
