let questions = [];
const ques = document.getElementById("question-div");

async function fetchDataFromServer() {
    try {
        const res = await fetch('https://opentdb.com/api.php?amount=1');
        if (!res.ok) {
            throw new Error(`Something went wrong !! Unable to fetch the data`);
        }
        const data = await res.json();
        questions = data.results;
    } catch (error) {
        ques.innerHTML = `<h4 style="color:#e603c8";>${error}</h4>`;
    }
}

fetchDataFromServer();

let score = 0;
let currQuestionIndex = 0;

if (questions.length === 0) {
    ques.innerHTML = `<h4>Please wait!! Loading Question</h4>`;
}

function LoadQuestion() {
    const option = document.getElementById("option-div");
    let currQuestion = questions[currQuestionIndex].question;

    if (currQuestion.indexOf('"') > -1) {
        currQuestion = currQuestion.replace(/"/g, '\"');
    }

    if (currQuestion.indexOf('') > -1) {
        currQuestion = currQuestion.replace(/&#039;/g, '\'');
    }

    ques.innerText = currQuestion;
    option.innerHTML = "";

    const correctAnswer = questions[currQuestionIndex].correct_answer;
    const wrongAnswers = questions[currQuestionIndex].incorrect_answers;
    const options = [correctAnswer, ...wrongAnswers];

    options.sort(() => Math.random() - 0.5);

    options.forEach((ourOption) => {
        if (ourOption.indexOf('"') > -1) {
            ourOption = ourOption.replace(/"/g, '\"');
        }
        if (ourOption.indexOf('') > -1) {
            ourOption = ourOption.replace(/'/g, '\'');
        }

        const choiceDiv = document.createElement("div");
        const choices = document.createElement("input");
        const choiceLabel = document.createElement("label");

        choices.type = "radio";
        choices.name = "myoption";
        choices.value = ourOption;
        choiceLabel.textContent = ourOption;

        choiceDiv.appendChild(choices);
        choiceDiv.appendChild(choiceLabel);
        option.appendChild(choiceDiv);
    });
}

setTimeout(() => {
    LoadQuestion();
    if (questions.length === 0) {
        ques.innerHTML = `<h4 style='color:#e603c8'>Unable to Load question!! Please try again</h4>`;
    }
}, 2000);

function display() {
    const totalScore = document.getElementById("score-div");
    totalScore.textContent = `Your score ${score} out of ${questions.length}`;
    totalScore.innerHTML += `<h4 style="text-align:center">Answers</h4><hr>`;

    questions.forEach((element, index) => {
        totalScore.innerHTML += `<p>${index+1}.${element.correct_answer}</p>`;
    });
}

function otherQuestion() {
    if (currQuestionIndex < questions.length - 1) {
        currQuestionIndex++;
        LoadQuestion();
    } else {
        document.getElementById("option-div").remove();
        document.getElementById("question-div").remove();
        document.getElementById("submit-btn").remove();
        display();
    }
}

function isCorrect() {
    const yourAnswer = document.querySelector('input[name="myoption"]:checked').value;

    if (yourAnswer === questions[currQuestionIndex].correct_answer) {
        score++;
    }

    otherQuestion();
}
