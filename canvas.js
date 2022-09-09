// beginPath()와 closePath() 메소드 사이에 모든 명령어가 들어간다.
// rect(좌측 간격, 상단 간격, 너비, 높이)
// arc(원의 중심값 x, 원의 중심값 y, 반지름, 시작 각도와 끝 각도 radian, 그리는 방향 true, false )
const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
const btnOn = document.querySelector(".btn-on");
const btnOff = document.querySelector(".btn-off");

const ballRadius = 10;

let x = canvas.width / 2;
let y = canvas.height - 30;

let dx = +2;
let dy = -2;

let rightPressed = false;
let leftPressed = false;

const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

// 블럭
// 블럭 갯수 조정
let brickRowCount = 2;
let brickColumnCount = 5;

// 블럭 크기와 위치
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

// 점수
let score = 0;

// 목숨
let lives = 3;

// 벽돌 생성 함수
function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status == 1) {
        let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

// 공 생성 함수
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

// 바 생성 함수
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

const color = () => {
  ctx.fillStyle = "red";
  ctx.fill();
};

// 그리자!
function draw() {
  // 화면 초기화
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 함수 호출
  drawBricks();
  drawBall();
  drawScore();
  drawLives();
  collisionDetection();

  // 공이 부딪힐시 방향 전환
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
      dy += -1;
      // 속도 표시
      speed(dy);
    } else {
      lives--;
      if (!lives) {
        alert("GAME OVER");
        document.location.reload();
      } else {
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 2;
        dy = -2;
        paddleX = (canvas.width - paddleWidth) / 2;
        speed(dy);
      }
    }
  }
  x += dx;
  y += dy;

  // 바
  drawPaddle();
  // 바 이동 속도
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 5;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 5;
  }
  requestAnimationFrame(draw);
}

// 37은 왼쪽 방향키, 39는 오른쪽 방향키
// 방향키 이동
function keyDownHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = true;
  } else if (e.keyCode == 37) {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = false;
  } else if (e.keyCode == 37) {
    leftPressed = false;
  }
}

function mouseMoveHandler(e) {
  let relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > paddleWidth && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 1;
  }
}

// 출돌 감지 함수
function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r];
      if (b.status == 1) {
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          dy = -dy;
          b.status = 0;
          color();
          score++;
          if (score == brickRowCount * brickColumnCount) {
            alert(`you win your score ${score}`);
            document.location.reload();
          }
        }
      }
    }
  }
}

function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score: " + score, 8, 20);
}

function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

const speed = (dy) => {
  const speed = document.querySelector(".game_monitor");
  let speedNum = Math.abs(dy.toFixed(1));
  speed.innerText = `스피드 ${speedNum}`;
};

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

draw();
