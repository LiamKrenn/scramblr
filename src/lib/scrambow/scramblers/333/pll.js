import base from './base';

const pll = function (register) {
  const scrambler = (function (scrambler) {
    const getPLLScramble = function () {
      while (true) {
        let scramble = scrambler.customScramble(
          [4, 5, 6, 7],
          [8, 9, 10, 11],
          [],
          []
        );
        if (scramble.scramble_string.split(' ').length > 1) {
          return scramble;
        }
      }
    }

    return {
      initialize: scrambler.initialize,
      setRandomSource: scrambler.setRandomSource,
      getRandomScramble: function () {
        return {
          scramble_string: getPLLScramble()
        }
      },
      setScrambleLength: scrambler.setScrambleLength
    }
  })(base);

  register('pll', scrambler);
}

export default pll;
