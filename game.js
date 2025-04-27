let clickCount = 0;

// Настройки контракта
const contractAddress = "ВАШ_АДРЕС_КОНТРАКТА";
const abi = [{"inputs":[{"internalType":"address","name":"_tokenAddress","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"harvest","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"rewardPerClick","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_newReward","type":"uint256"}],"name":"setReward","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"token","outputs":[{"internalType":"contract IWBC","name":"","type":"address"}],"stateMutability":"view","type":"function"}];

async function connectWallet() {
    if (window.ethereum) {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            window.web3 = new Web3(window.ethereum);
            document.getElementById("harvestBtn").disabled = false;
        } catch (error) {
            console.error(error);
        }
    }
}

document.getElementById("harvestBtn").addEventListener("click", async () => {
    const accounts = await web3.eth.getAccounts();
    const gameContract = new web3.eth.Contract(abi, contractAddress);
    
    try {
        await gameContract.methods.harvest().send({ from: accounts[0] });
        clickCount++;
        document.getElementById("harvestBtn").innerHTML = `🌾 Сжать! (${clickCount} кликов)`;
        alert("Урожай собран! Проверьте баланс $WBC");
    } catch (err) {
        alert("Ошибка: " + err.message);
    }
});

// Инициализация
connectWallet();
