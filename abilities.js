
/* =====================================
   DIGIMON ABILITIES SYSTEM
===================================== */

export const abilityTypes = {
    fire: "Fire",
    water: "Water",
    ice: "Ice",
    wind: "Wind",
    electricity: "Electricity",
    nature: "Nature",
    light: "Light",
    darkness: "Darkness",
    earth: "Earth",
    physical: "Physical"
};

export const digimonAbilities = {
    Agumon: [
        {
            name: "Pepper Breath",
            type: "fire",
            damage: 25,
            energyCost: 10,
            cooldown: 2,
            unlockLevel: 1,
            upgradeLevel: 1
        },
        {
            name: "Claw Attack",
            type: "physical",
            damage: 15,
            energyCost: 5,
            cooldown: 1,
            unlockLevel: 1,
            upgradeLevel: 1
        }
    ],

    Gabumon: [
        {
            name: "Blue Blaster",
            type: "ice",
            damage: 25,
            energyCost: 10,
            cooldown: 2,
            unlockLevel: 1,
            upgradeLevel: 1
        },
        {
            name: "Horn Attack",
            type: "physical",
            damage: 15,
            energyCost: 5,
            cooldown: 1,
            unlockLevel: 1,
            upgradeLevel: 1
        }
    ],

    Patamon: [
        {
            name: "Boom Bubble",
            type: "wind",
            damage: 20,
            energyCost: 8,
            cooldown: 2,
            unlockLevel: 1,
            upgradeLevel: 1
        }
    ],

    Gomamon: [
        {
            name: "Marching Fishes",
            type: "water",
            damage: 25,
            energyCost: 12,
            cooldown: 3,
            unlockLevel: 1,
            upgradeLevel: 1
        }
    ],

    Palmon: [
        {
            name: "Poison Ivy",
            type: "nature",
            damage: 20,
            energyCost: 10,
            cooldown: 2,
            unlockLevel: 1,
            upgradeLevel: 1
        }
    ],

    Tentomon: [
        {
            name: "Super Shocker",
            type: "electricity",
            damage: 25,
            energyCost: 10,
            cooldown: 2,
            unlockLevel: 1,
            upgradeLevel: 1
        }
    ],

    Biyomon: [
        {
            name: "Spiral Twister",
            type: "wind",
            damage: 25,
            energyCost: 10,
            cooldown: 2,
            unlockLevel: 1,
            upgradeLevel: 1
        }
    ],

    Gatomon: [
        {
            name: "Cat's Eye Hypnotism",
            type: "light",
            damage: 20,
            energyCost: 10,
            cooldown: 3,
            unlockLevel: 1,
            upgradeLevel: 1
        }
    ],

    Veemon: [
        {
            name: "Vee Headbutt",
            type: "physical",
            damage: 25,
            energyCost: 8,
            cooldown: 2,
            unlockLevel: 1,
            upgradeLevel: 1
        }
    ],

    Wormmon: [
        {
            name: "Sticky Net",
            type: "nature",
            damage: 15,
            energyCost: 8,
            cooldown: 2,
            unlockLevel: 1,
            upgradeLevel: 1
        }
    ],

    Hawkmon: [
        {
            name: "Feather Slash",
            type: "wind",
            damage: 20,
            energyCost: 8,
            cooldown: 2,
            unlockLevel: 1,
            upgradeLevel: 1
        }
    ],

    Armadillomon: [
        {
            name: "Diamond Shell",
            type: "earth",
            damage: 20,
            energyCost: 10,
            cooldown: 3,
            unlockLevel: 1,
            upgradeLevel: 1
        }
    ]
};

/* Return a Digimon's abilities */
export function getDigimonAbilities(digimonName) {
    return digimonAbilities[digimonName] || [];
}

/* Return abilities unlocked at the Digimon's current level */
export function getUnlockedAbilities(digimonName, level) {
    return getDigimonAbilities(digimonName).filter(
        ability => level >= ability.unlockLevel
    );
}

/* Upgrade an ability */
export function upgradeAbility(ability) {
    if (ability.upgradeLevel >= 5) {
        return false;
    }

    ability.upgradeLevel++;
    ability.damage += 5;

    return true;
}

