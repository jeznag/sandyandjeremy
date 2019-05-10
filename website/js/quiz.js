var counter = -1;
var numCorrectAnswers = 0;
var questions = [
  {
    question: "Where did Sandy and Jeremy meet?",
    answers: [
      { answerText: "Spring break, Miami - cliché, we know", correct: false },
      { answerText: "On Tinder", correct: false },
      { answerText: "While ice skating", correct: false },
      { answerText: "At the society for creative anachronism", correct: false },
      { answerText: "On eHarmony", correct: true },
      { answerText: "At Monash University, obviously", correct: false },
      {
        answerText:
          "Through a friend who set them up - Hi, Friend! You know who you are ;)",
        correct: false
      },
      {
        answerText:
          "In the one Anthropology class Jeremy took while at Monash. It was called 'Magic, Witchcraft and Religion'. He thought it 'sounded cool'.",
        correct: false
      }
    ]
  },
  {
    question: "How long have they been together?",
    answers: [
      { answerText: "2 months", correct: false },
      { answerText: "2 years", correct: false },
      { answerText: "3 years", correct: true },
      { answerText: "6 years", correct: false },
      { answerText: "7 years", correct: false },
      { answerText: "8 years", correct: false },
      {
        answerText: "An eternity. Seriously, what took them so long?",
        correct: false
      }
    ]
  },
  {
    question: "How long were they in a long distance relationship?",
    answers: [
      {
        answerText: "They were in a long distance relationship??",
        correct: true
      },
      { answerText: "3 years", correct: false },
      { answerText: "4 years", correct: false },
      { answerText: "5 years", correct: false }
    ]
  },
  {
    question: "Where did they get engaged?",
    answers: [
      { answerText: "Miami, Florida - where it all began", correct: false },
      {
        answerText:
          "Lisbon, Portugal - Sandy thought it was a vacation with Jeremy's family",
        correct: false
      },
      {
        answerText:
          "Boston, Massachusetts - on a random Sunday, with Otis Redding on the record player, over brunch",
        correct: false
      },
      {
        answerText: "After 9 holes of mini golf, where Sandy beat Jeremy",
        correct: false
      },
      {
        answerText: "In a park overheard by a dog doing its business",
        correct: true
      },
      {
        answerText: "New York City, New York - it was a full on flash mob",
        correct: false
      }
    ]
  },
  {
    question: "What is the most common phrase they say to each other?",
    answers: [
      { answerText: "#dontbeadouch", correct: false },
      { answerText: "CUP", correct: true },
      { answerText: "Be Safe!", correct: false },
      { answerText: "Have you got the keys?", correct: false }
    ]
  },
  {
    question: "What is their preferred term of endearment?",
    answers: [
      { answerText: "Boo", correct: false },
      { answerText: "Babe", correct: false },
      { answerText: "Hon", correct: false },
      { answerText: "Dear", correct: false },
      { answerText: "Xiao-bao-bao", correct: true },
      { answerText: "Bao-bao-ren", correct: false },
      { answerText: "Bobo", correct: false }
    ]
  },
  {
    question: "Which of these is a nickname Sandy has for Jeremy?",
    answers: [
      { answerText: "Schmoomoo", correct: false },
      { answerText: "Boo Radley", correct: false },
      { answerText: "KP", correct: false },
      { answerText: "Niu-zhen-rong", correct: true },
      { answerText: "All of the above", correct: false }
    ]
  },
  {
    question: "Which of these is a nickname Jeremy has for Sandy? ",
    answers: [
      { answerText: "Clown", correct: false },
      { answerText: "Ma", correct: false },
      { answerText: "Booface", correct: false },
      { answerText: "Pao sheng nong", correct: false },
      { answerText: "Xiao shen ning", correct: true },
      { answerText: "All of the above", correct: false }
    ]
  },
  {
    question:
      "Over the years, Sandy and Jeremy have had a lot of adventures together. What <i>haven't</i> they done together?",
    answers: [
      {
        answerText:
          "Cross country skiied next to mountain cats in -30 degree weather",
        correct: false
      },
      { answerText: "Scuba dived in the great barrier reef", correct: false },
      { answerText: "Taken a woodworking class", correct: false },
      { answerText: "Made engagement rings", correct: false },
      { answerText: "Done a wilderness survival course", correct: false },
      { answerText: "Gone to a music festival", correct: false },
      { answerText: "Surfing lessons in Cairns", correct: true },
      { answerText: "All of the above", correct: false }
    ]
  }
];

