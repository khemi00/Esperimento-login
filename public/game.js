const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    }
};

const game = new Phaser.Game(config);
let currentMap;

function preload() {
    console.log("Preloading assets...");
    this.load.image('mapEurope', '/public/mapEurope.png');
    this.load.image('mapWorld', '/public/mapWorld.png');
}

function create() {
    console.log("Creating scene...");

    // Aggiungi l'immagine della mappa al centro della scena
    currentMap = this.add.image(0, 0, 'mapEurope').setOrigin(0, 0);

    // Ottieni le dimensioni della mappa
    updateMapBounds(currentMap);

    // Abilita lo scorrimento della telecamera con i tasti freccia
    this.cursors = this.input.keyboard.createCursorKeys();

    // Imposta lo zoom iniziale della telecamera
    this.cameras.main.setZoom(0.25);

    // Variabili per il trascinamento con il mouse
    this.isDragging = false;
    this.dragStart = new Phaser.Math.Vector2();

    // Abilita il trascinamento con il mouse
    this.input.on('pointerdown', (pointer) => {
        if (pointer.x < this.scale.width - 300) { // Ignora l'area del menù
            console.log("Pointer down at", pointer.x, pointer.y);
            this.isDragging = true;
            this.dragStart.set(pointer.x, pointer.y);
        }
    });

    this.input.on('pointerup', () => {
        console.log("Pointer up");
        this.isDragging = false;
    });

    this.input.on('pointermove', (pointer) => {
        if (this.isDragging) {
            const dragEnd = new Phaser.Math.Vector2(pointer.x, pointer.y);
            const dragDistance = this.dragStart.subtract(dragEnd);
            console.log("Dragging", dragDistance);

            this.cameras.main.scrollX += dragDistance.x / this.cameras.main.zoom;
            this.cameras.main.scrollY += dragDistance.y / this.cameras.main.zoom;

            this.dragStart.set(pointer.x, pointer.y);
        }
    });

    // Abilita lo zoom con la rotella del mouse
    this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
        if (pointer.x < this.scale.width - 300) { // Ignora l'area del menù
            console.log("Mouse wheel delta", deltaY);
            let newZoom = this.cameras.main.zoom - deltaY * 0.01; // Ridotta sensibilità dello zoom
            newZoom = Phaser.Math.Clamp(newZoom, 0.2, 10); // Limiti dello zoom (Min: 0.2, Max: 10)
            console.log("New zoom level", newZoom);
            this.cameras.main.setZoom(newZoom);
        }
    });

    // Gestisci il pulsante del menù
    const menuButton = document.getElementById('menuButton');
    const europeMapButton = document.getElementById('europeMapButton');
    const worldMapButton = document.getElementById('worldMapButton');

    if (menuButton) {
        menuButton.addEventListener('click', () => {
            const menu = document.getElementById('menu');
            if (menu.style.display === 'none') {
                menu.style.display = 'flex';
                menuButton.textContent = 'X';
            } else {
                menu.style.display = 'none';
                menuButton.textContent = '☰';
            }
        });
    }

    // Aggiungi logica per cambiare mappa
    if (europeMapButton) {
        europeMapButton.addEventListener('click', () => {
            console.log("Europe map button clicked");
            changeMap.call(this, 'mapEurope');
        });
    }

    if (worldMapButton) {
        worldMapButton.addEventListener('click', () => {
            console.log("World map button clicked");
            changeMap.call(this, 'mapWorld');
        });
    }
}

function update() {
    const speed = 5;

    if (this.cursors.left.isDown) {
        this.cameras.main.scrollX -= speed;
    }
    if (this.cursors.right.isDown) {
        this.cameras.main.scrollX += speed;
    }
    if (this.cursors.up.isDown) {
        this.cameras.main.scrollY -= speed;
    }
    if (this.cursors.down.isDown) {
        this.cameras.main.scrollY += speed;
    }
}

function changeMap(mapKey) {
    console.log("Changing map to", mapKey);
    if (currentMap) {
        currentMap.setTexture(mapKey); // Cambia la texture dell'immagine esistente
        updateMapBounds(currentMap);
    } else {
        console.error("Current map is not defined");
    }
}

function updateMapBounds(map) {
    if (map) {
        const mapWidth = map.width;
        const mapHeight = map.height;
        console.log("Map dimensions:", mapWidth, mapHeight);

        // Imposta le dimensioni del mondo per adattarsi alla mappa
        game.scene.scenes[0].cameras.main.setBounds(0, 0, mapWidth, mapHeight);
    } else {
        console.error("Map is not defined");
    }
}
