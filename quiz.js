const startQuizBtn = document.querySelector(".mds-start-button");
const quizBody = document.querySelector(".mds-scroll-main");
const modalContainer = document.querySelector(".mds-modal");
const container = document.querySelector(".mds-container");

// Menu items and subitems
const drawerMenuBtn = document.querySelector(".mds-menu-icon ");
const menuBar = document.querySelector(".mds-menubar");
const menubarListitem = document.querySelectorAll(".mds-menubar-listitem");
const statsScreen = document.querySelector(".mds-stats");
const aboutScreen = document.querySelector(".mds-about");
let headTitle = document.querySelector(".mds-header-text");
let stats = {
    gamesplayed: "",
    correctanswers: "",
    incorrectanswer: "",
    correctpercentage: "",
}

// Variables declared
let gamesPlayed = 0;
let numberOfWrong = 0;
let percentage = 0;
let allCorrect = 0;
let count = 1;
let allCorrectAnswer = [];
let playerAnswer = [];
let numOfCorrectAnswer = 0;

//------------Quiz screen------------// 
// Event listner for START QUIZ button
startQuizBtn.addEventListener("click", () => {
    startQuizBtn.classList.add("mds-display-none");
    quizBody.dataset.type = "active"
    getRequest();
})

// Fetching data from api
function getRequest() {
    let xml = new XMLHttpRequest
    xml.open("GET", "https://opentdb.com/api.php?amount=10");
    xml.addEventListener("load", getParse);
    xml.send();
}

// Parsing data
function getParse() {
    let parsedData = JSON.parse(this.responseText);
    console.log(parsedData.results);
    renderQuiz(parsedData);
}

// Rendering list of questions only
function renderQuiz(parsedData) {
    let answer = [];
    let quizHeadline = document.createElement("h3");
    quizHeadline.innerHTML = "Quiz " + (gamesPlayed + 1);
    quizBody.appendChild(quizHeadline);
    let array = parsedData.results;
    for (let i = 0; i < array.length; i++) {

        // Giving number to each question
        let numberQuestion = document.createElement("h3");
        //console.log(numberQuestion);
        numberQuestion.className = "numberClass";
        numberQuestion.textContent = "Q" + (i + 1) + ".";
        quizBody.appendChild(numberQuestion);

        let question = array[i].question;
        let questionText = document.createElement("h2");
        questionText.className = "questionClass";
        questionText.innerHTML = question;
        quizBody.appendChild(questionText);
        answer = randomAnswer(array[i].correct_answer, array[i].incorrect_answers);
        renderAnswer(answer);
        count++;
    }
    let doneButton = document.createElement("button");
    doneButton.className = "mds-done-button";
    doneButton.innerHTML = "DONE";
    quizBody.appendChild(doneButton);
    doneButton.addEventListener("click", checkAnswer)
}

// Rendering answers to each question with radio button
function renderAnswer(answer) {
    let newUlTag = document.createElement("ul");
    quizBody.appendChild(newUlTag);
    for (let i = 0; i < answer.length; i++) {
        let newLiTag = document.createElement("li");
        let newInputTag = document.createElement("input");
        let newSpanTag1 = document.createElement("span");
        let newSpanTag2 = document.createElement("span");
        let newPTag = document.createElement("p");
        // Setting type radio attributes
        newInputTag.setAttribute("type", "radio");
        newInputTag.setAttribute("name", count);
        newInputTag.setAttribute("value", answer[i]);
        newInputTag.setAttribute("required", "");
        newInputTag.className = "mds-radio-input"
        newSpanTag1.className = "mds-radio-border"
        newSpanTag2.className = "mds-radio-toogle"
        newPTag.innerHTML = answer[i];
        newUlTag.appendChild(newLiTag);
        newLiTag.appendChild(newInputTag);
        newLiTag.appendChild(newSpanTag1);
        newLiTag.appendChild(newSpanTag2);
        newLiTag.appendChild(newPTag);
    }
    quizBody.scrollIntoView();
}

// Helps you to get correct list of answers with radio button
function randomAnswer(correct, wrong) {
    SaveCorrectAnswer(correct);
    wrong.push(correct);
    for (let x = wrong.length - 1; x > 0; x--) {
        let y = Math.floor(Math.random() * (x + 1))
        let z = wrong[x];
        wrong[x] = wrong[y];
        wrong[y] = z;
        return wrong;
    }
    return wrong;
}

// Pushing all correct answers to page
function SaveCorrectAnswer(correct) {
    allCorrectAnswer.push(correct);
}

// Checking answers if its right or wrong
function checkAnswer() {
    let newInputTags = document.querySelectorAll("input");
    numOfCorrectAnswer = 0;
    for (let i = 0; i < newInputTags.length; i++) {
        if (newInputTags[i].type === "radio" && newInputTags[i].checked) {
            playerAnswer.push(newInputTags[i].value);
        }
        else { continue };
    }
    for (let i = 0; i < playerAnswer.length; i++) {
        if (playerAnswer[i] === allCorrectAnswer[i]) {
            numOfCorrectAnswer++;
        }
    }
    modalFunction()
}
//------------End of Quiz screen------------//

