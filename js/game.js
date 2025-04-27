// Конфигурация токена WBC
const WBC_CONTRACT = '0xc41dd553125ca202d9fbe133c38cfd1ffd0c2444';
const WBC_ABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function decimals() view returns (uint8)"
];

class CyberFarm {
    constructor() {
        this.wbc = 50; // Игровая валюта
        this.plants = [];
        this.connected = false;
        this.tokenBalance = 0;
        this.tokenDecimals = 18;
        
        this.initElements();
        this.setupEventListeners();
        this.checkWalletConnection();
    }

    initElements() {
        this.connectBtn = document.getElementById('connectBtn');
        this.plantBtn = document.getElementById('plantBtn');
        this.harvestBtn = document.getElementById('harvestBtn');
        this.walletStatus = document.getElementById('walletStatus');
        this.plantsCount = document.getElementById('plantsCount');
        this.wbcCount = document.getElementById('wbcCount');
        this.tokenBalanceEl = document.getElementById('tokenBalance');
        this.farmArea = document.getElementById('farmArea');
    }

    setupEventListeners() {
        this.connectBtn.addEventListener('click', () => this.connectWallet());
        this.plantBtn.addEventListener('click', () => this.plant());
        this.harvestBtn.addEventListener('click', () => this.harvest());
    }

    async checkWalletConnection() {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                if (accounts.length > 0) {
                    this.connected = true;
                    this.updateWalletStatus(accounts[0]);
                    this.loadTokenBalance(accounts[0]);
                }
            } catch (error) {
                console.error("Ошибка проверки кошелька:", error);
            }
        }
    }

    async connectWallet() {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                this.connected = true;
                this.updateWalletStatus(accounts[0]);
                this.loadTokenBalance(accounts[0]);
                
                // Слушаем изменения аккаунта
                window.ethereum.on('accountsChanged', (accounts) => {
                    if (accounts.length > 0) {
                        this.updateWalletStatus(accounts[0]);
                        this.loadTokenBalance(accounts[0]);
                    } else {
                        this.handleDisconnect();
                    }
                });
                
                // Слушаем изменения сети
                window.ethereum.on('chainChanged', () => {
                    window.location.reload();
                });
                
            } catch (error) {
                console.error("Ошибка подключения:", error);
                this.walletStatus.textContent = "🔴 Ошибка подключения";
            }
        } else {
            alert("Установите MetaMask!");
        }
    }

    handleDisconnect() {
        this.connected = false;
        this.walletStatus.innerHTML = "🔴 MetaMask не подключен";
        this.plantBtn.disabled = true;
        this.harvestBtn.disabled = true;
        this.tokenBalanceEl.textContent = "0";
    }

    updateWalletStatus(address) {
        const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;
        this.walletStatus.innerHTML = `🟢 Подключен: <strong>${shortAddress}</strong>`;
        this.plantBtn.disabled = false;
        this.harvestBtn.disabled = false;
    }

    async loadTokenBalance(address) {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(WBC_CONTRACT, WBC_ABI, provider);
            
            // Получаем decimals
            this.tokenDecimals = await contract.decimals();
            
            // Получаем баланс
            const balance = await contract.balanceOf(address);
            this.tokenBalance = ethers.utils.formatUnits(balance, this.tokenDecimals);
            this.tokenBalanceEl.textContent = parseFloat(this.tokenBalance).toFixed(2);
            
        } catch (error) {
            console.error("Ошибка загрузки баланса:", error);
            this.tokenBalanceEl.textContent = "Ошибка";
        }
    }

    plant() {
        if (this.wbc >= 10) {
            this.wbc -= 10;
            const plant = document.createElement('div');
            plant.className = 'plant';
            plant.textContent = '🌱';
            plant.style.left = `${Math.random() * 80 + 10}%`;
            
            setTimeout(() => plant.textContent = '🌿', 1000);
            setTimeout(() => plant.textContent = '🌳', 2000);
            
            this.farmArea.appendChild(plant);
            this.plants.push(plant);
            this.updateUI();
        }
    }

    harvest() {
        if (this.plants.length === 0) return;
        
        const harvested = this.plants.length * 1;
        this.wbc += harvested;
        
        this.plants.forEach(plant => plant.remove());
        this.plants = [];
        this.updateUI();
    }

    updateUI() {
        this.plantsCount.textContent = this.plants.length;
        this.wbcCount.textContent = this.wbc;
        this.plantBtn.disabled = !this.connected || this.wbc < 10;
        this.harvestBtn.disabled = !this.connected || this.plants.length === 0;
    }
}

// Запуск игры
window.addEventListener('load', () => {
    const game = new CyberFarm();
});
