//get elements
const button = document.getElementById("button");
const gameContainer = document.getElementById("gameContainer");
const currentLevel = document.getElementById("level");
const second = document.getElementById("timer");
const score = document.getElementById("score");

//card pattern
const cardPool = [
  "Iron-man",
  "Thor",
  "Natasha",
  "Hawkeye",
  "Spider-man",
  "Captain",
  "wizart"
];

const game = {
  flipped: null,
  firstCard: null,
  secondCard: null,
  waitingForFlip: null,
  counting: null,
  finalScore: null,
  levelNumber: null,
  secondInnerHtml: null,
  id: null,
  cardNumber: null,
  levelContainer: null,
  gameOver: null
};

//basic setting at very beginning
function gameStartInitial() {
  gameContainer.style.display = "block";
  game.levelNumber = 1;
  currentLevel.innerHTML = game.levelNumber;
  game.waitingForFlip = false;
  game.flipped = false;
  game.firstCard = null;
  game.secondCard = null;
  second.innerHTML = 60;
  game.finalScore = 0;
  score.innerHTML = game.finalScore;
  game.counting = 0;
  game.gameOver = false;
  if (gameContainer.contains(game.levelContainer)) {
    gameContainer.removeChild(game.levelContainer);
  }
}

/*******************************************
/     UI Update
/******************************************/

function pickCardsPattern(pairNumber) {
  const cards = [];
  const cardPoolLength = cardPool.length;

  for (let i = 0; i < pairNumber; i++) {
    let index = i % cardPoolLength;
    const card = cardPool[index];
    cards.push(card);
    cards.push(card);
  }
  return cards;
}

function createCard(shuffledcardsPattern) {
  game.levelContainer = document.createElement("div");
  game.levelContainer.classList.add("levelContainer");
  game.levelContainer.style[
    "grid-template-columns"
  ] = `repeat(${game.levelNumber * 2}, 1fr)`;
  gameContainer.appendChild(game.levelContainer);
  for (let i = 0; i < shuffledcardsPattern.length; i++) {
    const singleCard = document.createElement("div");
    singleCard.classList.add("single-card-container");
    singleCard.dataset.framework = shuffledcardsPattern[i];
    game.levelContainer.appendChild(singleCard);
    const frontFace = document.createElement("img");
    singleCard.appendChild(frontFace);
    frontFace.classList.add("front-face");
    frontFace.src = "./img/" + shuffledcardsPattern[i] + ".jpg";
    const backFace = document.createElement("img");
    singleCard.appendChild(backFace);
    backFace.classList.add("back-face");
    backFace.src = "./img/Avenger-Logo.jpg";
  }
}

function shuffleCards(cards) {
  return cards.sort(() => Math.random() - 0.5);
}

function initUI(levelNumber) {
  pairNumber = (levelNumber * 2) ** 2 / 2;
  const cards = pickCardsPattern(pairNumber);
  const shuffledCards = shuffleCards(cards);
  createCard(shuffledCards);
}

/*******************************************
/     button  binding
/******************************************/
button.onclick = function() {
  if (button.innerHTML === "Start") {
    button.innerHTML = "Finish";
    gameStartInitial();
    initUI(game.levelNumber);
    gameSet();
  } else {
    gameOverInitial();
    alert("Game over! Your score is " + game.finalScore + "!");
  }
};

/*******************************************
/     game progress
/******************************************/

function gameSet() {
  const cards = document.getElementsByClassName("single-card-container");
  game.cardNumber = cards.length;
  game.counting = 0;

  //cards add listener;
  addListener(cards, flipCard);

  //timer 60s countdown
  game.id = setInterval(countdown, 1000);
}

function addListener(cards) {
  for (let i = 0; i < cards.length; i++) {
    cards[i].addEventListener("click", flipCard);
  }
}

function countdown() {
  second.innerHTML = second.innerHTML - 1;
  alertLose();
}

function flipCard(event) {
  //if two cards not match, player can't flip the third card before these two cards flip back
  if (game.waitingForFlip || game.gameOver) {
    return;
  }

  event.currentTarget.classList.add("flip");

  //choose first card and second card
  if (!game.flipped) {
    game.flipped = true;
    game.firstCard = event.currentTarget;
  } else {
    game.flipped = false;
    game.secondCard = event.currentTarget;

    // select same card
    if (game.firstCard === game.secondCard) {
      game.firstCard.classList.remove("flip");
      return;
    }
    // two cards matching
    if (
      game.firstCard.dataset.framework === game.secondCard.dataset.framework
    ) {
      game.firstCard.removeEventListener("click", flipCard);
      game.secondCard.removeEventListener("click", flipCard);
      game.counting++;
      game.secondInnerHtml = second.innerHTML;
      const scoreincrease =
        game.levelNumber * game.levelNumber * game.secondInnerHtml;
      game.finalScore += scoreincrease;
      score.innerHTML = game.finalScore;
      judge();
    } else {
      // two cards different
      game.waitingForFlip = true;
      setTimeout(() => {
        game.firstCard.classList.remove("flip");
        game.secondCard.classList.remove("flip");
        game.waitingForFlip = false;
      }, 1000);
      return;
    }
  }
}

function judge() {
  // final judge
  // win
  if (game.secondInnerHtml > 0 && game.counting === game.cardNumber / 2) {
    setTimeout(() => {
      alertWin();
    }, 500);
  }
}

function alertWin() {
  //final level 3 win
  if (game.levelNumber === 3) {
    alert("You win! The final score is " + game.finalScore + " !");
    gameOverInitial();
  } else {
    //level 1 or level 2 win
    alert("You win!");
    clearInterval(game.id);
    gameContainer.removeChild(game.levelContainer);
    nextLevel();
  }
}

function nextLevel() {
  game.levelNumber += 1;
  currentLevel.innerHTML = game.levelNumber;
  second.innerHTML = 60;
  initUI(game.levelNumber);
  gameSet();
}

function alertLose() {
  if (second.innerHTML <= 0) {
    alert("Ops! Game over... Your score is " + game.finalScore + "...");
    gameOverInitial();
  }
}

function gameOverInitial() {
  clearInterval(game.id);
  game.waitingForFlip = true;
  game.gameOver = true;
  game.flipped = false;
  button.innerHTML = "Start";
}
