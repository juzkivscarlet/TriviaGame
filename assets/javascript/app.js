$(document).ready(function() {

    $("#game").hide();
    $("#result").hide();

    var currentQ = 0;
    var dataNum = 0;
    var correctAns = 0;
    var wrongAns = 0;

    // convert buttons in div #ansBtns to array ansBtns[]
    var ansBtns = document.getElementById("ansBtns").querySelectorAll("button");

    let data  = 
    `[
        {
            "text": "Which country owns the Arctic archipelago, Svalbard?",
            "answers": [
                "Norway",
                "Russia",
                "Sweden"
            ],
            "correct": "Norway"
        }, {
            "text": "Pyongyang is the capital of which country?",
            "answers": [
                "China",
                "North Korea",
                "South Korea"
            ],
            "correct": "North Korea"
        }, {
            "text": "How many provinces does Canada have?",
            "answers": [
                13,
                8,
                12
            ],
            "correct": 13
        }, {
            "text": "What is the capital city of the US state of Alaska?",
            "answers": [
                "Ketchikan",
                "Anchorage",
                "Juneau"
            ],
            "correct": "Juneau"
        }, {
            "text": "What is the largest city in the world by population?",
            "answers": [
                "Beijing",
                "Shanghai",
                "Tokyo"
            ],
            "correct": "Shanghai"
        }, {
            "text": "What is the least densely populated country in the world?",
            "answers": [
                "Chad",
                "Russia",
                "Mongolia"
            ],
            "correct": "Mongolia"
        }, {
            "text": "Which city is closest to the North Pole?",
            "answers": [
                "Rome",
                "Madrid",
                "New York"
            ],
            "correct": "Rome"
        }, {
            "text": "What is the capital city of Norway?",
            "answers": [
                "Copenhagen",
                "Stockholm",
                "Oslo"
            ],
            "correct": "Oslo"
        }, {
            "text": "Which country in eastern Europe has had their political leader in power since 1994?",
            "answers": [
                "Ukraine",
                "Belarus",
                "Russia"
            ],
            "correct": "Belarus"
        }, {
            "text": "During which year did the country Czechoslovakia officially dissolve into two separate countries, Slovakia and the Czech Republic?",
            "answers": [
                "1993",
                "2002",
                "1988"
            ],
            "correct": "1993"
        }
    ]`

    var questions = JSON.parse(data);

    // dismiss start
    const dismiss = new TimelineLite({paused: true});
    dismiss.to("#start",0.5,{
        left: '0%',
        opacity: 0,
        ease: Power1.easeOut,
        display: 'none',
        onComplete: function() {
            showGame();
        }
    });

    function showGame() {
        $("#game").css("left","99%");

        // reset answer button classes
        for(var i=0; i<ansBtns.length; i++) {
            if(ansBtns[i].classList.contains("btn-danger")) ansBtns[i].classList.remove("btn-danger");
            else if(ansBtns[i].classList.contains("btn-success")) ansBtns[i].classList.remove("btn-success");
            else if(ansBtns[i].classList.contains("btn-primary")) ansBtns[i].classList.remove("btn-primary");
            else if(ansBtns[i].classList.contains("btn-outline-secondary")) ansBtns[i].classList.remove("btn-outline-secondary");

            ansBtns[i].classList.add("btn-outline-primary");
        }

        if(questions.length>0) getQuestion(currentQ);
        $("#game").fadeIn(300).animate({
            left: "25%",
        },300);
        setTimeout(function() {
            showText();
        },1000);
    }

    function showResult() {
        $("#result").css("left","99%");
        $("#result").fadeIn(300).animate({
            left: "25%"
        },300);
        $("#result-right").text(correctAns);
        $("#result-wrong").text(wrongAns);
    }

    function nextSlide() {
        $("#game").animate({
            left: "0px",
        },300).fadeOut(300);
        currentQ++;
        // $("#game").fadeIn(500);
        setTimeout(function() {
            if(questions.length>0) showGame();
            else showResult();
        },500);
    }

    function showText() {
        $("#question-head").fadeIn(1000);
        setTimeout(function() {
            $("#question-text").fadeIn(500);
        },750);
        setTimeout(function() {
            $("#ansBtns").fadeIn(500);
        },1000);
        
        $("#game").css("pointer-events","auto");
    }

    $("#startbtn").click(function() {
        currentQ = 1;
        dismiss.play();
    });

    function getQuestion(num) {

        dataNum = Math.floor(Math.random()*questions.length);

        $("#question-head").text("Question #"+num);
        $("#question-text").text(questions[dataNum].text);

        $("#correct-answers").text(correctAns);
        $("#wrong-answers").text(wrongAns);

        $("#ansA").text(questions[dataNum].answers[0]);
        $("#ansB").text(questions[dataNum].answers[1]);
        $("#ansC").text(questions[dataNum].answers[2]);

        startTimer();
    }

    $("#btnA").click(function() {
        clickAnswer(dataNum, 0);
    });
    $("#btnB").click(function() {
        clickAnswer(dataNum, 1);
    });
    $("#btnC").click(function() {
        clickAnswer(dataNum, 2);
    });
    $("#noAns").click(function() {
        clickAnswer(dataNum,null);
    });

    // user chooses answer
    function clickAnswer(n,ans) {

        // stop timer
        clearInterval(int);
        clearTimeout(t);

        // create variables with correct answer text, number
        var rightAnsText = questions[n].correct;
        var rightAnsNum;
        var isCorrect;

        // log answer text from user, if they answer
        if(ans!=null) {
            var ansText = ansBtns[ans].textContent.slice(4);
            console.log("Your answer: "+ansText);
        } else {
            console.log("No answer...");
            var ansText = "";
        }
        

        // get text for correct answer in questions[n]
        for(var i=0; i<questions[n].answers.length; i++) {
            if(rightAnsText==questions[n].answers[i]) rightAnsNum = i+1;
        }

        // log if answer was correct, if not, log the corrected answer
        if(ansText==rightAnsText) {
            console.log("Correct answer");
            correctAns++;
            isCorrect = true;
        } else {
            console.log("Incorrect answer."+rightAnsNum+" - "+rightAnsText);
            wrongAns++;
            isCorrect = false;
        }
        // run correct answer and user answer through function changeBtns(), 
        // then run animateQuestion() with whether user answer was correct or not
        questions.splice(dataNum,1);
        changeBtns(rightAnsNum-1, ans);
        animateQuestion(isCorrect);

        // display next question


        // currentQ++;
    }

    // changes button CSS when answer is clicked
    function changeBtns(x,y) {

        // $("#game").css("pointer-events","none");
        for(var i=0; i<ansBtns.length; i++) {
            ansBtns[i].classList.remove("btn-outline-primary");

            if(i==x) ansBtns[i].classList.add("btn-success");
            else {
                // ansBtns[x].classList.add("btn-primary");

                if(i==y) ansBtns[i].classList.add("btn-danger");
                else ansBtns[i].classList.add("btn-outline-secondary");
            }
        }
            
    }

    function animateQuestion(bool) {
        if(bool==true) {
            // if user guesses correct, bounce #game
            $("#game").animate({
                top: "10%"
            },500);
            $("#game").animate({
                top: "15%"
            },500);
        } else {
            // if user guesses incorrect, do different animation to #game
            $("#game").fadeOut(200);
            setTimeout(function() {
                $("#game").fadeIn(200);
            },200);
            setTimeout(function() {
                $("#game").fadeOut(200);
            },400);
            setTimeout(function() {
                $("#game").fadeIn(200);
            },600);
        }

        // display next question

        setTimeout(function() {
            nextSlide();
            $("#game").css("pointer-events","auto");
        }, 1500);
    }

    // question timer
    var time = 20;
    var int;
    var t;

    function timer() {
        $("#countdown").text(time+" sec");
        time--;
    }
    function startTimer() {
        time = 20;
        int = setInterval(timer, 1000);
        t = setTimeout(stopTimer,21000);
    }
    function stopTimer() {
        // clearInterval() && clearTimeout() are in function clickAnswer()
        clickAnswer(dataNum,null);
    }

});