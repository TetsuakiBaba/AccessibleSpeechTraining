/*
my google script url for free translation 
https://script.google.com/d/14bneey4l1045Kf9tXrfIbD81jwk3Xdh4W44LoYGt65a5oVHb37CcOWN5/edit?splash=yes#

languageApp detail info, you can check all list of language codes.
https://developers.google.com/apps-script/reference/language/language-app
*/
var myRec = new p5.SpeechRec('', parseResult); // new P5.SpeechRec object
var is_recognition_activated = false;
var timestamp = {
    start: 0,
    end: 0
}
var cpm = 0; // Character per Minute
var kuro;




function preload() {
    kuromoji.builder({ dicPath: "/kuromoji/dict/" }).build(function (err, tokenizer) {
        // tokenizer is ready
        kuro = tokenizer;
        var path = tokenizer.tokenize("kuromojiの準備できたよ");
        console.log(path);
    });
}


function setup() {
    // graphics stuff:
    noCanvas();

    myRec.onEnd = endSpeech;
    myRec.onStart = startSpeech();
    myRec.continuous = false; // no continuous recognition
    myRec.interimResults = true; // allow partial recognition (faster, less accurate)
    is_recognition_activated = false;
    myRec.rec.lang = 'ja';

    select("#button_start_or_stop").mouseClicked(toggleSpeechRecognition);
}

function draw() { }
function keyPressed() {
    if (key == 't') {
        console.log("createToast")
        createToast("hello");
    }
}
let flg_first_parsing = true;
function parseResult() {
    document.getElementById("label").innerHTML = "speaking...";
    document.getElementById("text").value = myRec.resultString;
    //    document.getElementById("text_debug").innerHTML = myRec.resultString;
    timestamp.end = millis();

    var results = kuro.tokenize(myRec.resultString);
    let length_reading = 0;
    for (result of results) {
        if (result.word_type === 'KNOWN') {
            length_reading += result.reading.length;
        }
    }
}

function toggleSpeechRecognition() {
    is_recognition_activated = !is_recognition_activated;
    if (is_recognition_activated == true) {
        myRec.rec.lang = 'ja'; //document.getElementById("lang_speaking").value;
        myRec.start();
        this.html("stop");
    } else {
        myRec.stop();
        this.html("start");
    }
}

function startSpeech() {
    console.log("startSpeech()");
}

function endSpeech() {
    if (is_recognition_activated == true) {
        if (!myRec.resultValue) {
            timestamp.start = millis();
            myRec.start(); // start engine
            return;
        }
        if (myRec.resultString.length > 0) {
            console.log("End");
            document.getElementById("label").innerHTML = "quiet";
            document.getElementById("textarea").innerHTML += myRec.resultString + "。";
            document.getElementById("text").value = "";

            timestamp.end = millis();


            var results = kuro.tokenize(myRec.resultString);
            console.log(results);
            let length_reading = 0;
            for (result of results) {
                if (result.word_type === 'KNOWN') {
                    length_reading += result.reading.length;
                }
            }

            let duration_min = (1000.0 * 60) / (timestamp.end - timestamp.start);
            cpm = length_reading * duration_min;
            console.log(timestamp.end - timestamp.start, duration_min, cpm);
            gauge.set(cpm); // set actual value

            // 話した言葉に、指示代名詞が含まれる場合はグラフにカウントする
            //myChart.data.datasets[0].data[0] = cpm;
            for (result of results) {
                let pos_label = 0;
                for (label of myChart.data.labels) {
                    // 指示代名詞を見つけた場合
                    if (result.word_type === 'KNOWN' &&
                        result.pos === '名詞' &&
                        result.surface_form === label) {
                        myChart.data.datasets[0].data[pos_label] += 1;

                        // bootstrap toasterでも通知
                        createToast("「" + label + "」が発話されました");
                    }
                    pos_label++;
                }
            }
            myChart.update();
            myRec.resultString = '';
        }

        timestamp.start = millis();
        myRec.start(); // start engine
        console.log("start");
    }
}