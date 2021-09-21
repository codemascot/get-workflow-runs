import axios from "axios";

export const getRunPromises = async (repo) => {
  const run = await axios.get(
    "https://api.github.com/repos/NordicSemiconductor/" +
      repo.name +
      "/actions/runs",
    {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
      },
    }
  );
  return run;
};
