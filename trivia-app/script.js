//A partir de esta api: https://opentdb.com/api_config.php
//Crea un sitio web que genere trivias según los siguientes parámetros:
//Siempre son 10 preguntas
//Se puede modificar la dificultad
//Se puede seleccionar el tipo de respuesta
//Y se puede escoger la categoría.

document.addEventListener("DOMContentLoaded", function () {
    const difficultySelect = document.getElementById("dificultad");
    const typeSelect = document.getElementById("tipo");
    const categorySelect = document.getElementById("category");
    const generateButton = document.getElementById("generate");
    const triviaContainer = document.querySelector(".trivia");
    const questionsDiv = document.getElementById("questions");
    const submitButton = document.getElementById("submit");
    const scoreDisplay = document.getElementById("score");
    const newTriviaButton = document.getElementById("newTrivia");
    const API_BASE_URL = "https://opentdb.com/api.php";
  
    async function fetchTriviaQuestions() {
      const difficulty = difficultySelect.value;
      const type = typeSelect.value;
      const category = categorySelect.value;
      const amount = 10;
  
      const url = `${API_BASE_URL}?amount=${amount}&category=${category}&dificultad=${difficulty}&tipo=${tipo}`;
  
      try {
        const response = await fetch(url);
        const data = await response.json();
        return data.results;
      } catch (error) {
        console.error("Error fetching trivia questions:", error);
        return [];
      }
    }
 
    function renderTrivia(questions) {
      questionsDiv.innerHTML = "";
      questions.forEach((question, index) => {
        const options = shuffleOptions([...question.incorrect_answers, question.correct_answer]);
        const optionsHtml = options.map(option => `<li><input type="radio" name="question-${index}" value="${option}" /> ${option}</li>`).join("");
        const questionHtml = `
          <div>
            <p><strong>Q${index + 1}: ${question.question}</strong></p>
            <ul>${optionsHtml}</ul>
          </div>
        `;
        questionsDiv.innerHTML += questionHtml;
      });
    }
  

    function shuffleOptions(options) {
      return options.sort(() => Math.random() - 0.5);
    }
  
    function calculateScore(questions) {
      let score = 0;
      questions.forEach((question, index) => {
        const selectedOption = document.querySelector(`input[name="question-${index}"]:checked`);
        if (selectedOption && selectedOption.value === question.correct_answer) {
          score += 100;
        }
      }
      );
      scoreDisplay.textContent = `Your score: ${score}`;
      scoreDisplay.style.display = "block";
      newTriviaButton.style.display = "block";
    }
  
    function newTrivia() {
      triviaContainer.style.display = "none";
      scoreDisplay.style.display = "none";
      newTriviaButton.style.display = "none";
      fetchAndRenderTrivia();
    }
    async function fetchAndRenderTrivia() {
      const questions = await fetchTriviaQuestions();
      renderTrivia(questions);
      triviaContainer.style.display = "block";
    }
    generateButton.addEventListener("click", function () {
      fetchAndRenderTrivia();
    }
    );
    submitButton.addEventListener("click", function () {
      const questions = document.querySelectorAll(".trivia input[type='radio']:checked");
      if (questions.length === 10) {
        calculateScore(questions);
      } else {
        alert("responda todas las preguntas antes de ver resultados.");
      }
    }
    );
    newTriviaButton.addEventListener("click", function () {
      newTrivia();
    }
    );
    fetchAndRenderTrivia();
  }
  );