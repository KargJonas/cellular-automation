const cnv = document.querySelector("canvas");
const c = cnv.getContext("2d");

const width = cnv.width;
const height = cnv.height;

const cellSize = 5;

const gridW = width / cellSize;
const gridH = height / cellSize;

function mkGrid() {
  const c = new Array(gridW);

  for (let x = 0; x < gridW; x++) {
    c[x] = new Array(gridH);
  }

  return c;
}

function mkRndGrid() {
  const c = new Array(gridW);

  for (let x = 0; x < gridW; x++) {
    c[x] = new Array(gridH);
    for (let y = 0; y < gridH; y++) {
      c[x][y] = Math.round(Math.random() * 3);
    }
  }

  return c;
}

let grid = mkRndGrid();
const tempGrid = mkGrid();

function forEachCell(callback) {
  for (let x = 0; x < gridW; x++)
    for (let y = 0; y < gridH; y++) callback(x, y);
}

function draw() {
  forEachCell((x, y) => {
    const cell = grid[x][y];

    switch (cell) {
      case 0:
        c.fillStyle = "black";
        break;

      case 1:
        c.fillStyle = "gray";
        break;

      case 2:
        c.fillStyle = "white";
        break;
    }

    c.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
  });
}

const neighborOffsets = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [-1, 0],
  [1, 0],
  [-1, 1],
  [0, 1],
  [1, 1]
];

function getNeighbors(x, y) {
  const neighbors = [];

  for (let i = 0; i < neighborOffsets.length; i++) {
    const neighbor = neighborOffsets[i];
    const neighborX = x + neighbor[0];
    const neighborY = y + neighbor[1];

    if (
      -1 < neighborX &&
      neighborX < gridW &&
      -1 < neighborY &&
      neighborY < gridH
    )
      neighbors.push(grid[neighborX][neighborY]);
  }

  return neighbors;
}

function update() {
  forEachCell((x, y) => {
    const cell = grid[x][y];

    if (cell === 2) {
      tempGrid[x][y] = 1;
      return;
    }

    if (cell === 1) {
      tempGrid[x][y] = 0;
      return;
    }

    const values = [0, 0, 0];
    getNeighbors(x, y).map(neighbor => values[neighbor]++);

    // // Conway
    // if (cell == 1 && values[1] < 2) {
    //   tempGrid[x][y] = 0;
    // } else if (cell == 1 && values[1] >= 3) {
    //   tempGrid[x][y] = 0;
    // } else if (cell == 0 && values[1] >= 3) {
    //   tempGrid[x][y] = 1;
    // }

    // My Creation
    if (cell == 0 && values[2] >= 2) {
      tempGrid[x][y] = 2;
    } else if(cell == 2 && values[2] >= 3) {
      tempGrid[x][y] = 0;
    }

    return;
  });

  grid = tempGrid;
}

function loop() {
  setTimeout(() => {
    window.requestAnimationFrame(loop);
    update();
    draw();
  }, 10);
}

loop();
