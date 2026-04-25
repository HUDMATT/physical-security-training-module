
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

function updateProgressBar() {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    document.getElementById('progressBar').style.width = scrollPercent + '%';
}

window.addEventListener('scroll', updateProgressBar);

const scenarios = [
    {
        question: "You enter a secure building. A person behind you says, 'I forgot my badge. Can you hold the door?'",
        options: [
            { text: "Hold the door.", correct: false },
            { text: "Ask them to badge in or visit the front desk.", correct: true },
            { text: "Ignore it and walk away.", correct: false }
        ],
        feedback: {
            false: "Holding the door allows unauthorized access. Always ensure everyone badges in.",
            true: "Correct! Always insist on proper access procedures, but make sure to keep it polite.",
            false2: "Ignoring might seem rude, but asking them to follow procedure is better."
        }
    },
    {
        question: "A person in a reflective vest carrying a clipboard says they are here to inspect wiring and need access to the server room.",
        options: [
            { text: "Let them in since they look official.", correct: false },
            { text: "Verify through facilities or security before allowing access.", correct: true },
            { text: "Ask for their badge and let them follow you.", correct: false }
        ],
        feedback: {
            false: "Uniforms can be faked. Always verify identity.",
            true: "Correct! Never grant access based on appearance alone.",
            false2: "Following you could still be tailgating. Verify first."
        }
    },
    {
        question: "A coworker you recognize is walking in behind you but does not scan their badge.",
        options: [
            { text: "Assume it's fine since you know them.", correct: false },
            { text: "Politely ask them to badge in too.", correct: true },
            { text: "Hold the door and let them in.", correct: false }
        ],
        feedback: {
            false: "Even familiar people must follow procedures.",
            true: "Correct! Consistency is key to security.",
            false2: "Holding the door breaks the audit trail."
        }
    },
    {
        question: "Someone says they are from IT and urgently need you to open a restricted office because 'the network is down.'",
        options: [
            { text: "Open the door since it's urgent.", correct: false },
            { text: "Do not grant access based on urgency, verify their identity and authorization.", correct: true },
            { text: "Tell them to come back later.", correct: false }
        ],
        feedback: {
            false: "Urgency is a common social engineering tactic.",
            true: "Correct! Always verify before granting access.",
            false2: "Coming back later doesn't solve the verification issue."
        }
    }
];

let currentScenario = 0;
let scenarioScore = 0;

