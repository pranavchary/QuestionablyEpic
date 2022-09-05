// 
import { applyDiminishingReturns } from "General/Engine/ItemUtilities";
import { DRUIDLKSPELLDB } from "./ClassicSpellDB";
import { reportError } from "General/SystemTools/ErrorLogging/ErrorReporting";
import { checkBuffActive, removeBuffStack, getCurrentStats, getHaste, getSpellRaw, getStatMult, GLOBALCONST, getBuffStacks } from "Classic/Engine/EffectFormulas/Generic/RampBaseClassic";

const addReport = (state, entry) => {
    if (state.settings.reporting) state.report.push({t: Math.round(100*state.t)/100, e: entry});
}


const getHealth = (stamina) => {
    return stamina * 20;
}

const LKCONSTANTS = {
    
    masteryMod: 1.8, 
    masteryEfficiency: 0.92, 
    baseMana: 3496,

    //CBT: {transferRate: 0.3, expectedOverhealing: 0.25},
    auraHealingBuff: 1, 
    auraDamageBuff: 1, 

    enemyTargets: 1, 

}

const triggerEssenceBurst = (state) => {
    if (state.talents.exhiliratingBurst) {
        // If we're talented into Exhil Burst then also add that buff.
        // If we already have an Exhilirating Burst active then we'll just refresh it's duration instead.
        // If not, we'll create a new buff.
        const activeBuff = state.activeBuffs.filter(function (buff) {return buff.name === "Exhilirating Burst"});
        const exhilBurst = EVOKERCONSTANTS.exhilBurstBuff;
        if (activeBuff.length > 0) activeBuff.expiration = (state.t + exhilBurst.buffDuration);
        else {
            exhilBurst.expiration = (state.t + exhilBurst.buffDuration);
            addReport(state, `Adding buff: Essence Burst`);
            state.activeBuffs.push(exhilBurst);
        }
    }
}


