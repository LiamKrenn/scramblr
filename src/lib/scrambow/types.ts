export interface Scramble {
  state?: string;
  scramble_string: string;
}

export interface Seed {
  random: () => number;
}

export interface Scrambler {
  initialize: (randomSource: Seed) => void;
  setRandomSource: (randomSource: Seed) => void;
  setScrambleLength: (length: number) => void;
  getRandomScramble: (args?: string[]) => Scramble;
}

export type ScramblerAliases = Record<string, string>;
export type Scramblers = Record<string, Scrambler>;

export type Register = (scramblers: Scramblers, scramblerAliases: ScramblerAliases) =>
  (name: string, scrambler: Scrambler, aliases: string[]) => void;
