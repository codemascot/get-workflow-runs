import axios, { AxiosResponse } from "axios";

export const getInfoFromApi = async <ResponseType extends Record<string, any>>(
  URL: string
): Promise<AxiosResponse<ResponseType>> => {
  const response = await axios.get<ResponseType>(URL, {
    headers: {
      Authorization: `token ${process.env.GITHUB_TOKEN}`,
    },
  });
  return response;
};
