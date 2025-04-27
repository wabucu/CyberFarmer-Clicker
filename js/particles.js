particlesJS('particles-js', {
    particles: {
        number: { value: 80 },
        color: { value: '#44ff44' },
        shape: { type: 'circle' },
        opacity: { value: 0.5 },
        size: { value: 3 },
        move: {
            enable: true,
            speed: 0.5,
            direction: 'none',
            random: true
        }
    },
    interactivity: {
        events: {
            onhover: { enable: true, mode: 'repulse' }
        }
    }
});
