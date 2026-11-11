
// ==========================================
// DIGIMON: DIGITAL WORLD SURVIVAL
// JAVASCRIPT - FIRST VERSION
// ==========================================

// GAME DATA

const digimonChoices = [
    "Agumon",
    "Gabumon",
    "Patamon",
    "Gomamon",
    "Palmon",
    "Tentomon",
    "Biyomon",
    "Gatomon",
    "Veemon",
    "Wormmon",
    "Hawkmon",
    "Armadillomon"
];

let player = {
    name: "",
    appearance: "Default",
    partner: "",
    health: 100,
    hunger: 100,
    energy: 100,
    rest: 100
};

// SCREEN MANAGEMENT

const screens = document.querySelectorAll("main > section");

function showScreen(screenId) {
    screens.forEach(screen => {
        screen.hidden = true;
    });

    document.getElementById(screenId).hidden = false;
}

// SAVE SYSTEM

function saveGame() {
    localStorage.setItem("digimonSurvivalSave", JSON.stringify(player));
}

function loadGame() {
    const savedGame = localStorage.getItem("digimonSurvivalSave");

    if (!savedGame) {
        return false;
    }

    try {
        player = JSON.parse(savedGame);

        return Boolean(
            player &&
            typeof player.name === "string" &&
            typeof player.partner === "string" &&
            digimonChoices.includes(player.partner)
        );
    } catch (error) {
        console.error("Could not load saved game:", error);
        return false;
    }
}

// MAIN MENU

const menuButtons = document.querySelectorAll("#main-menu button");

const newGameButton = menuButtons[0];
const continueButton = menuButtons[1];
const settingsButton = menuButtons[2];

newGameButton.disabled = false;
continueButton.disabled = !loadGame();

// Settings will be added in a future update.
settingsButton.disabled = true;

newGameButton.addEventListener("click", () => {
    player = {
        name: "",
        appearance: "Default",
        partner: "",
        health: 100,
        hunger: 100,
        energy: 100,
        rest: 100
    };

    showScreen("character-creation");
});

continueButton.addEventListener("click", () => {
    if (loadGame()) {
        enterDigitalWorld();
    }
});

// CHARACTER CREATION

const characterArea = document.getElementById(
    "character-customization"
);

const appearanceLabel = document.createElement("label");
appearanceLabel.textContent = "Choose Appearance: ";

const appearanceSelect = document.createElement("select");

const appearances = [
    "Default",
    "Explorer",
    "Adventurer",
    "Futuristic"
];

appearances.forEach(appearance => {
    const option = document.createElement("option");
    option.value = appearance;
    option.textContent = appearance;
    appearanceSelect.appendChild(option);
});

appearanceLabel.appendChild(appearanceSelect);
characterArea.appendChild(appearanceLabel);

const characterNextButton = document.createElement("button");
characterNextButton.textContent = "Continue to Digimon Selection";
characterNextButton.type = "button";

document.getElementById("character-creation")
    .appendChild(characterNextButton);

characterNextButton.addEventListener("click", () => {
    const nameInput = document.getElementById("player-name");
    const name = nameInput.value.trim();

    if (name.length === 0) {
        alert("Please enter your character's name!");
        return;
    }

    player.name = name;
    player.appearance = appearanceSelect.value;

    showScreen("digimon-selection");
});

// DIGIMON SELECTION

const digimonList = document.getElementById(
    "starting-digimon-list"
);

digimonChoices.forEach(digimon => {
    const button = document.createElement("button");

    button.type = "button";
    button.textContent = digimon;

    button.addEventListener("click", () => {
        player.partner = digimon;

        saveGame();
        enterDigitalWorld();
    });

    digimonList.appendChild(button);
});

// ENTER THE DIGITAL WORLD

function enterDigitalWorld() {
    if (!player.partner) {
        showScreen("digimon-selection");
        return;
    }

    document.getElementById("game-world")
        .querySelector("p").textContent =
        `Welcome, ${player.name}! Your partner is ${player.partner}. Your Digital World adventure begins!`;

    updateSurvivalStatus();

    showScreen("game-world");
    saveGame();
}

// SURVIVAL STATUS DISPLAY

function updateSurvivalStatus() {
    document.getElementById("health").textContent =
        player.health;

    document.getElementById("hunger").textContent =
        player.hunger;

    document.getElementById("energy").textContent =
        player.energy;

    document.getElementById("rest").textContent =
        player.rest;
}

// INITIAL GAME SETUP

showScreen("main-menu");

console.log("Digimon: Digital World Survival is ready!");
