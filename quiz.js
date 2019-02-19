const startButton = document.querySelector(".mds-body-button");
const quizBody = document.querySelector(".mds-body");
const popUpContainer = document.querySelector(".mds-popup");
const container = document.querySelector(".mds-container");

// Menu items and subitems
const iconButton = document.querySelector(".mds-header-icon ");
const menuBar = document.querySelector(".mds-menubar");
const menubarListItem = document.querySelectorAll(".mds-menubar-list-item");
const statsContainer = document.querySelector(".mds-stats");
const aboutContainer = document.querySelector(".mds-about");
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
startButton.addEventListener("click", () => {
    startButton.classList.add("mds-display-none");
    quizBody.dataset.type = "active"
    getRequest();

})

/* //----- Anothter way of fetching data -------//
function getRequest() {
    return fetch("https://opentdb.com/api.php?amount=10")
        .then(response => response.json())
        .then(response => { return response })
        .catch(error => console.error("Error", error));
} */

// Fetching data from api
function getRequest() {
    let xml = new XMLHttpRequest
    xml.open("GET", "https://opentdb.com/api.php?amount=10");
    xml.addEventListener("load", getParse);
    xml.send();
}

function getParse() {
    let parsedData = JSON.parse(this.responseText);
    console.log(parsedData.results);
    renderQuiz(parsedData);
}

// Rendering questions only
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
    doneButton.className = "mds-body-doneButton";
    doneButton.innerHTML = "DONE";
    quizBody.appendChild(doneButton);
    doneButton.addEventListener("click", checkanswer)
}

// Rendering answers with radio button
function renderAnswer(answer) {
    let ulTag = document.createElement("ul");
    quizBody.appendChild(ulTag);
    for (let i = 0; i < answer.length; i++) {
        let liTag = document.createElement("li");
        let inputTag = document.createElement("input");
        let spanTag1 = document.createElement("span");
        let spanTag2 = document.createElement("span");
        let pTag = document.createElement("p");
        giveAttributes(inputTag, {
            type: "radio",
            name: "radio" + count,
            value: answer[i],
        });
        inputTag.className = "mds-radio-input"
        spanTag1.className = "mds-radio-border"
        spanTag2.className = "mds-radio-toogle"
        pTag.innerHTML = answer[i];
        ulTag.appendChild(liTag);
        liTag.appendChild(inputTag);
        liTag.appendChild(spanTag1);
        liTag.appendChild(spanTag2);
        liTag.appendChild(pTag);
    }
    quizBody.scrollIntoView();
}

function giveAttributes(element, obj) {
    for (let prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            element[prop] = obj[prop];
        }
    }
}

// Helps you to get correct list of answers with radio button
function randomAnswer(correct, wrong) {
    SaveCorrectAnswer(correct);
    wrong.push(correct);
    let j, x, i;
    for (i = wrong.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1))
        x = wrong[i];
        wrong[i] = wrong[j];
        wrong[j] = x;
        return wrong;
    }
    return wrong;
}

function SaveCorrectAnswer(correct) {
    allCorrectAnswer.push(correct);
}

function checkanswer() {
    let inputTags = document.querySelectorAll("input");
    numOfCorrectAnswer = 0;
    for (let i = 0; i < inputTags.length; i++) {
        if (inputTags[i].type === "radio" && inputTags[i].checked) {
            playerAnswer.push(inputTags[i].value);
        }
        else { continue };
    }
    for (let i = 0; i < playerAnswer.length; i++) {
        if (playerAnswer[i] === allCorrectAnswer[i]) {
            numOfCorrectAnswer++;
        }
    }
    popUpFunction()
}
//------------End of Quiz screen------------//

//------------Popup------------// 
function popUpFunction() {
    popUpContainer.classList.remove("mds-display-none")
    container.style.backgroundColor = "#ADADAD";
    let dialogtext = document.querySelector(".mds-popup-supporting--text");
    dialogtext.innerHTML = "You answered " + numOfCorrectAnswer + "/10 questions correct!"
    let closeButton = document.querySelector(".close")
    let reStartButton = document.querySelector(".re-start");
    closeButton.addEventListener("click", closeFunction);
    reStartButton.addEventListener("click", reStartFunction)
}

function closeFunction() {
    clearHtmlFunction()
    iconButton.dataset.click = "inactive"
    startButton.classList.remove("mds-display-none")

}
function reStartFunction() {
    savePlayerStats();
    numOfCorrectAnswer = 0;
    clearHtmlFunction();
    allCorrectAnswer = [];
    playerAnswer = [];
    getRequest();
}
//------------End of Popup------------// 

// Clear all html to go back to the beginning
function clearHtmlFunction() {
    while (quizBody.firstChild) {
        quizBody.removeChild(quizBody.firstChild);
    }
    popUpContainer.classList.add("mds-display-none");
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
iconButton.addEventListener("click", iconFunction);
function iconFunction() {
    if (iconButton.dataset.click === "active") {
        statsContainer.classList.add("mds-display-none");
        menuBar.style.width = "640px";
        quizBody.classList.add("mds-display-none")
        startButton.classList.add("mds-display-none");
        aboutContainer.classList.add("mds-display-none")
        iconButton.dataset.click = "inactive"
        container.style.backgroundColor = "#ADADAD";
    }
    else if (iconButton.dataset.click === "inactive") {
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
                startButton.classList.remove("mds-display-none");
            }
            container.style.backgroundColor = "#fff";
            iconButton.dataset.click = "active"
        }
    }

}
for (let bar of menubarListItem) {
    bar.addEventListener("click", function (e) {
        if (e.target.innerHTML === "Game screen") {
            statsContainer.classList.add("mds-display-none");
            aboutContainer.classList.add("mds-display-none")
            headTitle.innerHTML = "Quiz Master";
            iconFunction();
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
    startButton.classList.add("mds-display-none");
    aboutContainer.classList.add("mds-display-none")
    container.style.backgroundColor = "#fff";
    iconButton.dataset.click = "active"
    headTitle.innerHTML = "Stats";
    statsContainer.classList.remove("mds-display-none")
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
    iconButton.dataset.click = "active"
    startButton.classList.add("mds-display-none");
    container.style.backgroundColor = "#fff";
    menuBar.style.width = "0px";
    aboutContainer.classList.remove("mds-display-none")
}
//------------End of Menu bar------------//


