// Action Types
import { TOGGLE_CONTENT } from "../ActionTypes";
import { TOGGLE_GAMETYPE } from "../ActionTypes";
import { TOGGLE_PLAYERSETTINGS } from "../ActionTypes";
import { TOGGLE_PATRONSTATUS } from "../ActionTypes";

// Reducers
import { contentType } from "./ContentType";
import { gameType } from "./GameType";
import { playerSettings } from "./PlayerSettings";
import { patronStatus } from "./PatronStatus";

// Local Storage
import ls from "local-storage";

// Initial Store/State settings
const initialState = {
  gameType: "Retail",
  contentType: ls.get("contentType") || "Raid",
  playerSettings: {"includeGroupBenefits": {value: true, options: [true, false], category: "trinkets"},
                    "incarnateAllies": {value: "DPS", options: ["Solo", "DPS", "Tank", "Tank + DPS"], category: "trinkets"},
                    "idolGems": {value: 2, options: [1, 2, 3, 4, 5, 6, 7, 8], category: "trinkets"},
                    "rubyWhelpShell": {value: "Untrained", options: ["Untrained", "AoE Heal", "ST Heal", "Crit Buff", "Haste Buff"], category: "trinkets"}, // "ST Damage", "AoE Damage", 
                    "alchStonePotions": {value: 1, options: [0, 1, 2], category: "trinkets"},
                    "enchantItems": {value: true, options: [true, false], category: "topGear"},
                    "catalystLimit": {value: 1, options: [1, 2, 3], category: "topGear"},
                    "upgradeFinderMetric": {value: "Show % Upgrade", options: ["Show % Upgrade", "Show HPS"], category: "upgradeFinder"},// "whisperingIncarnateIcon": "Alone", "enemyTargets": 1},
                    "dungeonTargets": {value: 3.5, options: [1, 2, 3, 3.5, 4, 5], category: "topGear"}},
  patronStatus: "Standard" // Currently not used. Will be once we evolve app into a functional component.
};
if (initialState.gameType === "BurningCrusade") initialState.gameType = "Classic";

export default function rootReducer(state = initialState, action) {
  switch (action.type) {
    case TOGGLE_CONTENT:
      return contentType(state, action);
    case TOGGLE_GAMETYPE:
      return gameType(state, action);
    case TOGGLE_PLAYERSETTINGS:
      return playerSettings(state, action);
    case TOGGLE_PATRONSTATUS:
      return patronStatus(state, action);
    default:
      return state;
  }
}
