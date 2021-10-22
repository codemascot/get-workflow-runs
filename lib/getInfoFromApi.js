import axios from "axios";

export const getInfoFromApi = async (URL) => {
  const response = await axios.get(
    URL,
    {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
      },
    }
  );
  return response;
};