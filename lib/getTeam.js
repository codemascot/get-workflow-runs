import { getInfoFromApi } from "./getInfoFromApi.js";

export const getTeamId = async (organization, teamName) => {
  const response = await getInfoFromApi(
    "https://api.github.com/organizations/" + organization + "/teams"
  );
  let teamID;
  for (let i = 0; i < response.data.length; i++) {
    if (response.data[i].name === teamName) {
      teamID = response.data[i].id;
      break;
    }
  }
  return teamID;
};