$(document).ready(function() {
  advanceQuiz();
  addEventListeners();

  function addEventListeners() {
    $(document).on("click", "[data-correct='true']", function() {
      numCorrectAnswers = numCorrectAnswers + 1;
      $("[data-correct='true']").css("background-color", "#44D37E");
      $("[data-correct='true']").css("color", "white");
      $("[data-correct='false']").css("background-color", "#2F1C42");
      $("[data-correct='false']").css("color", "white");
      window.setTimeout(advanceQuiz, 600);
    });
    $(document).on("click", "[data-correct='false']", function() {
      $("[data-correct='true']").css("background-color", "#44D37E");
      $("[data-correct='true']").css("color", "white");
      $("[data-correct='false']").css("background-color", "#2F1C42");
      $("[data-correct='false']").css("color", "white");
      window.setTimeout(advanceQuiz, 600);
    });
  }

  function advanceQuiz() {
    counter = counter + 1;
    document.getElementById("progress").value += 12;
    if (counter >= questions.length) {
      showResults();
    } else {
      showNextQuestion();
    }
  }

  function showNextQuestion() {
    $("[data-correct='true']").css("background-color", "#FFFEFE");
    $("[data-correct='true']").css("color", "black");
    $("[data-correct='false']").css("background-color", "#FFFEFE");
    $("[data-correct='false']").css("color", "black");

    $("#question").fadeOut("slow", function() {
      // TODO use React instead of this gross jQuery
      var newQ = $(
        "<div id='question' class='field'><strong>Question " +
          (counter + 1) +
          "/9</strong><label id='real-question' class='label is-size-5'>" +
          questions[counter].question +
          "</label ></div >"
      ).hide();
      $(this).replaceWith(newQ);
      $("#question").fadeIn("slow");
    });

    var answers = questions[counter].answers;
    var numAnswers = answers.length;

    $("#answers").fadeOut("slow", function() {
      var newAnswersHTML = "";
      for (var i = 0; i < numAnswers; i++) {
        var answerNumber = i + 1;
        var answerID = "a" + answerNumber;
        var answerData = answers[i];

        var answerHTML =
          "<p id='" +
          answerID +
          "' class='control'>" +
          "<a class='box' data-correct='" +
          answerData.correct +
          "'>" +
          answerData.answerText +
          "</a>" +
          "</p>\n";

        newAnswersHTML += answerHTML;
      }

      $(this)
        .html(newAnswersHTML)
        .show();
    });
  }

  function showResults() {
    $("[data-answer], #question").fadeOut("slow", function() {
      var percentageCorrect = (numCorrectAnswers / questions.length) * 100;
      if (percentageCorrect === 100.0) {
        var result = $(
          "<div id='question' class='field is-size-4'><strong class='has-text-success'>You got all " +
            numCorrectAnswers +
            "/" +
            questions.length +
            " right.</strong></br><div class='is-size-5'> Wow! You got them all right! There's no way you're not a stalker. Not that you need it, but scroll down to read the full story!</div></div>"
        ).hide();
      } else if (percentageCorrect > 70) {
        var result = $(
          "<div id='question' class='field is-size-4'><strong class='has-text-success'>You got " +
            numCorrectAnswers +
            "/" +
            questions.length +
            "right.</strong></br><div class='is-size-5'> Pretty good! You must be quite close to Sandy and Jeremy... or you're a stalker. Scroll down for the full story!</div></div>"
        ).hide();
      } else if (percentageCorrect < 70 && percentageCorrect >= 30) {
        var result = $(
          "<div id='question' class='field is-size-4'><strong class='orange'>You got " +
            numCorrectAnswers +
            "/" +
            questions.length +
            " right.</strong></br><div class='is-size-5'> You've got some work to do! Scroll down and read up...</div></div>"
        ).hide();
      } else {
        var result = $(
          "<div id='question' class='field is-size-4'><strong class='has-text-danger'>You got " +
            numCorrectAnswers +
            "/" +
            questions.length +
            " right.</strong></br><div class='is-size-5'> Wow you did terribly! Do you even know Sandy and Jeremy!? Scroll down and take notes...</div></div>"
        ).hide();
      }
      $("#couple-20").replaceWith(
        '<div id="couple-20" class="column is-4 is-offset-1"><p class="title is-2 "><span class="rsvp-label">Your Results</span></p></div>'
      );
      $("#question").replaceWith(result);
      $("#question").fadeIn("slow");
      $("#progress").replaceWith(
        "<p style='line-height:0px;margin:-15px;'><br></p>"
      );
    });
  }
});
