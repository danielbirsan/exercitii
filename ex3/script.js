
class IntelRadar {

    static possiblePoints(x1, y1, r1, x2, y2, r2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const d = Math.sqrt(dx * dx + dy * dy);

        const sumR = r1 + r2;
        const dR = Math.abs(r1 - r2);

        // Centers coincide
        if (d === 0) {
            if (r1 === r2) {
                return -1; // Same circle
            } else {
                return 0; // Same center, different radius
            }
        }

        // No intersection (too far apart or one circle inside the other)
        if (d > sumR || d < dR) {
            return 0;
        }

        // Tangent circles - outside or inside (I used inequality here to avoid precision issues)
        if (Math.abs(d - sumR) < 1e-6 || Math.abs(d - dR) < 1e-6) {
            return 1;
        }
        // Case: Two intersections 
        return 2;
    }


}
function drawCircle(centerX, centerY, r, context) {
    context.beginPath();
    context.arc(centerX, centerY, r, 0, 2 * Math.PI);
    context.stroke();
}

let x1 = 0, y1 = 0, r1 = 1;
let x2 = 0, y2 = 2, r2 = 1;

const intersectionCount = IntelRadar.possiblePoints(x1, y1, r1, x2, y2, r2);
document.getElementById('intersectionCount').textContent = intersectionCount;

const canvas = document.getElementById('radar');
const ctx = canvas.getContext('2d');

const minX = Math.min(x1 - r1, x2 - r2);
const maxX = Math.max(x1 + r1, x2 + r2);
const minY = Math.min(y1 - r1, y2 - r2);
const maxY = Math.max(y1 + r1, y2 + r2);

const padding = 20;

const logicalWidth = maxX - minX + 2 * padding;
const logicalHeight = maxY - minY + 2 * padding;

const screenW = window.innerWidth * 0.7;
const screenH = window.innerHeight * 0.8;
canvas.width = screenW;
canvas.height = screenH;

const scaleX = screenW / logicalWidth;
const scaleY = screenH / logicalHeight;
const scale = Math.min(scaleX, scaleY);

function toCanvasCoords(x, y) {
    return {
        x: (x - minX + padding) * scale,
        y: (y - minY + padding) * scale
    };
}
ctx.clearRect(0, 0, canvas.width, canvas.height);
ctx.lineWidth = 2;

ctx.strokeStyle = 'darkblue';
const center1 = toCanvasCoords(x1, y1);
drawCircle(center1.x, center1.y, r1 * scale, ctx);

ctx.strokeStyle = 'darkred';
const center2 = toCanvasCoords(x2, y2);
drawCircle(center2.x, center2.y, r2 * scale, ctx);