/* eslint-disable @typescript-eslint/no-explicit-any */
import { Rule } from 'eslint';
import type { AttributeValueNode, TextNode } from 'es-html-parser';
const Spellchecker = require('hunspell-spellchecker');
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
  const dname = dirname(require.main?.filename ?? '');

  const rootFolder = join(dname, relative(dname, options.dicFolder));
  const dict = spellchecker.parse({
    aff: readFileSync(
      join(rootFolder, `${options.dicName}.aff`)
    ),
    dic: readFileSync(
      join(rootFolder, `${options.dicName}.dic`)
    )
  });
  spellchecker.use(dict);
  return spellchecker;
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
      const regex = new RegExp(options.matchWordRegex, 'g');
      const result = node.value.match(regex)?.filter((x) => Boolean(x));
      if (!result || result.length === 0) {
        return;
      }
      result.map(x => x.toLowerCase()).forEach((r) => {
        if (wordsCache.has(r)) {
          return;
        }
        wordsCache.add(r);
        if (!dic.checkExact(r)) {
          context.report({
            node: node as any,
            message: `Нет слова в словаре "${r}"`
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
