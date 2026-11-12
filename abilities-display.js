
/* =====================================
   CONNECT DIGIMON ABILITIES
===================================== */

function updateAbilityDisplay() {
    const gameWorld = document.getElementById("game-world");

    if (!gameWorld || !player.partner) return;

    let panel = document.getElementById("digimon-abilities-panel");

    if (!panel) {
        panel = document.createElement("div");
        panel.id = "digimon-abilities-panel";
        gameWorld.appendChild(panel);
    }

    const digimonLevel =
        player.digimonProgress?.[player.partner]?.level || 1;

    const abilities = getUnlockedAbilities(
        player.partner,
        digimonLevel
    );

    panel.innerHTML = `
        <h3>${player.partner}'s Abilities</h3>
        <p>Digimon Level: ${digimonLevel}</p>

        ${
            abilities.length
                ? abilities.map(ability => `
                    <div class="ability-card">
                        <h4>${ability.name}</h4>
                        <p>Type: ${abilityTypesLabel(ability.type)}</p>
                        <p>Damage: ${ability.damage}</p>
                        <p>Energy Cost: ${ability.energyCost}</p>
                        <p>Cooldown: ${ability.cooldown}</p>
                        <p>Upgrade Level: ${ability.upgradeLevel}</p>
                    </div>
                `).join("")
                : "<p>No abilities unlocked yet.</p>"
        }
    `;
}

function abilityTypesLabel(type) {
    return type.charAt(0).toUpperCase() + type.slice(1);
}

const previousAbilityWorldEntry = enterDigitalWorld;

enterDigitalWorld = function () {
    previousAbilityWorldEntry();
    updateAbilityDisplay();
};

window.digimonAbilitySystem = {
    getDigimonAbilities,
    getUnlockedAbilities,
    upgradeAbility,
    updateAbilityDisplay
};

console.log("Digimon abilities connected!");

/* =====================================
   DIGIMON ABILITY DISPLAY
===================================== */

import { getUnlockedAbilities } from "./abilities.js";

export function createAbilityDisplay(getPlayer) {

    function updateAbilityDisplay() {
        const player = getPlayer();
        const gameWorld = document.getElementById("game-world");

        if (!gameWorld || !player.partner) return;

        let panel = document.getElementById(
            "digimon-abilities-panel"
        );

        if (!panel) {
            panel = document.createElement("div");
            panel.id = "digimon-abilities-panel";
            gameWorld.appendChild(panel);
        }

        const level =
            player.digimonProgress?.[player.partner]?.level || 1;

        const abilities = getUnlockedAbilities(
            player.partner,
            level
        );

        panel.innerHTML = `
            <h3>${player.partner}'s Abilities</h3>
            <p>Digimon Level: ${level}</p>

            ${abilities.map(ability => `
                <div class="ability-card">
                    <h4>${ability.name}</h4>
                    <p>Type: ${ability.type}</p>
                    <p>Damage: ${ability.damage}</p>
                    <p>Energy Cost: ${ability.energyCost}</p>
                    <p>Cooldown: ${ability.cooldown}</p>
                    <p>Upgrade Level: ${ability.upgradeLevel}</p>
                </div>
            `).join("")}
        `;
    }

    return { updateAbilityDisplay };
}
