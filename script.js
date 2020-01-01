//score
const score = document.getElementById("score");
let finalScore = 0;
score.innerHTML = finalScore;

//button click
const startBtn = document.getElementById("startBtn");
const finishBtn = document.getElementById("finishBtn");
const gameContainer = document.getElementById("gameContainer");
const currentLevel = document.getElementById("level");

let levelNumber;
let flipped = false;
let firstCard = null;
let secondCard = null;
let counting = 0;
let id;
let cardNumber;
const second = document.getElementById("timer");
let waitingForFlip = false;
let levelContainer;
let levelString;

const cardPool = ["Iron-man", "Thor", "Natasha", "Hawkeye", "Spider-man", "Captain", "wizart"];

const generateCards = function(pairNumber){
    const cards = [];
    const cardPoolLength = cardPool.length;

    for (let i = 0; i < pairNumber; i++) {
        let index;
        if(i > cardPoolLength - 1 ){
            index = i % cardPoolLength;
        } else {
            index = i;
        }
        const card = cardPool[index];
        cards.push(card);
        cards.push(card);
    } 
    return cards;
};

const shuffleCards = function(cards){
    return cards.sort(() => Math.random() - 0.5);
};

function initial(){
    clearInterval(id);
    waitingForFlip = true;
    startBtn.style.display = "block";
    finishBtn.style.display = "none";
    flipped = false;
}

function createCard(levelCardURL,levelCss){
    levelContainer = document.createElement("div");
    levelContainer.classList.add("levelContainer");
    gameContainer.appendChild(levelContainer);
    for(let i = 0; i < levelCardURL.length; i++){
        const singleCard = document.createElement("div");
        singleCard.classList.add("single-card-container");
        singleCard.classList.add(levelCss);
        singleCard.dataset.framework = levelCardURL[i];
        levelContainer.appendChild(singleCard);
        const frontFace = document.createElement("img");
        singleCard.appendChild(frontFace);
        frontFace.classList.add("front-face");
        frontFace.src = "/img/"+levelCardURL[i]+".jpg";
        const backFace = document.createElement("img");
        singleCard.appendChild(backFace);
        backFace.classList.add("back-face");
        backFace.src = "/img/Avenger-Logo.jpg";
    }
}

function addListener(cards) {
    for(let i=0; i<cards.length; i++){
        cards[i].addEventListener("click", flipCard);
    }
}

function alertWin(){
    //final level 3 win
    if(levelNumber ===3) {
        alert("You win! The final score is "+ finalScore +" !");
        initial();
    } else {
//level 1 or level 2 win
        alert("You win!");
        clearInterval(id);
        gameContainer.removeChild(levelContainer);
        levelNumber += 1;
        currentLevel.innerHTML = levelNumber;
        second.innerHTML = 60; 
        initUI(levelNumber);
        game(levelString);
    }
}

function judge() {
    let secondInnerHtml = second.innerHTML;
    // final judge
    // win
    if(secondInnerHtml > 0 && counting === cardNumber / 2) {
        setTimeout(() => {        
            alertWin();
        }, 500);
    }  
}

//flip card and check
function flipCard(event){
//if two cards not match, player can't flip the third card before these two cards flip back
    if(waitingForFlip){
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
    if(firstCard === secondCard){
        firstCard.classList.remove("flip");
        return;
    }
// two cards matching
    if (firstCard.dataset.framework === secondCard.dataset.framework) {
        firstCard.removeEventListener("click",flipCard);
        secondCard.removeEventListener("click",flipCard);
        counting++;
        finalScore += 10;
        score.innerHTML = finalScore;
        judge();
    } else {
// two cards different
        waitingForFlip = true;
        setTimeout(() =>{
            firstCard.classList.remove("flip");
            secondCard.classList.remove("flip"); 
            waitingForFlip = false; 
            },1000);
        return;
        }
    }   
}

function game(level){
    const cards = document.getElementsByClassName(level);
    cardNumber = cards.length;
    counting = 0;


//cards add listener;
    addListener(cards, flipCard);

//timer 60s countdown
    id = setInterval(countdown, 1000);
}

function lose(){
    if (second.innerHTML <= 0){
    alert("Ops!Game over...");
    initial();
    } 
}

function countdown() {
    second.innerHTML = second.innerHTML - 1;
    lose();
} 

finishBtn.onclick = function(){
    initial();
    alert("Game over! Your score is " + finalScore + "!");
}

function initUI(levelNumber){
    levelString = `level${levelNumber}`;
    const cards = generateCards((levelNumber * 2) ** 2 / 2);
    const shuffledCards = shuffleCards(cards);
    createCard(shuffledCards, levelString);
}

startBtn.onclick = function(){
    gameContainer.style.display = "block";
    levelNumber = 1;
    currentLevel.innerHTML = levelNumber;
    startBtn.style.display = "none";
    finishBtn.style.display = "block";
    waitingForFlip = false;
    flipped = false;
    second.innerHTML = 60; 
    finalScore = 0;
    score.innerHTML = finalScore;
    if(gameContainer.contains(levelContainer)){
        gameContainer.removeChild(levelContainer)
    }
    initUI(levelNumber);
    game(levelString);
}