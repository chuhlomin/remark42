import { createFetchMock, getLastFetchInit } from '../../test/lib'
import { JWT_HEADER, XSRF_COOKIE, XSRF_HEADER } from '../consts'
import { createFetcher } from './fetcher'

const apiUri = '/anything'
const apiUrl = `/anything?site=remark42`

function setup(params?: Parameters<typeof createFetchMock>[1]) {
	return {
		fetcher: createFetcher('remark42', ''),
		fetchMock: createFetchMock(undefined, params),
	}
}

describe('fetcher', () => {
	describe('methods', () => {
		it('should send GET request', async () => {
			const { fetcher, fetchMock } = setup()
			await fetcher.get(apiUri)

			expect(window.fetch).toHaveBeenCalledWith(apiUrl, {
				method: 'get',
				headers: getLastFetchInit(fetchMock).headers,
			})
		})

		it('should send POST request', async () => {
			const { fetcher, fetchMock } = setup()
			await fetcher.post(apiUri)

			expect(window.fetch).toHaveBeenCalledWith(apiUrl, {
				method: 'post',
				headers: getLastFetchInit(fetchMock).headers,
			})
		})

		it('should send PUT request', async () => {
			const { fetcher, fetchMock } = setup()
			await fetcher.put(apiUri)

			expect(window.fetch).toHaveBeenCalledWith(apiUrl, {
				method: 'put',
				headers: getLastFetchInit(fetchMock).headers,
			})
		})

		it('should send DELETE request', async () => {
			const { fetcher, fetchMock } = setup()
			await fetcher.delete(apiUri)

			expect(window.fetch).toHaveBeenCalledWith(apiUrl, {
				method: 'delete',
				body: undefined,
				headers: getLastFetchInit(fetchMock).headers,
			})
		})
	})

	describe('headers', () => {
		it('should set active token and then clean it on unauthorized response', async () => {
			const headers = { [JWT_HEADER]: 'token' }
			const { fetcher, fetchMock: initialFetcherMock } = setup({ headers })
			let fetchMock = initialFetcherMock
			// token should be saved
			await fetcher.get(apiUri)
			// the first call should be without token
			expect(getLastFetchInit(fetchMock).headers.get(JWT_HEADER)).toBeNull()
			// the second call should be with token
			await fetcher.get(apiUri)
			// check if the second call was with token
			expect(getLastFetchInit(fetchMock).headers.get(JWT_HEADER)).toBe('token')
			// unauthorized response should clean token
			fetchMock = createFetchMock(undefined, { status: 401 })
			// the third call should be without token but token should be cleaned
			await expect(fetcher.get(apiUri)).rejects.toMatch('Unauthorized')
			// check token on the third call
			expect(getLastFetchInit(fetchMock).headers.get(JWT_HEADER)).toBe('token')
			// the fourth call should be with token
			await expect(fetcher.get(apiUri)).rejects.toMatch('Unauthorized')
			// check if the fourth call was with token
			expect(getLastFetchInit(fetchMock).headers.get(JWT_HEADER)).toBeNull()
		})

		it('should add XSRF header if we have it in cookies', async () => {
			Object.defineProperty(document, 'cookie', {
				writable: true,
				value: `${XSRF_COOKIE}=token`,
			})
			const { fetcher, fetchMock } = setup()

			await fetcher.get(apiUri)

			expect(getLastFetchInit(fetchMock).headers.get(XSRF_HEADER)).toBe('token')
		})
	})

	describe('send data', () => {
		it('should send JSON', async () => {
			const data = { text: 'text' }

			const { fetcher, fetchMock } = setup()
			await fetcher.post(apiUri, {}, data)

			const [, response] = fetchMock.mock.lastCall
			expect(fetchMock).toBeCalledWith('/anything?site=remark42', {
				body: '{"text":"text"}',
				headers: response.headers,
				method: 'post',
			})
			expect(response.headers.get('Content-Type')).toBe('application/json')
		})

		it("shouldn't send content-type with form data", async () => {
			const body = new FormData()

			const { fetcher, fetchMock } = setup()
			await fetcher.post(apiUri, {}, body)

			const [, response] = fetchMock.mock.lastCall
			expect(response.headers.get('Conente-Type')).toBeNull()
		})
	})

	describe('errors', () => {
		it('should throw error on api response with status code 400', async () => {
			const { fetcher } = setup({ status: 400 })
			await expect(fetcher.get(apiUri)).rejects.toEqual(undefined)
		})
	})
})
