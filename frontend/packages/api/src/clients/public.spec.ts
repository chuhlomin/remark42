import { getLastFetchInit, createFetchMock, getLastFetchUrl } from '@test/lib'
import { createPublicClient, GetUserCommentsParams, Vote } from './public'

describe('Public Client', () => {
	const client = createPublicClient({ siteId: 'mysite', baseUrl: '/remark42' })

	it('should create an public client', () => {
		expect(client).toBeDefined()
	})

	describe('getConfig', () => {
		it('should return config', async () => {
			const input = { x: 1, y: 2 }
			const fetchMock = createFetchMock(input)
			const result = await client.getConfig()

			expect(result).toEqual(input)
			expect(fetchMock).toHaveBeenCalledWith('/remark42/api/v1/config?site=mysite', {
				body: undefined,
				headers: getLastFetchInit(fetchMock).headers,
				method: 'get',
			})
		})
	})

	describe('getComments', () => {
		it('should return page comments', async () => {
			const input = { post: { id: '1' }, node: [{ id: 1 }] }
			const fetchMock = createFetchMock(input)
			const result = await client.getComments('/post/1')

			expect(result).toEqual(input)
			expect(fetchMock).toHaveBeenCalledWith('/remark42/api/v1/find?site=mysite&url=%2Fpost%2F1', {
				body: undefined,
				headers: getLastFetchInit(fetchMock).headers,
				method: 'get',
			})
		})
		it.each`
			params                                 | output
			${{ userId: '1' }}                     | ${'comments?site=mysite&userId=1'}
			${{ userId: '2' }}                     | ${'comments?site=mysite&userId=2'}
			${{ userId: '2', limit: 10 }}          | ${'comments?limit=10&site=mysite&userId=2'}
			${{ userId: '2', skip: 10 }}           | ${'comments?site=mysite&skip=10&userId=2'}
			${{ userId: '2', skip: 10, limit: 0 }} | ${'comments?limit=0&site=mysite&skip=10&userId=2'}
		`('should return user comments', async (p) => {
			const { params, output } = p as { params: GetUserCommentsParams; output: string }
			const input = [{ id: 1 }, { id: 2 }]
			const fetchMock = createFetchMock(input)
			const result = await client.getComments(params)

			expect(result).toEqual(input)
			expect(fetchMock).toHaveBeenCalledWith(`/remark42/api/v1/${output}`, {
				body: undefined,
				headers: getLastFetchInit(fetchMock).headers,
				method: 'get',
			})
		})
	})

	it('should add comment', async () => {
		const fetchMock = createFetchMock()
		await client.addComment('/post/1', { text: 'test' })

		const { headers, body, method } = getLastFetchInit(fetchMock)
		expect(method).toBe('post')
		expect(headers.get('Content-Type')).toBe('application/json')
		expect(body).toBe(JSON.stringify({ text: 'test', locator: { site: 'mysite', url: '/post/1' } }))
		expect(getLastFetchUrl(fetchMock)).toBe('/remark42/api/v1/comment?site=mysite')
	})

	it('should update comment', async () => {
		const fetchMock = createFetchMock()
		await client.updateComment('/post/1', '1', 'test')

		const { headers, body, method } = getLastFetchInit(fetchMock)
		expect(method).toBe('put')
		expect(headers.get('Content-Type')).toBe('application/json')
		expect(body).toBe(JSON.stringify({ text: 'test' }))
		expect(getLastFetchUrl(fetchMock)).toBe(
			'/remark42/api/v1/comment/1?site=mysite&url=%2Fpost%2F1'
		)
	})

	it('should update comment', async () => {
		const fetchMock = createFetchMock()
		await client.removeComment('/post/1', '1')

		expect(getLastFetchInit(fetchMock).method).toBe('delete')
		expect(getLastFetchUrl(fetchMock)).toBe(
			'/remark42/api/v1/comment/1?site=mysite&url=%2Fpost%2F1'
		)
	})

	it.each`
		vote  | do            | expected
		${1}  | ${'upvote'}   | ${'/remark42/api/v1/vote/1?site=mysite&url=%2Fpost%2F1&vote=1'}
		${-1} | ${'downvote'} | ${'/remark42/api/v1/vote/1?site=mysite&url=%2Fpost%2F1&vote=-1'}
	`('should $do for comment', async (p) => {
		const { vote, expected } = p as { vote: Vote; expected: string }
		const fetchMock = createFetchMock()
		await client.vote('/post/1', '1', vote)

		expect(getLastFetchInit(fetchMock).method).toBe('put')
		expect(getLastFetchUrl(fetchMock)).toBe(expected)
	})
})
