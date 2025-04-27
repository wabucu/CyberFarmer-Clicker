class CyberFarmGame {
    constructor() {
        this.oxygen = 100;
        this.drones = 0;
        this.clicks = 0;
        this.isConnected = false;
        
        this.initElements();
        this.setupEventListeners();
    }

    initElements() {
        this.connectBtn = document.getElementById('connectBtn');
        this.harvestBtn = document.getElementById('harvestBtn');
        this.buyDroneBtn = document.getElementById('buyDroneBtn');
        this.walletStatus = document.getElementById('walletStatus');
        this.oxygenDisplay = document.getElementById('oxygenValue');
        this.dronesDisplay = document.getElementById('dronesCount');
        this.clicksDisplay = document.getElementById('clicksCount');
    }

    setupEventListeners() {
        this.connectBtn.addEventListener('click', () => this.connectWallet());
        this.harvestBtn.addEventListener('click', () => this.harvest());
        this.buyDroneBtn.addEventListener('click', () => this.buyDrone());
    }

    async connectWallet() {
        if (typeof window.ethereum !== 'undefined') {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                this.isConnected = true;
                this.walletStatus.innerHTML = `🟢 Подключен: ${accounts[0].slice(0,6)}...${accounts[0].slice(-4)}`;
                this.harvestBtn.disabled = false;
                this.buyDroneBtn.disabled = false;
                
                // Слушаем изменения аккаунта
                window.ethereum.on('accountsChanged', (accounts) => {
                    if (accounts.length === 0) {
                        this.handleDisconnect();
                    }
                });
            } catch (error) {
                console.error("Ошибка подключения:", error);
            }
        } else {
            alert("Установите MetaMask!");
        }
    }

    handleDisconnect() {
        this.isConnected = false;
        this.walletStatus.innerHTML = "🔴 Кошелек отключен";
        this.harvestBtn.disabled = true;
        this.buyDroneBtn.disabled = true;
    }

    harvest() {
        if (!this.isConnected) return;
        
        this.clicks++;
        this.oxygen += 1 + Math.floor(this.drones * 0.5);
        this.updateUI();
        
        // Анимация
        this.harvestBtn.textContent = `🌾 Сжать (${this.clicks})`;
        this.harvestBtn.style.transform = 'scale(1.1)';
        setTimeout(() => {
            this.harvestBtn.style.transform = 'scale(1)';
        }, 200);
    }

    buyDrone() {
        if (this.oxygen >= 50 && this.isConnected) {
            this.oxygen -= 50;
            this.drones++;
            this.updateUI();
            
            // Добавляем ASCII-дрона
            const farmArea = document.getElementById('farmArea');
            const drone = document.createElement('div');
            drone.textContent = '🛸';
            drone.style.position = 'absolute';
            drone.style.left = `${Math.random() * 80 + 10}%`;
            farmArea.appendChild(drone);
            
            // Анимация полета
            let pos = 0;
            const flyInterval = setInterval(() => {
                pos += 5;
                drone.style.top = `${pos}px`;
                if (pos > 100) {
                    clearInterval(flyInterval);
                    drone.remove();
                }
            }, 100);
        }
    }

    updateUI() {
        this.oxygenDisplay.textContent = Math.floor(this.oxygen);
        this.dronesDisplay.textContent = this.drones;
        this.clicksDisplay.textContent = this.clicks;
        this.buyDroneBtn.textContent = `🛸 Купить дрон (50 WBC)`;
    }
}

// Инициализация игры при загрузке страницы
window.addEventListener('load', () => {
    const game = new CyberFarmGame();
});
