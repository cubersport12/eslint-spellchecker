import { ESLintUtils } from '@typescript-eslint/utils'
import { splitWords, loadHunspellDic, OptionsType } from '@shared';

const createRule = ESLintUtils.RuleCreator(name => 'ts-spellchecker');

let dic: any;
const wordsCache = new Set<string>();


export const TsSpellschekerRule = createRule({
  create(context) {
    const options: OptionsType = context.options[0];
    if (!options.dicFolder) {
      throw new Error('dicPath not found');
    }
    if (!dic) {
      dic = loadHunspellDic(options);
    }
    return {
      Literal(node) {
        const words = splitWords(`${node.value}`, options.matchWordRegex);
        words.forEach(word => {
          if (wordsCache.has(word)) {
            return;
          }
          wordsCache.add(word);
          if (!dic.checkExact(word)) {
            context.report({
              node: node as any,
              messageId: 'misspelled',
              data: {
                word
              }
            });
          }
        });
      }
    }
  },
  name: 'ts-spellchecker',
  meta: {
    docs: {
      description: 'Spellchecker',
      recommended: 'recommended'
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
    messages: {
      misspelled: 'Нет слова в словаре "{{word}}"'
    },
    type: 'problem',
    hasSuggestions: true
  },
  defaultOptions: [],
})