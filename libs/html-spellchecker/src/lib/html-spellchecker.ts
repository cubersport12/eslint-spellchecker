/* eslint-disable @typescript-eslint/no-explicit-any */
import { Rule } from 'eslint';
import type { AttributeValueNode, TextNode } from 'es-html-parser';
import { OptionsType, loadHunspellDic, splitWords, } from '@shared';


const meta: Rule.RuleMetaData = {
  docs: {
    description: 'Spellchecker',
    category: 'Best Practices',
    recommended: true
  },
  schema: [
    {
      type: 'object',
      properties: {
        matchWordRegex: { type: 'string', default: '[А-Яа-я]+' },
        dicFolder: { type: 'string', default: './dics/ru' },
        dicName: { type: 'string', default: 'ru_RU' }
      }
    }
  ],
  type: 'problem',
  hasSuggestions: true
};

let dic: any;
const wordsCache = new Set<string>();

const create = (context: Rule.RuleContext) => {
  const options: OptionsType = context.options[0];
  if (!options.dicFolder) {
    throw new Error('dicPath not found');
  }
  if (!dic) {
    dic = loadHunspellDic(options);
  }

  return {
    [['Text', 'AttributeValue'].join(',')](
      node: TextNode | AttributeValueNode
    ) {
      const words = splitWords(node.value, options.matchWordRegex);
      words.forEach(word => {
        if (wordsCache.has(word)) {
          return;
        }
        wordsCache.add(word);
        if (!dic.checkExact(word)) {
          context.report({
            node: node as any,
            message: `Нет слова в словаре "${word}"`
          });
        }
      });
    }
  };
};

export const HtmlSpellcheckRule: Rule.RuleModule = {
  create: create as any,
  meta
};
