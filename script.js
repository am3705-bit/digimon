import { createProgressionSystem } from "./progression.js";
import {
    getDigimonAbilities,
    getUnlockedAbilities,
    upgradeAbility
} from "./abilities.js";
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
    "Armadillomon",
    "Guilmon",
    "Terriermon",
    "Renamon",
    "Lopmon",
    "Impmon",
    "Elecmon",
    "Betamon",
    "Dracomon",
    "Dorumon",
    "Kudamon",
    "Falcomon",
    "Monodramon"
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
ensureExtraData();
progression.ensureLevelData();
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
// CONNECT PROGRESSION AND ABILITY SYSTEMS

const progression = createProgressionSystem({
    getPlayer: () => player,
    saveGame: () => saveGame()
});

const abilityDisplay = createAbilityDisplay(() => player);

window.gameProgress = {
    grantPlayerXP: progression.grantPlayerXP,
    grantDigimonXP: progression.grantDigimonXP
};

window.digimonAbilitySystem = {
    getDigimonAbilities,
    getUnlockedAbilities,
    upgradeAbility,
    updateAbilityDisplay: abilityDisplay.updateAbilityDisplay
};
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
    progression.ensureLevelData();
    progression.updateDisplay();
    abilityDisplay.updateAbilityDisplay();
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

/* =================================
   EXTRA GAME DATA
================================= */

// Give the player one of each chest for testing.
// We can change these amounts when chest drops are added.
function ensureExtraData() {
    player.chests ??= {
        common: 1,
        uncommon: 1,
        rare: 1,
        legendary: 1,
        mythical: 1,
        ultra: 1
    };

    player.items ??= {};
    player.unlockedCheats ??= [];
    player.cheatFailures ??= 0;
    player.evolutionReady ??= false;
}

// Extend the existing save system.
const originalSaveGame = saveGame;

saveGame = function () {
    ensureExtraData();
    originalSaveGame();
};

// Extend the existing load system.
const originalLoadGame = loadGame;

loadGame = function () {
    const loaded = originalLoadGame();

    if (loaded) {
        ensureExtraData();
    }

    return loaded;
};

ensureExtraData();


/* =================================
   GAME NAVIGATION
================================= */

let previousScreen = "game-world";

function addNavigationButton(sectionId, buttonText) {
    const section = document.getElementById(sectionId);

    const button = document.createElement("button");
    button.type = "button";
    button.textContent = buttonText;

    button.addEventListener("click", () => {
        showScreen("game-world");
    });

    section.appendChild(button);
}

addNavigationButton("chest-system", "Return to Game");
addNavigationButton("cheat-terminal", "Return to Game");

document.getElementById("open-chests").addEventListener("click", () => {
    showScreen("chest-system");
    updateChestButtons();
});

document.getElementById("open-cheats").addEventListener("click", () => {
    showScreen("cheat-terminal");
    updateCheatMenu();
});


/* =================================
   TREASURE CHEST SYSTEM
================================= */

const chestRewards = {
    common: [
        { name: "Small Food Pack", amount: 2 },
        { name: "Wood", amount: 5 },
        { name: "Basic Healing Potion", amount: 1 }
    ],

    uncommon: [
        { name: "Energy Crystal", amount: 2 },
        { name: "Stone", amount: 10 },
        { name: "Healing Potion", amount: 2 }
    ],

    rare: [
        { name: "Evolution Blueprint", amount: 2 },
        { name: "Rare Food", amount: 3 },
        { name: "Energy Crystal", amount: 5 }
    ],

    legendary: [
        { name: "Evolution Blueprint", amount: 5 },
        { name: "Legendary Treasure", amount: 1 },
        { name: "Healing Potion", amount: 5 }
    ],

    mythical: [
        { name: "Evolution Blueprint", amount: 10 },
        { name: "Mythical Treasure", amount: 1 },
        { name: "Energy Crystal", amount: 15 }
    ],

    ultra: [
        { name: "Evolution Blueprint", amount: 20 },
        { name: "Ultra Treasure", amount: 1 },
        { name: "Ancient Revival Item", amount: 1 }
    ]
};

const chestNames = [
    "common",
    "uncommon",
    "rare",
    "legendary",
    "mythical",
    "ultra"
];

const chestButtons = document.querySelectorAll(
    "#chest-list button"
);

function updateChestButtons() {
    chestNames.forEach((chest, index) => {
        const amount = player.chests[chest] || 0;

        chestButtons[index].disabled = amount <= 0;

        chestButtons[index].textContent =
            chest.charAt(0).toUpperCase() +
            chest.slice(1) +
            " Chest (" + amount + ")";
    });
}

function addItem(itemName, amount) {
    player.items[itemName] =
        (player.items[itemName] || 0) + amount;
}

function openChest(chestType) {
    if (!player.chests[chestType] ||
        player.chests[chestType] <= 0) {
        return;
    }

    player.chests[chestType]--;

    const rewards = chestRewards[chestType];
    const reward = rewards[
        Math.floor(Math.random() * rewards.length)
    ];

    addItem(reward.name, reward.amount);

    document.getElementById("chest-rewards").textContent =
        "You opened a " + chestType +
        " chest and received " +
        reward.amount + " " + reward.name + "!";

    updateChestButtons();
    saveGame();
}

chestButtons.forEach((button, index) => {
    button.disabled = false;

    button.addEventListener("click", () => {
        openChest(chestNames[index]);
    });
});

updateChestButtons();

