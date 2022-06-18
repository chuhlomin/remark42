import { ClientParams } from '../typings'
import { createAdminClient } from './admin'
import { createAuthClient } from './auth'
import { createPublicClient } from './public'

export type Client = {
	admin: ReturnType<typeof createAdminClient>
	auth: ReturnType<typeof createAuthClient>
	public: ReturnType<typeof createPublicClient>
}

let client: Client

export function createClient(params: ClientParams): Client {
	if (client === undefined) {
		client = {
			auth: createAuthClient(params),
			admin: createAdminClient(params),
			public: createPublicClient(params),
		}
	}

	return client
}
