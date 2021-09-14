import axios from "axios";

export const getOrganization = async (name) => {
  const response = await axios.get(`https://api.github.com/orgs/${name}`, {
    headers: {
      Authorization: `token ${process.env.GITHUB_TOKEN}`,
    },
  });
  return response.data;
};
