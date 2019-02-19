const startButton = document.querySelector(".mds-body-button");
const quizBody = document.querySelector(".mds-body");
const popUpContainer = document.querySelector(".mds-popup");
const container = document.querySelector(".mds-container");
const iconButton = document.querySelector(".mds-header-icon ");
let headTitle = document.querySelector(".mds-header-text");
let stats = {
    gamesplayed: "",
    correctanswers: "",
    incorrectanswer: "",
    correctpercentage: "",
}
let gamesPlayed = 0;
let numberOfWrong = 0;
let percentage = 0;
let allCorrect = 0;
let count = 1;
let allCorrectAnswer = [];
let playerAnswer = [];
let numOfCorrectAnswer = 0;

startButton.addEventListener("click", () => {
    startButton.classList.add("mds-display-none");
    quizBody.dataset.type = "active"

    getData()
        .then(res => renderQuiz(res));
})
function getData() {
    return fetch("https://opentdb.com/api.php?amount=10")
        .then(response => response.json())
        .then(response => { return response })
        .catch(error => console.error("Error", error));
}
function renderQuiz(data) {
    let answer = [];
    let quizHeadline = document.createElement("h3");
    quizHeadline.innerHTML = "Quiz " + (gamesPlayed + 1);
    quizBody.appendChild(quizHeadline);
    let array = data.results;
    console.log(array);
    for (let i = 0; i < array.length; i++) {

         // Giving number to each question
         let numberQuestion = document.createElement("h3");
         console.log(numberQuestion);
         numberQuestion.textContent = "Q."  +(i+1);
         quizBody.appendChild(numberQuestion);

        let question = array[i].question;
        let questionText = document.createElement("h2");
        questionText.innerHTML = question;
        quizBody.appendChild(questionText);
        answer = randomAnswer(array[i].correct_answer, array[i].incorrect_answers);
        renderAnswer(answer);
        count++;
    }
    let doneButton = document.createElement("button");
    doneButton.className = "mds-body-doneButton";
    doneButton.innerHTML = "Done";
    quizBody.appendChild(doneButton);
    doneButton.addEventListener("click", checkanswer)
}
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
function popUpFunction() {
    popUpContainer.classList.remove("mds-display-none")
    container.style.backgroundColor = "#ADADAD";
    let dialogtext = document.querySelector(".mds-popup-supporting--text");
    dialogtext.innerHTML = "You answered " + numOfCorrectAnswer + "/10 questions correct"
    let closeButton = document.querySelector(".close")
    let reStartButton = document.querySelector(".re-start");
    closeButton.addEventListener("click", closeFunction);
    reStartButton.addEventListener("click", reStartFunction)
}
function closeFunction() {
    clearHtmlFunction()
    //iconButton.dataset.click = "inactive"
    startButton.classList.remove("mds-display-none")

}
function reStartFunction() {
    savePlayerStats();
    numOfCorrectAnswer = 0;
    clearHtmlFunction();
    allCorrectAnswer = [];
    playerAnswer = [];
    getData()
        .then(res => renderQuiz(res));
}
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



