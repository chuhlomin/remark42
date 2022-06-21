import { createPublicClient } from '@remark42/api/'

export const publicClient = createPublicClient({
	siteId: 'remark42',
	baseUrl: 'https://demo.remark42.com',
})
