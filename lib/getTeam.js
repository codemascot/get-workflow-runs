import axios from "axios";

export const getTeam = async (name) =>
  axios
    .get(`https://api.github.com/organizations/${name}/teams`, {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
      },
    })
    .then((res) => {
      let teamID;
      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i].name === teamName) {
          teamID = res.data[i].id;
          break;
        }
      }
    });
