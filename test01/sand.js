const canvas = document.getElementById('sandCanvas');
const ctx = canvas.getContext('2d');

const width = canvas.width;
const height = canvas.height;
const sandColor = ['#C2B280', '#E0C9A2', '#E9D6AA', '#F0E2B8']
const sandSize = 5;


const sandParticles = [];

const waterColor = '#0000FF';
const waterParticles = [];


const dirtColor = ['#8B4513', '#A0522D', '#CD853F', '#D2691E', '#8B4513', '#A0522D', '#CD853F', '#D2691E', '#8B4513', '#A0522D', '#CD853F', '#D2691E', '#8B4513', '#A0522D', '#CD853F', '#D2691E', '#8B4513', '#A0522D', '#CD853F', '#D2691E', '#8B4513', '#A0522D', '#CD853F', '#D2691E', '#8B4513', '#A0522D', '#CD853F', '#D2691E', '#8B4513', '#A0522D', '#CD853F', '#D2691E', '#8B4513', '#A0522D', '#CD853F', '#D2691E', '#8B4513', '#A0522D', '#CD853F', '#D2691E', '#8B4513', '#A0522D', '#CD853F', '#D2691E', '#8B4513', '#A0522D', '#CD853F', '#D2691E'];
const dirtParticles = [];

let inserting = "sand";
let deleting = false;


const sandGrid = new Array(height);
for (let y = 0; y < height; y++) {
    sandGrid[y] = new Array(width).fill(null);
}

canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    let curr_x = Math.floor(mouseX / sandSize) * sandSize;
    let curr_y = Math.floor(mouseY / sandSize) * sandSize;

    const amount = 10;
    for (let i = 0; i < amount; i++) {

        //llenar una esfera de material
        let x = curr_x + Math.floor(Math.random() * sandSize * 3) * (Math.random() > 0.5 ? 1 : -1);
        let y = curr_y + Math.floor(Math.random() * sandSize * 3) * (Math.random() > 0.5 ? 1 : -1);

        x = Math.floor(x / sandSize) * sandSize;
        y = Math.floor(y / sandSize) * sandSize;

        if (sandGrid[y][x] === null && !deleting) {
            let p = { 
                x, y, 
                size: sandSize, 
                type : inserting,
                color: "#000"
            };
            if (inserting === "water") {
                p.color = waterColor;
                waterParticles.push(p);
            } else if (inserting === "dirt") {
                p.color = dirtColor[Math.floor(Math.random() * dirtColor.length)];
                dirtParticles.push(p);
            } else if (inserting === "sand") {
                p.color = sandColor[Math.floor(Math.random() * sandColor.length)];
                sandParticles.push(p);
            }
            sandGrid[y][x] = p;
        } else if (deleting) {
            let p = sandGrid[y][x];
            if (p !== null) {
                if (p.type === "water") {
                    waterParticles.splice(waterParticles.indexOf(p), 1);
                } else if (p.type === "dirt") {
                    dirtParticles.splice(dirtParticles.indexOf(p), 1);
                } else if (p.type === "sand") {
                    sandParticles.splice(sandParticles.indexOf(p), 1);
                }
                sandGrid[y][x] = null;
            }
        }
    }

});

canvas.addEventListener('click', () => {
    if (inserting === "sand") {
        inserting = "water";
    } else if (inserting === "water") {
        inserting = "dirt";
    } else if (inserting === "dirt") {
        inserting = "sand";
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === ' ') {
        deleting = !deleting;
    }
});

