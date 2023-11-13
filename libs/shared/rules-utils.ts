const Spellchecker = require('hunspell-spellchecker');
import { dirname, join, relative } from 'path';
import { readFileSync } from 'fs';
import { OptionsType } from './types';

export const splitWords = (value: string, pattern: string): string[] => {
    const regex = new RegExp(pattern, 'g');
    const result = value.match(regex)?.filter((x) => Boolean(x));
    if (!result || result.length === 0) {
        return [];
    }
    return result.map(x => x.toLowerCase());
}

export const loadHunspellDic = (options: OptionsType) => {
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