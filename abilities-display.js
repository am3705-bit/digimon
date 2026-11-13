
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
