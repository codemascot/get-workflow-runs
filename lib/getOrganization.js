import axios from "axios";

export const getOrganization = async (name) =>
  axios
    .get(`https://api.github.com/orgs/${name}`, {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
      },
    })
    .then((res) => res.data);