function loadScenarios() {
    const container = document.getElementById('scenarioContainer');
    container.innerHTML = '';

    scenarios.forEach((scenario, index) => {
        const scenarioDiv = document.createElement('div');
        scenarioDiv.className = 'scenario-card card';
        scenarioDiv.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">Scenario ${index + 1}</h5>
                <p class="card-text">${scenario.question}</p>
                <div class="scenario-options">
                    ${scenario.options.map((option, optIndex) => `
                        <button class="btn btn-outline-primary d-block mb-2 scenario-btn" data-scenario="${index}" data-option="${optIndex}">
                            ${option.text}
                        </button>
                    `).join('')}
                </div>
                <div class="scenario-feedback alert" style="display: none;"></div>
            </div>
        `;
        container.appendChild(scenarioDiv);
    });

    // Add event listeners
    document.querySelectorAll('.scenario-btn').forEach(btn => {
        btn.addEventListener('click', handleScenarioClick);
    });
}

function handleScenarioClick(event) {
    const scenarioIndex = parseInt(event.target.dataset.scenario);
    const optionIndex = parseInt(event.target.dataset.option);
    const scenario = scenarios[scenarioIndex];
    const option = scenario.options[optionIndex];

    const feedbackDiv = event.target.closest('.scenario-card').querySelector('.scenario-feedback');
    const buttons = event.target.closest('.scenario-options').querySelectorAll('.scenario-btn');

    buttons.forEach(btn => btn.disabled = true);

    if (option.correct) {
        feedbackDiv.className = 'scenario-feedback alert alert-success';
        scenarioScore++;
    } else {
        feedbackDiv.className = 'scenario-feedback alert alert-danger';
    }

    const feedbackKey = option.correct ? 'true' : (optionIndex === 0 ? 'false' : 'false2');
    feedbackDiv.textContent = scenario.feedback[feedbackKey];
    feedbackDiv.style.display = 'block';

    document.getElementById('scenarioScore').textContent = scenarioScore;
    const progressPercent = ((scenarioIndex + 1) / scenarios.length) * 100;
    document.getElementById('scenarioProgress').style.width = progressPercent + '%';
}

const quizQuestions = [
    {
        question: "What is tailgating?",
        options: [
            "Following someone through a secured door without authorization",
            "Using a fake badge",
            "Asking for directions"
        ],
        correct: 0
    },
    {
        question: "Why does urgency work in social engineering?",
        options: [
            "It shows politeness",
            "It creates familiarity",
            "It makes people think quickly without verifying"
        ],
        correct: 2
    },
    {
        question: "Why does authority work in social engineering?",
        options: [
            "People trust titles and uniforms",
            "It creates urgency",
            "It shows politeness"
        ],
        correct: 0
    },
    {
        question: "Why is badging important?",
        options: [
            "It creates an audit trail",
            "It looks professional",
            "It's faster than keys"
        ],
        correct: 0
    },
    {
        question: "What should you do if someone forgot their badge?",
        options: [
            "Hold the door for them",
            "Direct them to the front desk",
            "Ignore them"
        ],
        correct: 1
    },
    {
        question: "Why is a recently fired employee a risk?",
        options: [
            "They might still have access",
            "They know the layout",
            "They might be angry"
        ],
        correct: 0
    },
    {
        question: "How should you verify contractors?",
        options: [
            "Check their uniform",
            "Contact the appropriate department",
            "Ask for their name"
        ],
        correct: 1
    }
];

let quizAnswers = [];

function loadQuiz() {
    const container = document.getElementById('quizContainer');
    container.innerHTML = '';

    quizQuestions.forEach((question, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'quiz-question card mb-3';
        questionDiv.innerHTML = `
            <div class="card-body">
                <h6 class="card-title">Question ${index + 1}</h6>
                <p class="card-text">${question.question}</p>
                <div class="quiz-options">
                    ${question.options.map((option, optIndex) => `
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="question${index}" value="${optIndex}" id="q${index}o${optIndex}">
                            <label class="form-check-label" for="q${index}o${optIndex}">
                                ${option}
                            </label>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        container.appendChild(questionDiv);
    });

    document.getElementById('submitQuiz').style.display = 'block';
}

function submitQuiz() {
    quizAnswers = [];
    let score = 0;

    quizQuestions.forEach((question, index) => {
        const selected = document.querySelector(`input[name="question${index}"]:checked`);
        if (selected) {
            const answer = parseInt(selected.value);
            quizAnswers.push(answer);
            if (answer === question.correct) {
                score++;
            }
        } else {
            quizAnswers.push(null);
        }
    });

    showQuizResult(score);
}

function showQuizResult(score) {
    const totalQuestions = quizQuestions.length;
    const percentage = Math.round((score / totalQuestions) * 100);
    const passed = percentage >= 80;

    const resultDiv = document.getElementById('quizResult');
    resultDiv.innerHTML = `
        <div class="alert ${passed ? 'alert-success' : 'alert-warning'}">
            <h5>${passed ? 'Congratulations!' : 'Try Again'}</h5>
            <p>You scored ${score}/${totalQuestions} (${percentage}%)</p>
            ${passed ? '<p>You passed the quiz!</p>' : '<p>You need at least 80% to pass. Review the material and try again.</p>'}
        </div>
        <div class="mt-3">
            <button class="btn btn-secondary" onclick="resetQuiz()">Retry Quiz</button>
        </div>
    `;

    if (!passed || score < totalQuestions) {
        let explanations = '<h6>Review:</h6><ul>';
        quizQuestions.forEach((question, index) => {
            if (quizAnswers[index] !== question.correct) {
                explanations += `<li><strong>Q${index + 1}:</strong> ${question.question}<br>Correct: ${question.options[question.correct]}</li>`;
            }
        });
        explanations += '</ul>';
        resultDiv.innerHTML += explanations;
    }

    resultDiv.style.display = 'block';
}

function resetQuiz() {
    quizAnswers = [];
    document.getElementById('quizResult').style.display = 'none';
    loadQuiz();
}

document.addEventListener('DOMContentLoaded', function () {
    loadScenarios();
    loadQuiz();
    document.getElementById('submitQuiz').addEventListener('click', submitQuiz);
    document.querySelectorAll('.navbar-nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
});