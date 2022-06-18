import { createFetchMock, getLastFetchUrl } from '@test/lib'
import { createAuthClient } from './auth'

describe('Auth Client', () => {
	const client = createAuthClient({ siteId: 'mysite', baseUrl: '/remark42' })

	it('should authorize as anonymouse', async () => {
		const fetchMock = createFetchMock()
		await client.anonymous('username')

		expect(getLastFetchUrl(fetchMock)).toBe(
			'/remark42/auth/anonymous/login?aud=mysite&site=mysite&user=username'
		)
	})
	it('should authorize with email', async () => {
		const fetchMock = createFetchMock()
		const tokenVerification = await client.email('username@example.com', 'username')

		expect(getLastFetchUrl(fetchMock)).toBe(
			'/remark42/auth/email/login?address=username%40example.com&site=mysite&user=username'
		)

		await tokenVerification('token')

		expect(getLastFetchUrl(fetchMock)).toBe('/remark42/auth/email/login?site=mysite&token=token')
	})

	it('should authorize with telegram', async () => {
		const fetchMock = createFetchMock(undefined, {
			json: () => Promise.resolve({ bot: 'remark42bot', token: 'token' }),
		})
		const telegramAuth = await client.telegram()

		expect(getLastFetchUrl(fetchMock)).toBe('/remark42/auth/telegram/login?site=mysite')
		expect(telegramAuth.bot).toBe('remark42bot')
		expect(telegramAuth.token).toBe('token')

		await telegramAuth.verify()
		expect(getLastFetchUrl(fetchMock)).toBe('/remark42/auth/telegram/login?site=mysite&token=token')
	})

	it('should logout', async () => {
		const fetchMock = createFetchMock()
		await client.logout()

		expect(getLastFetchUrl(fetchMock)).toBe('/remark42/auth/logout?site=mysite')
	})
})
