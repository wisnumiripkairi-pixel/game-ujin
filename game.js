import * as THREE from
"https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";


// ================================
// BASIC SETUP
// ================================

const container =
document.getElementById("gameContainer");

const scene =
new THREE.Scene();

scene.background =
new THREE.Color(0x050810);

scene.fog =
new THREE.Fog(
  0x070b13,
  35,
  180
);


const camera =
new THREE.PerspectiveCamera(
  65,
  window.innerWidth /
  window.innerHeight,
  0.1,
  300
);

camera.position.set(
  0,
  4.2,
  8
);


const renderer =
new THREE.WebGLRenderer({
  antialias: true
});

renderer.setSize(
  window.innerWidth,
  window.innerHeight
);

renderer.setPixelRatio(
  Math.min(
    window.devicePixelRatio,
    1.5
  )
);

renderer.shadowMap.enabled = true;

renderer.outputColorSpace =
THREE.SRGBColorSpace;

container.appendChild(
  renderer.domElement
);


// ================================
// LIGHT
// ================================

const ambient =
new THREE.HemisphereLight(
  0x9db9ff,
  0x08090d,
  1.6
);

scene.add(ambient);


const moon =
new THREE.DirectionalLight(
  0xbfdcff,
  2
);

moon.position.set(
  -30,
  40,
  20
);

moon.castShadow = true;

scene.add(moon);


// ================================
// ROAD
// ================================

const road =
new THREE.Mesh(
  new THREE.PlaneGeometry(
    18,
    500
  ),
  new THREE.MeshStandardMaterial({
    color: 0x11151a,
    roughness: .9
  })
);

road.rotation.x =
-Math.PI / 2;

road.position.z =
-180;

road.receiveShadow = true;

scene.add(road);


// SIDEWALK

const sidewalkMaterial =
new THREE.MeshStandardMaterial({
  color: 0x252a30,
  roughness: .8
});


for (const x of [-11,11]) {

  const sidewalk =
  new THREE.Mesh(
    new THREE.BoxGeometry(
      4,
      .3,
      500
    ),
    sidewalkMaterial
  );

  sidewalk.position.set(
    x,
    .15,
    -180
  );

  sidewalk.receiveShadow = true;

  scene.add(sidewalk);
}


// ================================
// ROAD MARKINGS
// ================================

const markings = [];

const markMaterial =
new THREE.MeshStandardMaterial({
  color: 0xd8e4e8,
  emissive: 0x18252b,
  emissiveIntensity: .5
});


for (
  let z = 5;
  z > -400;
  z -= 12
) {

  const mark =
  new THREE.Mesh(
    new THREE.BoxGeometry(
      .18,
      .04,
      5
    ),
    markMaterial
  );

  mark.position.set(
    0,
    .03,
    z
  );

  scene.add(mark);

  markings.push(mark);
}


// ================================
// BUILDINGS
// ================================

const buildingMaterials = [
  0x111821,
  0x171d25,
  0x0d141c,
  0x202832
];


function makeBuilding(
  x,
  z
) {

  const width =
  4 +
  Math.random() * 5;

  const depth =
  5 +
  Math.random() * 6;

  const height =
  8 +
  Math.random() * 25;


  const material =
  new THREE.MeshStandardMaterial({
    color:
    buildingMaterials[
      Math.floor(
        Math.random() *
        buildingMaterials.length
      )
    ],
    roughness: .9
  });


  const building =
  new THREE.Mesh(
    new THREE.BoxGeometry(
      width,
      height,
      depth
    ),
    material
  );

  building.position.set(
    x,
    height / 2,
    z
  );

  building.castShadow = true;

  scene.add(building);


  // Windows

  const windowMaterial =
  new THREE.MeshBasicMaterial({
    color:
    Math.random() > .5
    ? 0x55dfff
    : 0x596875
  });


  for (
    let y = 3;
    y < height - 2;
    y += 3
  ) {

    if (
      Math.random() > .35
    ) {

      const window =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          .55,
          .9,
          .04
        ),
        windowMaterial
      );

      const front =
      x < 0
      ? 1
      : -1;

      window.position.set(
        x +
        front *
        (width / 2 + .03),
        y,
        z
      );

      scene.add(window);
    }
  }
}


