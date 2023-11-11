/* eslint-disable @typescript-eslint/no-explicit-any */
import { Rule } from 'eslint';
import type { TextNode, AttributeValueNode } from 'es-html-parser';
import Spellchecker from 'hunspell-spellchecker';
import { dirname, join, relative } from 'path';
import { readFileSync } from 'fs';

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
        matchWordRegex: { type: 'string', default: '[А-Яа-я]+' },
        dicFolder: { type: 'string', default: './dics/ru' },
        dicName: { type: 'string', default: 'ru_RU' }
      }
    }
  ],
  type: 'problem',
  hasSuggestions: true
};

type OptionsType = {
  matchWordRegex: string;
  dicFolder: string;
  dicName: string;
};

const loadHunspellDic = (options: OptionsType) => {
  const spellchecker = new Spellchecker();
  const rootFolder = dirname(require.main?.filename ?? '');
  const dict = spellchecker.parse({
    aff: readFileSync(
      relative(rootFolder, join(options.dicFolder, `${options.dicName}.aff`))
    ),
    dic: readFileSync(
      relative(rootFolder, join(options.dicFolder, `${options.dicName}.dic`))
    )
  });
  spellchecker.use(dict);
  return spellchecker;
};

const create = (context: Rule.RuleContext) => {
  const options: OptionsType = context.options[0];
  if (!options.dicFolder) {
    throw new Error('dicPath not found');
  }
  const dic = loadHunspellDic(options);
  const wordsCache = new Set<string>();
  console.info('-----------------', dic);
  return {
    [['Text', 'AttributeValue'].join(',')](
      node: TextNode | AttributeValueNode
    ) {
      const regex = new RegExp(options.matchWordRegex, 'g');
      const result = node.value.match(regex)?.filter((x) => Boolean(x));
      if (!result || result.length === 0) {
        return;
      }
      result.forEach((r) => {
        if (wordsCache.has(r)) {
          return;
        }
        wordsCache.add(r);
        if (!dic.check(r)) {
          context.report({
            node: node as any,
            message: `Нет слова в словаре "${r}"`
          });
        }
      });
    }
  };
};

export const SpellcheckRule: Rule.RuleModule = {
  create: create as any,
  meta
};
