let userAddress = null;
let clickCount = 0;

// 1. Подключение кошелька
document.getElementById('connectBtn').addEventListener('click', async () => {
    if (window.ethereum) {
        try {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            userAddress = accounts[0];
            
            // Проверяем сохраненные данные
            const savedData = localStorage.getItem(userAddress);
            if (savedData) {
                clickCount = parseInt(savedData);
            }
            
            updateUI();
        } catch (error) {
            alert("Ошибка подключения: " + error.message);
        }
    } else {
        alert("Установите MetaMask!");
    }
});

// 2. Логика кликов
document.getElementById('clickBtn').addEventListener('click', () => {
    clickCount++;
    localStorage.setItem(userAddress, clickCount.toString());
    updateUI();
});

// 3. Обновление интерфейса
function updateUI() {
    document.getElementById('connectBtn').disabled = true;
    document.getElementById('clickBtn').disabled = false;
    document.getElementById('clickBtn').innerHTML = `🌾 Сжать! (${clickCount} кликов)`;
    document.getElementById('address').innerHTML = `Адрес: ${userAddress}`;
}
