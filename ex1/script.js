const redCircle = document.getElementById("red-circle");
const blueCircle = document.getElementById("blue-circle");


const redSquare = document.getElementById("red-square");
const blueSquare = document.getElementById("blue-square");

const redCircleInitialX = redCircle.offsetLeft;
const redCircleInitialY = redCircle.offsetTop;
const blueCircleInitialX = blueCircle.offsetLeft;
const blueCircleInitialY = blueCircle.offsetTop;

document.body.addEventListener("dragover", dragOver);
redCircle.addEventListener("dragstart", dragStart);
blueCircle.addEventListener("dragstart", dragStart);
redSquare.addEventListener("drop", dropOnSquare);
blueSquare.addEventListener("drop", dropOnSquare);
redCircle.addEventListener("dragend", dragEnd);
blueCircle.addEventListener("dragend", dragEnd);

function dragStart(e) {
    e.dataTransfer.setData("text", e.target.id);
    e.target.style.opacity = 0.01;
    e.target.style.cursor = "grabbing";
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnd(e) {
    e.preventDefault();
    e.target.style.opacity = 1;
    e.target.style.cursor = "default";
}


function dropOnSquare(e) {
    e.preventDefault();
    const circleId = e.dataTransfer.getData("text");
    const circle = document.getElementById(circleId);

    if (
        (circle.id === "red-circle" && this.id === "red-square") ||
        (circle.id === "blue-circle" && this.id === "blue-square")
    ) {
        const squareRect = this.getBoundingClientRect();
        const circleRect = circle.getBoundingClientRect();

        const centerX = squareRect.left + (squareRect.width - circleRect.width) / 2;
        const centerY = squareRect.top + (squareRect.height - circleRect.height) / 2;

        circle.style.left = centerX + "px";
        circle.style.top = centerY + "px";

        circle.setAttribute("draggable", false);
    } else {
        resetCirclePosition(circle.id);
    }
}


function resetCirclePosition(circleId) {
    if (circleId === "red-circle") {
        redCircle.style.left = redCircleInitialX + "px";
        redCircle.style.top = redCircleInitialY + "px";
        redCircle.style.opacity = 1;

    } else if (circleId === "blue-circle") {
        blueCircle.style.left = blueCircleInitialX + "px";
        blueCircle.style.top = blueCircleInitialY + "px";
        blueCircle.style.opacity = 1;
    }
}

