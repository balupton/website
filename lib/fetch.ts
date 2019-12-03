import fetch from 'isomorphic-unfetch'

export default async function(
	input: RequestInfo,
	init?: RequestInit
): Promise<string> {
	const res = await fetch(input, init)
	return await res.text()
}
