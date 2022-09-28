const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('Score');
const progressBarfull = document.getElementById('progressBarfull');
const loader = document.getElementById('loader');
const game = document.getElementById('game');

const categories = document.getElementById('categories');
const levels = document.getElementById('levels')
const categoryContainer = document.getElementById("category-container");
console.log(NumberofQuestions);

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuesions = [];
let difficulty = 'easy';

let questions = [];

//CONSTANTS
const CORRECT_BONUS = 10;
let MAX_QUESTIONS = 5;
// 


pickCategory = (e) => {
    e.preventDefault();

    switch (levels.value) {
        case 'med':
            difficulty = 'medium';
            break;
        case 'hard':
            difficulty = 'hard';
            break;

        default:
            difficulty = 'easy'
            break;
    }

    switch (categories.value) {
        case 'gk':
            category = 10;
            break;

        case 'anime':
            category = 31;
            break;

        case 'cs':
            category = 18;
            break;

        case 'film':
            category = 11;
            break;

        case 'tv':
            category = 14;
            break;

        case 'vehicles':
            category = 28;
            break;

        case 'myth':
            category = 20;
            break;

        default:
            category = 10;
            break;
    };

    categoryContainer.classList.add('hidden')
    loader.classList.remove('hidden')

    MAX_QUESTIONS = document.getElementById('NumberofQuestions').value;

    fetch(`https://opentdb.com/api.php?amount=${MAX_QUESTIONS}&category=${category}&difficulty=${difficulty}&type=multiple`)
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
}

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuesions = [...questions];
    scoreText.innerText = score;
    progressBarfull.style.width = 0;


    getNewQuestion();
    game.classList.remove("hidden");
    loader.classList.add("hidden");
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