for (
  let z = 0;
  z > -400;
  z -= 18
) {

  makeBuilding(
    -18 -
    Math.random() * 10,
    z
  );

  makeBuilding(
    18 +
    Math.random() * 10,
    z - 8
  );
}


// ================================
// STREET LIGHTS
// ================================

const streetLights = [];


function makeStreetLight(
  x,
  z
) {

  const pole =
  new THREE.Mesh(
    new THREE.CylinderGeometry(
      .06,
      .08,
      5,
      8
    ),
    new THREE.MeshStandardMaterial({
      color: 0x202a32,
      metalness: .7
    })
  );

  pole.position.set(
    x,
    2.5,
    z
  );

  scene.add(pole);


  const lamp =
  new THREE.PointLight(
    0x4de4ff,
    3,
    14
  );

  lamp.position.set(
    x,
    5,
    z
  );

  scene.add(lamp);


  streetLights.push({
    pole,
    lamp
  });
}


for (
  let z = 0;
  z > -400;
  z -= 22
) {

  makeStreetLight(
    -10,
    z
  );

  makeStreetLight(
    10,
    z - 11
  );
}


// ================================
// CAR CREATOR
// ================================

function createCar(
  color
) {

  const car =
  new THREE.Group();


  // BODY

  const body =
  new THREE.Mesh(
    new THREE.BoxGeometry(
      1.8,
      .55,
      3.8
    ),
    new THREE.MeshStandardMaterial({
      color: color,
      metalness: .75,
      roughness: .25
    })
  );

  body.position.y =
  .58;

  body.castShadow = true;

  car.add(body);


  // FRONT HOOD

  const hood =
  new THREE.Mesh(
    new THREE.BoxGeometry(
      1.65,
      .2,
      1.25
    ),
    new THREE.MeshStandardMaterial({
      color: color,
      metalness: .7,
      roughness: .2
    })
  );

  hood.position.set(
    0,
    .9,
    -1.05
  );

  hood.castShadow = true;

  car.add(hood);


  // CABIN

  const cabin =
  new THREE.Mesh(
    new THREE.BoxGeometry(
      1.45,
      .65,
      1.55
    ),
    new THREE.MeshStandardMaterial({
      color: 0x0a1119,
      metalness: .4,
      roughness: .15
    })
  );

  cabin.position.set(
    0,
    1.08,
    .25
  );

  cabin.castShadow = true;

  car.add(cabin);


  // ROOF

  const roof =
  new THREE.Mesh(
    new THREE.BoxGeometry(
      1.25,
      .12,
      1.35
    ),
    new THREE.MeshStandardMaterial({
      color: color,
      metalness: .7,
      roughness: .25
    })
  );

  roof.position.set(
    0,
    1.43,
    .25
  );

  car.add(roof);


  // WHEELS

  const wheelMat =
  new THREE.MeshStandardMaterial({
    color: 0x030406,
    roughness: .8
  });


  for (
    const x of [-1,1]
  ) {

    for (
      const z of [-1.25,1.25]
    ) {

      const wheel =
      new THREE.Mesh(
        new THREE.CylinderGeometry(
          .38,
          .38,
          .26,
          20
        ),
        wheelMat
      );

      wheel.rotation.z =
      Math.PI / 2;

      wheel.position.set(
        x,
        .38,
        z
      );

      wheel.castShadow = true;

      car.add(wheel);
    }
  }


  // FRONT LIGHTS

  const frontLight =
  new THREE.MeshBasicMaterial({
    color: 0xeaffff
  });


  for (
    const x of [-.62,.62]
  ) {

    const light =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        .38,
        .08,
        .04
      ),
      frontLight
    );

    light.position.set(
      x,
      .7,
      -1.93
    );

    car.add(light);
  }


  // REAR LIGHT

  const rearLight =
  new THREE.MeshBasicMaterial({
    color: 0xff294d
  });


  const rear =
  new THREE.Mesh(
    new THREE.BoxGeometry(
      1.2,
      .08,
      .04
    ),
    rearLight
  );

  rear.position.set(
    0,
    .7,
    1.93
  );

  car.add(rear);


  // SPOILER

  const spoiler =
  new THREE.Mesh(
    new THREE.BoxGeometry(
      1.5,
      .1,
      .15
    ),
    new THREE.MeshStandardMaterial({
      color: 0x090c10,
      metalness: .8
    })
  );

  spoiler.position.set(
    0,
    1.12,
    1.75
  );

  car.add(spoiler);


  return car;
}