/**
 * This function handles all of our effects that might change our spell database before the ramps begin.
 * It includes conduits, legendaries, and some trinket effects.
 * 
 * @param {*} evokerSpells Our spell database
 * @param {*} settings Settings including legendaries, trinkets, soulbinds and anything that falls out of any other category.
 * @param {*} talents The talents run in the current set.
 * @returns An updated spell database with any of the above changes made.
 */
 const applyLoadoutEffects = (adjSpells, settings, talents, state, stats) => {

    // ==== Default Loadout ====
    // While Top Gear can automatically include everything at once, individual modules like Trinket Analysis require a baseline loadout
    // since if we compare trinkets like Bell against an empty loadout it would be very undervalued. This gives a fair appraisal when
    // we don't have full information about a character.
    // As always, Top Gear is able to provide a more complete picture. 
    if (settings['DefaultLoadout']) {

    }

    // Raid Buffs
    // Arcane Intellect
    stats.intellect += 60;

    // Gift of the Wild
    stats.intellect += (37 * 1.4);
    stats.spirit += (37 * 1.4);

    // ==== Talents ====
    // Not all talents just make base modifications to spells, but those that do can be handled here.

    // Druid Stat Talents
    if (talents.livingSpirit) stats.spirit *= (1 + talents.livingSpirit * 0.05);
    if (talents.improvedTree) stats.spellpower += (stats.spirit * 0.05 * talents.improvedTree);

    // Gift of the Wild +2% increase
    if (talents.giftOfTheWild) {
        stats.spirit *= (1 + talents.livingSpirit * 0.01);
        stats.intellect *= (1 + talents.livingSpirit * 0.01);
    }
    

    // Druid Spell Talents
    if (talents.giftOfNature) LKCONSTANTS.auraHealingBuff = (1 + talents.giftOfNature * 0.02);

    // Improved Rejuvenation - +15% healing
    if (talents.improvedRejuvenation) {
        adjSpells['Rejuvenation'][0].flatHeal *= (1 + talents.improvedRejuvenation * 0.05);
        adjSpells['Rejuvenation'][0].coeff *= (1 + talents.improvedRejuvenation * 0.05);
    }

    // Empowered Rejuvenation - +20% coefficient on all HoTs
    if (talents.empoweredRejuvenation) {
        adjSpells['Rejuvenation'][0].coeff *= (1 + talents.empoweredRejuvenation * 0.04);
        adjSpells['Wild Growth'][0].coeff *= (1 + talents.empoweredRejuvenation * 0.04);
        //adjSpells['Regrowth'][1].coeff *= (1 + talents.empoweredRejuvenation * 0.04);
    }

    // Genesis - +5% HoT Healing
    if (talents.genesis) {
        adjSpells['Rejuvenation'][0].coeff *= (1 + talents.genesis * 0.01);
        adjSpells['Wild Growth'][0].coeff *= (1 + talents.genesis * 0.01);
        //adjSpells['Regrowth'][1].coeff *= (1 + talents.genesis * 0.01);

        adjSpells['Rejuvenation'][0].flat *= (1 + talents.genesis * 0.01);
        adjSpells['Wild Growth'][0].flat *= (1 + talents.genesis * 0.01);
        //adjSpells['Regrowth'][1].flat *= (1 + talents.genesis * 0.01);
    }

    // Gift of the Earthmother
    // 10% haste. Maybe just put a buff up for this since it's multiplicative probably.
    if (talents.giftOfTheEarthmother) {
        state.activeBuffs.push({
            type: "buff",
            buffType: "statsMult",
            stat: 'haste',
            value: 1.1,
            expiration: 999,
        })
    }

    // Celestial Focus
    // Same but with 3% haste.
    if (talents.celestialFocus) {
        state.activeBuffs.push({
            type: "buff",
            buffType: "statsMult",
            stat: 'haste',
            value: 1.03,
            expiration: 999,
        })
    }



    // Druid mana changes
    // Note that multiple discounts are applied additively.
    // Moonglow and Tree Form (passive) sum for a 29% reduction. 
    // Tree Form is HoTs only, Moonglow is HT, Nourish, Rejuv, Regrowth.

    // Moonglow & Tree Form
    adjSpells['Rejuvenation'][0].cost *= (1 - ((talents.moonglow || 0) * 0.03 + (talents.treeOfLife || 0) * 0.2));
    adjSpells['Regrowth'][0].cost *= (1 - ((talents.moonglow || 0) * 0.03 + (talents.treeOfLife || 0) * 0.2));
    adjSpells['Wild Growth'][0].cost *= (1 - (talents.treeOfLife || 0) * 0.2);
    //adjSpells['Regrowth'][0].cost *= (1 - talents.moonglow * 0.03);



    // Setup mana costs & cooldowns.
    for (const [key, value] of Object.entries(adjSpells)) {
        let spell = value[0];

        spell.cost = spell.cost * LKCONSTANTS.baseMana / 100;

    }


    
    // Remember, if it adds an entire ability then it shouldn't be in this section. Add it to ramp generators in DiscRampGen.


    // Raid Buffs
    // Kings

    stats.spirit *= 1.1;
    stats.intellect *= 1.1;


    // ==== Tier Sets ====



    return adjSpells;
}


/** A spells damage multiplier. It's base damage is directly multiplied by anything the function returns.
 * @schism 25% damage buff to primary target if Schism debuff is active.
 * @sins A 3-12% damage buff depending on number of active atonements.
 * @chaosbrand A 5% damage buff if we have Chaos Brand enabled in Disc Settings.
 * @AscendedEruption A special buff for the Ascended Eruption spell only. The multiplier is equal to 3% (4 with conduit) x the number of Boon stacks accrued.
 */
const getDamMult = (state, buffs, activeAtones, t, spellName, talents) => {
    let mult = EVOKERCONSTANTS.auraDamageBuff;
    
    mult *= (buffs.filter(function (buff) {return buff.name === "Avenging Wrath"}).length > 0 ? 1.2 : 1); 
    
    return mult; 
}

/** A healing spells healing multiplier. It's base healing is directly multiplied by whatever the function returns.
 * @powerwordshield Gets a 200% buff if Rapture is active (modified by Exaltation if taken)
 * @ascendedEruption The healing portion also gets a buff based on number of boon stacks on expiry.
 */
const getHealingMult = (state, t, spellName, talents) => {
    let mult = LKCONSTANTS.auraHealingBuff;

    
    return mult;
}




const getSqrt = (targets) => {
    return Math.sqrt(targets);
}


