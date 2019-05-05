var counter = -1;
var numCorrectAnswers = 0;
var questions = [
    ["Where did Sandy and Jeremy meet?", "Spring break, Miami - cliché, we know", "On Tinder", "While ice skating", "At the society for creative anachronism", "On eHarmony", "At Monash University, obviously", "Through a friend who set them up - Hi, Friend! You know who you are ;)", "In the one Anthropology class Jeremy took while at Monash. It was called 'Magic, Witchcraft and Religion'. He thought it 'sounded cool'.", "5"],
    ["How long have they been together?", "2 months", "2 years", "3 years", "6 years", "7 years", "8 years", "An eternity. Seriously, what took them so long?", "3"],
    ["How long were they in a long distance relationship?", "They were in a long distance relationship??", "3 years", "4 years", "5 years", "1"],
    ["Where did they get engaged?", "Miami, Florida - where it all began", "Lisbon, Portugal - Sandy thought it was a vacation with Jeremy's family", "Boston, Massachusetts - on a random Sunday, with Otis Redding on the record player, over brunch", "After 9 holes of mini golf, where Sandy beat Jeremy", "In a park overheard by a dog doing its business", "New York City, New York - it was a full on flash mob", "5"],
    ["What is the most common phrase they say to each other?", "#dontbeadouch", "CUP", "Be Safe!", "2"],
    ["What is their preferred term of endearment?", "Boo", "Babe", "Hon", "Dear", "Xiao-bao-bao", "Bao-bao-ren", "Bobo", "5"],
    ["Which of these is a nickname Sandy has for Jeremy?", "Schmoomoo", "Boo Radley", "KP", "Niu-zhen-rong", "All of the above", "4"],
    ["Which of these is a nickname Jeremy has for Sandy? ", "Clown", "Ma", "Booface", "Pao sheng nong", "Xiao shen ning", "All of the above", "5"],
    ["Over the years, Sandy and Jeremy have had a lot of adventures together. What <i>haven't</i> they done together?", "Cross country skiied next to mountain cats in -30 degree weather", "Scuba dived in the great barrier reef", "Taken a woodworking class", "Made engagement rings", "Done a wilderness survival course", "Gone to a music festival", "Surfing lessons in Cairns", "All of the above", "7"]
];

var MAX_ANSWERS = Math.max(questions.map(function(question) {
  return question.length - 1;
}));

$(document).ready(function () {
    advanceQuiz();
    addEventListeners();

    function addEventListeners() {
        $(document).on("click", ".true", function () {
            numCorrectAnswers = numCorrectAnswers + 1;
            $(".true").css("background-color", "#44D37E");
            $(".true").css("color", "white");
            $(".false").css("background-color", "#2F1C42");
            $(".false").css("color", "white");
            window.setTimeout(advanceQuiz, 600);
        });
        $(document).on("click", ".false", function () {
            $(".true").css("background-color", "#44D37E");
            $(".true").css("color", "white");
            $(".false").css("background-color", "#2F1C42");
            $(".false").css("color", "white");
            window.setTimeout(advanceQuiz, 600);
        });
    }

    function advanceQuiz() {
        counter = counter + 1;
        document.getElementById("progress").value += 12;
        if (counter >= questions.length) {
            showResults();
        }
        else {
            showNextQuestion();
        }
    }

    function showNextQuestion() {
        $(".true").css("background-color", "#FFFEFE");
        $(".true").css("color", "black");
        $(".false").css("background-color", "#FFFEFE");
        $(".false").css("color", "black");

        $('#question').fadeOut("slow", function () {
            var newQ = $("<div id='question' class='field'><strong>Question " + (counter + 1) + "/9</strong><label id='real-question' class='label is-size-5'>" + questions[counter][0] + "</label ></div >").hide();
            $(this).replaceWith(newQ);
            $('#question').fadeIn("slow");
        });

        var numAnswers = questions[counter].length - 2;
        var correctAnswer = questions[counter][numAnswers + 1];

        $('#answers').fadeOut("slow", function () {
            var newAnswersHTML = '';
            for (var i = 0; i < numAnswers; i++) {
                var answerNumber = i + 1;
                var answerID = 'a' + answerNumber;

                var answerHTML = "<p id='" + answerID + "' class='control' data-answer='" + answerNumber + "'><a class='box " + (correctAnswer == answerNumber) + "'>" + questions[counter][answerNumber] + "</a></p>\n";

                newAnswersHTML += answerHTML;
            }

            $(this).html(newAnswersHTML).show();
        });
    }

    function showResults() {
        $('[data-answer], #question').fadeOut("slow", function () {
            var percentageCorrect = (numCorrectAnswers / questions.length) * 100;
            if (percentageCorrect === 100.0) {
                var result = $("<div id='question' class='field is-size-4'><strong class='has-text-success'>You got all " + numCorrectAnswers + "/" + questions.length + " right.</strong></br><div class='is-size-5'> Wow! You got them all right! There's no way you're not a stalker. Not that you need it, but scroll down to read the full story!</div></div>").hide();
            }
            else if (percentageCorrect > 70) {
                var result = $("<div id='question' class='field is-size-4'><strong class='has-text-success'>You got " + numCorrectAnswers + "/" + questions.length + "right.</strong></br><div class='is-size-5'> Pretty good! You must be quite close to Sandy and Jeremy... or you're a stalker. Scroll down for the full story!</div></div>").hide();
            }
            else if (percentageCorrect < 70 && percentageCorrect >= 30) {
                var result = $("<div id='question' class='field is-size-4'><strong class='orange'>You got " + numCorrectAnswers + "/" + questions.length + " right.</strong></br><div class='is-size-5'> You've got some work to do! Scroll down and read up...</div></div>").hide();
            }
            else {
                var result = $("<div id='question' class='field is-size-4'><strong class='has-text-danger'>You got " + numCorrectAnswers + "/" + questions.length + " right.</strong></br><div class='is-size-5'> Wow you did terribly! Do you even know Sandy and Jeremy!? Scroll down and take notes...</div></div>").hide();
            }
            $('#couple-20').replaceWith('<div id="couple-20" class="column is-4 is-offset-1"><p class="title is-2 "><span class="rsvp-label">Your Results</span></p></div>');
            $('#question').replaceWith(result);
            $('#question').fadeIn("slow");
            $('#progress').replaceWith("<p style='line-height:0px;margin:-15px;'><br></p>");
        });
    }
});