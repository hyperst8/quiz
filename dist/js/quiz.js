let correctAnswer,
    correctNumber = (localStorage.getItem('quiz_game_correct') ? localStorage.getItem('quiz_game_correct') : 0),
    incorrectNumber = (localStorage.getItem('quiz_game_incorrect') ? localStorage.getItem('quiz_game_incorrect') : 0);

document.addEventListener('DOMContentLoaded', function() {
    loadQuestion();
    eventListeners();
});

eventListeners = () => {
    document.querySelector('#check-answer').addEventListener('click', validateAnswer);

    document.querySelector('#clear-storage').addEventListener('click', clearResults);
}


// load a new question from api
loadQuestion = () => {
    const url = 'https://opentdb.com/api.php?amount=1';
    fetch(url)
        .then(data => data.json())
        .then(result => displayQuestion(result.results));
}

// display the question as HTML from API
displayQuestion = questions => {
    
    // create the HTML question
    const questionHTML = document.createElement('div');
    questionHTML.classList.add('col-12');

    questions.forEach(question => {
        // read the correct answer
        correctAnswer = question.correct_answer;

        // inject the correct answer in the correct answers
        let possibleAnswers = question.incorrect_answers;
        possibleAnswers.splice( Math.floor( Math.random() * 3 ), 0, correctAnswer );

        // add the HTML for the current question
        questionHTML.innerHTML = `
            <div class="row justify-content-between heading">
                <p class="category">Category: ${question.category}</p>
                <div class="totals">
                    <span class="badge badge-success">${correctNumber}</span>
                    <span class="badge badge-danger">${incorrectNumber}</span>
                </div>
            </div>
            <h2 class="text-center">${question.question}</h2>
        `;

        // generate the HTML for possible answers
        const answerDiv = document.createElement('div');
        answerDiv.classList.add('questions', 'row', 'justify-content-around', 'mt-4');

        possibleAnswers.forEach(answer => {
            const answerHTML = document.createElement('li');
            answerHTML.classList.add('col-12', 'col-md-5');
            answerHTML.textContent = answer;
            // attach an event click the answer is clicked
            answerHTML.onclick = selectAnswer;
            answerDiv.appendChild(answerHTML);
        });

        questionHTML.appendChild(answerDiv);

        // render in the HTML
        document.querySelector('#app').appendChild(questionHTML);

    });
} 

// when the answer is selected
selectAnswer = (e) => {
    // remove the previous active class for the answer
    if(document.querySelector('.active')){
        const activeAnswer = document.querySelector('.active');
        activeAnswer.classList.remove('active');
    }
    // add the current answer
    e.target.classList.add('active');
}

// Checks if the answer is correct and 1 answer is selected
validateAnswer = (e) => {
    e.preventDefault();
    if(document.querySelector('.questions .active')) {
        // everything is fine. Check if the answer is correct or not
        checkAnswer();
    } else {
        // error. User didn't select anything
        const errorDiv = document.createElement('div');
        errorDiv.classList.add('alert', 'alert-danger', 'col-md-6');
        errorDiv.textContent = 'Please select 1 answer';
        // Select the questions div to insert the alert
        const questionDiv = document.querySelector('.questions');
        questionDiv.appendChild(errorDiv);

        // remove the error
        setTimeout(() => {
            document.querySelector('.alert-danger').remove();
        }, 3000);
    }
}

checkAnswer = () => {
    
    const userAnswer = document.querySelector('.questions .active');

    if(userAnswer.textContent === correctAnswer) {
        correctNumber++;
    } else {
        incorrectNumber++;
    }

    // save into localstorage
    saveIntoStorage();

    // Clear previous HTML
    const app = document.querySelector('#app')
    while(app.firstChild) {
        app.removeChild(app.firstChild);
    }

    // load a new question
    loadQuestion();
}

// Saves correct and incorrect totals in storage
saveIntoStorage = () => {
    localStorage.setItem('quiz_game_correct', correctNumber);
    localStorage.setItem('quiz_game_incorrect', incorrectNumber);
}

// Clear the results from storage
clearResults = () => {
    localStorage.setItem('quiz_game_correct', 0);
    localStorage.setItem('quiz_game_incorrect', 0);

    setTimeout(() => {
        window.location.reload();
    }, 500);
}