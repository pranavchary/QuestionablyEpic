interface Raid {
  ID: number;
  raidID: number;
  name: {
    en: string;
    fr: string;
    de: string;
    ru: string;
    ch: string;
    [key: string]: string;  // This is the index signature
  };
  expansion: number;
  icon: string;
}

export const raidDB: Raid[] = [
  {
    ID: 2522,
    raidID: 1200,
    name: {
      en: "Vault of the Incarnates",
      fr: "Caveau des Incarnations",
      de: "Gewölbe der Inkarnationen",
      ru: "Хранилище Воплощений",
      ch: "化身巨龙牢窟",
    },
    expansion: 9,
    icon: require("Images/achievement_raidprimalist_raid.jpg").default,
  },
  {
    ID: 2569,
    raidID: 1208,
    name: {
      en: "Aberrus, the Shadowed Crucible",
      fr: "",
      de: "",
      ru: "",
      ch: "",
    },
    expansion: 9,
    icon: require("Images/achievement_raidprimalist_raid.jpg").default,
  },
];

interface Boss {
  DungeonEncounterID: number;
  ID: number;
  name: {
    en: string;
    fr: string;
    de: string;
    ru: string;
    ch: string;
  };
  zoneID: number;
  icon: string;
}

export const bossList: Boss[] = [
  /* ---------------------------------------------------------------------------------------------- */
  /*                                     Vault of the Incarnates                                    */
  /* ---------------------------------------------------------------------------------------------- */

  {
    DungeonEncounterID: 2587,
    ID: 2480,
    name: {
      en: "Eranog",
      fr: "Éranog",
      de: "Eranog",
      ru: "Эраног",
      ch: "艾拉诺格",
    },
    zoneID: 2522,
    icon: require("Images/Bosses/VaultOfTheIncarnates/achievement_raidprimalist_eranog.jpg").default,
  },

  {
    DungeonEncounterID: 2639,
    ID: 2500,
    name: {
      en: "Terros",
      fr: "Terros",
      de: "Terros",
      ru: "Террос",
      ch: "泰洛斯",
    },
    zoneID: 2522,
    icon: require("Images/Bosses/VaultOfTheIncarnates/achievement_raidprimalist_terros.jpg").default,
  },

  {
    DungeonEncounterID: 2590,
    ID: 2486,
    name: {
      en: "The Primalist Council",
      fr: "Le Conseil primaliste",
      de: "Der Primalistenrat",
      ru: "Совет воинов стихий",
      ch: "拜荒者议会",
    },
    zoneID: 2522,
    icon: require("Images/Bosses/VaultOfTheIncarnates/achievement_raidprimalist_council.jpg").default,
  },

  {
    DungeonEncounterID: 2592,
    ID: 2482,
    name: {
      en: "Sennarth, The Cold Breath",
      fr: "Sennarth, la Glaciale",
      de: "Sennarth, der kalte Atem",
      ru: "Сеннарт Дыхание Льда",
      ch: "瑟娜尔丝，冰冷之息",
    },
    zoneID: 2522,
    icon: require("Images/Bosses/VaultOfTheIncarnates/achievement_raidprimalist_sennarth.jpg").default,
  },

  {
    DungeonEncounterID: 2635,
    ID: 2502,
    name: {
      en: "Dathea, Ascended",
      fr: "Dathéa, transcendée",
      de: "Dathea, die Aufgestiegene",
      ru: "Дафия Перерожденная",
      ch: "晋升者达瑟雅",
    },
    zoneID: 2522,
    icon: require("Images/Bosses/VaultOfTheIncarnates/achievement_raidprimalist_windelemental.jpg").default,
  },

  {
    DungeonEncounterID: 2605,
    ID: 2491,
    name: {
      en: "Kurog Grimtotem",
      fr: "Kurog Totem-Sinistre",
      de: "Kurog Grimmtotem",
      ru: "Курог Зловещий Тотем",
      ch: "库洛格·恐怖图腾",
    },
    zoneID: 2522,
    icon: require("Images/Bosses/VaultOfTheIncarnates/achievement_raidprimalist_kurog.jpg").default,
  },

  {
    DungeonEncounterID: 2614,
    ID: 2493,
    name: {
      en: "Broodkeeper Diurna",
      fr: "Garde-couvée Diurna",
      de: "Bruthüterin Diurna",
      ru: "Хранительница стаи Денна",
      ch: "巢穴守护者迪乌尔娜",
    },
    zoneID: 2522,
    icon: require("Images/Bosses/VaultOfTheIncarnates/achievement_raidprimalist_diurna.jpg").default,
  },

  {
    DungeonEncounterID: 2607,
    ID: 2499,
    name: {
      en: "Raszageth the Storm-Eater",
      fr: "Raszageth la Mange-tempêtes",
      de: "Raszageth die Sturmfresserin",
      ru: "Рашагет Пожирательница Бурь",
      ch: "莱萨杰丝，噬雷之龙",
    },
    zoneID: 2522,
    icon: require("Images/Bosses/VaultOfTheIncarnates/achievement_raidprimalist_raszageth.jpg").default,
  },

  /* ---------------------------------------------------------------------------------------------- */
  /*                                 Aberrus, the Shadowed Crucible                                 */
  /* ---------------------------------------------------------------------------------------------- */
  {
    DungeonEncounterID: 2688,
    ID: 2522,
    name: {
      en: "Kazzara, the Hellforged",
      ch: "狱铸者卡扎拉",
      de: "Kazzara, die Höllengeschmiedete",
      fr: "Kazzara, née des enfers",
      ru: "Каззара из Преисподней",
    },
    zoneID: 2569,
    icon: require("Images/Bosses/Aberrus/inv_achievement_raiddragon_kazzara.jpg").default,
  },
  {
    DungeonEncounterID: 2687,
    ID: 2529,
    name: {
      en: "The Amalgamation Chamber",
      ch: "融合体密室",
      de: "Die Verschmelzungskammer",
      fr: "Chambre de fusion",
      ru: "Чертог слияния",
    },
    zoneID: 2569,
    icon: require("Images/Bosses/Aberrus/inv_achievement_raiddragon_amalgamationchamber.jpg").default,
  },
  {
    DungeonEncounterID: 2693,
    ID: 2530,
    name: {
      en: "The Forgotten Experiments",
      ch: "被遗忘的实验体",
      de: "Die vergessenen Experimente",
      fr: "Les expériences oubliées",
      ru: "Забытые эксперименты",
    },
    zoneID: 2569,
    icon: require("Images/Bosses/Aberrus/inv_achievement_raiddragon_forgottenexperiments.jpg").default,
  },
  {
    DungeonEncounterID: 2682,
    ID: 2524,
    name: {
      en: "Assault of the Zaqali",
      ch: "扎卡利突袭",
      de: "Angriff der Zaqali",
      fr: "Assaut des Zaqalis",
      ru: "Нападение закали",
    },
    zoneID: 2569,
    icon: require("Images/Bosses/Aberrus/inv_achievement_raiddragon_zaqaliassault.jpg").default,
  },
  {
    DungeonEncounterID: 2680,
    ID: 2525,
    name: {
      en: "Rashok, the Elder",
      ch: "莱修克，长老",
      de: "Ältester Rashok",
      fr: "Rashok, l’Ancien",
      ru: "Рашок Древний",
    },
    zoneID: 2569,
    icon: require("Images/Bosses/Aberrus/inv_achievement_raiddragon_rashok.jpg").default,
  },
  {
    DungeonEncounterID: 2689,
    ID: 2532,
    name: {
      en: "The Vigilant Steward, Zskarn",
      ch: "警戒管事兹斯卡恩",
      de: "Der aufmerksame Verwalter, Zskarn",
      fr: "Zskarn, l’Intendant vigilant",
      ru: "Бдительный распорядитель Шкарн",
    },
    zoneID: 2569,
    icon: require("Images/Bosses/Aberrus/inv_achievement_raiddragon_zskarn.jpg").default,
  },
  {
    DungeonEncounterID: 2683,
    ID: 2527,
    name: {
      en: "Magmorax",
      ch: "玛格莫莱克斯",
      de: "Magmorax",
      fr: "Magmorax",
      ru: "Магморакс",
    },
    zoneID: 2569,
    icon: require("Images/Bosses/Aberrus/inv_achievement_raiddragon_magmorax.jpg").default,
  },
  {
    DungeonEncounterID: 2684,
    ID: 2523,
    name: {
      en: "Echo of Neltharion",
      ch: "奈萨里奥的回响",
      de: "Echo von Neltharion",
      fr: "Écho de Neltharion",
      ru: "Эхо Нелтариона",
    },
    zoneID: 2569,
    icon: require("Images/Bosses/Aberrus/inv_achievement_raiddragon_neltharion.jpg").default,
  },
  {
    DungeonEncounterID: 2685,
    ID: 2520,
    name: {
      en: "Scalecommander Sarkareth",
      ch: "鳞长萨卡雷斯",
      de: "Schuppenkommandant Sarkareth",
      fr: "Squammandant Sarkareth",
      ru: "Дракомандир Саркарет",
    },
    zoneID: 2569,
    icon: require("Images/Bosses/Aberrus/inv_achievement_raiddragon_sarkareth.jpg").default,
  },
  /*
  {
    DungeonEncounterID: 2696,
    ID: 2531,
    name: {
      en: "The Zaqali Elders",
      ch: "扎卡利长老",
      de: "Die Ältesten der Zaqali",
      fr: "Les Anciens zaqalis",
      ru: "Старейшины закали",
    },
    zoneID: 2569,
    icon: require("Images/Bosses/VaultOfTheIncarnates/achievement_raidprimalist_raszageth.jpg").default,
  }, */

];

export const getBossName = (encounterID: number, lang: keyof Boss['name']): string | null => {
  const boss = bossList.find((boss) => boss.DungeonEncounterID === encounterID);
  if (boss) {
    return boss.name[lang];
  }
  return null;
};

export const getTranslatedRaidName = (raid: number, lang: string) => {
  const raidName = raidDB.filter((obj: any) => {
    return obj.raidID === raid;
  })[0]["name"][lang];
  return raidName;
};
