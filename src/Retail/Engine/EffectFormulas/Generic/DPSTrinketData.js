import { convertPPMToUptime, getSetting, processedValue, runGenericPPMTrinket, runGenericOnUseTrinket, getDiminishedValue, runDiscOnUseTrinket } from "../EffectUtilities";

export const dpsTrinketData = [
  {
    /* ---------------------------------------------------------------------------------------------- */
    /*                                          Eye of Skovald                                        */
    /* ---------------------------------------------------------------------------------------------- */
    /* 
    */
    name: "Eye of Skovald",
    effects: [
      { // Mastery portion
        coefficient: 61.85143,
        table: -8,
        stat: "dps",
        secondaries: ['crit', 'haste', 'versatility'],
        meteorMult: 0.15,
        ppm: 4,
      },
    ],
    runFunc: function(data, player, itemLevel, additionalData) {
      let bonus_stats = {};
      
      const oneHit = processedValue(data[0], itemLevel, data[0].mult) * player.getStatMults(data[0].secondaries);
      const multiplier = 1 + data[0].meteorMult * Math.min(5, getSetting(additionalData.settings, "dungeonTargets"));

      bonus_stats.dps =  oneHit * multiplier * data[0].ppm / 60;

      return bonus_stats;
    }
  },
  {
    /* ---------------------------------------------------------------------------------------------- */
    /*                                      Windscar Whetstone                                        */
    /* ---------------------------------------------------------------------------------------------- */
    /* 
    */
    name: "Windscar Whetstone",
    effects: [
      { // Mastery portion
        coefficient: 119.2894,
        table: -8,
        stat: "dps",
        secondaries: ['crit', 'versatility'],
        meteorMult: 0.15,
        cooldown: 120,
        ticks: 6,
        armorMult: 0.7,
      },
    ],
    runFunc: function(data, player, itemLevel, additionalData) {
      let bonus_stats = {};
      
      const oneHit = processedValue(data[0], itemLevel, data[0].mult) * player.getStatMults(data[0].secondaries);
      const multiplier = 1 + data[0].meteorMult * Math.min(5, getSetting(additionalData.settings, "dungeonTargets"));

      bonus_stats.dps =  oneHit * multiplier * data[0].armorMult * data[0].ticks / data[0].cooldown;
        console.log(bonus_stats);
      return bonus_stats;
    }
  },
  {
    /* ---------------------------------------------------------------------------------------------- */
    /*                                    Furious Ragefeather                                        */
    /* ---------------------------------------------------------------------------------------------- */
    /* 
    */
    name: "Furious Ragefeather",
    effects: [
      { 
        coefficient: 11.29835,
        table: -9,
        stat: "dps",
        secondaries: ['crit', 'haste', 'versatility'],
        bonusPPM: 0.4,
        hits: 11,
        ppm: 1,
      },
    ],
    runFunc: function(data, player, itemLevel, additionalData) {
      let bonus_stats = {};
      
      const oneHit = processedValue(data[0], itemLevel, data[0].mult) * player.getStatMults(data[0].secondaries);

      bonus_stats.dps =  oneHit * (data[0].ppm + data[0].bonusPPM) * data[0].hits / 60;

      return bonus_stats;
    }
  },


]