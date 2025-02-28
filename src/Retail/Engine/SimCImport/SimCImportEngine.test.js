
import Player from "General/Modules/Player/Player";
import { processItem, processCurve, processAllLines, runSimC} from "Retail/Engine/SimCImport/SimCImportEngine"

const testDruidSet = 
`
# Voulk - Restoration - 2021-11-02 15:51 - US/Stonemaul
# SimC Addon 9.1.0-01
# Requires SimulationCraft 910-01 or newer

druid="Voulk"
level=60
race=night_elf
region=us
server=stonemaul
role=attack
professions=alchemy=175/herbalism=175
talents=3323123
spec=restoration

covenant=night_fae
soulbind=niya:1,322721/273:5:0/342270/257:7:0/320687/271:7:0/260:7:0/320662
# soulbind=dreamweaver:2,
# conduits_available=261:5/262:7/263:7/264:7/265:5/266:7/267:7/268:5/269:5/270:7/273:5/274:5/275:7/276:7/279:4/257:7/258:5/259:4/260:7/254:4/255:4/256:1/271:7/272:7
renown=40

head=,id=185797,bonus_id=7732/7359/43/7575/1550/6646
neck=,id=187552,bonus_id=6652/7574
shoulder=,id=178763,bonus_id=7608/7359/6652/1566/6646
back=,id=178755,enchant_id=6204,bonus_id=7384/7359/6652/1524/6646
chest=,id=185786,enchant_id=6230,bonus_id=7732/7359/41/1550/6646
wrist=,id=178702,enchant_id=6220,bonus_id=7622/7359/6652/7575/1566/6646
hands=,id=172316,bonus_id=7098/6649/6648/6718/1522
waist=,id=178699,bonus_id=7370/7359/40/7193/1524/6646
legs=,id=178819,bonus_id=7348/7359/6652/1521/6646
feet=,id=178731,bonus_id=7603/7359/6652/1550/6646
finger1=,id=173133,enchant_id=6166,gem_id=173128,bonus_id=7461,drop_level=60,crafted_stats=40
finger2=,id=178933,enchant_id=6166,bonus_id=7622/7359/41/7575/1566/6646
trinket1=,id=178809,bonus_id=7375/7359/6652/1540/6646
trinket2=,id=178708,bonus_id=7369/7359/6652/6917/1521/6646
main_hand=,id=178829,enchant_id=6229,bonus_id=7412/7359/6652/1524/6646
`

const testShamanSet = 
`
# Voulksham - Restoration - 2021-11-03 07:40 - US/Stonemaul
# SimC Addon 9.1.0-01
# Requires SimulationCraft 910-01 or newer

shaman="Voulksham"
level=60
race=draenei
region=us
server=stonemaul
role=attack
professions=enchanting=9/skinning=29
talents=2112133
spec=restoration

covenant=necrolord
soulbind=plague_deviser_marileth:4,323074/147:1:0/323091
# conduits_available=112:4/147:1/95:1/93:1
renown=5

head=,id=178692,bonus_id=6807/6652/7193/1498/6646
neck=,id=173146,gem_id=153709,crafted_stats=49
shoulder=,id=178695,bonus_id=6807/6652/1498/6646
back=,id=180123,enchant_id=6204,bonus_id=6807/6652/1498/6646
chest=,id=180100,bonus_id=6807/6652/1498/6646
wrist=,id=178767,bonus_id=6807/42/7193/1498/6646
hands=,id=179325,bonus_id=6807/6652/1498/6646
waist=,id=180110,bonus_id=6807/6652/7194/1498/6646
legs=,id=178839,bonus_id=6807/6652/1498/6646
feet=,id=178745,bonus_id=6807/6652/1498/6646
finger1=,id=178872,bonus_id=6807/6652/7193/1498/6646
finger2=,id=178736,enchant_id=6166,bonus_id=6807/6652/7194/1498/6646
trinket1=,id=178809,bonus_id=6806/6652/1485/4785
trinket2=,id=178298,bonus_id=6784/1485/6616
main_hand=,id=178714,enchant_id=6229,bonus_id=6807/6652/1498/6646
`

const settings = {
    includeGroupBenefits: { value: true, options: [true, false], category: "trinkets", type: "selector" },
    incarnateAllies: { value: "DPS", options: ["Solo", "DPS", "Tank", "Tank + DPS"], category: "trinkets", type: "selector" },
    idolGems: { value: 2, options: [1, 2, 3, 4, 5, 6, 7, 8], category: "trinkets", type: "input" },
    rubyWhelpShell: { value: "Untrained", options: ["Untrained", "AoE Heal", "ST Heal", "Crit Buff", "Haste Buff"], category: "trinkets", type: "selector" }, // "ST Damage", "AoE Damage",
    alchStonePotions: { value: 1, options: [0, 1, 2], category: "trinkets", type: "selector" },
    enchantItems: { value: true, options: [true, false], category: "topGear", type: "selector" },
    catalystLimit: { value: 1, options: [1, 2, 3], category: "topGear", type: "selector" },
    upgradeFinderMetric: { value: "Show % Upgrade", options: ["Show % Upgrade", "Show HPS"], category: "upgradeFinder", type: "selector" },
    primordialGems: {
      value: "Automatic",
      options: ["Automatic", "Wild Spirit, Exuding Steam, Deluging Water", "Wild Spirit, Exuding Steam, Desirous Blood", "Flame Licked, Wild Spirit, Exuding Steam"],
      category: "topGear",
      type: "selector",
    },
    topGearAutoGem: { value: false, options: [true, false], category: "topGear", type: "selector" },
    healingDartsOverheal: { value: 55, options: [], category: "embellishments", type: "Entry" },
    lariatGems: { value: 3, options: [], category: "embellishments", type: "Entry" },
  } 

