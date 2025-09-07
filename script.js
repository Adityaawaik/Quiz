const body = document.querySelector("body");

const startQuizBtn = document.querySelector(".start-quiz");

const firstPageContent = document.querySelector(".first-page-content");

const wholeQuizContent = document.querySelector(".whole-quiz-content");

const secondPageContent = document.querySelector(
  ".second-page-content-removal"
);

const soundBtn = document.querySelector(".volume-btn");

const soundBtnImage = document.querySelector(".volume-btn i");

const music = document.querySelector(".sound");

const questionPlace = document.querySelector(".question");

const allOptions = document.querySelectorAll(".options");

const nextQuestion = document.querySelector(".next-question");

const startingQuestionNumber = document.querySelector(".starting-question");

const timer = document.querySelector(".timer");

const secondPageLayout = document.querySelector(
  ".second-page-question-answer-layout"
);

const resultBtn = document.querySelector(".result-btn-removal");

const candidateResult = document.querySelector(".result");

const showCandidateResult = document.querySelector(".show-result");

const candidateRemarks = document.querySelector(".remarks");

startQuizBtn.addEventListener("click", () => {
  firstPageContent.classList.add("first-page-content-removal");
  wholeQuizContent.classList.add("whole-quiz-content-second-layout");
  secondPageContent.classList.remove("second-page-content-removal");
  clearInterval(intervalId);
  timeInSecond = 59;
  timer.innerHTML = timeInSecond;
  intervalId = setInterval(timerOfOneMin, 1000);
});

soundBtn.addEventListener("click", toggleMusic);

function toggleMusic() {
  if (music.paused) {
    music.play();
    soundBtnImage.classList.remove("fa-volume-up");
    soundBtnImage.classList.add("fa-volume-xmark");
  } else {
    music.pause();
    soundBtnImage.classList.remove("fa-volume-xmark");
    soundBtnImage.classList.add("fa-volume-up");
  }
}

let index = 0;
let questionNumber = "01";
let intervalId;
let timeInSecond = 59;
startingQuestionNumber.innerHTML = questionNumber;
timer.innerHTML = timeInSecond;

const questionApi = async () => {
  const url = "https://opentdb.com/api.php?amount=25&category=9&type=multiple";
  const response = await fetch(url);
  const data = await response.json();
  const allQuestionResponse = data.results;
  console.log(allQuestionResponse.length);
  questionPlace.innerHTML = allQuestionResponse[0].question;
  allOptions[0].innerHTML = allQuestionResponse[0].incorrect_answers[0];
  allOptions[1].innerHTML = allQuestionResponse[0].incorrect_answers[1];
  allOptions[2].innerHTML = allQuestionResponse[0].correct_answer;
  allOptions[3].innerHTML = allQuestionResponse[0].incorrect_answers[2];
  rightAnswer(allOptions, 2);
  nextQuestion.addEventListener("click", () => {
    index++;
    if (index < allQuestionResponse.length) {
      questionPlace.innerHTML = allQuestionResponse[index].question;
      allOptions[0].innerHTML = allQuestionResponse[index].incorrect_answers[0];
      allOptions[1].innerHTML = allQuestionResponse[index].incorrect_answers[1];
      allOptions[2].innerHTML = allQuestionResponse[index].correct_answer;
      allOptions[3].innerHTML = allQuestionResponse[index].incorrect_answers[2];
    }
    rightAnswer(allOptions, 2);
    clearInterval(intervalId);
    timeInSecond = 59;
    timer.innerHTML = timeInSecond;
    intervalId = setInterval(timerOfOneMin, 1000);
    wholeQuizContent.style.backgroundColor = "";
    timer.style.backgroundColor = "";
    nextQuestion.style.color = "";
    nextQuestion.style.backgroundColor = "";
    if (questionNumber < allQuestionResponse.length) {
      questionNumber++;
      startingQuestionNumber.innerHTML = questionNumber
        .toString()
        .padStart(2, 0);
    } else if (questionNumber === allQuestionResponse.length) {
      nextQuestion.innerHTML = "Go to result";
      nextQuestion.addEventListener("click", () => {
        clearInterval(intervalId);
        console.log("clicked");
        secondPageLayout.classList.add(
          "second-page-question-answer-layout-removal"
        );
        candidateResult.classList.add("result-appear");
        candidateRemarks.classList.add("remarks-appear");
        restartBtn.classList.remove("restart-btn-removal");
      });
    }
  });
};
questionApi();

function timerOfOneMin() {
  if (timeInSecond > 0 && timeInSecond < 60) --timeInSecond;
  timer.innerHTML = timeInSecond.toString().padStart(2, 0);
  if (timeInSecond >= 0 && timeInSecond < 10) {
    wholeQuizContent.style.backgroundColor = "rgba(219, 173, 173, 1)";
    timer.style.backgroundColor = "rgba(197, 12, 0, 0.43)";
    nextQuestion.style.color = "rgba(197, 0, 0, 1)";
    nextQuestion.style.backgroundColor = "rgba(219, 173, 173, 1)";
  } else if (timeInSecond > 10 && timeInSecond < 30) {
    wholeQuizContent.style.backgroundColor = "rgba(212, 214, 159, 0.55)";
    timer.style.backgroundColor = "rgba(197, 177, 0, 0.43)";
    nextQuestion.style.color = "rgba(197, 136, 0, 1)";
    nextQuestion.style.backgroundColor = "rgba(212, 214, 159, 0.55)";
  }
}

let candidateRightAnswers = 0;
let candidateWrongAnswer = 0;

function rightAnswer(options, index) {
  let alreadyClicked = false;

  options.forEach((option) => {
    option.onclick = (e) => {
      if (alreadyClicked) return;
      alreadyClicked = true;

      if (e.target.innerHTML === allOptions[index].innerHTML) {
        candidateRightAnswers++;
        const percentage = (candidateRightAnswers / 25) * 100;

        if (percentage >= 80 && percentage <= 100) {
          showCandidateResult.innerHTML = `Congratulations you got ${percentage}%`;
          candidateRemarks.innerHTML =
            "Remarks: Still Hunger for more knowledge";
          candidateResult.style.backgroundColor = "lightgreen";
        } else if (percentage >= 50 && percentage <= 80) {
          showCandidateResult.innerHTML = `Congratulations you got ${percentage}%`;
          candidateRemarks.innerHTML = `Remarks : Can do better`;
          candidateResult.style.backgroundColor = "lightyellow";
        } else if (percentage > 0 && percentage <= 50) {
          showCandidateResult.innerHTML = `Congratulations you got ${percentage}%`;
          candidateRemarks.innerHTML = `Remarks : Need Improvement`;
          candidateResult.style.backgroundColor = "indianred";
        }
      } else {
        candidateWrongAnswer++;
      }
    };
  });
}
