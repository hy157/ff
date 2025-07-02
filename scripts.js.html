const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let touches = {};

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

canvas.addEventListener('touchstart', handleTouch, { passive: false });
canvas.addEventListener('touchmove', handleTouch, { passive: false });
canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
canvas.addEventListener('touchcancel', handleTouchEnd, { passive: false });

function handleTouch(evt) {
    evt.preventDefault();
    touches = {};
    for (let i = 0; i < evt.touches.length; i++) {
        let t = evt.touches[i];
        touches[t.identifier] = {
            x: t.clientX,
            y: t.clientY
        };
    }
}

function handleTouchEnd(evt) {
    evt.preventDefault();
    touches = {};
    for (let i = 0; i < evt.touches.length; i++) {
        let t = evt.touches[i];
        touches[t.identifier] = {
            x: t.clientX,
            y: t.clientY
        };
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    Object.values(touches).forEach(t => {
        ctx.beginPath();
        ctx.arc(t.x, t.y, 40, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fill();
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#ff9900';
        ctx.stroke();
    });
    requestAnimationFrame(draw);
}
draw();