describe("Test Curve IDs", () => {
    test("Evoker Starting Items", () => {
        expect(processCurve(30725, 59)).toEqual(229)
        expect(processCurve(30725, 60)).toEqual(239)
        expect(processCurve(30726, 59)).toEqual(242) 
    })

    test("Random Levelling Items", () => {
        expect(processCurve(16667, 51)).toEqual(139)
        expect(processCurve(16666, 59)).toEqual(183)
        
    });

    test("Timewalking Item", () => {
        expect(processCurve(56365, 70)).toEqual(359)
        
    });
    
    
})

describe("Test Regular Items", () => {
    const player = new Player("Voulk", "Restoration Druid", 99, "NA", "Stonemaul", "Night Elf");
    const contentType = "Raid";
    const type = "Regular";

    test("Stitchflesh's Misplaced Signet w/ Socket", () => {
        const line = "finger1=,id=178736,bonus_id=7389/7359/6652/6935/1540/6646";
        const item = processItem(line, player, contentType, type, settings)
        //expect(item.stats.versatility).toEqual(77);
        expect(item.socket).toEqual(1)
    });


});

describe("Test Upgrade Track", () => {
    const player = new Player("Voulk", "Restoration Druid", 99, "NA", "Stonemaul", "Night Elf");
    const contentType = "Raid";
    const type = "Regular";

    test("Claws of Obsidian Secrets 5/8 Champion", () => {
        const line = "hands=,id=202489,bonus_id=6652/9230/7979/9325/1479/8767";
        const item = processItem(line, player, contentType, type, settings)

        expect(item.upgradeTrack).toEqual("Champion");
        expect(item.upgradeRank).toEqual(5);
        expect(item.level).toEqual(428);
    });

    test("Raoul's Barrelhook Bracers 1/5 Hero", () => {
        const line = "hands=,id=202489,bonus_id=6652/9230/7979/9325/1479/87wrist=,id=159356,enchant_id=6580,bonus_id=9331/6652/9415/9223/9220/9144/3301/8767";
        const item = processItem(line, player, contentType, type, settings)

        expect(item.upgradeTrack).toEqual("Hero");
        expect(item.upgradeRank).toEqual(2);
        expect(item.level).toEqual(431);
    });

    test("Bestowed Cape 3/8 Explorer", () => {
        const line = "# back=,id=204617,bonus_id=9296/1472/8766";
        const item = processItem(line, player, contentType, type, settings)

        expect(item.upgradeTrack).toEqual("Explorer");
        expect(item.upgradeRank).toEqual(3);
        expect(item.level).toEqual(382);
    });
});

