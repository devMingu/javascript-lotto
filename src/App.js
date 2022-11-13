const Lotto = require("./Lotto");
const MissionUtils = require("@woowacourse/mission-utils");

class App {
  constructor() {
    this.lottoPrize = {
      3: [0, 5000, "3개 일치 (5,000원) -"],
      4: [0, 50000, "4개 일치 (50,000원) -"],
      5: [0, 1500000, "5개 일치 (1,500,000원) -"],
      6: [0, 30000000, "5개 일치, 보너스 볼 일치 (30,000,000원) -"],
      7: [0, 2000000000, "6개 일치 (2,000,000,000원) -"],
    };
    this.purchaseMoney;
  }

  play() {
    this.userInput();
  }

  userInput() {

    MissionUtils.Console.readLine("구입금액을 입력해 주세요.\n", (userMoney) => {
      this.purchaseMoney = userMoney;
      const user = this.lottoPurchase(userMoney);
      this.prizeInput(user);
    });
  }

  prizeInput(user) {
    MissionUtils.Console.readLine("\n당첨 번호를 입력해 주세요.\n", (prizeNumber) => {
      const przNum = prizeNumber.split(',');
      new Lotto(przNum);
      this.bonusInput(user, przNum);
    });
  }

  bonusInput(user, przNum) {
    MissionUtils.Console.readLine("\n보너스 번호를 입력해 주세요.\n", (bonusNumber) => {
      const bnsNum = parseInt(bonusNumber);
      if (bnsNum < 1 || bnsNum > 45) {
        throw new Error("[ERROR] 보너스 번호는 1 ~ 45사이의 번호여야 합니다.")
      }
      this.caculateResult(user, przNum, bonusNumber);
      this.showResult();
      MissionUtils.Console.close();
    });
  }

  lottoPurchase(userMoney) {
    return this.numberOfAvailablePurchase(userMoney);
  }

  numberOfAvailablePurchase(userMoney) {
    if (!(userMoney % 1000)) {
      let availablePurchaseNumber = parseInt(userMoney / 1000);
      MissionUtils.Console.print(`\n${availablePurchaseNumber}개를 구매했습니다.`);
      return this.buyRandomLotto(availablePurchaseNumber);
    }
    throw new Error(`[ERROR] 천원단위로 입력해주세요`);
  }

  buyRandomLotto(availablePurchaseNumber) {
    let randomLotto = [];
    while (availablePurchaseNumber > 0) {
      randomLotto.push(this.makeRandomLotto());
      availablePurchaseNumber--;
    }
    this.showLottoList(randomLotto);
    return randomLotto;
  }

  makeRandomLotto() {
    const randomLotto = MissionUtils.Random.pickUniqueNumbersInRange(1, 45, 6);
    return randomLotto.sort((a, b) => a - b);
  }

  showLottoList(randomLotto) {
    randomLotto.forEach((element) => {
      const answer = this.makeLottoString(element);
      MissionUtils.Console.print(answer);
    });
  }

  makeLottoString(element) {
    let answer = "";
    for (let i = 0; i < 6; i++) {
      if (i === 0) {
        answer += "[";
        answer += `${element[i]}, `;
      } else if (i === 5) {
        answer += element[i];
        answer += "]";
      } else {
        answer += `${element[i]}, `;
      }
    }
    return answer;
  }

  isBonusInPrize(prize, bonus) {
    if (prize.includes(bonus)) {
      throw new Error("[ERROR] 보너스 번호는 당첨 번호와 중복될 수 없습니다.");
    }
  }

  caculateResult(user, prize, bonus) {
    this.isBonusInPrize(prize, bonus);

    user.forEach((element) => {
      this.makeLottoPrize(element, prize, bonus);
    });
  }

  makeLottoPrize(element, prize, bonus) {
    let cnt = 0;
    for (let i = 0; i < prize.length; i++) {
      const n = parseInt(prize[i]);
      if (element.includes(n)) {
        cnt++;
      }
    }

    if (element.includes(bonus) || cnt >= 5) {
      this.lottoPrize[cnt + 1][0] += 1;
    }else if (cnt >= 3) {
      this.lottoPrize[cnt][0] += 1;
    }
  }

  showResult() {
    MissionUtils.Console.print("\n당첨 통계");
    MissionUtils.Console.print("---");

    for (let i = 3; i <= 7; i++) {
      MissionUtils.Console.print(`${this.lottoPrize[i][2]} ${this.lottoPrize[i][0]}개`);
    }

    let sum = this.totalRevenue();
    let revenue = (sum / this.purchaseMoney) * 100;
    let total = parseFloat(revenue.toFixed(2));

    MissionUtils.Console.print(
      `총 수익률은 ${total}%입니다.`
    );
  }

  totalRevenue() {
    let sum = 0;
    for (let i = 3; i <= 7; i++) {
      sum += this.lottoPrize[i][0] * this.lottoPrize[i][1];
    }
    return sum;
  }
}

const game = new App();
game.play();

module.exports = App;
