export function getLastFetchUrl(mockFn: jest.Mock) {
	return mockFn.mock.lastCall[0]
}

export function getLastFetchInit(mockFn: jest.Mock) {
	return mockFn.mock.lastCall[1]
}

export function createFetchMock(
	data?: unknown,
	res?: Partial<Omit<Response, 'headers'> & { headers: Record<string, string> }>
) {
	const response = Object.assign(
		{
			ok: true,
			status: 200,
			json: () => Promise.resolve(data),
		},
		res,
		{ headers: new Headers({ date: `${Math.floor(Date.now() / 1000)}`, ...(res?.headers ?? {}) }) }
	)
	const fetchMock = jest.fn().mockResolvedValue(response)

	window.fetch = fetchMock

	return fetchMock
}