describe("Test Crafted Items", () => {
    const player = new Player("Voulk", "Restoration Druid", 99, "NA", "Stonemaul", "Night Elf");
    const contentType = "Raid";
    const type = "Regular";


    test("Quick Oxxein Ring - No Missive IDs", () => {
        const line = "finger1=,id=173133,bonus_id=7461,drop_level=60,crafted_stats=49";
        const item = processItem(line, player, contentType, type, settings)
        expect(item.level).toEqual(230);
        //expect(item.stats.mastery).toEqual(63);
        expect(item.socket).toEqual(1);
        //expect(item.uniqueEquip).toEqual("crafted");
    });

    test("Elemental Lariat", () => {
        const line = "neck=,id=193001,gem_id=192980/192921/192920,bonus_id=8836/8840/8902/8960/8783/8782/8801/8791,crafted_stats=49/32";
        const item = processItem(line, player, contentType, type, settings)
        expect(item.level).toEqual(389);
        expect(item.stats.crit).toEqual(468);
        expect(item.stats.mastery).toEqual(468);
        expect(item.effect).toEqual({type: "embellishment", name: "Elemental Lariat"});
        expect(item.socket).toEqual(3);
    });

    test("Elemental Lariat with wrong crafted_stats", () => {
        const line = "neck=,id=193001,gem_id=192987,bonus_id=8836/8840/8902/8960/8783/8782/8802/8791/8845,crafted_stats=40/32";
        const item = processItem(line, player, contentType, type, settings)
        expect(item.level).toEqual(405);
        expect(item.stats.crit).toEqual(536);
        expect(item.stats.mastery).toEqual(536);
        expect(item.effect).toEqual({type: "embellishment", name: "Elemental Lariat"});
        expect(item.socket).toEqual(3);
        expect(item.uniqueEquip).toEqual("embellishment");
    });

    test("Obsidian Seared Hexblade", () => {
        const line = "main_hand=,id=190511,enchant_id=6628,bonus_id=8836/8840/8902/8801/8845/8791/8175/8960,crafted_stats=40/36";
        const item = processItem(line, player, contentType, type, settings)
        expect(item.level).toEqual(402);
        expect(item.stats.crit).toEqual(176);
        expect(item.effect).toEqual({type: "embellishment", name: "Potion Absorption Inhibitor", level: 402});
        expect(item.socket).toEqual(0);
        expect(item.uniqueEquip).toEqual("embellishment");
    });

    test("Ring with Embellishment", () => {
        const line = "finger1=,id=192999,enchant_id=6556,gem_id=192948,bonus_id=8836/8840/8902/8780/8802/8793/8846/8960/8175,crafted_stats=36/49";
        const item = processItem(line, player, contentType, type, settings)
        expect(item.effect).toEqual({type: "embellishment", name: "Potion Absorption Inhibitor", level: 418});
        expect(item.socket).toEqual(1);
        expect(item.uniqueEquip).toEqual("embellishment");
    });

    test("Warlords of Draenor Timewalking - Blackwater Belt", () => {
        const line = "waist=,id=109842,bonus_id=6652/8812/8171/7756,drop_level=70";
        const item = processItem(line, player, contentType, type, settings)
        expect(item.level).toEqual(359);
        expect(item.stats.intellect).toEqual(210);
    });

    test("Engineering Wrists with Crit (override used)", () => {
        const line = "wrist=,id=198332,enchant_id=6580,gem_id=201408,bonus_id=8836/8840/8902/7936/8802/8846/8949/8864,crafted_stats=49";
        const item = processItem(line, player, contentType, type, settings)
        expect(item.level).toEqual(418);
        expect(item.stats.crit).toEqual(429);

    });

    // 10.1 Crafted Items
    test("Elemental Lariat 10.1 - 395 item level", () => {
        const line = "neck=,id=193001,gem_id=192948/192948/192948,bonus_id=8836/8840/8902/8960/8784/8782/9405/8793/9365,crafted_stats=40/49,crafting_quality=5";
        const item = processItem(line, player, contentType, type, settings)
        expect(item.level).toEqual(395);
        expect(item.stats.haste).toEqual(494);
        expect(item.stats.mastery).toEqual(494);
        expect(item.effect).toEqual({type: "embellishment", name: "Elemental Lariat"});
        expect(item.socket).toEqual(3);
        expect(item.uniqueEquip).toEqual("embellishment");
    });

    test("Elemental Lariat 10.1 - 421 item level", () => {
        const line = "neck=,id=193001,gem_id=192987/192922/192958,bonus_id=8836/8840/8902/8960/8783/8782/9405/8791/8846/9365,crafted_stats=40/32,crafting_quality=5";
        const item = processItem(line, player, contentType, type, settings)

        expect(item.level).toEqual(421);
        expect(item.stats.crit).toEqual(605);
        expect(item.stats.mastery).toEqual(605);
        expect(item.effect).toEqual({type: "embellishment", name: "Elemental Lariat"});
        expect(item.socket).toEqual(3);
        expect(item.uniqueEquip).toEqual("embellishment");
    });

    // Regular blue item. 
    test("Pioneer's Practiced Belt - 336 item level", () => { 
        const line = "waist=,id=201945,bonus_id=8851/8852/9403/9415,crafted_stats=32/49,crafting_quality=3"
        const item = processItem(line, player, contentType, type, settings)
    
        expect(item.level).toEqual(336);
        expect(item.stats.crit).toEqual(150);
    });


    
});


/*
describe("updatePlayerStats function", () => {
    test("Sample Druid Loadout", () => {
        const player = new Player("Voulk", "Restoration Druid", 99, "NA", "Stonemaul", "Night Elf");
        var lines = testDruidSet.split("\n");
        const ingameStats = {
            intellect: 1575,
            haste: 790,
            crit: 385,
            mastery: 340,
            stamina: 2100,
            versatility: 330,
            leech: 109, // 107
            hps: 0,
            dps: 0,
            mana: 0,
        }

        processAllLines(player, "Raid", "night_fae", lines, -1, -1)
        expect(player.activeStats).toEqual(ingameStats)
    });

    test("Sample Shaman Loadout", () => {
        const player = new Player("VoulkSham", "Restoration Shaman", 99, "NA", "Stonemaul", "Night Elf");
        var lines = testShamanSet.split("\n");
        const ingameStats = {
            intellect: 1212,
            haste: 494,
            crit: 231,
            mastery: 335,
            stamina: 2100,
            versatility: 313,
            leech: 0,
            hps: 0,
            dps: 0,
            mana: 0,
        }

        processAllLines(player, "Raid", "night_fae", lines, -1, -1)
        expect(player.activeStats).toEqual(ingameStats)
    });

})
*/
// Add tests for Domination items.