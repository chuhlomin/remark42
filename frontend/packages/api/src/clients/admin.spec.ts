import { createFetchMock, getLastFetchUrl } from '@test/lib'
import { BlockTTL, createAdminClient } from './admin'

describe('Admin Client', () => {
	const client = createAdminClient({ siteId: 'mysite', baseUrl: '/remark42' })

	it('should create an admin client', () => {
		expect(client).toBeDefined()
	})

	it('should return list of blocked users', async () => {
		const data = [{ id: 1 }, { id: 2 }]
		const fetchMock = createFetchMock(data)
		const users = await client.getBlockedUsers()

		expect(users).toEqual(data)
		expect(getLastFetchUrl(fetchMock)).toBe('/remark42/api/v1/blocked?site=mysite')
	})

	it.each`
		ttl              | expected
		${'permanently'} | ${'/remark42/api/v1/user/1?block=1&site=mysite&ttl=0'}
		${'1440m'}       | ${'/remark42/api/v1/user/1?block=1&site=mysite&ttl=1440m'}
		${'43200m'}      | ${'/remark42/api/v1/user/1?block=1&site=mysite&ttl=43200m'}
	`('should block user with ttl: $input', async (p) => {
		const { ttl, expected } = p as { ttl: BlockTTL; expected: string }
		const fetchMock = createFetchMock()
		await client.blockUser('1', ttl)

		expect(getLastFetchUrl(fetchMock)).toBe(expected)
	})

	it('should unblock user', async () => {
		const fetchMock = createFetchMock()
		await client.unblockUser('1')

		expect(getLastFetchUrl(fetchMock)).toBe('/remark42/api/v1/user/1?block=0&site=mysite')
	})

	it('should mark user as verified', async () => {
		const fetchMock = createFetchMock()
		await client.verifyUser('1')
		expect(getLastFetchUrl(fetchMock)).toBe('/remark42/api/v1/verify/1?site=mysite&verified=1')
	})

	it('should mark user as unverified', async () => {
		const fetchMock = createFetchMock()
		await client.unverifyUser('1')
		expect(getLastFetchUrl(fetchMock)).toBe('/remark42/api/v1/verify/1?site=mysite&verified=0')
	})

	it('should approve removing request', async () => {
		const fetchMock = createFetchMock()
		await client.approveRemovingRequest('token')
		expect(getLastFetchUrl(fetchMock)).toBe('/remark42/api/v1/deleteme?site=mysite&token=token')
	})

	it('should pin comment', async () => {
		const fetchMock = createFetchMock()
		await client.pinComment('1')
		expect(getLastFetchUrl(fetchMock)).toBe('/remark42/api/v1/pin/1?pinned=1&site=mysite')
	})

	it('should unpin comment', async () => {
		const fetchMock = createFetchMock()
		await client.unpinComment('1')
		expect(getLastFetchUrl(fetchMock)).toBe('/remark42/api/v1/pin/1?pinned=0&site=mysite')
	})

	it('should remove comment', async () => {
		const fetchMock = createFetchMock()
		await client.removeComment('/post/1', '1')
		expect(getLastFetchUrl(fetchMock)).toBe(
			'/remark42/api/v1/comment/1?site=mysite&url=%2Fpost%2F1'
		)
	})

	it('should enable commenting on a page', async () => {
		const fetchMock = createFetchMock()
		await client.enableCommenting('/post/1')
		expect(getLastFetchUrl(fetchMock)).toBe(
			'/remark42/api/v1/readonly?ro=1&site=mysite&url=%2Fpost%2F1'
		)
	})

	it('should enable commenting on a page', async () => {
		const fetchMock = createFetchMock()
		await client.disableCommenting('/post/1')
		expect(getLastFetchUrl(fetchMock)).toBe(
			'/remark42/api/v1/readonly?ro=0&site=mysite&url=%2Fpost%2F1'
		)
	})
})
