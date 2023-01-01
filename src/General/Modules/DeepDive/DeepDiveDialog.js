import React, { useState } from "react";
import { makeStyles } from "@mui/styles/";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import IconButton from "@mui/material/IconButton";

import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

import { getTranslatedItemName, buildStatString, getItemIcon } from "../../Engine/ItemUtilities";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { translatedStat } from "General/Engine/STAT";

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(0),
  },
  itemIcon: {
    width: 48,
    height: 48,
  },
  itemName: {
    fontWeight: "bold",
  },
  itemStats: {
    marginTop: theme.spacing(1),
  },
  itemBlurb: {
    marginTop: theme.spacing(2),
  },
  //   itemStatsTable: {
  //     border: "1px solid #ccc",
  //     borderRadius: theme.shape.borderRadius,
  //     padding: theme.spacing(1),
  //   },
}));

function ItemDialog(props) {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const gameType = useSelector((state) => state.gameType);
  //   <ItemDialog item={item} />
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const item = props.item;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const itemQuality = item.getQualityColor();
  const itemName = getTranslatedItemName(item.id, currentLanguage, "", gameType);
  const filteredStats = Object.entries(props.item.stats).filter(([name, value]) => value > 0);
  const gemString = gameType === "Retail" && item.gemString ? "&gems=" + item.gemString : "";
  const wowheadDom = (gameType === "Classic" ? "wotlk-" : "") + currentLanguage;

  return (
    <Grid item>
      <IconButton className={classes.button} onClick={handleClickOpen} sx={{ padding: 0, margin: 0 }} size="small">
        <InfoOutlinedIcon style={{ fontSize: "18px" }} fontSize="small" />
      </IconButton>

      <Dialog open={open} onClose={handleClose} aria-labelledby="item-dialog-title" fullWidth={true} maxWidth={"sm"}>
        <DialogTitle id="item-dialog-title">
          <Grid container alignItems="center" spacing={1}>
            <Grid item>
              <a data-wowhead={"item=" + item.id + "&" + "ilvl=" + item.level + gemString + "&bonus=" + item.bonusIDS + "&domain=" + wowheadDom}>
                <img
                  style={{
                    borderRadius: 4,
                    borderWidth: "1px",
                    borderStyle: "solid",
                    borderColor: itemQuality,
                    //   position: "absolute",
                  }}
                  src={getItemIcon(item.id, gameType)}
                  alt={itemName}
                  className={classes.itemIcon}
                />
              </a>
            </Grid>
            <Grid item>{itemName}</Grid>
          </Grid>
        </DialogTitle>
        <DialogContent>
          <Table size="small" className={classes.itemStatsTable}>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Score</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStats.map(([name, quantity]) => (
                <TableRow key={name}>
                  <TableCell>{translatedStat[name][currentLanguage]}</TableCell>
                  <TableCell align="right">{quantity}</TableCell>
                  <TableCell align="right">{props.item.stats.score || 45}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <DialogContentText className={classes.itemBlurb}>{props.item.blurb || "This is a powerful piece of armor that will greatly increase your strength and stamina in battle."}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

export default ItemDialog;
