const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('Score');
const progressBarfull = document.getElementById('progressBarfull');


let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuesions = [];

let questions = [];

var url = "https://opentdb.com/api.php?amount=10";

fetch(
    url
)
    .then((res) => {
        return res.json();
    })
    .then((loadedQuestions) => {
        // console.log(loadedQuestions.results);
        questions = loadedQuestions.results.map((loadedQuestion) => {
            const formattedQuestion = {
                question: loadedQuestion.question,
            };

            const answerChoices = [...loadedQuestion.incorrect_answers];
            formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
            answerChoices.splice(
                formattedQuestion.answer - 1,
                0,
                loadedQuestion.correct_answer
            );

            answerChoices.forEach((choice, index) => {
                formattedQuestion['choice' + (index + 1)] = choice;
            });

            return formattedQuestion;   
        });
        startGame();
    })
    .catch((err) => {
        console.error(err);
    });

//CONSTANTS
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 5;

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuesions = [...questions];
    scoreText.innerText = score;
    progressBarfull.style.width = 0;
    getNewQuestion();
};

getNewQuestion = () => {
    // setup the question
    if (availableQuesions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem("RecentScore", score);
        return window.location.assign('/end.html');
    }

    questionCounter++;
    progressText.innerText = `Question: ${questionCounter}/${MAX_QUESTIONS}`;
    // console.log((questionCounter / MAX_QUESTIONS) * 100);
    progressBarfull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    const questionIndex = Math.floor(Math.random() * availableQuesions.length);
    currentQuestion = availableQuesions[questionIndex];
    question.innerHTML = currentQuestion.question;

    choices.forEach((choice) => {
        const number = choice.dataset['number'];
        choice.innerText = currentQuestion['choice' + number];
    });

    availableQuesions.splice(questionIndex, 1);
    acceptingAnswers = true;
};

choices.forEach((choice) => {
    choice.addEventListener('click', (e) => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];

        const ResultofSelection = (currentQuestion.answer == selectedAnswer ? "correct" : "incorrect");

        selectedChoice.parentElement.classList.add(ResultofSelection);

        if (ResultofSelection === "correct") {
            score += CORRECT_BONUS;
        }
        scoreText.innerText = score;

        // to wait for 1s before removing class of colors
        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(ResultofSelection);
            getNewQuestion();
        }, 700)
    });
});
