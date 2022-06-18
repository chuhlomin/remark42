import { ClientParams, Config } from '../typings'
import { createFetcher } from '../lib/fetcher'
import { API_BASE } from '../consts'

type Sort = 'asc' | 'desc'
type Comment = {
	id: string
	body: string
}
type CommentsTree = Comment[]

type CommentPayload = {
	title?: string
	pid?: string
	text: string
}

export type GetUserCommentsParams = { userId: string; sort?: Sort; limit?: number; skip?: number }
export type Vote = -1 | 1

export function createPublicClient({ siteId: site, baseUrl }: ClientParams) {
	const fetcher = createFetcher(site, `${baseUrl}${API_BASE}`)

	function getComments(params: GetUserCommentsParams): Promise<Comment[]>
	function getComments(url: string): Promise<CommentsTree>
	function getComments(params: GetUserCommentsParams | string): Promise<Comment[] | CommentsTree> {
		if (typeof params === 'string') {
			return fetcher.get<CommentsTree>('/find', { url: params })
		}

		return fetcher.get('/comments', params)
	}

	return {
		getConfig(): Promise<Config> {
			return fetcher.get('/config')
		},

		getComments,

		addComment(url: string, payload: CommentPayload): Promise<Comment> {
			const locator = { site, url }
			return fetcher.post(
				'/comment',
				{},
				{
					...payload,
					locator,
				}
			)
		},

		updateComment(url: string, id: string, text: string): Promise<Comment> {
			return fetcher.put(`/comment/${id}`, { url }, { text })
		},

		removeComment(url: string, id: string): Promise<void> {
			return fetcher.delete(`/comment/${id}`, { url })
		},

		vote(url: string, id: string, vote: Vote): Promise<{ id: string; vote: number }> {
			return fetcher.put<{ id: string; vote: number }>(`/vote/${id}`, { url, vote })
		},
	}
}
