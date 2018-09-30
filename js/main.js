let score = 0;
let color = "blue";
let nameInput = document.getElementById('name');
let submitButton = document.getElementById('submit');
let li = document.getElementById('scoreList');

function random(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function setBG() {
    if (Math.round(Math.random())) {
        return "./images/aliens.png";
    } else {
        return "./images/alien.png";
    }
}

function dropBox() {
    let length = random(100, ($(".game").width() - 100));
    let velocity = random(850, 10000);
    let size = random(50, 150);
    let thisBox = $("<div/>", {
        class: "box",
        style: "width:" + size + "px; height:" + size + "px; left:" + length + "px; transition: transform " + velocity + "ms linear;"
    });

    //set data and bg based on data
    thisBox.data("test", Math.round(Math.random()));
    if (thisBox.data("test")) {
        thisBox.css({ "background": "url('./images/aliens.png')", "background-size": "contain" });
    } else {
        thisBox.css({ "background": "url('./images/alien.png')", "background-size": "contain" });
    }


    //insert gift element
    $(".game").append(thisBox);

    //random start for animation
    setTimeout(function () {
        thisBox.addClass("move");
    }, random(0, 5000));

    //remove this object when animation is over
    thisBox.one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend",
        function (event) {
            $(this).remove();
        });
}

for (i = 0; i < 10; i++) {
    dropBox();
}

$(document).on('click', '.box', function () {


    if ($(this).data("test")) {
        score += 5;
    } else {
        score -= 5;
    }

    $(".score").html(score);
    $(this).remove();

});

let runGame = setInterval(function () {
    for (i = 0; i < 10; i++) {
        dropBox();
    }
}, 5000);

function countdown() {
    let seconds = 20;
    function tick() {
        var counter = document.getElementById("counter");
        seconds--;
        counter.innerHTML = (seconds < 10 ? "0" : "") + String(seconds) + "S";
        if (seconds > 0) {
            setTimeout(tick, 1000);
            // draw();
            // update();
        } else {
            alert("Game over");
            clearInterval(runGame);
        }
    }
    tick();
}

countdown();


function submitScore() {
    let data = {
        name: nameInput.value,
        score: score
    }
    database = firebase.database();
    let ref = database.ref('scores');
    ref.push(data);
    ref.on('value', getData, errData);
}

function getData(data) {

    const scores = data.val();
    const keys = Object.keys(scores);

    for (let i = 0; i < keys.length; i++) {
        let k = keys[i];

        li.innerHTML = `Score : <li>${scores[k].name + "  :  " + scores[k].score}</li>`;
    }
}

function errData(err) {
    console.log('Error!');
}

submitButton.addEventListener("click", function (e) {
    submitScore();
})