// ================================
// PLAYER
// ================================

const player =
new THREE.Group();

scene.add(player);

player.add(
  createCar(0x26323d)
);

player.position.set(
  0,
  0,
  4
);


// ================================
// ENEMIES
// ================================

const enemies = [];


function spawnEnemy() {

  const enemy =
  createCar(
    Math.random() > .5
    ? 0x6d1e2e
    : 0x233c5a
  );

  const lanes = [
    -6,
    -3,
    0,
    3,
    6
  ];

  const lane =
  lanes[
    Math.floor(
      Math.random() *
      lanes.length
    )
  ];


  enemy.position.set(
    lane,
    0,
    -150
  );

  scene.add(enemy);

  enemies.push(enemy);
}


// ================================
// VARIABLES
// ================================

let running = false;

let score = 0;

let speed = 0;

let level = 1;

let playerX = 0;

let spawnTimer = 0;

let lastTime =
performance.now();

let gas = false;
let brake = false;
let nitro = false;
let left = false;
let right = false;


// ================================
// START
// ================================

function startGame() {

  running = true;

  score = 0;
  speed = 0;
  level = 1;

  playerX = 0;

  spawnTimer = 0;

  enemies.forEach(
    e => scene.remove(e)
  );

  enemies.length = 0;

  player.position.x = 0;

  document.getElementById(
    "menu"
  ).style.display = "none";

  document.getElementById(
    "over"
  ).style.display = "none";

  lastTime =
  performance.now();

  requestAnimationFrame(
    gameLoop
  );
}


// ================================
// GAME OVER
// ================================

function endGame() {

  if (!running)
    return;

  running = false;

  document.getElementById(
    "finalScore"
  ).textContent =
  Math.floor(score);

  document.getElementById(
    "over"
  ).style.display = "flex";
}


// ================================
// PLAYER MOVEMENT
// ================================

function updatePlayer() {

  if (left)
    playerX -= .10;

  if (right)
    playerX += .10;

  playerX =
  THREE.MathUtils.clamp(
    playerX,
    -7,
    7
  );

  player.position.x =
  THREE.MathUtils.lerp(
    player.position.x,
    playerX,
    .2
  );

  player.rotation.z =
  THREE.MathUtils.lerp(
    player.rotation.z,
    left ? .05 :
    right ? -.05 :
    0,
    .15
  );
}


// ================================
// SPEED
// ================================

function updateSpeed() {

  if (gas)
    speed += .9;
  else
    speed -= .3;

  if (brake)
    speed -= 2;

  if (nitro)
    speed += 2.5;

  speed =
  THREE.MathUtils.clamp(
    speed,
    0,
    nitro ? 180 : 125
  );

  level =
  Math.floor(
    score / 1200
  ) + 1;

  document.getElementById(
    "speed"
  ).textContent =
  Math.floor(speed);

  document.getElementById(
    "level"
  ).textContent =
  level;
}


// ================================
// ROAD
// ================================

function updateRoad() {

  const move =
  speed * .018;

  markings.forEach(
    mark => {

      mark.position.z += move;

      if (
        mark.position.z > 10
      ) {
        mark.position.z =
        -400;
      }
    }
  );


  streetLights.forEach(
    item => {

      item.pole.position.z += move;

      item.lamp.position.z += move;

      if (
        item.pole.position.z > 10
      ) {

        item.pole.position.z =
        -400;

        item.lamp.position.z =
        -400;
      }
    }
  );
}


// ================================
// ENEMIES
// ================================