function update() {
    for (let i = sandParticles.length - 1; i >= 0; i--) {
        let p = sandParticles[i];

        //si abajo esta libre:
        if (p.y + p.size < height && !sandGrid[Math.floor(p.y + p.size)][Math.floor(p.x)]) {
            sandGrid[Math.floor(p.y)][Math.floor(p.x)] = null;
            p.y += p.size;
            sandGrid[Math.floor(p.y)][Math.floor(p.x)] = p;
        } 
        //si abajo hay agua:
        else if (p.y + p.size < height && sandGrid[Math.floor(p.y + p.size)][Math.floor(p.x)] && sandGrid[Math.floor(p.y + p.size)][Math.floor(p.x)].type === "water") {
            //intercambiar lugares
            let temp = sandGrid[Math.floor(p.y + p.size)][Math.floor(p.x)];
            sandGrid[Math.floor(p.y + p.size)][Math.floor(p.x)] = p;
            sandGrid[Math.floor(p.y)][Math.floor(p.x)] = temp;
            p.y += p.size;
            temp.y -= p.size;

        }
        // si abajo a la derecha esta libre:
        else if (p.y + p.size < height && p.x + p.size < width && !sandGrid[Math.floor(p.y + p.size)][Math.floor(p.x + p.size)] && Math.random() > 0.7) {
            sandGrid[Math.floor(p.y)][Math.floor(p.x)] = null;
            p.y += p.size;
            p.x += p.size;
            sandGrid[Math.floor(p.y)][Math.floor(p.x)] = p;
        }
        // si abajo a la izquierda esta libre:
        else if (p.y + p.size < height && p.x - p.size >= 0 && !sandGrid[Math.floor(p.y + p.size)][Math.floor(p.x - p.size)] && Math.random() > 0.7) {
            sandGrid[Math.floor(p.y)][Math.floor(p.x)] = null;
            p.y += p.size;
            p.x -= p.size;
            sandGrid[Math.floor(p.y)][Math.floor(p.x)] = p;
        }
        //si abajo a la izquierda esta ocupado por agua:
        else if (p.y + p.size < height && p.x - p.size >= 0 && sandGrid[Math.floor(p.y + p.size)][Math.floor(p.x - p.size)] && sandGrid[Math.floor(p.y + p.size)][Math.floor(p.x - p.size)].type === "water" && Math.random() > 0.7) {
            //intercambiar lugares
            let temp = sandGrid[Math.floor(p.y + p.size)][Math.floor(p.x - p.size)];
            sandGrid[Math.floor(p.y + p.size)][Math.floor(p.x - p.size)] = p;
            sandGrid[Math.floor(p.y)][Math.floor(p.x)] = temp;
            p.y += p.size;
            p.x -= p.size;
            temp.y -= p.size;
            temp.x += p.size;

        }
        //si abajo a la derecha esta ocupado por agua:
        else if (p.y + p.size < height && p.x + p.size < width && sandGrid[Math.floor(p.y + p.size)][Math.floor(p.x + p.size)] && sandGrid[Math.floor(p.y + p.size)][Math.floor(p.x + p.size)].type === "water" && Math.random() > 0.7) {
            //intercambiar lugares
            let temp = sandGrid[Math.floor(p.y + p.size)][Math.floor(p.x + p.size)];
            sandGrid[Math.floor(p.y + p.size)][Math.floor(p.x + p.size)] = p;
            sandGrid[Math.floor(p.y)][Math.floor(p.x)] = temp;
            p.y += p.size;
            p.x += p.size;
            temp.y -= p.size;
            temp.x -= p.size;

        }
        // si abajo a la izquierda y derecha estan ocupados:
        else {
            sandGrid[Math.floor(p.y)][Math.floor(p.x)] = p;
        }
    }

    for (let i = waterParticles.length - 1; i >= 0; i--) {
        let p = waterParticles[i];

        //si abajo esta libre:
        if (p.y + p.size < height && !sandGrid[Math.floor(p.y + p.size)][Math.floor(p.x)]) {
            sandGrid[Math.floor(p.y)][Math.floor(p.x)] = null;
            p.y += p.size;
            sandGrid[Math.floor(p.y)][Math.floor(p.x)] = p;
        } 
        // si abajo a la derecha esta libre:
        else if (p.y + p.size < height && p.x + p.size < width && !sandGrid[Math.floor(p.y + p.size)][Math.floor(p.x + p.size)]) {
            sandGrid[Math.floor(p.y)][Math.floor(p.x)] = null;
            p.y += p.size;
            p.x += p.size;
            sandGrid[Math.floor(p.y)][Math.floor(p.x)] = p;
        }
        // si abajo a la izquierda esta libre:
        else if (p.y + p.size < height && p.x - p.size >= 0 && !sandGrid[Math.floor(p.y + p.size)][Math.floor(p.x - p.size)]) {
            sandGrid[Math.floor(p.y)][Math.floor(p.x)] = null;
            p.y += p.size;
            p.x -= p.size;
            sandGrid[Math.floor(p.y)][Math.floor(p.x)] = p;
        }
        // si a la izquierda o derecha esta libre:
        else if (p.x + p.size < width && !sandGrid[Math.floor(p.y)][Math.floor(p.x + p.size)] ||
            p.x - p.size >= 0 && !sandGrid[Math.floor(p.y)][Math.floor(p.x - p.size)]) {
            if (Math.random() > 0.5) {
                if (p.x + p.size < width && !sandGrid[Math.floor(p.y)][Math.floor(p.x + p.size)]) {
                    sandGrid[Math.floor(p.y)][Math.floor(p.x)] = null;
                    p.x += p.size;
                    sandGrid[Math.floor(p.y)][Math.floor(p.x)] = p;
                } else {
                    sandGrid[Math.floor(p.y)][Math.floor(p.x)] = p;
                }
            } else {
                if (p.x - p.size >= 0 && !sandGrid[Math.floor(p.y)][Math.floor(p.x - p.size)]) {
                    sandGrid[Math.floor(p.y)][Math.floor(p.x)] = null;
                    p.x -= p.size;
                    sandGrid[Math.floor(p.y)][Math.floor(p.x)] = p;
                } else {
                    sandGrid[Math.floor(p.y)][Math.floor(p.x)] = p;
                }
            }
        }
        // si a la izquierda y derecha estan ocupados:
        else {
            sandGrid[Math.floor(p.y)][Math.floor(p.x)] = p;
        }
    }
}

function draw() {
    //clear with black color
    ctx.fillStyle = '#181717';
    ctx.fillRect(0, 0, width, height);

    for (let p of sandParticles) {
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
    }

    for (let p of waterParticles) {
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
    }

    for (let p of dirtParticles) {
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
    }

    //dibujar un menú mostrando el material seleccionado
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, 100, 20);
    ctx.fillStyle = '#FFF';
    ctx.font = '12px Arial';
    ctx.fillText(`Inserting: ${inserting}`, 10, 15);

    //dibujar un menú mostrando si se esta borrando o no
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 20, 100, 20);
    ctx.fillStyle = '#FFF';
    ctx.font = '12px Arial';
    ctx.fillText(`Deleting: ${deleting}`, 10, 35);

}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

loop();
