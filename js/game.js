class CyberFarm {
    constructor() {
        this.oxygen = 100;
        this.drones = 0;
        this.clicks = 0;
        this.achievements = {
            firstClick: false,
            tenClicks: false
        };
    }

    init() {
        this.loadProgress();
        this.setupEventListeners();
        this.renderDrones();
        setInterval(() => this.autoHarvest(), 1000);
    }

    setupEventListeners() {
        document.getElementById('harvestBtn').addEventListener('click', () => this.harvest());
        document.getElementById('buyDroneBtn').addEventListener('click', () => this.buyDrone());
        
        window.addEventListener('beforeunload', () => {
            localStorage.setItem('cyberFarmProgress', JSON.stringify({
                oxygen: this.oxygen,
                drones: this.drones,
                clicks: this.clicks
            }));
        });
    }

    harvest() {
        this.clicks++;
        this.oxygen += 1 + Math.floor(this.drones * 0.5);
        this.checkAchievements();
        this.updateUI();
    }

    buyDrone() {
        if(this.oxygen >= 50) {
            this.oxygen -= 50;
            this.drones++;
            this.renderDrones();
            this.showToast('🛸 Дрон активирован!');
        }
    }

    autoHarvest() {
        this.oxygen += this.drones * 0.1;
        this.updateUI();
    }

    renderDrones() {
        const container = document.querySelector('.drones-container');
        container.innerHTML = '';
        
        for(let i = 0; i < this.drones; i++) {
            const drone = document.createElement('img');
            drone.src = 'assets/images/drone.webp';
            drone.classList.add('drone');
            drone.style.animation = `fly${i % 3} 5s infinite`;
            container.appendChild(drone);
        }
    }

    showToast(message) {
        const toast = document.getElementById('achievementToast');
        toast.textContent = message;
        toast.style.right = '20px';
        setTimeout(() => toast.style.right = '-300px', 3000);
    }
}

// Инициализация игры
const game = new CyberFarm();
game.init();
