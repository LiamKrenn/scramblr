let randomSource;
const rn = (n) => Math.floor(randomSource.random() * n);

const clock = function (register) {
  const scrambler = (function () {
    const getRandomScramble = () => {
      const moves = ['0+', '1+', '2+', '3+', '4+', '5+', '6+', '1-', '2-', '3-', '4-', '5-'];
      const pinPositions = ["UR", "UL", "DR", "DL", "UR DR DL UL", "UR DR DL", "UR DR UL", "UR DL UL", "DR DL UL", "DR UL", "UR DL", "UR DR", "DL UL", "UR UL", "DR DL", ""];
      let scramble = '';

      scramble += `UR${moves[rn(12)]} DR${moves[rn(12)]} DL${moves[rn(12)]} UL${moves[rn(12)]} U${moves[rn(12)]} R${moves[rn(12)]} D${moves[rn(12)]} L${moves[rn(12)]} ALL${moves[rn(12)]} y2 U${moves[rn(12)]} R${moves[rn(12)]} D${moves[rn(12)]} L${moves[rn(12)]} ALL${moves[rn(12)]} ${pinPositions[rn(16)]}`;

      return {
        scramble_string: scramble,
      };
    }

    const setRandomSource = (src) => {
      randomSource = src;
    };

    return {
      /* mark2 interface */
      version: 'July 12, 2023',
      initialize: setRandomSource,
      getRandomScramble: getRandomScramble,
      setScrambleLength: function () { return; }
    };
  })();

  register('clock', scrambler, ['clock-wca']);
}

export default clock;
