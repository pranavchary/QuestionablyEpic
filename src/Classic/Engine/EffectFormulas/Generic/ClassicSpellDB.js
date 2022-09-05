

// Classic Druid Spell DB.
export const DRUIDLKSPELLDB = {
    "Rest": [{ // This lets the sequence gen rest. The time param is flexible. 
        type: "",
        castTime: 1.5,
        cost: 0,
    }],
    "Rejuvenation": [{
        castTime: 0,
        type: "buff",
        name: "Rejuvenation",
        buffType: "heal",
        coeff: 0.376, // 
        cost: 18,
        flatHeal: 338,
        tickRate: 3,
        buffDuration: 15,
        expectedOverheal: 0.3,
        secondaries: [], // + Haste
        canPartialTick: false,
        hastedTicks: false,
    }],
    "Wild Growth": [{
        castTime: 0,
        type: "buff",
        name: "Wild Growth",
        buffType: "heal",
        coeff: 0.115, // 
        cooldown: 6,
        activeCooldown: 0,
        flatHeal: 206,
        tickRate: 1,
        cost: 23,
        targets: 6,
        buffDuration: 7,
        expectedOverheal: 0.3,
        secondaries: [], // + Haste
        canPartialTick: false,
        hastedTicks: false,
    }],
    "Regrowth": [{ // NYI
        castTime: 0,
        type: "buff",
        name: "Rejuvenation",
        buffType: "heal",
        coeff: 0.376, // 
        cost: 18,
        flatHeal: 338,
        tickRate: 3,
        buffDuration: 15,
        expectedOverheal: 0.3,
        secondaries: [], // + Haste
        canPartialTick: false,
    }],
}

export const DISCLKSPELLDB = {


}

export const PALADINLKSPELLDB = {


}

