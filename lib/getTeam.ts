import { getInfoFromApi } from "./getInfoFromApi";

export const getTeamId = async (
  organization: number,
  teamName: string
): Promise<number | undefined> => {
  const response = await getInfoFromApi<{ name: string; id: number }[]>(
    "https://api.github.com/organizations/" + organization.toString() + "/teams"
  );
  let teamID: number | undefined = undefined;
  for (const i of response.data) {
    if (i.name === teamName) {
      teamID = i.id;
      break;
    }
  }
  return teamID;
};
