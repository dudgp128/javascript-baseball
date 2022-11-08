const MissionUtils = require("@woowacourse/mission-utils");
class App {
  constructor(gameResult) {
    this.gameResult = gameResult;
  }

  play() {
    let computerNum = this.selectNum();
    this.gameStart(computerNum);
  }

  selectNum() {
    const computer = new Set();
    while (computer.size < 3) {
      computer.add(MissionUtils.Random.pickNumberInRange(1, 9));
    }

    return Number([...computer].join(""));
  }

  gameStart(computer) {
    MissionUtils.Console.readLine("숫자를 입력해주세요.", (input) => {
      if (!this.isValidInput(input)) {
        throw "유효하지 않은 숫자입니다.";
      }
      this.CompareInputWithComputer(input, computer);
      if (this.gameResult.get("스트라이크") == 3) {
        this.isRetry();
      } else {
        this.gameStart(computer);
      }
    });
  }

  isValidInput(input) {
    return (
      new RegExp(/^[1-9]{3}$/).test(String(input)) && // 1부터 9까지 수로 이루어진 3자리의 수
      !new RegExp(/([1-9])\1/).test(String(input)) // 중복되는 숫자가 없는 수
    );
  }

  CompareInputWithComputer(input, computer) {
    let inputArray = this.NumberToArray(input);

    let computerArray = this.NumberToArray(computer);

    let result = new Map();
    result.set("스트라이크", null);
    result.set("볼", null);

    inputArray.forEach((e, idx) => {
      // 같은 자리수의 숫자일때, 스트라이크
      if (computerArray.indexOf(e) == idx) {
        result.set("스트라이크", result.get("스트라이크") + 1 ?? 1);
      }
      // 같은 숫자가 다른 자리수일때, 볼
      else if (computerArray.indexOf(e) != -1) {
        result.set("볼", result.get("볼") + 1 ?? 1);
      }
    });

    this.gameResult = result;
    this.printResult();
  }

  NumberToArray(number) {
    let numArray = [];
    while (number >= 1) {
      numArray.unshift(number % 10);
      number = parseInt(number / 10);
    }

    return numArray;
  }

  printResult() {
    let result = this.gameResult;

    // 볼, 스트라이크가 둘 다 null인 경우
    if (!result.get("볼") && !result.get("스트라이크")) {
      MissionUtils.Console.print("낫싱");
      // 숫자를 모두 맞춘 경우
    } else if (result.get("스트라이크") == 3) {
      MissionUtils.Console.print("3스트라이크");
      // 볼, 스트라이크 값이 있는 경우
    } else {
      let ball = result.get("볼") != null ? result.get("볼") + "볼" : "";
      let strike =
        result.get("스트라이크") != null
          ? result.get("스트라이크") + "스트라이크"
          : "";
      MissionUtils.Console.print(
        ball ? ball.concat(strike ? " " + strike : "") : strike
      );
    }
  }

  isRetry() {
    let userQuestion =
      "3개의 숫자를 모두 맞히셨습니다! 게임 종료" +
      "n게임을 새로 시작하려면 1, 종료하려면 2를 입력하세요.";

    MissionUtils.Console.readLine(userQuestion, (input) => {
      switch (input) {
        case "1":
          return this.play();
        case "2":
          MissionUtils.Console.print("게임 종료");
          break;
        default:
          throw "유효하지 않은 입력값입니다.";
      }
    });
  }
}

module.exports = App;