export const runHeal = (state, spell, spellName, compile = true) => {

    // Pre-heal processing
    const currentStats = state.currentStats;

    const healingMult = getHealingMult(state, state.t, spellName, state.talents); 
    const targetMult = (('tags' in spell && spell.tags.includes('sqrt')) ? getSqrt(spell.targets) : spell.targets) || 1;
    const healingVal = getSpellRaw(spell, currentStats, LKCONSTANTS) * (1 - spell.expectedOverheal) * healingMult * targetMult;
    
    //if (cloudburstActive) cloudburstHealing = (healingVal / (1 - spell.expectedOverheal)) * EVOKERCONSTANTS.CBT.transferRate * (1 - EVOKERCONSTANTS.CBT.expectedOverhealing);
    //console.log(spellName + ": " + healingVal + ". t:" + targetMult + ". HealingM: " + healingMult);
    
    if (compile) state.healingDone[spellName] = (state.healingDone[spellName] || 0) + healingVal;
    addReport(state, `${spellName} healed for ${Math.round(healingVal)} (m: ${healingMult})`)
    //if (compile) state.healingDone['Cloudburst Totem'] = (state.healingDone['Cloudburst Totem'] || 0) + cloudburstHealing;

    return healingVal;
}

export const runDamage = (state, spell, spellName, atonementApp, compile = true) => {

    //const activeAtonements = getActiveAtone(atonementApp, state.t); // Get number of active atonements.
    const damMultiplier = getDamMult(state, state.activeBuffs, 0, state.t, spellName, state.talents); // Get our damage multiplier (Schism, Sins etc);
    const damageVal = getSpellRaw(spell, state.currentStats, EVOKERCONSTANTS) * damMultiplier;
    
    // This is stat tracking, the atonement healing will be returned as part of our result.
    if (compile) state.damageDone[spellName] = (state.damageDone[spellName] || 0) + damageVal; // This is just for stat tracking.
    addReport(state, `${spellName} dealt for ${Math.round(damageVal)} damage`)
    return damageVal;
}

const canCastSpell = (state, spellDB, spellName) => {
    
    const spell = spellDB[spellName][0];
    let miscReq = true;

    const cooldownReq = (state.t > spell.activeCooldown) || !spell.cooldown;

    return cooldownReq && miscReq;
}

const getSpellHPM = (state, spellDB, spellName) => {
    const spell = spellDB[spellName][0];
    const spellHealing = runHeal(state, spell, spellName, false)

    return spellHealing / spell.cost || 0;
}



export const genSpell = (state, spells) => {
    let spellName = ""

    const usableSpells = [...apl].filter(spell => canCastSpell(state, spells, spell));

    if (apl.includes("Wild Growth") && !(usableSpells.includes("Wild Growth"))) {
        if ((spells["Wild Growth"][0].activeCooldown - state.t) < (0.5 / getHaste(state.currentStats))) {
            // Wild Growth is nearly up soon. Hold CD.
            spells["Rest"][0].castTime = (spells["Wild Growth"][0].activeCooldown - state.t + 0.01);
            return "Rest";
        }
    }

    /*
    if (state.holyPower >= 3) {
        spellName = "Light of Dawn";
    }
    else {
        let possibleCasts = [{name: "Holy Shock", score: 0}, {name: "Flash of Light", score: 0}]

        possibleCasts.forEach(spellData => {
            if (canCastSpell(state, spells, spellData['name'])) {
                spellData.score = getSpellHPM(state, spells, spellData['name'])
            }
            else {
                spellData.score = -1;
            }
        });
        possibleCasts.sort((a, b) => (a.score < b.score ? 1 : -1));
        console.log(possibleCasts);
        spellName = possibleCasts[0].name;
    }
    console.log("Gen: " + spellName + "|");
    */
    return usableSpells[0];

}


const apl = ["Wild Growth", "Rejuvenation"]

