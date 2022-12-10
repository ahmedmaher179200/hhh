const outputElement = document.querySelector("#output");
const uploadBtn = document.querySelector("#uploadBtn");
const btn = document.querySelector("#btn");
const talkBtn = document.querySelector("#talk");
const downloadBtn = document.querySelector("#downloadBtn");
var synthesis = window.speechSynthesis;
var voice = synthesis.getVoices().filter(function (voice) {
    return voice.lang === "en";
})[0];

function showTalkBtn(text) {
    talkBtn.style.display = "block";
    talkBtn.addEventListener("click", () => {
        if ("speechSynthesis" in window) {
            // Create an utterance object
            var utterance = new SpeechSynthesisUtterance(text);

            // Set utterance properties
            utterance.voice = voice;
            utterance.pitch = 1;
            utterance.rate = 1;
            utterance.volume = 0.8;

            // Speak the utterance
            synthesis.speak(utterance);
        } else {
            console.log("Text-to-speech not supported.");
        }
    });
}

var mp3_url =
    "https://media.geeksforgeeks.org/wp-content/uploads/20190531135120/beep.mp3";
const audio = new Audio(mp3_url);
function play(binaryText) {
    const binaryArray = binaryText.split("");
    let vibrationArray = [];
    binaryArray.forEach((binaryNumber, index) => {
        setTimeout(() => {
            if (binaryNumber == "0") {
                outputElement.textContent = "Don't vibrate";
            } else {
                outputElement.textContent = "Vibrate";
                audio.play();
                window.navigator.vibrate(100);
            }
        }, 500 * index);
    });
}
btn.addEventListener("click", (e) => {
    fetch(
        "https://test.ahmed.center/hackathon/api/summarization/binary?text="
            .then((res) => {
                return res.text();
            })
            .then((binaryText) => {
                play(binaryText);
            })
            .catch((error) => {
                if (error) outputElement.textContent = error;
            });
});

uploadBtn.addEventListener("click", async () => {
    let fileElement = document.getElementById("fileInput");
    // check if user had selected a file
    if (fileElement.files.length === 0) {
        alert("please choose a file");
        return;
    }
    let file = fileElement.files[0];
    let formData = new FormData();
    formData.set("file", file);
    fetch("https://ibwahim.azurewebsites.net/upload", {
        method: "POST",
        body: formData,
    })
        .then((data) => {
            return data.text();
        })
        .then((text) => {
            uploadResponse.textContent = "Backend response" + text;
            downloadBtn.href = "data:text/html," + text;
            showTalkBtn(text);
        });
});
