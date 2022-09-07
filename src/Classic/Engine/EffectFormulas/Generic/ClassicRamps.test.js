import { getSpellRaw, runCastSequence } from "./ClassicDruidRamps";



// These are basic tests to make sure our coefficients and secondary scaling arrays are all working as expected.

/*
describe("Test Base Spells", () => {
    const errorMargin = 1.1; // There's often some blizzard rounding hijinx in spells. If our formulas are within 1 (a fraction of a percent) then we are likely calculating it correctly.
    const activeStats = {
            intellect: 1974,
            haste: 869,
            crit: 1000,
            mastery: 451,
            versatility: 528,
            stamina: 1900,
    }
    const critMult = 1.05 + activeStats.crit / 35 / 100; 
    test("Smite", () => {
        const spell = DISCSPELLS['Smite'][0];

        const damage = getSpellRaw(spell, activeStats);

        //expect(Math.round(damage)).toEqual(Math.round(1110*critMult));
    });
    test("Mind Blast", () => {
        const spell = DISCSPELLS['Mind Blast'][0];
        expect(Math.abs(getSpellRaw(spell, activeStats) - 1666*critMult)).toBeLessThan(3);
    });
    test("Solace", () => {
        const spell = DISCSPELLS['Power Word: Solace'][0];

        const damage = getSpellRaw(spell, activeStats);

        expect(Math.abs(damage - 1680*critMult)).toBeLessThan(errorMargin);
    });
    test("Schism", () => {
        const spell = DISCSPELLS['Schism'][0];

        const damage = getSpellRaw(spell, activeStats);

        expect(Math.abs(damage - 3150*critMult)).toBeLessThan(errorMargin);
    });
    test("Power Word: Radiance", () => {
        const spell = DISCSPELLS['Power Word: Radiance'][0];

        const healing = getSpellRaw(spell, activeStats);

        expect(Math.abs(healing - 2347*critMult)).toBeLessThan(errorMargin);
    });
    test("Power Word: Shield", () => {
        const spell = DISCSPELLS['Power Word: Shield'][0];

        const healing = getSpellRaw(spell, activeStats);

        expect(Math.abs(healing - 3687*critMult)).toBeLessThan(errorMargin);
    });

    // TODO: test more spells.
});
*/
describe("Evang Cast Sequence", () => {
    //const player = new Player("Mock", "Discipline Priest", 99, "NA", "Stonemaul", "Night Elf");
    /*player.activeStats = {
            intellect: 1974,
            haste: 869,
            crit: 445,
            mastery: 451,
            versatility: 528,
            stamina: 1900,
    } */
    

    const settings = {reporting: true}

    const print = (name, base, healing) => {
        let percInc = Math.round(10000*(healing / base - 1))/100;
        console.log(name + ": " + healing + " (+" + percInc + "%)")
    }

    

    //const talents = {...baseTalents, bountifulBloom: true, renewingBreath: 3, timelessMagic: 3, lifeforceMender: 3, callOfYsera: true, sacralEmpowerment: true,
    //                    temporalCompression: true, lushGrowth: 2, attunedToTheDream: 2, lifeGiversFlame: false, cycleOfLife: true, fieldOfDreams: true}
    const talents = {moonglow: 3, empoweredRejuvenation: 5, improvedRejuvenation: 3, giftOfNature: 5, improvedTree: 3, livingSpirit: 3, genesis: 5,
                    giftOfTheEarthmother: true, celestialFocus: true, treeOfLife: 1, giftOfTheWild: 2};
    /*
    test("Spell HPM", () => {
        const spellList = Object.keys(EVOKERSPELLDB);
        const spellHPMs = []

        spellList.forEach(spellName => {
            const seq = [spellName];
            const spellData = {name: spellName}
            const rawSpell = EVOKERSPELLDB[spellName];

            const baseline = runCastSequence(seq, activeStats, settings, talents)

            spellData.healing = Math.round(baseline.totalHealing) || 0;
            spellData.hpm = Math.round(100*baseline.hpm)/100 || 0;

            if (rawSpell[0].empowered) spellData.name = spellData.name + " (4x EMPOWERED)";
            if (rawSpell[0].essence) spellData.essenceCost = rawSpell[0].essence;
            

            spellHPMs.push(spellData);
        })

        console.log(spellHPMs);

    });
    */

    test("Test Stuff", () => {

        //const baseline = allRamps(evangSeq, fiendSeq, activeStats, {"playstyle": "Venthyr Evangelism", "Power of the Dark Side": true, true);


        const activeStats = {
            intellect: 1000,
            haste: 400,
            crit: 600,
            spirit: 850 / 1.15,
            stamina: 2800,
            spellpower: 2000,
            mp5: 200,
    
            critMult: 1,
    }

        //console.log(seq);
        const iter = 1;
        const results = {healingDone: 0, manaSpent: 0};

        const seq = ["Wild Growth"] 

        const baseline = runCastSequence(seq, {...activeStats}, settings, talents)

       

        const spellpower = runCastSequence(seq, {...activeStats, spellpower: activeStats.spellpower + 10}, settings, talents)
        const hasteS = runCastSequence(seq, {...activeStats, haste: activeStats.haste + 100}, settings, talents)
        const mp5 = runCastSequence(seq, {...activeStats, mp5: activeStats.mp5 + 100}, settings, talents)

        console.log(baseline);

        const metric = 'hps'
        console.log(`Healing Done over ${iter} iterations: ` + baseline.totalHealing / iter + " at cost: " + baseline.manaSpent / iter);
        console.log(`Spell Power: ` + (spellpower[metric] - baseline[metric])/10);
        console.log(`Haste: ` + (hasteS[metric] - baseline[metric])/100);
        console.log(`MP5: ` + (mp5[metric] - baseline[metric])/100);
        
        //console.log(baseline.healingDone['Rejuvenation(hot)'] / baseline.manaSpent['Rejuvenation'])
        

        /*
        print("Indemnity", baseline, allRampsHealing(seq, activeStats, settings, {...talents, indemnity: true}))
        print("Rapture", baseline, allRampsHealing(seq3, activeStats, settings, {...talents, rapture: true}))
        print("Exaltation & Rapture", baseline, allRampsHealing(seq3, activeStats, settings, {...talents, rapture: true, exaltation: true}))
        print("Shining Radiance", baseline, allRampsHealing(seq, activeStats, settings, {...talents, shiningRadiance: 2}))
        print("Rabid Shadows", baseline, allRampsHealing(seq, activeStats, settings, {...talents, rabidShadows: 2}))
        print("Dark Indul", baseline, allRampsHealing(seq, activeStats, settings, {...talents, darkIndulgence: 2}))
        print("Swift Penitence", baseline, allRampsHealing(seq, activeStats, settings, {...talents, swiftPenitence: 2}))
        print("Castigation", baseline, allRampsHealing(seq, activeStats, settings, {...talents, castigation: true}))
        print("Purge the Wicked", baseline, allRampsHealing(seq2, activeStats, settings, {...talents, purgeTheWicked: true}))
        print("Purge & Revel", baseline, allRampsHealing(seq2, activeStats, settings, {...talents, purgeTheWicked: true, revelInPurity: 2}))
        
        
        print("Malicious Scission", baseline, allRampsHealing(seq, activeStats, settings, {...talents, maliciousScission: true}))
        
        print("Stolen Psyche", baseline, allRampsHealing(seq, activeStats, settings, {...talents, stolenPsyche: 2}))
        print("Lesson in Humility", baseline, allRampsHealing(seq, activeStats, settings, {...talents, lessonInHumility: 2}))

        print("PtW / Revel / Lesson in Humi / Evenfall / LW / Indem", baseline, allRampsHealing(seq2, activeStats, settings, {...imprTalents, 
                revelInPurity: 2, purgeTheWicked: true, lessonInHumility: 2, evenfall: 2, indemnity: true}))
        print("PtW / Swift Pen / Lesson in Humi / Evenfall / LW / Indem", baseline, allRampsHealing(seq2, activeStats, settings, {...imprTalents, 
                swiftPenitence: 2, purgeTheWicked: true, lessonInHumility: 2, evenfall: 2, indemnity: true}))                                                            
        */
        //console.log(allRamps(seq, activeStats, settings, {...talents, stolenPsyche: 2}, true))
        //runCastSequence(seq, activeStats, settings, conduits);

        //console.log("Total Healing: " + baseline.totalHealing);
        //console.log(`Call to doSomething took ${endTime - startTime} milliseconds`)
        //console.log("Baseline: " + JSON.stringify(baseline));

        //const clarityOfMind = allRamps(boonSeq, fiendSeq, activeStats, {"Clarity of Mind": true, "Pelagos": false, "Power of the Dark Side": true}, {});
        //const pelagos = allRamps(boonSeq, fiendSeq, activeStats, {"Clarity of Mind": false, "Pelagos": true, "Power of the Dark Side": true}, {});
        //const rabidShadows = allRamps(boonSeq, fiendSeq, activeStats, {"Clarity of Mind": false, "Pelagos": false, "Power of the Dark Side": true}, {"Rabid Shadows": 226});
        //const fourPiece = allRamps(boon4pc, fiendSeq, activeStats, {"4T28": true, "Clarity of Mind": true, "Pelagos": false, "Power of the Dark Side": true}, {});

        // These are extremely simple checks to make sure our legendaries and soulbinds are having some net impact on our result.
        // They're not specific on their value, but will fail if any portion of the ramp isn't working correctly.



    });
});