const runSpell = (fullSpell, state, spellName, evokerSpells) => {
    fullSpell.forEach(spell => {

        let canProceed = true;

        if (canProceed) {
            // The spell casts a different spell. 
            if (spell.type === 'castSpell') {
                addReport(state, `Spell Proc: ${spellName}`)
                const newSpell = evokerSpells[spell.storedSpell];
                runSpell(newSpell, state, spell.storedSpell, evokerSpells);
            }
            // The spell has a healing component. Add it's effective healing.
            // Power Word: Shield is included as a heal, since there is no functional difference for the purpose of this calculation.
            else if (spell.type === 'heal') {
                runHeal(state, spell, spellName)
            }
            
            
            // The spell has a damage component. Add it to our damage meter, and heal based on how many atonements are out.
            else if (spell.type === 'damage') {
                runDamage(state, spell, spellName)
            }
            // The spell has a damage component. Add it to our damage meter, and heal based on how many atonements are out.
            else if (spell.type === 'function') {
                spell.runFunc(state, spell);
            }

            // The spell adds a buff to our player.
            // We'll track what kind of buff, and when it expires.
            else if (spell.type === "buff") {
                addReport(state, `Adding buff: ${spell.name}`);
                if (spell.buffType === "stats") {
                    state.activeBuffs.push({name: spellName, expiration: state.t + spell.buffDuration, buffType: "stats", value: spell.value, stat: spell.stat});
                }
                else if (spell.buffType === "statsMult") {
                    state.activeBuffs.push({name: spellName, expiration: state.t + spell.buffDuration, buffType: "statsMult", value: spell.value, stat: spell.stat});
                }
                else if (spell.buffType === "damage" || spell.buffType === "heal") {     
                    const newBuff = {name: spell.name, buffType: spell.buffType, attSpell: spell,
                        tickRate: spell.tickRate, canPartialTick: spell.canPartialTick, next: state.t + spell.tickRate }// getHaste(state.currentStats))}

                    newBuff['expiration'] = spell.hastedDuration ? state.t + (spell.buffDuration / getHaste(currentStats)) : state.t + spell.buffDuration    
                    state.activeBuffs.push(newBuff)

                }
                else if (spell.buffType === "function") {
                    const newBuff = {name: spellName, buffType: spell.buffType, attSpell: spell,
                        tickRate: spell.tickRate, canPartialTick: spell.canPartialTick || false, 
                        next: state.t + (spell.tickRate / getHaste(state.currentStats))}
                    newBuff.attFunction = spell.function;
                    if (spellName === "Reversion") newBuff.expiration = (state.t + spell.castTime + (spell.buffDuration / (1 - 0.25)));

                    state.activeBuffs.push(newBuff);
                }
                else if (spell.buffType === "special") {
                    // Check if buff already exists, if it does add a stack.
                    const buffStacks = state.activeBuffs.filter(function (buff) {return buff.name === spell.name}).length;

                    if (spell.canStack === false || buffStacks === 0) {
                        const buff = {name: spell.name, expiration: (state.t  + spell.buffDuration) + (spell.castTime || 0), buffType: spell.buffType, value: spell.value, stacks: 1, canStack: spell.canStack}
                    
                        if (spell.name === "Cycle of Life") {

                            buff.runEndFunc = true;
                            buff.runFunc = spell.runFunc;
                            buff.canPartialTick = true;

                        }
                        //if (spell.name === "Temporal Compression") console.log(buff);
                        state.activeBuffs.push(buff);
                    }
                    else {
    
                        const buff = state.activeBuffs.filter(buff => buff.name === spell.name)[0]

                        addReport(state, `${spell.name} stacks: ${buff.stacks+1}`)

                        
                        if (buff.canStack) buff.stacks += 1;
                    }

                    if (spell.name === "Essence Burst") {
                        triggerEssenceBurst(state);
                    }

                    

                }     
                else {
                    state.activeBuffs.push({name: spellName, expiration: state.t + spell.castTime + spell.buffDuration});
                }
            }

            // These are special exceptions where we need to write something special that can't be as easily generalized.

            if (spell.cooldown) spell.activeCooldown = state.t + spell.cooldown;
        
            }


 
        // Grab the next timestamp we are able to cast our next spell. This is equal to whatever is higher of a spells cast time or the GCD.
    }); 
}

/**
 * Run a full cast sequence. This is where most of the work happens. It runs through a short ramp cycle in order to compare the impact of different trinkets, soulbinds, stat loadouts,
 * talent configurations and more. Any effects missing can be easily included where necessary or desired.
 * @param {} sequence A sequence of spells representing a ramp. Note that in two ramp cycles like alternating Fiend / Boon this function will cover one of the two (and can be run a second
 * time for the other).
 * @param {*} stats A players base stats that are found on their gear. This doesn't include any effects which we'll apply in this function.
 * @param {*} settings Any special settings. We can include soulbinds, legendaries and more here. Trinkets should be included in the cast sequence itself and conduits are handled below.
 * @param {object} conduits Any conduits we want to include. The conduits object is made up of {ConduitName: ConduitLevel} pairs where the conduit level is an item level rather than a rank.
 * @returns The expected healing of the full ramp.
 */
