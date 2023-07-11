import { styled } from '@mui/system';
import { Tab } from "@mui/material";

const commonStyles = `
background-repeat: no-repeat;
background-position: center 60%;
background-size: 101%;
border-radius: 4px 0px 0px 4px;
height: 45px;
white-space: nowrap;
text-shadow: 3px 3px 4px black;
color: #fff;
font-size: 0.9rem;
`

export const Root = styled('div')`
width: 100%;
margin-top: 4px;
padding: 4px;
`;

export const Header = styled('div')(({ theme }) => `
justify-content: center;
display: block;
margin-left: auto;
margin-right: auto;
flex-grow: 1;
max-width: 100%;
${theme.breakpoints.down('lg')} {
  justify-content: center;
  display: block;
  margin-left: auto;
  margin-right: auto;
  flex-grow: 1;
  max-width: 100%;
}
${theme.breakpoints.up('md')} {
  justify-content: center;
  display: block;
  margin-left: auto;
  margin-right: auto;
  flex-grow: 1;
  max-width: 100%;
}
`)

export const NaxxramasHeaderTab = styled(Tab)`
${commonStyles}
background-image: url(${require('../../../../Images/Classic/Raid/Naxxramas.jpg')});
`
export const MalygosHeaderTab = styled(Tab)`
${commonStyles}
background-image: url(${require("../../../../Images/Classic/Raid/Malygos.jpg")});
`
export const ArgentRaidHeaderTab = styled(Tab)`
${commonStyles}
background-image: url(${require("../../../../Images/Classic/Raid/ArgentRaid.jpg")});
`
export const UlduarHeaderTab = styled(Tab)`
${commonStyles}
background-image: url(${ require("../../../../Images/Classic/Raid/Ulduar.jpg") });
`
export const VaultOfArchavonHeaderTab = styled(Tab)`
${commonStyles}
background-image: url(${ require("../../../../Images/Classic/Raid/VaultOfArchavon.jpg")});
`
export const ObsidianSanctumHeaderTab = styled(Tab)`
${commonStyles}
background-image: url(${ require("../../../../Images/Classic/Raid/ObsidianSanctum.jpg")});
`
export const OnyxiaLairHeaderTab = styled(Tab)`
${commonStyles}
background-image: url(${ require("../../../../Images/Classic/Raid/OnyxiaLair.jpg")});
`
export const IcecrownCitadelHeaderTab = styled(Tab)`
${commonStyles}
background-image: url(${ require("../../../../Images/Classic/Raid/IcecrownCitadel.jpg")});
`
export const RaidHeaderOne = styled(Tab)`
${commonStyles}
background-image: url(${ require("../../../../Images/Bosses/Aberrus/AberrusRaidLong.png")});
`
export const RaidHeaderTwo = styled(Tab)`
${commonStyles}
background-image: url(${ require("Images/Bosses/SepulcherOfTheFirstOnes/SepulcherOfTheFirstOnesHeader.png")});
`
export const RaidHeaderThree = styled(Tab)`
${commonStyles}
background-image: url(${ require("Images/Bosses/SanctumOfDomination/SanctumArt.png")});
`
export const MythicHeaderTab = styled(Tab)`
${commonStyles}
background-image: url(${ require('Images/Bosses/DawnLong.png')});
`
export const MythicPlusHeaderTab = styled(Tab)`
${commonStyles}
background-image: url(${ require('Images/Bosses/MythicPlusLong.png')});
`

