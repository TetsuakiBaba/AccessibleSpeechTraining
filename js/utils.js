function createToast(message) {
    var toastTrigger = document.getElementById('liveToastBtn')
    var toastLiveExample = document.getElementById('liveToast')
    var toast = new bootstrap.Toast(toastLiveExample)
    document.getElementById("toast-body").innerHTML = message;
    toast.show()


    if (!feedback_speech.synth.speaking && is_audio_feedback_activated) {
        feedback_speech.speak(message);
    }
}
var toastTrigger = document.getElementById('liveToastBtn')
var toastLiveExample = document.getElementById('liveToast')
if (toastTrigger) {
    toastTrigger.addEventListener('click', function () {
        var toast = new bootstrap.Toast(toastLiveExample)
        toast.show()
    })
}