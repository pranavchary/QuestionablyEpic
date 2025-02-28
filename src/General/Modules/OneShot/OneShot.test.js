
import { enemySpellDB } from "./EnemySpellDB";
import { getKeyMult, getRawDamage, calcHealth, calcArmor } from "./OneShot";

describe("Key Level base multipliers", () => {
    test("Mythic +25", () => {
        expect(Math.round(100*getKeyMult(25))/100).toEqual(7.73)
    })
    test("Mythic +20", () => {
        expect(Math.round(100*getKeyMult(20))/100).toEqual(4.8)
    })
    test("Mythic +15", () => {
        expect(Math.round(100*getKeyMult(15))/100).toEqual(2.98)
    })
});

describe("Health Calculation", () => {
    test("In-game test case", () => {
        expect(calcHealth(16935)).toEqual(338700);
    })
    test("In-game test case with Absorb", () => {
        expect(calcHealth(9527, 1000)).toEqual(191540);
    });
});

describe("Armor Calculation", () => {
    test("In-game test case - Resto Druid - Overgrown Ancient M0", () => {
        expect(Math.round(calcArmor(2331)*1000)/1000).toEqual(Math.round(1000*(1-0.1538))/1000);
    })
})


// These must all be sourced from logs.
// Ideally we'd like a Tyrannical and Fort version of each ability at different key levels. This gives us excellent coverage.
describe("Ability Raw damage tests - Halls of Valor", () => {
    const tolerance = 5;

    test("Horn of Valor +20", () => {
        const spell = enemySpellDB['Halls of Valor'].filter(s => s.name === "Horn of Valor")[0];
        const expectedResult = 243343;
        
        expect(Math.abs(Math.round(getRawDamage(spell, 20)*1.15)-expectedResult)).toBeLessThan(tolerance); // Tyrannical

        const expectedFortResult = 400247;
        // Atrophic Poison
        expect(Math.abs(Math.round(getRawDamage(spell, 27)*0.97)-expectedFortResult)).toBeLessThan(tolerance); // Fortified
    })

    // Does Arcing Bolt have variance?
    // Look into this in more detail.
    test("Arcing Bolt +20", () => {
        const spell = enemySpellDB['Halls of Valor'].filter(s => s.name === "Arcing Bolt")[0];
        const expectedResult = 122085;
        
        expect(Math.abs(Math.round(getRawDamage(spell, 20)*1.15)-expectedResult)).toBeLessThan(500); // Tyrannical

        /*
        const expectedFortResult = 198180;

        // Atrophic Poison
        expect(Math.abs(Math.round(getRawDamage(spell, 27)*0.97)-expectedFortResult)).toBeLessThan(tolerance); // Fortified
        */
    })

    test("Claw Frenzy +20 Tyrannical", () => {
        const spell = enemySpellDB['Halls of Valor'].filter(s => s.name === "Claw Frenzy (Correctly Split)")[0];
        const expectedResult = 206844;
        
        expect(Math.abs(Math.round(getRawDamage(spell, 20)*1.15)-expectedResult)).toBeLessThan(tolerance)

        const expectedFortResult = 340213;

        // Atrophic Poison
        expect(Math.abs(Math.round(getRawDamage(spell, 27)*0.97)-expectedFortResult)).toBeLessThan(tolerance); // Fortified
    })
})

describe("Ability Raw damage tests - Algeth'ar Academy", () => {
    const tolerance = 5;

    test("Defeaning Screech (3)", () => {
        const spell = enemySpellDB["Algeth'ar Academy"].filter(s => s.name === "Defeaning Screech (3)")[0];
        const expectedResult = 228082 * (1+0.5 * 2); // Note that logs doesn't increase the unmitigated damage for each stack.
        
        // Atrophic Poison
        expect(Math.abs(Math.round(getRawDamage(spell, 25)*1.15*0.97)-expectedResult)).toBeLessThan(tolerance); // Tyrannical

        /*
        const expectedFortResult = 400247;
        // Atrophic Poison
        expect(Math.abs(Math.round(getRawDamage(spell, 27)*0.97)-expectedFortResult)).toBeLessThan(tolerance); // Fortified */
    })

});