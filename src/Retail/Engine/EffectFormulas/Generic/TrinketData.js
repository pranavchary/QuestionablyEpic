import { convertPPMToUptime, getSetting, processedValue, runGenericPPMTrinket, runGenericFlatProc } from "../EffectUtilities";

export const raidTrinketData = [
  {
    /* ---------------------------------------------------------------------------------------------- */
    /*                                  Neltharion's Call to Suffering                                */
    /* ---------------------------------------------------------------------------------------------- */
    /* Now fixed and procs off HoTs.
    */
    name: "Neltharion's Call to Suffering",
    effects: [
      { // Int portion
        coefficient: 2.637718 * 1.05, //2.901138,
        table: -1,
        stat: "intellect",
        duration: 12,
        ppm: 1,
      },
      { // Self-damage portion
        coefficient: -16.71962,
        table: -8,
        ticks: 6,
        ppm: 1,
      },
    ],
    runFunc: function(data, player, itemLevel, additionalData) {
      let bonus_stats = {};

      bonus_stats.intellect = runGenericPPMTrinket(data[0], itemLevel);
      bonus_stats.hps = runGenericFlatProc(data[1], itemLevel, player);
      //if (player.spec === "Restoration Druid" || player.spec === "Holy Priest") bonus_stats.intellect *= 0.25;

      return bonus_stats;
    }
  },
  {
    /* ---------------------------------------------------------------------------------------------- */
    /*                                     Neltharion's Call to Dominance                                 */
    /* ---------------------------------------------------------------------------------------------- */
    /* 
    */
    name: "Neltharion's Call to Dominance",
    effects: [
      { // Int portion
        coefficient: 0.884775,
        table: -1,
        stat: "intellect",
        duration: 10,
        ppm: 3,
      },
    ],
    runFunc: function(data, player, itemLevel, additionalData) {
      let bonus_stats = {};

      const averageIntellect = processedValue(data[0], itemLevel) * data[0].ppm;
      const effect = data[0];
      bonus_stats.intellect = averageIntellect * effect.duration / 60 * (additionalData.castModel.getSpecialQuery("c60", "cooldownMult") || 1);

      return bonus_stats;
    }
  },
  {
    /* ---------------------------------------------------------------------------------------------- */
    /*                                     Neltharion's Call to Chaos                                 */
    /* ---------------------------------------------------------------------------------------------- */
    /* 
    */
    name: "Neltharion's Call to Chaos",
    effects: [
      { // Int portion
        coefficient: 1.844795 * 1.1,
        table: -1,
        stat: "intellect",
        duration: 18,
        classMod: {"Preservation Evoker": 1, "Holy Paladin": 1},
        ppm: 1 * 0.775, // Ultimately neither spec generates enough AoE events to get close to the advertised PPM.
      },
    ],
    runFunc: function(data, player, itemLevel, additionalData) {
      let bonus_stats = {};

      bonus_stats.intellect = runGenericPPMTrinket(data[0], itemLevel) * (data[0].classMod[player.spec] || 0.5);
      return bonus_stats;
    }
  },
  {
    /* ---------------------------------------------------------------------------------------------- */
    /*                                         Ward of Faceless Ire                                   */
    /* ---------------------------------------------------------------------------------------------- */
    /* 
    */
    name: "Ward of Faceless Ire",
    effects: [
      {  // Heal effect
        coefficient: 371.7325,
        table: -9,
        secondaries: ['versatility'],
        efficiency: {Raid: 0.62, Dungeon: 0.74}, // This is an absorb so you won't lose much value but it's really hard to find good uses for it on a 2 min cadence.
        cooldown: 120, 
      },
    ],
    runFunc: function(data, player, itemLevel, additionalData) {
      let bonus_stats = {};

      bonus_stats.hps = processedValue(data[0], itemLevel, data[0].efficiency[additionalData.contentType]) * player.getStatMults(data[0].secondaries) / data[0].cooldown;

      return bonus_stats;
    }
  },
  {
    /* ---------------------------------------------------------------------------------------------- */
    /*                                    Rashok's Molten Heart                                       */
    /* ---------------------------------------------------------------------------------------------- */
    /* 
    -- Spells that can proc it (incomplete list) --
    Evoker: 
    - Emerald Blossom
    - Time Spiral

    */
    name: "Rashok's Molten Heart",
    effects: [
      { // Mana Portion
        coefficient: 0.813774, // 1.506561 * 0.7, 
        table: -9,
        ppm: 2,
        ticks: 10,
        secondaries: []
      },
      { // Heal over time portion.
        coefficient: 4.441092, //3.86182,
        table: -9, 
        targets: {"Raid": 8, "Dungeon": 5},
        efficiency: 0.5,
        ticks: 10,
        secondaries: ["versatility"], 
      },
      { // Gifted Versatility portion
        coefficient: 0.483271,
        table: -7, 
        targets: {"Raid": 8, "Dungeon": 5},
        duration: 12,
      },
    ],
    runFunc: function(data, player, itemLevel, additionalData) {
      // This can probably be rewritten in a much easier way now that it doesn't have weird haste scaling.
      const BLP = 1.13;
      const effectivePPM = data[0].ppm * BLP;
      let bonus_stats = {};
      const contentType = additionalData.contentType || "Raid";
      //if (additionalData.settings.includeGroupBenefits) bonus_stats.allyStats = processedValue(data[0], itemLevel, versBoost);
      // Healing Portion
      let oneHoT = processedValue(data[1], itemLevel, data[1].efficiency) * player.getStatMults(data[1].secondaries) * data[1].ticks;
      bonus_stats.hps = oneHoT * data[1].targets[contentType] * data[0].ppm / 60 * BLP;

      // Mana Portion
      bonus_stats.mana = processedValue(data[0], itemLevel) * player.getStatMults(data[0].secondaries) * data[1].ticks * data[0].ppm / 60 * BLP;

      // Versatility Portion
      const versEfficiency = 1 - data[1].efficiency; // The strength of the vers portion is inverse to the strength of the HoT portion.

      if (additionalData.settings.includeGroupBenefits) bonus_stats.allyStats = processedValue(data[2], itemLevel) * versEfficiency * effectivePPM * data[2].targets[contentType] * data[2].duration / 60;

      return bonus_stats;
    }
  },
  {
    /* ---------------------------------------------------------------------------------------------- */
    /*                                  Screaming Black Dragonscale                                   */
    /* ---------------------------------------------------------------------------------------------- */
    /* This has an awkward 15s internal cooldown which makes modelling expected uptime much more annoying.
    // This is an annoying PPM + ICD based trinket and so we're actually going to simulate the uptime outside of the app and use that fixed value 
    // instead of calculating it here since simulating it each time would be much slower and still end on the same result.
    */
    name: "Screaming Black Dragonscale",
    effects: [
      { // Crit Portion
        coefficient: 0.919472, //0.815295, //0.906145,
        table: -7,
        stat: "crit",
        duration: 15,
        ppm: 3,
        expectedUptime: 0.475,
      },
      { // Leech Portion
        coefficient: 0.256105,
        table: -7,
        stat: "leech",
        duration: 15,
        ppm: 3,
      },
    ],
    runFunc: function(data, player, itemLevel, additionalData) {
      let bonus_stats = {};

      
      //bonus_stats.crit = runGenericPPMTrinket(data[0], itemLevel);
      //bonus_stats.leech = runGenericPPMTrinket(data[1], itemLevel);

      bonus_stats.crit = processedValue(data[0], itemLevel) * data[0].expectedUptime;
      bonus_stats.leech = processedValue(data[1], itemLevel) * data[0].expectedUptime;

      return bonus_stats;
    }
  },
  {
    /* ---------------------------------------------------------------------------------------------- */
    /*                                Ominous Chromatic Essence                                       */
    /* ---------------------------------------------------------------------------------------------- */
    name: "Ominous Chromatic Essence",
    effects: [
      { // 100% uptime.
        coefficient: 0.456332, //0.4861,
        table: -7,
      },
      { // This is for the proc if you have Earth and Frost in party.
        coefficient: 0.054011,
        table: -7,
        num: 3,
      },
    ],
    runFunc: function(data, player, itemLevel, additionalData) {
      // Versatility Portion
      let bonus_stats = {haste: 0, crit: 0, mastery: 0, versatility: 0};
      const buffSetting = getSetting(additionalData.settings, "chromaticEssenceBuff");
      const includeAllies = getSetting(additionalData.settings, "chromaticEssenceAllies");
      let primaryBuff = (buffSetting === "Automatic" ? player.getHighestStatWeight(additionalData.contentType) : buffSetting).toLowerCase();
      const primaryValue = processedValue(data[0], itemLevel);
      const secondaryValue = includeAllies ? processedValue(data[1], itemLevel) : 0;

      // Buffs from allies

      ["haste", "versatility", "crit", "mastery", "quad buff"].forEach(stat => {
        if (stat === "quad buff") {
          if (primaryBuff === "quad buff") {
            bonus_stats["haste"] += primaryValue / 4;
            bonus_stats["crit"] += primaryValue / 4;
            bonus_stats["versatility"] += primaryValue / 4;
            bonus_stats["mastery"] += primaryValue / 4;
          }
          else {
            bonus_stats["haste"] += secondaryValue / 4;
            bonus_stats["crit"] += secondaryValue / 4;
            bonus_stats["versatility"] += secondaryValue / 4;
            bonus_stats["mastery"] += secondaryValue / 4;
          }
        }
        else {
          if (stat === primaryBuff) bonus_stats[stat] += primaryValue;
          else bonus_stats[stat] += secondaryValue;
        }
        
      });
      return bonus_stats;
    }
  },
  // ========= Season 1 Trinkets =========
  {
    /* ---------------------------------------------------------------------------------------------- */
    /*                                    Broodkeeper's Promise                                       */
    /* ---------------------------------------------------------------------------------------------- */
    /* 
    */
    name: "Broodkeeper's Promise",
    effects: [
      { // Versatility Portion. 100% uptime.
        coefficient: 0.096854,
        table: -7,
        stat: "versatility",
        percentBoosted: 0.75,
        boostValue: 1.5,
      },
      { // Heal over time portion. Remember this is on both yourself and your bonded target.
        // The processed value here actually doesn't line up perfectly but is a close estimate. -6 is a difficult table and a precise formula isn't yet available.
        coefficient: 1.29544,
        table: -8, // -6 in spell data.
        percentBoosted: 0.75,
        boostValue: 2.33,
        efficiency: 0.77,
        secondaries: ["haste", "versatility"], // Currently cannot Crit. TODO: Test Haste.
      },
    ],
    runFunc: function(data, player, itemLevel, additionalData) {
      // Versatility Portion
      let bonus_stats = {};
      const versBoost = data[0].percentBoosted * data[0].boostValue + (1-data[0].percentBoosted)
      bonus_stats.versatility = processedValue(data[0], itemLevel, versBoost);

      if (additionalData.settings.includeGroupBenefits) bonus_stats.allyStats = processedValue(data[0], itemLevel, versBoost);
      // Healing Portion
      let healing = processedValue(data[1], itemLevel) * player.getStatMults(data[1].secondaries) * 2;
      bonus_stats.hps = healing * data[1].efficiency * ( data[0].percentBoosted * data[1].boostValue + (1-data[1].percentBoosted));

      return bonus_stats;
    }
  },
  {
    /* ---------------------------------------------------------------------------------------------- */
    /*                                    Conjured Chillglobe                                         */
    /* ---------------------------------------------------------------------------------------------- */
    /* 
    */
    name: "Conjured Chillglobe",
    effects: [
      { // Damage portion
        coefficient: 133.4993,
        table: -9,
        percentUsed: 0.3,
        cooldown: 60,
        secondaries: ["crit", "versatility"],
      },
      { // Mana portion
        coefficient: 30.13977,
        table: -9, 
        percentUsed: 0.7,
        cooldown: 60,
      },
    ],
    runFunc: function(data, player, itemLevel, additionalData) {
      let bonus_stats = {};

      // Damage Portion
      bonus_stats.dps = processedValue(data[0], itemLevel, data[0].percentUsed) * player.getStatMults(data[0].secondaries) / data[0].cooldown;

      // Mana Portion
      bonus_stats.mana = processedValue(data[1], itemLevel, data[1].percentUsed) / data[1].cooldown;

      return bonus_stats;
    }
  },
  {
    /* ---------------------------------------------------------------------------------------------- */
    /*                                Whispering Incarnate Icon                                       */
    /* ---------------------------------------------------------------------------------------------- */
    /*  DPS: Frost
        Healer: Fire
        Tank: Earth
        Possible group-only requirement.
        If you have both Frost & Fire in group then you'll get both buffs when it procs. It's based on what you do and does proc off healing.
    */
    name: "Whispering Incarnate Icon",
    effects: [
      { // 100% uptime. Probably add a setting for the rest?
        coefficient: 0.599658,
        table: -1,
      },
      { // This is for the proc if you have Earth and Frost in party.
        coefficient: 0.250517,
        table: -7,
        ppm: 2,
        duration: 12,
      },
    ],
    runFunc: function(data, player, itemLevel, additionalData) {
      // Versatility Portion
      let bonus_stats = {};
      bonus_stats.haste = processedValue(data[0], itemLevel);

      // Ally buff
      let sharedBuff = runGenericPPMTrinket(data[1], itemLevel);
      const iconSetting = getSetting(additionalData.settings, "incarnateAllies")

      // Check if buffs are active and if they are, add them to bonus stats.
      if (iconSetting === "Tank") bonus_stats.versatility = sharedBuff;
      else if (iconSetting === "DPS") bonus_stats.crit = sharedBuff;
      else if (iconSetting === "Tank + DPS")  {
        bonus_stats.crit = sharedBuff;
        bonus_stats.versatility = sharedBuff;
      }     
      
      return bonus_stats;
    }
  },

];

/* ------------------------------------------- Unused ------------------------------------------- */
// export const TAGS = {
//   It should be noted that this is longer used anywhere, and were part of a different trinket draft.
//   ON_USE: "on-use",
//   MULTIPLIER: "multiplier",
//   DURATION: "duration",
//   PPM: "ppm",
//   HASTED_PPM: "hasted-ppm",
//   DURATION_BASED: "duration-based",
//   METEOR: "meteor", // The meteor effect increases a trinkets value by X based on targets hit up to Y. X should be represented as 'multiplier' and Y as the 'cap'.
//   TICKS: "ticks",
// };
