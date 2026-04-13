const canvas = document.getElementById("draw");
const ctx = canvas.getContext("2d");

// Initialize canvas background
function resetCanvas() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
}
resetCanvas();

let drawing = false;


canvas.addEventListener("mousedown", e => {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
});

canvas.addEventListener("mouseup", () => {
    drawing = false;
    ctx.beginPath();
});

canvas.addEventListener("mouseleave", () => {
    drawing = false;
    ctx.beginPath();
});

canvas.addEventListener("mousemove", e => {
    if (!drawing) return;

    ctx.lineWidth = 12;
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";

    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
});


document.getElementById("clearBtn").addEventListener("click", () => {
    resetCanvas();
    document.getElementById("result").textContent = "";
});


document.getElementById("predictBtn").addEventListener("click", () => {

    canvas.toBlob(async blob => {
        if (!blob) {
            alert("Canvas is empty.");
            return;
        }

        const form = new FormData();
        form.append("file", blob, "drawing.png");

        try {
            const res = await fetch(window.ENV.API_URL, {
                method: "POST",
                body: form
            });

            const data = await res.json();
            document.getElementById("result").textContent =
                `Prediction: ${data.prediction}`;

        } catch (err) {
            alert("Prediction failed: " + err.message);
        }

    }, "image/png");
});
