let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let drawing = false;
let eraseMode = false;
let socket = io.connect("http://127.0.0.1:8080");

// Set up initial canvas dimensions
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Drawing settings
ctx.strokeStyle = "black";
ctx.lineWidth = 2;

let eraserBtn = document.getElementById("eraserBtn");
eraserBtn.addEventListener("click", () => {
  eraseMode = !eraseMode;
  if (eraseMode) {
    ctx.strokeStyle = "white";
    ctx.lineWidth = 20;
    eraserBtn.textContent = "Switch to Draw Mode";
  } else {
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    eraserBtn.textContent = "Switch to Erase Mode";
  }
});

canvas.addEventListener("mousedown", (e) => {
  drawing = true;
  ctx.beginPath();
  ctx.moveTo(e.clientX, e.clientY);
  socket.emit("startDrawing", { x: e.clientX, y: e.clientY, eraseMode });
});

canvas.addEventListener("mousemove", (e) => {
  if (drawing) {
    ctx.lineTo(e.clientX, e.clientY);
    ctx.stroke();
    socket.emit("drawing", { x: e.clientX, y: e.clientY, eraseMode });
  }
});

canvas.addEventListener("mouseup", () => {
  drawing = false;
});

// Socket listeners for real-time drawing
socket.on("startDrawing", (data) => {
  ctx.beginPath();
  ctx.moveTo(data.x, data.y);
  if (data.eraseMode) {
    ctx.strokeStyle = "white";
    ctx.lineWidth = 20;
  } else {
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
  }
});

socket.on("drawing", (data) => {
  ctx.lineTo(data.x, data.y);
  ctx.stroke();
  if (data.eraseMode) {
    ctx.strokeStyle = "white";
    ctx.lineWidth = 20;
  } else {
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
  }
});
