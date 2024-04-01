import { hashCode } from './util';
import { scramblers, scramblerAliases, register } from './scramblers';
import { type Seed, type Scramble, type Scrambler } from './types';

export class Scrambow {
  type = '333';
  length = 20;
  seed: Seed = Math;
  args: string[] = [];

  constructor(type?: string, length?: number) {
    this.setLength(length || this.length);
    this.setType(type || this.type);
  }

  init(): void {
    if (!scramblers.hasOwnProperty(this.type)) {
      throw new Error(
        `Invalid scrambler, allowed: ${Object.keys(scramblers).join(', ')}`
      );
    }

    scramblers[this.type].initialize(this.seed);
  }

  get(num = 1): Scramble[] {
    const stack = Array<Scramble>(num);

    for (let i = 0; i < num; i++) {
      stack[i] = scramblers[this.type].getRandomScramble(this.args);
    }

    return stack;
  }

  setType(type?: string): this {
    if (!type) {
      return this;
    }

    this.type = this.getType(type);

    this.init();

    return this;
  }

  private getType(type: string) {
    const lowerType = type.toLowerCase();
    if (scramblerAliases.hasOwnProperty(lowerType)) {
      return scramblerAliases[lowerType];
    }
    return lowerType;
  }

  setSeed(seed?: number): this {
    if (!seed) {
      return this;
    }

    const seedStr = seed.toString();
    let hash = hashCode(seedStr);

    this.seed = {
      random() {
        const x = Math.sin(hash++) * 10000;
        return x - Math.floor(x);
      },
    };

    this.init();

    return this;
  }

  setLength(length?: number): this {
    if (!length) {
      return this;
    }

    this.length = length;

    scramblers[this.type].setScrambleLength(this.length);

    return this;
  }

  setArgs(...args: string[]): this {
    if (!args.length) {
      return this;
    }

    this.args = args;

    return this;
  }

  registerCustomScrambler(
    name: string,
    scrambler: Scrambler,
    aliases: string[] = []
  ): void {
    register(scramblers, scramblerAliases)(name, scrambler, aliases);
  }
}
