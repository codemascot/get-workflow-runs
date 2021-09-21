import axios from "axios";

export const getRunPromises = async (repo_name) => {
  const run = await axios.get(
    "https://api.github.com/repos/NordicSemiconductor/" +
      repo_name +
      "/actions/runs",
    {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
      },
    }
  );
  return run;
};