export const runCastSequence = (sequence, stats, settings = {}, talents = {}) => {
    //console.log("Running cast sequence");
    let state = {t: 0.01, report: [], activeBuffs: [], healingDone: {}, damageDone: {}, manaSpent: 0, settings: settings, talents: talents, reporting: false};

    const sequenceLength = 900; // The length of any given sequence. Note that each ramp is calculated separately and then summed so this only has to cover a single ramp.
    const seqType = "Auto" // Auto / Manual.
    let nextSpell = 0;
    const startTime = performance.now();
    // Note that any talents that permanently modify spells will be done so in this loadoutEffects function. 
    // Ideally we'll cover as much as we can in here.
    const evokerSpells = applyLoadoutEffects(deepCopyFunction(DRUIDLKSPELLDB), settings, talents, state, stats);
    
    const seq = [...sequence];

    // Calculate Mana over the sequence length.
    const percRegen = 0.5; // Move this
    const regenPerFive = ((0.001 + (stats.spirit * Math.sqrt(stats.intellect) * 0.005575)) * 5 * 0.6 * percRegen) + stats.mp5;
    const manaPool = 3496 + (stats.intellect - 20) * 15 + 20 // The first 20 points of intellect are worth 1 mana. After that they are worth 15 mana each.
    const innervateMana = Math.ceil(sequenceLength/60/3) * 3496 * 2.25 // 2 uses of 225% base mana.
    const manaAvailable = (manaPool + innervateMana + regenPerFive * (sequenceLength / 5))

    state.manaAvailable = manaAvailable;

    for (var t = 0; state.t < sequenceLength; state.t += 0.01) {

        
        // ---- Heal over time and Damage over time effects ----
        // When we add buffs, we'll also attach a spell to them. The spell should have coefficient information, secondary scaling and so on. 
        // When it's time for a HoT or DoT to tick (state.t > buff.nextTick) we'll run the attached spell.
        // Note that while we refer to DoTs and HoTs, this can be used to map any spell that's effect happens over a period of time. 
        // This includes stuff like Shadow Fiend which effectively *acts* like a DoT even though it is technically not one.
        // You can also call a function from the buff if you'd like to do something particularly special. You can define the function in the specs SpellDB.
        const healBuffs = state.activeBuffs.filter(function (buff) {return (buff.buffType === "heal" || buff.buffType === "damage" || buff.buffType === "function") && state.t >= buff.next})
        if (healBuffs.length > 0) {
            healBuffs.forEach((buff) => {
               
                let currentStats = {...stats};
                state.currentStats = getCurrentStats(currentStats, state.activeBuffs)

                if (buff.buffType === "heal") {
                    const spell = buff.attSpell;
                    runHeal(state, spell, buff.name + "(hot)")
                }
                else if (buff.buffType === "damage") {
                    const spell = buff.attSpell;
                    runDamage(state, spell, buff.name)
                }
                else if (buff.buffType === "function") {
                    const func = buff.attFunction;
                    const spell = buff.attSpell;
                    func(state, spell);
                } 
                buff.next = buff.next + (buff.tickRate )/// getHaste(state.currentStats));
            });  
        }

        // -- Partial Ticks --
        // When DoTs / HoTs expire, they usually have a partial tick. The size of this depends on how close you are to your next full tick.
        // If your Shadow Word: Pain ticks every 1.5 seconds and it expires 0.75s away from it's next tick then you will get a partial tick at 50% of the size of a full tick.
        // Note that some effects do not partially tick (like Fiend), so we'll use the canPartialTick flag to designate which do and don't. 
        const expiringHots = state.activeBuffs.filter(function (buff) {return (buff.buffType === "heal" || buff.buffType === "damage" || buff.runEndFunc) && state.t >= buff.expiration && buff.canPartialTick})
        expiringHots.forEach(buff => {

            if (buff.buffType === "heal" || buff.buffType === "damage") {
                const tickRate = buff.tickRate /// getHaste(state.currentStats)
                const partialTickPercentage = (buff.next - state.t) / tickRate;
                const spell = buff.attSpell;
                spell.coeff = spell.coeff * partialTickPercentage;

                if (buff.buffType === "damage") runDamage(state, spell, buff.name);
                else if (buff.buffType === "healing") runHeal(state, spell, buff.name + "(hot)");
            }
            else if (buff.runEndFunc) buff.runFunc(state, buff);
        })

        // Remove any buffs that have expired. Note that we call this after we handle partial ticks. 
        state.activeBuffs = state.activeBuffs.filter(function (buff) {return buff.expiration > state.t});

        // This is a check of the current time stamp against the tick our GCD ends and we can begin our queued spell.
        // It'll also auto-cast Ascended Eruption if Boon expired.
        if ((state.t > nextSpell && seq.length > 0))  {

            // Update current stats for this combat tick.
            // Effectively base stats + any current stat buffs.
            let currentStats = {...stats};
            state.currentStats = getCurrentStats(currentStats, state.activeBuffs);

            let spellName = "";
            if (seqType === "Manual") spellName = seq.shift();
            else spellName = genSpell(state, evokerSpells);

            const fullSpell = evokerSpells[spellName];

            // We'll iterate through the different effects the spell has.
            // Smite for example would just trigger damage (and resulting atonement healing), whereas something like Mind Blast would trigger two effects (damage,
            // and the absorb effect).
            state.manaSpent += fullSpell[0].cost || 0;

            runSpell(fullSpell, state, spellName, evokerSpells);

            // Check if Echo
            // If we have the Echo buff active, and our current cast is Echo compatible (this will probably change through Alpha) then:
            // - Recast the echo version of the spell (created at the start of runtime).
            // - The echo versions of spells are a weird mix of exception cases.
            if (checkBuffActive(state.activeBuffs, "Echo") &&  !(EVOKERCONSTANTS.echoExceptionSpells.includes(spellName))) {
                // We have at least one Echo.

                // Check Echo number.
                const echoNum = state.activeBuffs.filter(function (buff) {return buff.name === "Echo"}).length;
                for (let j = 0; j < echoNum; j++) {
                    // Cast the Echo'd version of our spell j times.
                    
                    const echoSpell = evokerSpells[spellName + "(Echo)"]
                    runSpell(echoSpell, state, spellName + "(Echo)", evokerSpells)
  
                }

                // Remove all of our Echo buffs.
                state.activeBuffs =  state.activeBuffs.filter(function (buff) {return buff.name !== "Echo"})

            }
 

            if ('castTime' in fullSpell[0]) {
                let castTime = fullSpell[0].castTime;

                if (fullSpell[0].empowered) {
                    // Empowered spells don't currently scale with haste.
                    if (checkBuffActive(state.activeBuffs, "Temporal Compression")) {
                        const buffStacks = getBuffStacks(state.activeBuffs, "Temporal Compression")
                        castTime *= (1 - 0.05 * buffStacks)
                        if (buffStacks === 4) triggerTemporal(state);
                    }

                    nextSpell += castTime / getHaste(state.currentStats); // Empowered spells do scale with haste.

                } 

                else if (castTime === 0) nextSpell += (Math.max(1, 1.5 / getHaste(state.currentStats))); //1s GCD cap.
                else nextSpell += (castTime / getHaste(currentStats));
            }
            else console.log("CAST TIME ERROR. Spell: " + spellName);
            
        }
    }


    // Add up our healing values (including atonement) and return it.
    const sumValues = obj => Object.values(obj).reduce((a, b) => a + b);
    //state.activeBuffs = [];
    state.totalDamage = Object.keys(state.damageDone).length > 0 ? Math.round(sumValues(state.damageDone)) : 0;
    state.totalHealing = Object.keys(state.healingDone).length > 0 ? Math.round(sumValues(state.healingDone)) : 0;
    state.talents = {};
    state.hps = (state.totalHealing / sequenceLength);
    state.dps = (state.totalDamage / sequenceLength);
    state.hpm = (state.totalHealing / state.manaSpent) || 0;
    state.activeBuffs = []
    state.report = [];

    const endTime = performance.now();
    //console.log(`Call to doSomething took ${endTime - startTime} milliseconds`)
    return state;

}

// This is a boilerplate function that'll let us clone our spell database to avoid making permanent changes.
// We need this to ensure we're always running a clean DB, free from any changes made on previous runs.
const deepCopyFunction = (inObject) => {
    let outObject, value, key;
  
    if (typeof inObject !== "object" || inObject === null) {
      return inObject; // Return the value if inObject is not an object
    }
  
    // Create an array or object to hold the values
    outObject = Array.isArray(inObject) ? [] : {};
  
    for (key in inObject) {
      value = inObject[key];
  
      // Recursively (deep) copy for nested objects, including arrays
      outObject[key] = deepCopyFunction(value);
    }
  
    return outObject;
  };
