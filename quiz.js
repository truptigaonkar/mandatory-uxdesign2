let gamesPlayed = 0;
let count = 1;

const startButton = document.querySelector(".mds-body-button");
const quizBody = document.querySelector(".mds-body");

startButton.addEventListener ("click", () =>{
    startButton.classList.add ("mds-display-none");
    quizBody.dataset.type = "active"
    getData()
    .then (res => renderQuiz(res));
})

function getData (){
    return fetch("https://opentdb.com/api.php?amount=10")
   .then  (response => response.json())
   .then (response => {return response})
   .catch (error => console.error ("Error", error));
}

function renderQuiz (data){
    //let answer = [];
    let quizHeadline = document.createElement("h3");
    quizHeadline.innerHTML = "Quiz "+(gamesPlayed+1);
    quizBody.appendChild (quizHeadline);
    let array = data.results;
    for (let i = 0; i < array.length;i++){
        let question = array[i].question;
        let questionText = document.createElement("h2");
        questionText.innerHTML = question;
        quizBody.appendChild(questionText);
        array[i].correct_answer,array[i].incorrect_answers;
        count ++;
    }
    let doneButton = document.createElement("button");
    doneButton.className ="mds-body-doneButton";
    doneButton.innerHTML = "Done";
    quizBody.appendChild(doneButton);
} 

