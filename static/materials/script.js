let count = parseInt(localStorage.getItem('savedCount')) || 0;
let currentSrc = localStorage.getItem('savedSrc') || '/static/materials/smartcat.gif';
const audio = new Audio('/static/materials/miau.mp3');

function catlicker() {
    count++;

    const counterDisplay = document.getElementById('counter');
    if (counterDisplay) {
        counterDisplay.textContent = count;
    }

    if (Math.random() >= 0.75) {
        audio.play().catch(e => console.log(e));
    }

    switch (true) {
        case (count%100 < 16):
            currentSrc = '/static/materials/smartcat.gif';
            break;
        case (count%100 < 32):
            currentSrc = '/static/materials/hangcat.jpg';
            break;
        case (count%100 < 48):
            currentSrc = '/static/materials/hypecat.jpg';
            break;
        case (count%100 === 67):
            currentSrc = '/static/materials/67.png';
            break;
        case (count%100 < 65):
            currentSrc = '/static/materials/croissant.jpg';
            break;
        case (count < 81):
            currentSrc = '/static/materials/rigbe.jpg';
            break;
        default:
            currentSrc = '/static/materials/zazuscary.jpg';
            break;
    }

    const catImage = document.getElementById('catImage');
    if (catImage) {
        catImage.src = currentSrc;
    }

    localStorage.setItem('savedCount', count);
    localStorage.setItem('savedSrc', currentSrc);
}

function resetProgress() {
    localStorage.clear();
    location.reload();
}

async function saveProgress() {
    const username = document.getElementById('username').value;
    await fetch('/api/click', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, clicks: count})
    });
    loadLeaderboard();
}

async function loadLeaderboard(sortBy = 'clicks') {
    try {
        const response = await fetch(`/api/leaderboard?sort=${sortBy}`);
        const data = await response.json();
        const tbody = document.getElementById('leaderboard-body');
        if (!tbody) return;

        tbody.innerHTML = '';

        data.forEach(player => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="cell-name">${player.username}</td>
                <td class="cell-points">${player.clicks}</td>
            `;
            tbody.appendChild(row);
        });
    } catch (e) {
        console.error("Ошибка загрузки лидерборда:", e);
    }
}

async function deletePlayer(username) {
    const password = prompt("Введите пароль администратора для удаления:");
    if (!password) return;

    const response = await fetch('/api/admin/delete-player', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, secret: password})
    });

    if (response.ok) {
        loadLeaderboard();
    } else {
        alert("Неверный пароль!");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const counterDisplay = document.getElementById('counter');
    const catImage = document.getElementById('catImage');

    if (counterDisplay) counterDisplay.textContent = count;
    if (catImage) catImage.src = currentSrc;

    loadLeaderboard();
});