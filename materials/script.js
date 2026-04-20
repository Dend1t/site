let count = parseInt(localStorage.getItem('savedCount')) || 0;
let currentSrc = localStorage.getItem('savedSrc') || './materials/smartcat.gif';

const counterDisplay = document.getElementById('counter');
const catImage = document.getElementById('catImage');
const audio = new Audio('./materials/miau.mp3');

counterDisplay.textContent = count;
catImage.src = currentSrc;

function catlicker() {
    count++;
    counterDisplay.textContent = count;

    if (Math.random() >= 0.75) {
        audio.play().catch(e => console.log(e));
    }

    switch (true) {
        case (count < 20):
            currentSrc = './materials/smartcat.gif';
            break;
        case (count < 40):
            currentSrc = './materials/hangcat.jpg';
            break;
        case (count < 60):
            currentSrc = './materials/hypecat.jpg';
            break;
        case (count === 67):
            currentSrc = './materials/67.png';
            break;
        case (count < 80):
            currentSrc = './materials/croissant.jpg';
            break;
        case (count < 100):
            currentSrc = './materials/rigbe.jpg';
            break;
        default:
            currentSrc = './materials/zazuscary.jpg';
            break;
    }

    catImage.src = currentSrc;

    localStorage.setItem('savedCount', count);
    localStorage.setItem('savedSrc', currentSrc);
}

function reset() {
    localStorage.clear();
    location.reload();
}