//------------Modal------------// 
function modalFunction() {
    modalContainer.classList.remove("mds-display-none")
    container.style.backgroundColor = "#ADADAD";
    let dialogtext = document.querySelector(".mds-modal-supporting--text");
    dialogtext.innerHTML = "You answered " + numOfCorrectAnswer + "/10 questions correct!"
    let closeButton = document.querySelector(".close")
    let restartQuizBtn = document.querySelector(".re-start");
    closeButton.addEventListener("click", closeModalFunction);
    restartQuizBtn.addEventListener("click", restartModalFunction)
}

function closeModalFunction() {
    clearHtmlFunction()
    drawerMenuBtn.dataset.click = "inactive"
    startQuizBtn.classList.remove("mds-display-none")

}
function restartModalFunction() {
    savePlayerStats();
    numOfCorrectAnswer = 0;
    clearHtmlFunction();
    allCorrectAnswer = [];
    playerAnswer = [];
    getRequest();
}
//------------End of Modal------------// 

// Clear all html to go back to the beginning
function clearHtmlFunction() {
    while (quizBody.firstChild) {
        quizBody.removeChild(quizBody.firstChild);
    }
    modalContainer.classList.add("mds-display-none");
    container.style.backgroundColor = "#fff";
}

// Save stats from game in a object.
function savePlayerStats() {
    gamesPlayed = gamesPlayed + 1
    allCorrect = allCorrect + numOfCorrectAnswer;
    percentage = percentage + (allCorrect / (10 * gamesPlayed));
    numberOfWrong = numberOfWrong + (10 - numOfCorrectAnswer);

    stats = {
        gamesplayed: gamesPlayed,
        correctanswers: allCorrect,
        incorrectanswer: numberOfWrong,
        correctpercentage: percentage,
    }
    numOfCorrectAnswer = 0;
}

//------------Menu bar------------// 
drawerMenuBtn.addEventListener("click", drawerMenuFunction);
function drawerMenuFunction() {
    if (drawerMenuBtn.dataset.click === "active") {
        statsScreen.classList.add("mds-display-none");
        menuBar.style.width = "640px";
        quizBody.classList.add("mds-display-none")
        startQuizBtn.classList.add("mds-display-none");
        aboutScreen.classList.add("mds-display-none")
        drawerMenuBtn.dataset.click = "inactive"
        container.style.backgroundColor = "#ADADAD";
    }
    else if (drawerMenuBtn.dataset.click === "inactive") {
        if (headTitle.textContent === "Stats") {
            statsFunction();
        }
        else if (headTitle.textContent === "About this app") {
            aboutFunction()
        }
        else {
            menuBar.style.width = "0px";
            quizBody.classList.remove("mds-display-none")
            if (quizBody.dataset.type != "active") {
                startQuizBtn.classList.remove("mds-display-none");
            }
            container.style.backgroundColor = "#fff";
            drawerMenuBtn.dataset.click = "active"
        }
    }

}
for (let bar of menubarListitem) {
    bar.addEventListener("click", function (e) {
        if (e.target.innerHTML === "Game screen") {
            statsScreen.classList.add("mds-display-none");
            aboutScreen.classList.add("mds-display-none")
            headTitle.innerHTML = "Quiz Master";
            drawerMenuFunction();
        }
        else if (e.target.innerHTML === "Stats") {
            statsFunction();
        }
        else if (e.target.innerHTML === "About this app") {
            aboutFunction();
        }
    })
}

function statsFunction() {
    quizBody.classList.add("mds-display-none")
    startQuizBtn.classList.add("mds-display-none");
    aboutScreen.classList.add("mds-display-none")
    container.style.backgroundColor = "#fff";
    drawerMenuBtn.dataset.click = "active"
    headTitle.innerHTML = "Stats";
    statsScreen.classList.remove("mds-display-none")
    renderStats();
    menuBar.style.width = "0px";
}
function renderStats() {
    document.querySelector(".played").innerHTML = (stats.gamesplayed);
    document.querySelector(".correct").innerHTML = (stats.correctanswers);
    document.querySelector(".incorrect").innerHTML = (stats.incorrectanswer);
    document.querySelector(".percentage").innerHTML = (stats.correctpercentage) * 100 + "%";
}

function aboutFunction() {
    headTitle.innerHTML = "About this app";
    quizBody.classList.add("mds-display-none")
    drawerMenuBtn.dataset.click = "active"
    startQuizBtn.classList.add("mds-display-none");
    container.style.backgroundColor = "#fff";
    menuBar.style.width = "0px";
    aboutScreen.classList.remove("mds-display-none")
}
//------------End of Menu bar------------//


