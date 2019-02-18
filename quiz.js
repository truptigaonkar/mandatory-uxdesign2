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
    let answer = [];
    let quizHeadline = document.createElement("h3");
    quizHeadline.innerHTML = "Quiz "+(gamesPlayed+1);
    quizBody.appendChild (quizHeadline);
    let array = data.results;
    for (let i = 0; i < array.length;i++){
        // for(let i of array){
        // let h3 = document.createElement("h3");
        // let number = array.indexOf(i) + 1; //question number
        // h3.textContent = "Q." + number;
        
        let question = array[i].question;
        let questionText = document.createElement("h2");
        questionText.innerHTML = question;
        //quizBody.appendChild(h3);
        quizBody.appendChild(questionText);
        answer = randomAnswer(array[i].correct_answer,array[i].incorrect_answers);
        renderAnswer(answer);
        count ++;
    }
    let doneButton = document.createElement("button");
    doneButton.className ="mds-body-doneButton";
    doneButton.innerHTML = "Done";
    quizBody.appendChild(doneButton);
} 

function renderAnswer (answer){
    let ulTag = document.createElement("ul");
    quizBody.appendChild(ulTag);
    for(let i = 0; i < answer.length;i++){
        let liTag = document.createElement("li");
        let inputTag = document.createElement ("input");
        let spanTag1 = document.createElement("span");
        let spanTag2 = document.createElement("span");
        let pTag = document.createElement("p");
        giveAttributes(inputTag,{
            type: "radio",
            name: "radio"+count,
            value: answer[i],
        });
        inputTag.className ="mds-radio-input"
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
function giveAttributes(element,obj){
    for (let prop in obj){
        if(obj.hasOwnProperty(prop)){
            element[prop] = obj[prop];
        }
    }
}

function randomAnswer(correct,wrong){
    wrong.push(correct);
        let j,x,i;
        for (i = wrong.length -1; i > 0; i--){
            j = Math.floor(Math.random() * (i+1))
            x=wrong[i];
            wrong[i] = wrong[j];
            wrong[j] = x;
            return wrong;
        }
    return wrong;
}