// Use this function later when missions or exploration
// reward the player with new chests.
function giveChest(chestType, amount = 1) {
    if (!chestNames.includes(chestType)) return;

    player.chests[chestType] =
        (player.chests[chestType] || 0) + amount;

    updateChestButtons();
    saveGame();
}


/* =================================
   CHEAT CODE SYSTEM
================================= */

const basicCheats = [
    {
        code: "DIGIMONPOWER",
        name: "Restore Partner Health",
        description: "Restore your partner's health."
    },
    {
        code: "INFINITEENERGY",
        name: "Energy Refill",
        description: "Refill your energy."
    },
    {
        code: "DIGITALFOOD",
        name: "Hunger Refill",
        description: "Refill your hunger."
    },
    {
        code: "FULLRESTORE",
        name: "Full Restoration",
        description: "Restore all four survival meters."
    }
];

const advancedCheats = [
    {
        code: "EVOLUTIONTIME",
        name: "Evolution Unlock",
        description: "Unlock an evolution opportunity."
    },
    {
        code: "TREASUREHUNT",
        name: "Treasure Reward",
        description: "Receive a special treasure."
    },
    {
        code: "REAPERAWAKENS",
        name: "Summon the Digital Reaper",
        description: "Summon your security guardian."
    }
];

function activateCheat(code) {
    code = code.trim().toUpperCase();

    const basic = basicCheats.find(
        cheat => cheat.code === code
    );

    const advanced = advancedCheats.find(
        cheat => cheat.code === code
    );

    if (basic) {
        player.cheatFailures = 0;

        if (code === "DIGIMONPOWER") {
            player.health = 100;
        }

        if (code === "INFINITEENERGY") {
            player.energy = 100;
        }

        if (code === "DIGITALFOOD") {
            player.hunger = 100;
        }

        if (code === "FULLRESTORE") {
            player.health = 100;
            player.hunger = 100;
            player.energy = 100;
            player.rest = 100;
        }

        updateSurvivalStatus();

        document.getElementById("cheat-message").textContent =
            "CHEAT ACTIVATED: " + basic.name;

        saveGame();
        return;
    }

    if (advanced) {
        if (!player.unlockedCheats.includes(code)) {
            document.getElementById("cheat-message").textContent =
                "This cheat is locked. Complete missions to unlock it.";
            return;
        }

        if (code === "EVOLUTIONTIME") {
            player.evolutionReady = true;
        }

        if (code === "TREASUREHUNT") {
            addItem("Special Treasure", 1);
        }

        if (code === "REAPERAWAKENS") {
            summonDigitalReaper();
        }

        document.getElementById("cheat-message").textContent =
            "ADVANCED CHEAT ACTIVATED: " + advanced.name;

        saveGame();
        updateCheatMenu();
        return;
    }

    // Incorrect code
    player.cheatFailures++;

    document.getElementById("cheat-message").textContent =
        "INVALID CODE. Digital Reaper security warning: " +
        player.cheatFailures + " / 3";

    if (player.cheatFailures >= 3) {
        summonDigitalReaper();
        player.cheatFailures = 0;
    }

    saveGame();
}


/* =================================
   CHEAT MENU DISPLAY
================================= */

function updateCheatMenu() {
    const basicArea = document.getElementById("basic-cheats");
    const advancedArea = document.getElementById("advanced-cheats");

    basicArea.innerHTML = "";
    advancedArea.innerHTML = "";

    basicCheats.forEach(cheat => {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = cheat.name;

        button.addEventListener("click", () => {
            activateCheat(cheat.code);
        });

        basicArea.appendChild(button);
    });

    advancedCheats.forEach(cheat => {
        const unlocked =
            player.unlockedCheats.includes(cheat.code);

        const button = document.createElement("button");
        button.type = "button";

        button.textContent = unlocked
            ? cheat.name
            : "LOCKED: " + cheat.name;

        button.disabled = !unlocked;

        button.addEventListener("click", () => {
            activateCheat(cheat.code);
        });

        advancedArea.appendChild(button);
    });
}

document.getElementById("submit-cheat").addEventListener("click", () => {
    const input = document.getElementById("cheat-code-input");

    activateCheat(input.value);
    input.value = "";

    updateCheatMenu();
});

// Call this later when a mission or story event unlocks a cheat.
function unlockAdvancedCheat(code) {
    code = code.toUpperCase();

    const exists = advancedCheats.some(
        cheat => cheat.code === code
    );

    if (!exists) return;

    if (!player.unlockedCheats.includes(code)) {
        player.unlockedCheats.push(code);

        document.getElementById("cheat-message").textContent =
            "NEW ADVANCED CHEAT UNLOCKED: " + code;

        updateCheatMenu();
        saveGame();
    }
}

updateCheatMenu();


/* =================================
   DIGITAL REAPER
================================= */

function summonDigitalReaper() {
    previousScreen = "game-world";

    document.getElementById("reaper-display").innerHTML = `
        <h3>💀 THE DIGITAL REAPER HAS AWAKENED.</h3>
        <p>Unauthorized cheat activity detected.</p>
        <p>The Digital World is protected.</p>
        <p>Choose your actions carefully, player.</p>
    `;

    showScreen("digital-reaper");
}
document.getElementById("dismiss-reaper").addEventListener("click", () => {
    showScreen(previousScreen);
});

// Initial setup
updateChestButtons();
updateCheatMenu();
console.log("Chest System, Cheat System, and Digital Reaper loaded!");
