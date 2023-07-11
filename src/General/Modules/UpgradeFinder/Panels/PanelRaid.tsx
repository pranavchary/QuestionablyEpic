import React, { useState } from "react";
import {
  Root,
  Header,
  NaxxramasHeaderTab,
  MalygosHeaderTab,
  ArgentRaidHeaderTab,
  UlduarHeaderTab,
  VaultOfArchavonHeaderTab,
  ObsidianSanctumHeaderTab,
  OnyxiaLairHeaderTab,
  IcecrownCitadelHeaderTab,
  RaidHeaderOne
} from "./PanelStyles";
import { Typography, Grid, Divider, AppBar, Tabs, Tab } from "@mui/material";
import ItemUpgradeCard from "./ItemUpgradeCard";
import "./Panels.css";
import { encounterDB } from "../../../../Databases/InstanceDB";
import { getTranslatedRaidName } from "../../CooldownPlanner/Data/CooldownPlannerBossList";
import { useTranslation } from "react-i18next";
import { filterItemListBySource, filterItemListByDropLoc, getDifferentialByID } from "../../../Engine/ItemUtilities";
import { filterClassicItemListBySource } from "../../../Engine/ItemUtilitiesClassic";
import { useSelector } from "react-redux";
import bossHeaders from "General/Modules/CooldownPlanner/Functions/IconFunctions/BossHeaderIcons";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccordionDetails from "@mui/material/AccordionDetails";
import UFAccordion from "./ufComponents/ufAccordian";
import UFAccordionSummary from "./ufComponents/ufAccordianSummary";
import UFTabPanel from "./ufComponents/ufTabPanel";

interface RaidGearContainerProps {
  itemList: any;
  itemDifferentials: any;
  playerSettings: {
    raid: number[];
  };
}

const getDifficultyName = (difficulty: number) => {
  switch (difficulty) {
    case 0:
      return "LFR";
    case 1:
      return "LFR (Max)";
    case 2:
      return "Normal";
    case 3:
      return "Normal (Max)";
    case 4:
      return "Heroic";
    case 5:
      return "Heroic (Max)";
    case 6:
      return "Mythic";
    case 7:
      return "Mythic (Max)";
    default:
      return "";
  }
};

