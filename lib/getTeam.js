import axios from "axios";

export const getTeamId = async (organization, teamName) => {
  const response = await axios.get(
    `https://api.github.com/organizations/${organization}/teams`,
    {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
      },
    }
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
