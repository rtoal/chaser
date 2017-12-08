const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const progressBar = document.querySelector("progress");

document.body.addEventListener("mousemove", updateMouse);

canvas.addEventListener("click", () => {
  if (game.isOver()) {
    game.start();
  }
});

const game = {
  start() {
    progressBar.value = 100;
    Object.assign(player, { x: canvas.width / 2, y: canvas.height / 2 });
    requestAnimationFrame(drawScene);
  },
  isOver() {
    return progressBar.value <= 0;
  }
};

class Sprite {
  constructor(x, y, radius, color, speed) {
    Object.assign(this, { x, y, radius, color, speed });
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  collidedWith(other) {
    const distanceBetween = Math.hypot(this.x - other.x, this.y - other.y);
    return distanceBetween < this.radius + other.radius;
  }
  moveToward(target) {
    this.x += (target.x - this.x) * this.speed;
    this.y += (target.y - this.y) * this.speed;
  }
  pushOffFrom(other) {
    let [dx, dy] = [other.x - this.x, other.y - this.y];
    const distanceBetween = Math.hypot(dx, dy);
    let distanceToMove = this.radius + other.radius - distanceBetween;
    if (distanceToMove > 0) {
      dx /= distanceBetween;
      dy /= distanceBetween;
      this.x -= dx * distanceToMove / 2;
      this.y -= dy * distanceToMove / 2;
      other.x += dx * distanceToMove / 2;
      other.y += dy * distanceToMove / 2;
    }
  }
}

class Player extends Sprite {
  constructor(x, y, radius, color, speed) {
    super(x, y, radius, color, speed);
    this.image = new Image();
    this.image.src = "https://image.ibb.co/fPcP2w/8_Bit_Character_1_copy.png";
  }
  draw() {
    ctx.drawImage(
      this.image,
      this.x - this.radius / 2,
      this.y - this.radius / 2,
      this.radius,
      this.radius
    );
  }
}

let player = new Player(250, 150, 30, "lemonchiffon", 0.07);

class Enemy extends Sprite {
  constructor(x, y, radius, color, speed) {
    super(x, y, radius, color, speed);
  }
}

let enemies = [
  new Enemy(80, 200, 20, "rgba(250, 0, 50, 0.8)", 0.02),
  new Enemy(200, 250, 17, "rgba(200, 100, 0, 0.7)", 0.01),
  new Enemy(150, 180, 22, "rgba(50, 10, 70, 0.5)", 0.002),
  new Enemy(0, 200, 10, "rgba(250, 210, 70, 0.6)", 0.008),
  new Enemy(400, 400, 15, "rgba(0, 200, 250, 0.6)", 0.008)
];

let mouse = { x: 0, y: 0 };
function updateMouse(event) {
  const { left, top } = canvas.getBoundingClientRect();
  mouse.x = event.clientX - left;
  mouse.y = event.clientY - top;
}

function updateScene() {
  player.moveToward(mouse);
  enemies.forEach(enemy => enemy.moveToward(player));
  for (let i = 0; i < enemies.length; i++) {
    for (let j = i + 1; j < enemies.length; j++) {
      pushOff(enemies[i], enemies[j]);
    }
  }
  enemies.forEach(enemy => {
    if (enemy.collidedWith(player)) {
      progressBar.value -= 0.5;
    }
  });
}

function clearBackground() {
  ctx.fillStyle = "lightgreen";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawScene() {
  clearBackground();
  player.draw();
  enemies.forEach(enemy => enemy.draw());
  updateScene();
  if (progressBar.value <= 0) {
    ctx.font = "30px Arial";
    ctx.fillText("Game over, click to play again", 10, 50);
  } else {
    requestAnimationFrame(drawScene);
  }
}

requestAnimationFrame(drawScene);
