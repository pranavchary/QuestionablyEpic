import React from "react";
import { rootStyles } from "./PanelStyles";
import { Typography, Grid, Divider } from "@mui/material";
import ItemUpgradeCard from "./ItemUpgradeCard";
import "./Panels.css";
import { useTranslation } from "react-i18next";
import { encounterDB } from "../../../../Databases/InstanceDB";
import { filterItemListBySource, getDifferentialByID } from "../../../Engine/ItemUtilities";
import i18n from "i18next";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import bossHeaders from "General/Modules/CooldownPlanner/Functions/IconFunctions/BossHeaderIcons";
import UFAccordion from "./ufComponents/ufAccordian";
import UFAccordionSummary from "./ufComponents/ufAccordianSummary";

interface Props {
  itemList: any; // Replace 'any' with the appropriate type
  itemDifferentials: any; // Replace 'any' with the appropriate type
  type: any; // Replace 'any' with the appropriate type
}

const WorldBossGearContainer: React.FC<Props> = (props) => {
  const classes = rootStyles();
  const { t } = useTranslation();
  const itemList = props.itemList;
  const itemDifferentials = props.itemDifferentials;
  const currentLanguage = i18n.language;

  const contentGenerator = () => {
    if (encounterDB[1205]?.bossOrder) {
      return encounterDB[1205]?.bossOrder.map((key, i) => {
        const boss = encounterDB[1205]?.[key];
        if (boss) {
          return (
            <UFAccordion key={encounterDB[1205][key].name[currentLanguage] + "-accordian" + i} elevation={0} style={{ backgroundColor: "rgba(255, 255, 255, 0.12)" }}>
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
                  {encounterDB[1205][key].name[currentLanguage]} -{" "}
                  {
                    [...filterItemListBySource(itemList, 1205, key, key === 2531 ? 415 : 389)].map((item) => getDifferentialByID(itemDifferentials, item.id, item.level)).filter((item) => item !== 0)
                      .length
                  }{" "}
                  Upgrades
                </Typography>
              </UFAccordionSummary>
              <AccordionDetails style={{ backgroundColor: "#191c23" }}>
                <Grid xs={12} container spacing={1}>
                  {[...filterItemListBySource(itemList, 1205, key, key === 2531 ? 415 : 389)].map((item, index) => (
                    <ItemUpgradeCard key={index} item={item} itemDifferential={getDifferentialByID(itemDifferentials, item.id, item.level)} slotPanel={false} />
                  ))}
                </Grid>
              </AccordionDetails>
            </UFAccordion>
          );
        }
        return null;
      });
    }
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          {contentGenerator()}
        </Grid>
      </Grid>
    </div>
  );
};

export default WorldBossGearContainer;
