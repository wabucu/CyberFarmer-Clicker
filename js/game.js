class CyberFarm {
    constructor() {
        this.wbc = 50; // Стартовый баланс
        this.plants = [];
        this.drones = 0;
        this.plantCost = 10;
        this.droneCost = 50;
        this.harvestValue = 1;
        
        this.initElements();
        this.setupEventListeners();
        this.gameLoop();
        this.updateUI();
    }

    initElements() {
        this.plantBtn = document.getElementById('plantBtn');
        this.harvestBtn = document.getElementById('harvestBtn');
        this.droneBtn = document.getElementById('droneBtn');
        this.farmArea = document.getElementById('farmArea');
        this.plantsCount = document.getElementById('plantsCount');
        this.wbcCount = document.getElementById('wbcCount');
        this.dronesCount = document.getElementById('dronesCount');
        this.eventLog = document.getElementById('eventLog');
    }

    setupEventListeners() {
        this.plantBtn.addEventListener('click', () => this.plant());
        this.harvestBtn.addEventListener('click', () => this.harvest());
        this.droneBtn.addEventListener('click', () => this.buyDrone());
    }

    plant() {
        if (this.wbc >= this.plantCost) {
            this.wbc -= this.plantCost;
            const plant = document.createElement('div');
            plant.className = 'plant';
            plant.textContent = '🌱';
            plant.style.left = `${Math.random() * 80 + 10}%`;
            
            // Анимация роста
            setTimeout(() => {
                plant.textContent = '🌿';
                plant.style.transform = 'scale(1.5)';
            }, 1000);
            
            setTimeout(() => {
                plant.textContent = '🌳';
                plant.style.transform = 'scale(2)';
            }, 2000);
            
            this.farmArea.appendChild(plant);
            this.plants.push(plant);
            this.updateUI();
            this.logEvent('Посажено новое растение!');
        }
    }

    harvest() {
        if (this.plants.length === 0) return;
        
        const harvested = this.plants.length * this.harvestValue;
        this.wbc += harvested;
        
        // Анимация сбора
        this.plants.forEach(plant => {
            plant.textContent = '💰';
            setTimeout(() => plant.remove(), 500);
        });
        
        this.plants = [];
        this.updateUI();
        this.logEvent(`Собрано урожая: +${harvested} WBC!`);
    }

    buyDrone() {
        if (this.wbc >= this.droneCost) {
            this.wbc -= this.droneCost;
            this.drones++;
            
            // Создаем дрон
            const drone = document.createElement('div');
            drone.className = 'drone';
            drone.textContent = '🛸';
            drone.style.top = `${Math.random() * 100}px`;
            drone.style.animationDuration = `${5 - this.drones * 0.5}s`;
            this.farmArea.appendChild(drone);
            
            this.updateUI();
            this.logEvent('Активирован новый дрон!');
        }
    }

    gameLoop() {
        setInterval(() => {
            // Автоматический доход от дронов
            if (this.drones > 0) {
                const droneIncome = this.drones * 0.5;
                this.wbc += droneIncome;
                this.updateUI();
            }
        }, 1000);
    }

    updateUI() {
        this.plantsCount.textContent = this.plants.length;
        this.wbcCount.textContent = Math.floor(this.wbc);
        this.dronesCount.textContent = this.drones;
        
        this.plantBtn.disabled = this.wbc < this.plantCost;
        this.droneBtn.disabled = this.wbc < this.droneCost;
        this.plantBtn.textContent = `🌱 Посадить (${this.plantCost} WBC)`;
        this.droneBtn.textContent = `🛸 Купить дрон (${this.droneCost} WBC)`;
    }

    logEvent(message) {
        const event = document.createElement('div');
        event.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        this.eventLog.prepend(event);
        
        if (this.eventLog.children.length > 5) {
            this.eventLog.removeChild(this.eventLog.lastChild);
        }
    }
}

// Запуск игры при загрузке страницы
window.addEventListener('load', () => {
    const game = new CyberFarm();
});
