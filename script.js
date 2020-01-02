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

//global variable
let flipped;
let firstCard;
let secondCard;
let waitingForFlip;
let counting;
let finalScore;
let levelNumber;
let secondInnerHtml;
let id;
let cardNumber;
let levelContainer;

//basic setting at very beginning
function gameStartInitial() {
  gameContainer.style.display = "block";
  levelNumber = 1;
  currentLevel.innerHTML = levelNumber;
  waitingForFlip = false;
  flipped = false;
  firstCard = null;
  secondCard = null;
  second.innerHTML = 60;
  finalScore = 0;
  score.innerHTML = finalScore;
  counting = 0;
  if (gameContainer.contains(levelContainer)) {
    gameContainer.removeChild(levelContainer);
  }
}

/*******************************************
/     UI Update
/******************************************/

function pickCardsPattern(pairNumber) {
  const cards = [];
  const cardPoolLength = cardPool.length;

  for (let i = 0; i < pairNumber; i++) {
    let index;
    if (i > cardPoolLength - 1) {
      index = i % cardPoolLength;
    } else {
      index = i;
    }
    const card = cardPool[index];
    cards.push(card);
    cards.push(card);
  }
  return cards;
}

function createCard(shuffledcardsPattern) {
  levelContainer = document.createElement("div");
  levelContainer.classList.add("levelContainer");
  levelContainer.style["grid-template-columns"] = `repeat(${levelNumber *
    2}, 1fr)`;
  gameContainer.appendChild(levelContainer);
  for (let i = 0; i < shuffledcardsPattern.length; i++) {
    const singleCard = document.createElement("div");
    singleCard.classList.add("single-card-container");
    singleCard.dataset.framework = shuffledcardsPattern[i];
    levelContainer.appendChild(singleCard);
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

function countdown() {
  second.innerHTML = second.innerHTML - 1;
  alertLose();
}

/*******************************************
/     button  binding
/******************************************/
button.onclick = function() {
  if (button.innerHTML === "Start") {
    button.innerHTML = "Finish";
    gameStartInitial();
    initUI(levelNumber);
    game();
  } else {
    gameOverInitial();
    alert("Game over! Your score is " + finalScore + "!");
  }
};

/*******************************************
/     game progress
/******************************************/

function game() {
  const cards = document.getElementsByClassName("single-card-container");
  cardNumber = cards.length;
  counting = 0;

  //cards add listener;
  addListener(cards, flipCard);

  //timer 60s countdown
  id = setInterval(countdown, 1000);
}

function addListener(cards) {
  for (let i = 0; i < cards.length; i++) {
    cards[i].addEventListener("click", flipCard);
  }
}

function flipCard(event) {
  //if two cards not match, player can't flip the third card before these two cards flip back
  if (waitingForFlip) {
    return;
  }

  event.currentTarget.classList.add("flip");

  //choose first card and second card
  if (!flipped) {
    flipped = true;
    firstCard = event.currentTarget;
  } else {
    flipped = false;
    secondCard = event.currentTarget;

    // select same card
    if (firstCard === secondCard) {
      firstCard.classList.remove("flip");
      return;
    }
    // two cards matching
    if (firstCard.dataset.framework === secondCard.dataset.framework) {
      firstCard.removeEventListener("click", flipCard);
      secondCard.removeEventListener("click", flipCard);
      counting++;
      secondInnerHtml = second.innerHTML;
      const scoreincrease = levelNumber * levelNumber * secondInnerHtml;
      finalScore += scoreincrease;
      score.innerHTML = finalScore;
      judge();
    } else {
      // two cards different
      waitingForFlip = true;
      setTimeout(() => {
        firstCard.classList.remove("flip");
        secondCard.classList.remove("flip");
        waitingForFlip = false;
      }, 1000);
      return;
    }
  }
}

function judge() {
  // final judge
  // win
  if (secondInnerHtml > 0 && counting === cardNumber / 2) {
    setTimeout(() => {
      alertWin();
    }, 500);
  }
}

function alertWin() {
  //final level 3 win
  if (levelNumber === 3) {
    alert("You win! The final score is " + finalScore + " !");
    gameOverInitial();
  } else {
    //level 1 or level 2 win
    alert("You win!");
    clearInterval(id);
    gameContainer.removeChild(levelContainer);
    nextLevel();
  }
}

function nextLevel() {
  levelNumber += 1;
  currentLevel.innerHTML = levelNumber;
  second.innerHTML = 60;
  initUI(levelNumber);
  game();
}

function alertLose() {
  if (second.innerHTML <= 0) {
    alert("Ops! Game over... Your score is " + finalScore + "...");
    gameOverInitial();
  }
}

function gameOverInitial() {
  clearInterval(id);
  waitingForFlip = true;
  flipped = false;
  button.innerHTML = "Start";
}
