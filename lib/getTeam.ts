import { getInfoFromApi } from './getInfoFromApi.js'

export const getTeamId = async (
	organization: number,
	teamName: string,
): Promise<number | undefined> => {
	const response = await getInfoFromApi<{ name: string; id: number }[]>(
		'https://api.github.com/organizations/' +
			organization.toString() +
			'/teams',
	)
	for (const i of response.data) {
		if (i.name === teamName) {
			return i.id
		}
	}
	return undefined
}
