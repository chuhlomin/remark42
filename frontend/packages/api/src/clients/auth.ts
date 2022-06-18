import { createFetcher } from '../lib/fetcher'
import { ClientParams, User } from '../typings'

export function createAuthClient({ siteId, baseUrl }: ClientParams) {
	const fetcher = createFetcher(siteId, `${baseUrl}/auth`)

	return {
		async anonymous(user: string): Promise<User> {
			return fetcher.get<User>('/anonymous/login', { user, aud: siteId })
		},

		async email(email: string, username: string): Promise<(token: string) => Promise<User>> {
			const EMAIL_SIGNIN_ENDPOINT = '/email/login'

			await fetcher.get<void>(EMAIL_SIGNIN_ENDPOINT, { address: email, user: username })

			return function tokenVerification(token: string): Promise<User> {
				return fetcher.get<User>(EMAIL_SIGNIN_ENDPOINT, { token })
			}
		},

		async telegram() {
			const TELEGRAM_SIGNIN_ENDPOINT = '/telegram/login'

			const { bot, token } = await fetcher.get<{ bot: string; token: string }>(
				TELEGRAM_SIGNIN_ENDPOINT
			)

			return {
				bot,
				token,
				verify() {
					return fetcher.get(TELEGRAM_SIGNIN_ENDPOINT, { token })
				},
			}
		},

		async logout(): Promise<void> {
			return fetcher.get<void>('/logout')
		},
	}
}
