
import { RuleTester as ESLintRuleTester } from 'eslint';
import { TsSpellchekerRule } from './ts-spellchecker';

const FILE_NAME = 'test.html';

export class RuleTester extends ESLintRuleTester {
  constructor(options) {
    super(options);
  }
  run(name, rule, tests) {
    super.run(name, rule, {
      valid: tests.valid.map((test) => ({
        ...test,
        filename: FILE_NAME
      })),
      invalid: tests.invalid.map((test) => ({
        ...test,
        filename: FILE_NAME
      }))
    });
  }

  public static createRuleTester() {
    return new RuleTester({
      parser: require.resolve('@typescript-eslint/parser')
    });
  }
}

const ruleTester = RuleTester.createRuleTester();

ruleTester.run('TsSpecllcheckRule', TsSpellchekerRule, {
  valid: [
    {
      code: `const testFunction = (text: string) => {
        const obj = {
          desc: 'Тупо описание'
        }
        const x: 'Круто' | 'Не круто' = 'Круто';
        return x + '_нормально';
      }`,
      options: [
        {
          dicFolder: './dics/ru'
        }
      ]
    }
  ],
  invalid: []
});
