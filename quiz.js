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
    console.log(array);
    for (let i = 0; i < array.length; i++){

        // Giving number to each section
        let numberQuestion = document.createElement("h3");
        console.log(numberQuestion);
        //numberQuestion.className = "numberQuestion";
        numberQuestion.textContent = "Q."  +(i+1);
        quizBody.appendChild(numberQuestion);

        let question = array[i].question;
        let questionText = document.createElement("h2");
        questionText.innerHTML = question;
        
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
function giveAttributes(element,object){
    for (let property in object){
        if(object.hasOwnProperty(property)){
            element[property] = object[property];
        }
    }
}

function randomAnswer(right,fail){
    fail.push(right);
        for (let x = fail.length -1; x > 0; x--){
            let y = Math.floor(Math.random() * (x+1))
            let z=fail[x];
            fail[z] = fail[y];
            fail[y] = z;
            return fail;
        }
    return fail;
}

