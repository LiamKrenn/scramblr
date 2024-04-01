import { type ScramblerAliases, type Scramblers, type Register } from './types.js';
import scrambleGenerators from './scramblers/index.js';

export const scramblerAliases: ScramblerAliases = {};
export const scramblers: Scramblers = {};

export const register: Register =
  (scramblers, scramblerAliases) =>
    (name, scrambler, aliases = []) => {
      aliases.forEach((a) => {
        scramblerAliases[a.toLowerCase()] = name.toLowerCase();
      });
      scramblers[name.toLowerCase()] = scrambler;
    };

scrambleGenerators(register(scramblers, scramblerAliases));