const RaidGearContainer: React.FC<RaidGearContainerProps> = (props) => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const itemList = props.itemList;
  const itemDifferentials = props.itemDifferentials;
  const gameType = useSelector((state: any) => state.gameType);

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  const [tabvalue, setTabValue] = useState(0);

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabValue(newValue);
  };

  /* ---------------------------------------------------------------------------------------------- */
  /*                                           Shadowlands                                          */
  /* ---------------------------------------------------------------------------------------------- */

  const contentGenerator = (): React.JSX.Element => {
    // Raid Panel
    const shadowlandsList = [1208];
    const difficulties = props.playerSettings.raid;
    difficulties.sort().reverse();
    const firstDifficulty = difficulties[0];
    const secondDifficulty = difficulties.length === 2 ? difficulties[1] : -1;

    return (
      <Grid item xs={12}>
        <Header>
          <Grid item container spacing={1}>
            <Grid item xs={12}>
              <AppBar
                position="static"
                style={{
                  backgroundColor: "#000",
                  borderRadius: "4px 4px 4px 4px",
                }}
                elevation={1}
              >
                <Tabs
                  value={tabvalue}
                  onChange={handleTabChange}
                  aria-label="simple tabs example"
                  variant="fullWidth"
                  style={{ borderRadius: 4, border: "1px solid rgba(255, 255, 255, 0.22)" }}
                  TabIndicatorProps={{ style: { backgroundColor: "#F2BF59" } }}
                >
                  <RaidHeaderOne label={getTranslatedRaidName(1208, currentLanguage)} {...a11yProps(0)} />
                  {/* <Tab className={classes.sanctumHeader} label={getTranslatedRaidName(1193)} {...a11yProps(1)} /> */}
                  {/* <Tab className={classes.sepulcherHeader} label={getTranslatedRaidName(1195)} {...a11yProps(2)} /> */}
                </Tabs>
              </AppBar>
            </Grid>
            <Grid item xs={12}>
              {shadowlandsList.map((raidID, index) => (
                <UFTabPanel key={"panel" + index} value={tabvalue} index={index}>
                  <div >
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        {encounterDB[raidID].bossOrder
                          //.filter((key) => key === raidID)
                          .map((key, i) => (
                            <UFAccordion key={encounterDB[raidID].bosses[key].name[currentLanguage] + "-accordian" + i} elevation={0} style={{ backgroundColor: "rgba(255, 255, 255, 0.12)" }}>
                              <UFAccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header" style={{ verticalAlign: "middle" }}>
                                <Typography
                                  variant="h6"
                                  color="primary"
                                  align="left"
                                  style={{
                                    // backgroundColor: "#35383e",
                                    borderRadius: "4px 4px 0px 0px",
                                    display: "flex",
                                  }}
                                >
                                  {bossHeaders(key, { height: 36, verticalAlign: "middle" }, "UpgradeFinder")}
                                  <Divider flexItem orientation="vertical" style={{ margin: "0px 5px 0px 0px" }} />
                                  {encounterDB[raidID].bosses[key].name[currentLanguage]} -{" "}
                                  {[...filterItemListByDropLoc(itemList, 1208, key, "Raid", firstDifficulty)]
                                    .map((item) => getDifferentialByID(itemDifferentials, item.id, item.level))
                                    .filter((item) => item !== 0).length +
                                    (secondDifficulty !== -1
                                      ? [...filterItemListByDropLoc(itemList, 1208, key, "Raid", secondDifficulty)]
                                        .map((item) => getDifferentialByID(itemDifferentials, item.id, item.level))
                                        .filter((item) => item !== 0).length
                                      : 0)}{" "}
                                  Upgrades
                                </Typography>
                              </UFAccordionSummary>
                              <AccordionDetails style={{ backgroundColor: "#191c23" }}>
                                <Grid item xs={12} sm container direction="row" spacing={1}>
                                  <Grid item xs={12} container spacing={1}>
                                    <Grid item xs={12}>
                                      <Typography
                                        variant="h6"
                                        color="primary"
                                        align="left"
                                        style={{
                                          backgroundColor: "#35383e",
                                          borderRadius: 4,
                                        }}
                                      >
                                        <div style={{ marginLeft: 8 }}>
                                          {getDifficultyName(firstDifficulty)} -{" "}
                                          {
                                            [...filterItemListByDropLoc(itemList, 1208, key, "Raid", firstDifficulty)]
                                              .map((item) => getDifferentialByID(itemDifferentials, item.id, item.level))
                                              .filter((item) => item !== 0).length
                                          }{" "}
                                          Upgrades
                                        </div>
                                      </Typography>
                                    </Grid>
                                    {[...filterItemListByDropLoc(itemList, 1208, key, "Raid", firstDifficulty)].map((item, index) => (
                                      <ItemUpgradeCard key={index} item={item} itemDifferential={getDifferentialByID(itemDifferentials, item.id, item.level)} slotPanel={false} />
                                    ))}
                                  </Grid>
                                  {secondDifficulty !== -1 ? (
                                    <Grid item xs={12} container spacing={1}>
                                      <Grid item xs={12}>
                                        <Typography
                                          variant="h6"
                                          color="primary"
                                          align="left"
                                          style={{
                                            backgroundColor: "#35383e",
                                            borderRadius: 4,
                                          }}
                                        >
                                          <div style={{ marginLeft: 8 }}>
                                            {getDifficultyName(secondDifficulty)} -{" "}
                                            {
                                              [...filterItemListByDropLoc(itemList, 1208, key, "Raid", secondDifficulty)]
                                                .map((item) => getDifferentialByID(itemDifferentials, item.id, item.level))
                                                .filter((item) => item !== 0).length
                                            }{" "}
                                            Upgrades
                                          </div>
                                        </Typography>
                                      </Grid>
                                      {[...filterItemListByDropLoc(itemList, 1208, key, "Raid", secondDifficulty)].map((item, index) => (
                                        <ItemUpgradeCard key={index} item={item} itemDifferential={getDifferentialByID(itemDifferentials, item.id, item.level)} slotPanel={false} />
                                      ))}
                                    </Grid>
                                  ) : (
                                    ""
                                  )}
                                </Grid>
                              </AccordionDetails>
                            </UFAccordion>
                          ))}
                      </Grid>
                    </Grid>
                  </div>
                </UFTabPanel>
              ))}
            </Grid>
          </Grid>
        </Header>
      </Grid>
    );
  };


  /* ---------------------------------------------------------------------------------------------- */
  /*                                         Burning Crusade                                        */
  /* ---------------------------------------------------------------------------------------------- */

  const contentGeneratorBC = (): React.JSX.Element => {
    // Raid Panel
    const burningCrusadeList = [
      754, // Naxxramas
      756, // The Eye of Eternity
      759, // Ulduar
      753, // Vault of Archavon
      755, // The Obsidian Sanctum
      760, // Onyxia's Lair
      757, // Trial of the Crusader
      758, // Icecrown Citadel
    ];

    return (
      <Grid item xs={12}>
        <Header>
          <Grid item container spacing={1}>
            <Grid item xs={12}>
              <AppBar
                position="static"
                style={{
                  backgroundColor: "#000",
                  borderRadius: "4px 4px 4px 4px",
                }}
                elevation={1}
              >
                <Tabs
                  value={tabvalue}
                  onChange={handleTabChange}
                  aria-label="simple tabs example"
                  variant="fullWidth"
                  style={{ borderRadius: 4, border: "1px solid rgba(255, 255, 255, 0.22)" }}
                  TabIndicatorProps={{ style: { backgroundColor: "#F2BF59" } }}
                >
                  {/* ------------------------------------------ Karazhan ------------------------------------------ */}
                  <NaxxramasHeaderTab label={encounterDB[754].name[currentLanguage]} {...a11yProps(0)} />
                  {/* ---------------------------------------- Gruul's Lair ---------------------------------------- */}
                  <MalygosHeaderTab label={encounterDB[756].name[currentLanguage]} {...a11yProps(1)} />
                  {/* ------------------------------------ Serpentshrine Cavern ------------------------------------ */}
                  <UlduarHeaderTab label={encounterDB[759].name[currentLanguage]} {...a11yProps(2)} />
                  {/* ---------------------------------------- Tempest Keep ---------------------------------------- */}
                  <VaultOfArchavonHeaderTab label={encounterDB[753].name[currentLanguage]} {...a11yProps(3)} />
                  {/* --------------------------------- The Battle for Mount Hyjal --------------------------------- */}
                  <ObsidianSanctumHeaderTab label={encounterDB[755].name[currentLanguage]} {...a11yProps(4)} />
                  {/* ---------------------------------------- Black Temple ---------------------------------------- */}
                  <OnyxiaLairHeaderTab label={encounterDB[760].name[currentLanguage]} {...a11yProps(5)} />
                  {/* ------------------------------------------ Zul'Aman ------------------------------------------ */}
                  <ArgentRaidHeaderTab label={encounterDB[757].name[currentLanguage]} {...a11yProps(6)} />
                  {/* --------------------------------------- Sunwell Plateau -------------------------------------- */}
                  <IcecrownCitadelHeaderTab label={encounterDB[758].name[currentLanguage]} {...a11yProps(7)} />
                </Tabs>
              </AppBar>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  {burningCrusadeList.map((raidID, index) => (
                    <UFTabPanel key={"panel" + index} value={tabvalue} index={index}>
                      <div>
                        <Grid container spacing={1}>
                          <Grid item xs={12}>
                            {encounterDB[raidID].bossOrder.map((key, i) => (
                              <UFAccordion key={encounterDB[raidID].bosses[key].name[currentLanguage] + "-accordian" + i} elevation={0} style={{ backgroundColor: "rgba(255, 255, 255, 0.12)" }}>
                                <UFAccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header" style={{ verticalAlign: "middle" }}>
                                  <Typography
                                    variant="h6"
                                    color="primary"
                                    align="left"
                                    style={{
                                      borderRadius: "4px 4px 0px 0px",
                                      display: "flex",
                                    }}
                                  >
                                    {bossHeaders(key, { height: 36, verticalAlign: "middle" })}
                                    <Divider flexItem orientation="vertical" style={{ margin: "0px 5px 0px 0px" }} />
                                    {encounterDB[raidID].bosses[key].name[currentLanguage]} -{" "}
                                    {
                                      [...filterClassicItemListBySource(itemList, raidID, Number(key))].map((item) => getDifferentialByID(itemDifferentials, item.id, item.level)).filter((item) => item !== 0)
                                        .length
                                    }{" "}
                                    Upgrades
                                  </Typography>
                                </UFAccordionSummary>
                                <AccordionDetails style={{ backgroundColor: "#191c23" }}>
                                  <Grid xs={12} container spacing={1}>
                                    {[...filterClassicItemListBySource(itemList, raidID, Number(key))].map((item, index) => (
                                      <ItemUpgradeCard key={index} item={item} itemDifferential={getDifferentialByID(itemDifferentials, item.id, item.level)} slotPanel={false} />
                                    ))}
                                  </Grid>
                                </AccordionDetails>
                              </UFAccordion>
                            ))}
                          </Grid>
                        </Grid>
                      </div>
                    </UFTabPanel>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Header>
      </Grid>
    );
  };


  return (
    <Root>
      <Grid container spacing={1}>
        {gameType === "Retail" ? contentGenerator() : contentGeneratorBC()}
      </Grid>
    </Root>
  );
};

export default RaidGearContainer;