// =============================
// CONFIGURACIÓN INICIAL
// =============================
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// =============================
// CARGA DE FONDOS
// =============================
const fondos = [
  { nombre: "ciudad", img: "sprites/biomas/ciudad.png" },
  { nombre: "bosque", img: "sprites/biomas/bosque.png" },
  { nombre: "base", img: "sprites/biomas/base.png" },
  { nombre: "desierto", img: "sprites/biomas/desierto.png" },
  { nombre: "cementerio", img: "sprites/biomas/cementerio.png" },
  { nombre: "volcan", img: "sprites/biomas/volcan.png" },
  { nombre: "isla", img: "sprites/biomas/isla.png" },
  { nombre: "cueva", img: "sprites/biomas/cueva.png" },
  { nombre: "ruinas", img: "sprites/biomas/ruinas.png" },
  { nombre: "fabrica", img: "sprites/biomas/fabrica.png" },
];

let fondoIndex = 0;
let fondo = new Image();
fondo.src = fondos[fondoIndex].img;

// =============================
// CARGA DE SPRITES
// =============================
const spriteSheet = new Image();
spriteSheet.src = 'sprites/sprite_sheet.png';

const spriteWidth = 64;
const spriteHeight = 64;
let gameFrame = 0;
const staggerFrames = 6;

// =============================
// ENTIDADES
// =============================
let jugador = {
  x: 100,
  y: 400,
  frameX: 0,
  frameY: 0,
  width: 64,
  height: 64,
  velocidad: 3, // 🔽 velocidad reducida para mejor control
  saltando: false,
  velY: 0,
};

let enemigos = [];
let nivel = 1;
let dañoBala = 1; // daño base

function generarEnemigos() {
  enemigos = [];
  const cantidad = 2 + nivel;
  for (let i = 0; i < cantidad; i++) {
    enemigos.push({
      x: 600 + i * 150,
      y: 400,
      vida: 2 + nivel,
      velocidad: 1 + nivel * 0.3,
    });
  }
  console.log(`⚔️ Nivel ${nivel}: ${cantidad} enemigos generados`);
}

let balas = [];

// =============================
// CONTROL
// =============================
const keys = {};
window.addEventListener('keydown', (e) => keys[e.key] = true);
window.addEventListener('keyup', (e) => keys[e.key] = false);

// =============================
// MOVIMIENTO Y DIBUJO
// =============================
function moverJugador() {
  if (keys['ArrowRight']) jugador.x += jugador.velocidad;
  if (keys['ArrowLeft']) jugador.x -= jugador.velocidad;

  if (keys['ArrowUp'] && !jugador.saltando) {
    jugador.velY = -8; // 🔽 salto más suave
    jugador.saltando = true;
  }

  jugador.y += jugador.velY;
  jugador.velY += 0.5;
  if (jugador.y >= 400) {
    jugador.y = 400;
    jugador.velY = 0;
    jugador.saltando = false;
  }

  if (keys[' ']) disparar();
}

let tiempoUltimoDisparo = 0;
function disparar() {
  const ahora = Date.now();
  if (ahora - tiempoUltimoDisparo > 300) {
    balas.push({ x: jugador.x + 50, y: jugador.y + 25 });
    tiempoUltimoDisparo = ahora;
  }
}

function drawJugador() {
  let animFrame = Math.floor(gameFrame / staggerFrames) % 4;
  ctx.drawImage(spriteSheet, animFrame * spriteWidth, 0, spriteWidth, spriteHeight, jugador.x, jugador.y, jugador.width, jugador.height);
}

function drawBalas() {
  balas.forEach((bala, index) => {
    bala.x += 10;
    ctx.drawImage(spriteSheet, 0, 3 * spriteHeight, 64, 64, bala.x, bala.y, 32, 32);

    enemigos.forEach((ene, iE) => {
      if (bala.x < ene.x + spriteWidth &&
          bala.x + 16 > ene.x &&
          bala.y < ene.y + spriteHeight &&
          bala.y + 16 > ene.y) {
        ene.vida -= dañoBala;
        balas.splice(index, 1);
        if (ene.vida <= 0) enemigos.splice(iE, 1);
      }
    });
    if (bala.x > canvas.width) balas.splice(index, 1);
  });
}

function drawEnemigos() {
  enemigos.forEach(enemigo => {
    let animFrame = Math.floor(gameFrame / (staggerFrames * 2)) % 3;
    ctx.drawImage(spriteSheet, animFrame * spriteWidth, 2 * spriteHeight, spriteWidth, spriteHeight, enemigo.x, enemigo.y, 64, 64);
    enemigo.x -= enemigo.velocidad;
    if (enemigo.x < -64) enemigo.x = canvas.width + Math.random() * 200;
  });

  if (enemigos.length === 0) cambiarBioma();
}

function cambiarBioma() {
  fondoIndex++;
  if (fondoIndex >= fondos.length) {
    volverAlMenu();
    return;
  }
  fondo.src = fondos[fondoIndex].img;
  nivel++;
  dañoBala += 0.5;
  generarEnemigos();

  mostrarTextoNivel(`Nivel ${nivel}: ${fondos[fondoIndex].nombre.toUpperCase()} (Daño x${dañoBala.toFixed(1)})`);
  console.log(`🌍 Cambió a bioma: ${fondos[fondoIndex].nombre} | Daño actual: ${dañoBala}`);
}

function mostrarTextoNivel(texto) {
  let alpha = 0;
  const interval = setInterval(() => {
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.font = "bold 36px Arial";
    ctx.textAlign = "center";
    ctx.fillText(texto, canvas.width / 2, 100);
    alpha += 0.05;
    if (alpha >= 1) {
      clearInterval(interval);
      setTimeout(() => ctx.clearRect(0, 0, canvas.width, 120), 1500);
    }
  }, 50);
}

function volverAlMenu() {
  cancelAnimationFrame(animFrameId);
  let alpha = 0;
  const fadeInterval = setInterval(() => {
    ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.font = "bold 48px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Misión Completada", canvas.width / 2, canvas.height / 2);
    alpha += 0.02;
    if (alpha >= 1) {
      clearInterval(fadeInterval);
      setTimeout(() => {
        const menu = document.getElementById('menu');
        menu.style.display = 'flex';
        menu.classList.remove('desaparecer');
      }, 2000);
    }
  }, 50);
}

const palabras = ["Hello", "World", "Cat", "Dog", "House", "Car", "Book", "Sun", "Moon", "Tree"];
let palabraIndex = 0;
setInterval(() => {
  palabraIndex = (palabraIndex + 1) % palabras.length;
  document.getElementById('word').innerText = palabras[palabraIndex];
}, 5000);

let animFrameId;
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(fondo, 0, 0, canvas.width, canvas.height);
  moverJugador();
  drawJugador();
  drawBalas();
  drawEnemigos();
  gameFrame++;
  animFrameId = requestAnimationFrame(animate);
}

spriteSheet.onload = () => {
  generarEnemigos();
  animate();
};
