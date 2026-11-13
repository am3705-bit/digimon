
/* =====================================
   PLAYER AND DIGIMON LEVELING SYSTEM
===================================== */

const MAX_LEVEL = 100;

export function createProgressionSystem({ getPlayer, saveGame }) {
    function ensureLevelData() {
        const player = getPlayer();

        player.level ??= 1;
        player.xp ??= 0;
        player.skillPoints ??= 0;
        player.maxHealth ??= 100;
        player.digimonProgress ??= {};

        if (player.partner) {
            ensureDigimonRecord(player.partner);
        }
    }

    function ensureDigimonRecord(name) {
        const player = getPlayer();

        player.digimonProgress ??= {};

        player.digimonProgress[name] ??= {
            level: 1,
            xp: 0,
            maxHp: 100,
            hp: 100,
            attack: 20,
            defense: 10,
            speed: 10
        };

        return player.digimonProgress[name];
    }

    function xpNeeded(level) {
        return level * 100;
    }

    function grantPlayerXP(amount) {
        ensureLevelData();
        const player = getPlayer();

        if (amount <= 0 || player.level >= MAX_LEVEL) return;

        player.xp += amount;

        while (player.xp >= xpNeeded(player.level) &&
               player.level < MAX_LEVEL) {
            player.xp -= xpNeeded(player.level);
            player.level++;
            player.skillPoints++;
            player.maxHealth += 5;
            player.health = Math.min(
                player.health + 5,
                player.maxHealth
            );
        }

        if (player.level >= MAX_LEVEL) player.xp = 0;

        updateDisplay();
        saveGame();
    }

    function grantDigimonXP(name, amount) {
        ensureLevelData();
        const digimon = ensureDigimonRecord(name);

        if (amount <= 0 || digimon.level >= MAX_LEVEL) return;

        digimon.xp += amount;

        while (digimon.xp >= xpNeeded(digimon.level) &&
               digimon.level < MAX_LEVEL) {
            digimon.xp -= xpNeeded(digimon.level);
            digimon.level++;
            digimon.maxHp += 10;
            digimon.hp += 10;
            digimon.attack += 2;
            digimon.defense += 1;
            digimon.speed += 1;
        }

        if (digimon.level >= MAX_LEVEL) digimon.xp = 0;

        updateDisplay();
        saveGame();
    }

    function createDisplay() {
        if (document.getElementById("progression-panel")) return;

        const gameWorld = document.getElementById("game-world");
        if (!gameWorld) return;

        const panel = document.createElement("div");
        panel.id = "progression-panel";

        panel.innerHTML = `
            <h3>Player Progress</h3>
            <p>Level: <span id="player-level">1</span></p>
            <p>XP: <span id="player-xp">0</span></p>
            <p>Skill Points: <span id="player-skill-points">0</span></p>
            <h3>Partner Digimon</h3>
            <p>Name: <span id="progress-digimon-name">None</span></p>
            <p>Level: <span id="digimon-level">1</span></p>
            <p>XP: <span id="digimon-xp">0</span></p>
            <p>HP: <span id="digimon-hp">100 / 100</span></p>
            <p>Attack: <span id="digimon-attack">20</span></p>
            <p>Defense: <span id="digimon-defense">10</span></p>
            <p>Speed: <span id="digimon-speed">10</span></p>
        `;

        gameWorld.appendChild(panel);
    }

    function updateDisplay() {
        ensureLevelData();
        createDisplay();

        const player = getPlayer();

        const setText = (id, value) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        };

        setText("player-level", player.level);
        setText("player-xp",
            player.level >= MAX_LEVEL
                ? "MAX LEVEL"
                : `${player.xp} / ${xpNeeded(player.level)}`
        );
        setText("player-skill-points", player.skillPoints);
        setText("progress-digimon-name", player.partner || "None");

        if (!player.partner) return;

        const digimon = ensureDigimonRecord(player.partner);

        setText("digimon-level", digimon.level);
        setText("digimon-xp",
            digimon.level >= MAX_LEVEL
                ? "MAX LEVEL"
                : `${digimon.xp} / ${xpNeeded(digimon.level)}`
        );
        setText("digimon-hp", `${digimon.hp} / ${digimon.maxHp}`);
        setText("digimon-attack", digimon.attack);
        setText("digimon-defense", digimon.defense);
        setText("digimon-speed", digimon.speed);
    }

    return {
        ensureLevelData,
        updateDisplay,
        grantPlayerXP,
        grantDigimonXP
    };
}
