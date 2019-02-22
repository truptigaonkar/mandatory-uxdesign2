console.log("Main screen begins...... Click START QUIZ button")
// Variables declared
let gamesPlayed = 0;
let incorrectAnswer = 0;
let correctPercentage = 0;
let aveRage = 0;
let allCorrect = 0;
let allInCorrect = 0;
let count = 1;
let allCorrectAnswer = [];
let playerAnswer = [];
let numOfCorrectAnswer = 0;

// Main screen, Quiz screen: Selectors declared
let startQuizBtn = document.querySelector(".mds-start-button");
let quizBody = document.querySelector(".mds-scroll-main");
let modalContainer = document.querySelector(".mds-modal");
let container = document.querySelector(".mds-container");

//------------Start of Main screen------------// 
// Event listner for START QUIZ button
startQuizBtn.addEventListener("click", () => {
    startQuizBtn.classList.add("mds-display-none");
    quizBody.dataset.type = "active";
    console.log("Quiz screen begins......Game starts! ");
    getRequest();
})
//------------End of Main screen------------//

//------------Start of Quiz screen------------// 
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
    // logging all correct answers on console
    for (let q of parsedData.results) {
        console.log("Correct answer: " + q.correct_answer);
    }
    renderQuiz(parsedData);
}

// Rendering list of questions only
function renderQuiz(parsedData) {
    let answer = [];
    let quizHeadline = document.createElement("h3");
    quizHeadline.innerHTML = "Quiz " + (gamesPlayed + 1);
    quizHeadline.style.textAlign = "center";
    quizHeadline.style.fontWeight = "bold";
    console.log(quizHeadline.innerHTML);
    quizHeadline.style.color = "#003366";
    quizBody.appendChild(quizHeadline);
    let arrayData = parsedData.results;
    for (let i = 0; i < arrayData.length; i++) {

        // Display number to each question
        let numberQuestion = document.createElement("h3");
        //console.log(numberQuestion);
        numberQuestion.className = "numberClass";
        numberQuestion.textContent = "Q" + (i + 1) + ".";
        quizBody.appendChild(numberQuestion);

        // Display category to each question
        let category = arrayData[i].category;
        let categoryText = document.createElement("h3");
        categoryText.className = "categoryClass";
        categoryText.innerHTML = category;
        quizBody.appendChild(categoryText);

        // Display questions
        let question = arrayData[i].question;
        let questionText = document.createElement("h2");
        questionText.className = "questionClass";
        questionText.innerHTML = question;
        quizBody.appendChild(questionText);
        answer = randomAnswer(arrayData[i].correct_answer, arrayData[i].incorrect_answers);
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

//------------Start of Modal------------// 
function modalFunction() {
    modalContainer.classList.remove("mds-display-none")
    container.style.backgroundColor = "#ADADAD";
    let dialogtext = document.querySelector(".mds-modal-description");
    dialogtext.innerHTML = "You answered " + numOfCorrectAnswer + "/10 questions correct!";
    // Various types of messages on popup which depends on number of right answers
    let modalTitle = document.querySelector(".mds-modal-title");
    if (numOfCorrectAnswer <= 1) {
        modalTitle.textContent = "Unlucky!"
        modalTitle.style.color = "red"
    }
    else if (numOfCorrectAnswer > 1 && numOfCorrectAnswer <= 8) {
        modalTitle.textContent = "Try Harder!"
        modalTitle.style.color = "Orange"
    }
    else if (numOfCorrectAnswer > 8 && numOfCorrectAnswer <= 10) {
        modalTitle.textContent = "Congratulations!"
        modalTitle.style.color = "green"
    }


    let closeButton = document.querySelector(".mds-modalChoice-closeBtn")
    let restartQuizBtn = document.querySelector(".mds-modalChoice-restartBtn");
    closeButton.addEventListener("click", closeModalFunction);
    restartQuizBtn.addEventListener("click", restartModalFunction)
}

function closeModalFunction() {
    // Clear all html to go back to quiz screen after clicking RE-START and CLOSE button from modal
    while (quizBody.firstChild) {
        quizBody.removeChild(quizBody.firstChild);
    }
    modalContainer.classList.add("mds-display-none");
    container.style.backgroundColor = "#fff"; // Change the color white because after clicking RE-START and CLOSE button you get the gray screen

    drawerMenuBtn.dataset.click = "inactive"
    startQuizBtn.classList.remove("mds-display-none");
    console.log("Closed Quiz. Start again quiz.....");
}

function restartModalFunction() {
    // Clear all html to go back to quiz screen after clicking RE-START and CLOSE button from modal
    while (quizBody.firstChild) {
        quizBody.removeChild(quizBody.firstChild);
    }
    modalContainer.classList.add("mds-display-none");
    container.style.backgroundColor = "#fff"; // Change the color white because after clicking RE-START and CLOSE button you get the gray screen

    console.log("Restarted Quiz....");
    getRequest();

    // Stats screen update
    gamesPlayed = gamesPlayed + 1
    allCorrect = allCorrect + numOfCorrectAnswer;
    correctPercentage = correctPercentage + (allCorrect / (10 * gamesPlayed));
    incorrectAnswer = incorrectAnswer + (10 - numOfCorrectAnswer);
    aveRage = aveRage + (allCorrect / gamesPlayed);
    stats = {
        gamesplayed: gamesPlayed,
        correctanswers: allCorrect,
        incorrectanswer: incorrectAnswer,
        correctpercentage: correctPercentage,
        average: aveRage,
    }
    numOfCorrectAnswer = 0;
    allCorrectAnswer = [];
    playerAnswer = [];
}

//------------End of Modal------------// 

//------------Start of Drawer Screen ------------// 

// Drawer screen: Selectors declared
let drawerMenuBtn = document.querySelector(".mds-menu-icon ");
let drawermenubar = document.querySelector(".mds-drawermenubar");
let drawermenubarListitem = document.querySelectorAll(".mds-drawermenubar-listitem");
let statsScreen = document.querySelector(".mds-stats");
let aboutScreen = document.querySelector(".mds-about");
let headTitle = document.querySelector(".mds-header-text");
let stats = {
    gamesplayed: "",
    correctanswers: "",
    incorrectanswer: "",
    correctpercentage: "",
    average: "",
}
// Drawer button event listener
drawerMenuBtn.addEventListener("click", drawerMenuFunction);
function drawerMenuFunction() {
    if (drawerMenuBtn.dataset.click === "active") {
        statsScreen.classList.add("mds-display-none");
        drawermenubar.style.width = "700px";
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
            drawermenubar.style.width = "0px";
            quizBody.classList.remove("mds-display-none")
            if (quizBody.dataset.type != "active") {
                startQuizBtn.classList.remove("mds-display-none");
            }
            container.style.backgroundColor = "#fff";
            drawerMenuBtn.dataset.click = "active"
        }
    }
}
// Allow to click each drawer menu item
for (let item of drawermenubarListitem) {
    item.addEventListener("click", function (e) {
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
//------------End of Drawer Screen ------------// 

//------------Start of Stats screen ------------// 
function statsFunction() {
    quizBody.classList.add("mds-display-none")
    startQuizBtn.classList.add("mds-display-none");
    aboutScreen.classList.add("mds-display-none")
    container.style.backgroundColor = "#fff";
    drawerMenuBtn.dataset.click = "active"
    headTitle.innerHTML = "Stats";
    statsScreen.classList.remove("mds-display-none");
    drawermenubar.style.width = "0px";
    // Rendering stats
    document.querySelector(".mds-stats-text--played").innerHTML = (stats.gamesplayed);
    document.querySelector(".mds-stats-text--correct").innerHTML = (stats.correctanswers);
    document.querySelector(".mds-stats-text--incorrect").innerHTML = (stats.incorrectanswer);
    document.querySelector(".mds-stats-text--percentage").innerHTML = (stats.correctpercentage) * 100 + "%";
    document.querySelector(".mds-stats-text--average").innerHTML = (stats.average);
}
//------------End of Stats screen ------------//

//------------Start of About screen ------------//
function aboutFunction() {
    headTitle.innerHTML = "About this app";
    quizBody.classList.add("mds-display-none")
    drawerMenuBtn.dataset.click = "active"
    startQuizBtn.classList.add("mds-display-none");
    container.style.backgroundColor = "#fff";
    drawermenubar.style.width = "0px";
    aboutScreen.classList.remove("mds-display-none")
}
//------------End of About screen ------------//


