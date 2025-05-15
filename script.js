let currentQuestionIndex = 0;
let questions = [];
let traits = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

window.addEventListener('load', () => {
    traits = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
});

fetch('questions.json')
    .then(response => response.json())
    .then(data => {
        questions = data;
        showQuestion(currentQuestionIndex);
    })
    .catch(error => console.error('โหลดคำถามไม่สำเร็จ:', error));

function showQuestion(index) {
    if (index >= questions.length) {
        displayResult();
        return;
    }

    const question = questions[index];
    const container = document.getElementById('question-container');
    container.innerHTML = `
    <p class="text-lg sm:text-base md:text-lg lg:text-xl mb-4">${question.question}</p>
    <div class="options-container">
        ${question.options.map((opt, i) => `
        <button type="button" class="choice-btn bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-700 p-3 rounded-xl mb-2 
        w-full hover:from-indigo-600 hover:to-purple-600 hover:text-yellow-200 transition-all duration-300 transform hover:scale-105 
        focus:outline-none focus:ring-2 focus:ring-purple-400 custom-cursor" data-value='${opt.value}' data-score='${opt.score}'>
            ${opt.label}
        </button>
        `).join('')}
    </div>
    `;

    document.querySelectorAll('.choice-btn').forEach(button => {
        button.addEventListener('click', () => {
        document.querySelectorAll('.choice-btn').forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');
        });
    });
}

document.getElementById('next-btn').addEventListener('click', () => {
    const selected = document.querySelector('.choice-btn.selected');
    if (selected) {
        const value = selected.getAttribute('data-value');
        const score = parseInt(selected.getAttribute('data-score'), 10);
        traits[value] += score;
        currentQuestionIndex++;
        showQuestion(currentQuestionIndex);
    } else {
        showCustomAlert();
    }
});

function displayResult() {
    const result =
        (traits.E >= traits.I ? 'E' : 'I') +
        (traits.S >= traits.N ? 'S' : 'N') +
        (traits.T >= traits.F ? 'T' : 'F') +
        (traits.J >= traits.P ? 'J' : 'P');


    const image = document.getElementById('result-image');
    document.getElementById('question-container').style.display = 'none';
    document.getElementById('next-btn').style.display = 'none';

    const imagePath = `images/mbti_type/${result.toUpperCase()}.png`;
    image.src = imagePath;
    image.alt = `${result} image`;
    
    const downloadBtn = document.getElementById('download-btn');
    downloadBtn.classList.remove('hidden');

    downloadBtn.onclick = function () {
        const link = document.createElement('a');
        link.href = imagePath;
        link.download = `${result}.png`;
        link.click();
    };
}

function showCustomAlert() {
    const modal = document.getElementById('custom-alert');
    modal.classList.remove('hidden');
}

document.getElementById('close-btn').addEventListener('click', () => {
    const modal = document.getElementById('custom-alert');
    modal.classList.add('hidden');
});
