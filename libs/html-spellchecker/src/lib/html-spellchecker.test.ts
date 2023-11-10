import { SpellcheckRule } from './html-spellchecker';
import { RuleTester as ESLintRuleTester } from 'eslint';

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
      parser: require.resolve('@html-eslint/parser')
    });
  }
}

const ruleTester = RuleTester.createRuleTester();

ruleTester.run('SpecllcheckRule', SpellcheckRule, {
  valid: [
    {
      code: `<div title="Заголовок">
        Правильно написан
        <button>
          Закрыть
          <i class="far fa-times"></i>
        </button>
      </div>`,
      options: [
        {
          dicPath: 'C:/adasd/'
        }
      ]
    }
  ],
  invalid: []
});
