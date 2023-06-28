var last_modified = `
Last modified: 2023/06/29 08:43:02
`

var myRec = new p5.SpeechRec('', parseResult); // new P5.SpeechRec object
var is_recognition_activated = false;
var timestamp = {
    start: 0,
    end: 0,
}
var cpm = 0; // Character per Minute
var kuro;
var feedback_speech = new p5.Speech();



function preload() {
    let host_name = document.location.hostname;
    let ungzip;
    if (host_name == 'localhost' || host_name == "127.0.0.1") {
        ungzip = true;
    }
    else {
        ungzip = false;
    }
    kuromoji.builder({ dicPath: "./kuromoji/dict/", ungzip: ungzip }).build(function (err, tokenizer) {
        // tokenizer is ready
        console.log("tokenizer is ready");
        kuro = tokenizer;
        var path = tokenizer.tokenize("準備できたよ");
        select("#dict_loading").hide();
        console.log(path);
    });
}

let flg_first_parsing = true;
var threshold = {
    cpm: 400,
    duration: 10
};

function setup() {
    // graphics stuff:
    noCanvas();

    var userAgent = window.navigator.userAgent.toLowerCase();
    if (userAgent.indexOf('chrome') != -1) { } else {
        window.confirm("ブラウザをChromeで開き直してください。このページはChrome（macOS,windows,android,chromeOS）ブラウザのみで動作します。This page works only on Chrome browser.");
    }

    document.querySelector('#last_modified').innerText = last_modified;

    myRec.onEnd = endSpeech;
    myRec.onStart = startSpeech();
    myRec.onSoundStart = function () {
        console.log("sound start");
        if (flg_first_parsing) {
            timestamp.start = millis();
            flg_first_parsing = false;
        }
    }

    myRec.continuous = false; // no continuous recognition
    myRec.interimResults = true; // allow partial recognition (faster, less accurate)
    is_recognition_activated = false;
    myRec.rec.lang = 'ja';

    select("#button_start_or_stop").mouseClicked(toggleSpeechRecognition);
    select("#button_audio_feedback").mouseClicked(toggleAudioFeedback);
    select("#number_cpm_threshold").changed(changedCPMThreshold);
    select("#number_speech_duration_threshold").changed(changedSpeechDurationThreshold);
    document.querySelector('#button_trash').addEventListener('click', function () {
        clearPlotData();
    })
}

function draw() { }

function downloadResultImage() {
    html2canvas(document.querySelector("#capture")).then(canvas => {
        //document.body.appendChild(canvas)
        let downloadEle = document.createElement("a");
        downloadEle.href = canvas.toDataURL("image/png");
        downloadEle.download = "Accessible_Speech_Training_result.png";
        downloadEle.click();
    });
    createToast("画像をダウンロードしています");
}

function clearPlotData() {
    line_chart.data.datasets[0].data = [];
    line_chart.data.labels = [];
    line_chart.update();
    parsecpm = 0;
    gauge.set(cpm);
    for (let i = 0; i < myChart.data.datasets[0].data.length; i++) {
        myChart.data.datasets[0].data[i] = 0;
    }
    myChart.update();
    for (let i = 0; i < chart_warning_count.data.datasets[0].data.length; i++) {
        chart_warning_count.data.datasets[0].data[i] = 0;
    }
    chart_warning_count.update();
    createToast("グラフをリセットしました");
}
function keyPressed() {

    if (key == 'r') {
        console.log(line_chart.data.datasets[0].data.length);

        let sum = 0;
        for (d of line_chart.data.datasets[0].data) {
            sum += d;
        }
        console.log(sum / line_chart.data.datasets[0].data.length);
    }
    if (key == 't') {
        createToast("ここが通知が出る場所です");
    }
    if (key == 'r') {
        clearPlotData();
    }
    // if (key == 't') {
    //     console.log("createToast")
    //     createToast("hello");
    // }
    // if (key == "c") {
    //     html2canvas(document.querySelector("#capture")).then(canvas => {
    //         //document.body.appendChild(canvas)
    //         let downloadEle = document.createElement("a");
    //         downloadEle.href = canvas.toDataURL("image/png");
    //         downloadEle.download = "canvas.png";
    //         downloadEle.click();
    //     });
    // }
}



