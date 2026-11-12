/* CONNECT PLAYER AND DIGIMON LEVELING */

const progression = createProgressionSystem({
    getPlayer: () => player,
    saveGame: () => saveGame()
});

window.gameProgress = {
    grantPlayerXP: progression.grantPlayerXP,
    grantDigimonXP: progression.grantDigimonXP
};

newGameButton.addEventListener("click", () => {
    progression.ensureLevelData();
});

const previousEnterWorld = enterDigitalWorld;

enterDigitalWorld = function () {
    previousEnterWorld();
    progression.ensureLevelData();
    progression.updateDisplay();
};

console.log("Progression system connected!");