function updateEnemies() {

  const move =
  speed * .025;


  for (
    let i =
    enemies.length - 1;
    i >= 0;
    i--
  ) {

    const enemy =
    enemies[i];

    enemy.position.z += move;


    const dx =
    Math.abs(
      enemy.position.x -
      player.position.x
    );

    const dz =
    Math.abs(
      enemy.position.z -
      player.position.z
    );


    if (
      dx < 1.7 &&
      dz < 2.4
    ) {

      endGame();

      return;
    }


    if (
      enemy.position.z > 15
    ) {

      scene.remove(enemy);

      enemies.splice(
        i,
        1
      );

      score += 250;
    }
  }
}


// ================================
// SPAWN
// ================================

function updateSpawn(
  delta
) {

  spawnTimer += delta;

  const interval =
  Math.max(
    450,
    1300 -
    level * 60
  );


  if (
    spawnTimer >
    interval
  ) {

    spawnEnemy();

    spawnTimer = 0;
  }
}


// ================================
// SCORE
// ================================

function updateScore(
  delta
) {

  score +=
  speed *
  delta *
  .005;

  document.getElementById(
    "score"
  ).textContent =
  Math.floor(score);
}


// ================================
// CAMERA
// ================================

function updateCamera() {

  const targetX =
  player.position.x;


  camera.position.x =
  THREE.MathUtils.lerp(
    camera.position.x,
    targetX,
    .08
  );


  camera.position.y =
  THREE.MathUtils.lerp(
    camera.position.y,
    4.3,
    .08
  );


  camera.lookAt(
    player.position.x,
    1,
    0
  );
}


// ================================
// BUTTON CONTROL
// ================================

function hold(
  id,
  down,
  up
) {

  const button =
  document.getElementById(id);

  button.addEventListener(
    "pointerdown",
    e => {
      e.preventDefault();
      down();
    }
  );

  button.addEventListener(
    "pointerup",
    e => {
      e.preventDefault();
      up();
    }
  );

  button.addEventListener(
    "pointercancel",
    up
  );

  button.addEventListener(
    "pointerleave",
    up
  );
}


hold(
  "left",
  () => left = true,
  () => left = false
);

hold(
  "right",
  () => right = true,
  () => right = false
);

hold(
  "gas",
  () => gas = true,
  () => gas = false
);

hold(
  "brake",
  () => brake = true,
  () => brake = false
);

hold(
  "nitro",
  () => nitro = true,
  () => nitro = false
);


// ================================
// KEYBOARD
// ================================

window.addEventListener(
  "keydown",
  e => {

    const key =
    e.key.toLowerCase();

    if (
      key === "a" ||
      key === "arrowleft"
    )
      left = true;

    if (
      key === "d" ||
      key === "arrowright"
    )
      right = true;

    if (
      key === "w" ||
      key === "arrowup"
    )
      gas = true;

    if (
      key === "s" ||
      key === "arrowdown"
    )
      brake = true;

    if (
      key === "shift"
    )
      nitro = true;
  }
);


window.addEventListener(
  "keyup",
  e => {

    const key =
    e.key.toLowerCase();

    if (
      key === "a" ||
      key === "arrowleft"
    )
      left = false;

    if (
      key === "d" ||
      key === "arrowright"
    )
      right = false;

    if (
      key === "w" ||
      key === "arrowup"
    )
      gas = false;

    if (
      key === "s" ||
      key === "arrowdown"
    )
      brake = false;

    if (
      key === "shift"
    )
      nitro = false;
  }
);


// ================================
// START BUTTON
// ================================

document.getElementById(
  "start"
).addEventListener(
  "click",
  startGame
);


document.getElementById(
  "restart"
).addEventListener(
  "click",
  startGame
);


// ================================
// RESIZE
// ================================

window.addEventListener(
  "resize",
  () => {

    camera.aspect =
    window.innerWidth /
    window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );
  }
);


// ================================
// GAME LOOP
// ================================

function gameLoop(time) {

  if (!running)
    return;

  const delta =
  Math.min(
    time - lastTime,
    50
  );

  lastTime = time;

  updatePlayer();
  updateSpeed();
  updateRoad();
  updateEnemies();
  updateSpawn(delta);
  updateScore(delta);
  updateCamera();

  renderer.render(
    scene,
    camera
  );

  requestAnimationFrame(
    gameLoop
  );
}


// INITIAL RENDER

renderer.render(
  scene,
  camera
);