let flg_long_sentence_warning = false;
function parseResult() {
    if (flg_first_parsing) {
        timestamp.start = millis();
        flg_first_parsing = false;
    }
    if (millis() - timestamp.start > 1000 * threshold.duration) {
        createToast(str(threshold.duration) + "秒以上文章の切れ目がありません");
        if (flg_long_sentence_warning == false) {
            chart_warning_count.data.datasets[0].data[3]++;
            chart_warning_count.update();
            flg_long_sentence_warning = true;
        }
    }
    document.querySelector("#text_recognized").innerText = myRec.resultString;

    //    document.getElementById("text_debug").innerHTML = myRec.resultString;
    timestamp.end = millis();
    var length_reading = myRec.resultString.length;

    document.querySelector('#cpm_warning').style.backgroundColor = `hsl(0,${length_reading * 0.5}%,90%)`;
    //document.querySelector('#cpm_alert').style.backgroundColor = `blue`;

    if (length_reading > 20) {
        let duration_min = (1000.0 * 60) / (timestamp.end - timestamp.start);
        /*
        ここでのcpmは参考値でよいため，差分加算で短い文章で急な値の情報や下降を控えておく
        */

        cpm = cpm - (cpm - length_reading * duration_min) / 10;
        //console.log(cpm);
        //cpm = length_reading * duration_min;
        //console.log(timestamp.end - timestamp.start, length_reading, duration_min, cpm);
        if (cpm <= 600) {
            gauge.set(cpm); // set actual value
            // if (cpm > threshold.cpm) {
            //     createToast("ゆっくり話してください");
            // }
            line_chart.data.labels.push(str(parseInt(millis() / 1000)));
            //line_chart.data.labels.push(line_chart.data.labels.length + 1);
            line_chart.data.datasets[0].data.push(cpm);
            if (line_chart.data.labels.length > 20000) {
                line_chart.data.labels.shift();
            }
            if (line_chart.data.datasets[0].data.length > 20000) {
                line_chart.data.datasets[0].data.shift();
            }
            line_chart.update();
        }
    }



    var results = kuro.tokenize(myRec.resultString);
    length_reading = 0;
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
        this.html(`<i class="bi bi-mic"></i>`);
    } else {
        myRec.stop();
        this.html(`<i class="bi bi-mic-mute"></i>`);
    }
}



var is_audio_feedback_activated = false;
function toggleAudioFeedback() {
    is_audio_feedback_activated = !is_audio_feedback_activated;
    if (is_audio_feedback_activated == true) {
        this.html(`<i class="bi bi-volume-up"></i>`);
    }
    else {
        this.html(`<i class="bi bi-volume-mute"></i>`);
    }
}


function changedCPMThreshold() {
    threshold.cpm = this.value();
}
function changedSpeechDurationThreshold() {
    threshold.duration = this.value();
}


function startSpeech() {
    //console.log("startSpeech()");
}

function endSpeech() {
    if (is_recognition_activated == true) {
        if (!myRec.resultValue) {
            flg_first_parsing = true;
            flg_long_sentence_warning = false;
            myRec.start(); // start engine
            return;
        }
        if (myRec.resultString.length > 0) {
            //console.log("End");
            document.getElementById("textarea").innerHTML += myRec.resultString + "。";

            var results = kuro.tokenize(myRec.resultString);
            //console.log(results);
            // let length_reading = 0;
            // for (result of results) {
            //     if (result.word_type === 'KNOWN') {
            //         length_reading += result.surface_form.length
            //     }
            // }
            let length_reading = myRec.resultString.length;

            timestamp.end = millis();
            let duration_min = (1000 * 60) / (timestamp.end - timestamp.start);
            let speaking_duration = timestamp.end - timestamp.start;
            if (length_reading > 20) {
                cpm = length_reading * duration_min;
                if (cpm > threshold.cpm) {
                    createToast("ゆっくり話してください");
                    chart_warning_count.data.datasets[0].data[0]++;
                }
                //console.log(timestamp.end - timestamp.start, length_reading, duration_min, cpm);
                if (cpm <= 600) {
                    gauge.set(cpm); // set actual value
                    // feedback_speech
                    if (is_audio_feedback_activated) {
                        feedback_speech.speak(str(parseInt(cpm)));
                    }

                    line_chart.data.labels.push(str(parseInt(millis() / 1000)));
                    line_chart.data.datasets[0].data.push(cpm);
                    if (line_chart.data.labels.length > 20000) {
                        line_chart.data.labels.shift();
                    }
                    if (line_chart.data.datasets[0].data.length > 20000) {
                        line_chart.data.datasets[0].data.shift();
                    }
                    line_chart.update();
                }
            }

            // 話した言葉に、指示代名詞が含まれる場合はグラフにカウントする
            // フィラーの場合は警告
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
                        chart_warning_count.data.datasets[0].data[1]++;
                    }

                    pos_label++;
                }

                if (result.word_type === 'KNOWN' &&
                    result.pos == 'フィラー') {
                    createToast("フィラー「" + result.surface_form + "」が発話されました");
                    chart_warning_count.data.datasets[0].data[2]++;
                }
            }
            //console.log(results);

            myChart.update();
            chart_warning_count.update();
            myRec.resultString = '';
        }

        flg_first_parsing = true;
        flg_long_sentence_warning = false;
        myRec.start(); // start engine
        //console.log("start");
    }
}