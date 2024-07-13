import { cubicBezier } from './easing';
import { HealthBar } from './healthbar';
import './style.css'

const canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

canvas.width = 800;
canvas.height = 600;

const canvasHeight = canvas.height;
const canvasWidth = canvas.width;
const viewportScale = window.devicePixelRatio || 1;

canvas.width = canvasWidth * viewportScale;
canvas.height = canvasHeight * viewportScale;

canvas.style.width = canvasWidth + 'px';
canvas.style.height = canvasHeight + 'px';

ctx.scale(viewportScale, viewportScale);

const healthInput = document.getElementById('health') as HTMLInputElement;
const setHeathBtn = document.getElementById('btn') as HTMLButtonElement;
const maxHealthInput = document.getElementById('maxHealth') as HTMLInputElement;
const setMaxHeathBtn = document.getElementById('btnMax') as HTMLButtonElement;
const mode = document.getElementById('mode') as HTMLSelectElement;

let maxHealth = 50;
let showHealth = maxHealth;

const healthBar = new HealthBar(maxHealth, {
  duration: 1,
  updateCallback: (h: number) => {
    showHealth = h;
  },
  // linear
  easingFunction: (t: number) => {
    return t;
  }
});

mode.addEventListener('change', () => {
  if (mode.value === 'pokemon') {
    healthBar.updateConfig({ easingFunction: (t: number) => t });
  } else {
    healthBar.updateConfig({ easingFunction: cubicBezier(.33, .57, .21, 1.0) });
  }
});

setHeathBtn.addEventListener('click', () => {
  const h = Math.max(Math.min(parseFloat(healthInput.value), maxHealth), 0);
  healthBar.setHealth(h);
  if (mode.value === 'pokemon') {
    // pokemon style fixed-speed health change
    healthBar.updateConfig({ duration: Math.max(Math.abs(healthBar.getPrevHealth() - healthBar.getHealth()) / 100, 1) });
  } else {
    healthBar.updateConfig({ duration: 1 });
  }
});

setMaxHeathBtn.addEventListener('click', () => {
  maxHealth = Math.max(parseFloat(maxHealthInput.value), 1);
  if (healthBar.getHealth() > maxHealth) {
    healthBar.hardSetHealth(maxHealth);
  }
});

let lastTime = 0;

const healthPercentage = () => {
  return showHealth / maxHealth;
};

const draw = (t: number) => {
  const deltaTime = t - lastTime;
  lastTime = t;

  healthBar.update(deltaTime / 1000);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const lineWidth = 4;
  ctx.strokeStyle = 'black';
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.rect(50 - lineWidth / 2, 100 - lineWidth / 2, 400 + lineWidth, 10 + lineWidth);
  ctx.stroke();

  ctx.beginPath();
  ctx.fillStyle = 'red';
  ctx.rect(50, 100, 400 * healthPercentage(), 10);
  ctx.fill();

  ctx.fillStyle = 'black';
  ctx.font = "16px sans-serif";
  ctx.fillText(`${showHealth.toFixed(0)}/${maxHealth}`, 225, 130);

  requestAnimationFrame(draw);
}

draw(0);


