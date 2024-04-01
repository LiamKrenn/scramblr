import base from './base';

const ll = function (register) {
  const scrambler = (function (scrambler) {
    const getLLScramble = function () {
      return scrambler.customScramble(
        [0, 1, 2, 3, 4, 5, 6, 7],
        [0, 1, 2, 3, 8, 9, 10, 11],
        [0, 1, 2, 3, 4, 5, 6, 7],
        [0, 1, 2, 3, 8, 9, 10, 11],
      );
    }

    return {
      initialize: scrambler.initialize,
      setRandomSource: scrambler.setRandomSource,
      getRandomScramble: function () {
        return {
          scramble_string: getLLScramble()
        }
      },
      setScrambleLength: scrambler.setScrambleLength
    }
  })(base);

  register('cross', scrambler, ['cross']);
}

export default ll;
