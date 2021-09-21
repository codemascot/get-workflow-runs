import axios from "axios";

export const getReposResponse = async (organization, teamID, pageNumber) => {
  const reposResponse = await axios.get(
    "https://api.github.com/organizations/" +
      organization +
      "/team/" +
      teamID +
      "/repos?page=" +
      pageNumber,
    {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
      },
    }
  );
  return reposResponse;
};
