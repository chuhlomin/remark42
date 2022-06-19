import { ClientParams, Config, User } from '../typings'
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
		/**
		 * Get server config
		 */
		getConfig(): Promise<Config> {
			return fetcher.get('/config')
		},

		/**
		 * Get comments
		 */
		getComments,

		/**
		 * Add new comment
		 */
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

		/**
		 * Update comment
		 */
		updateComment(url: string, id: string, text: string): Promise<Comment> {
			return fetcher.put(`/comment/${id}`, { url }, { text })
		},

		/**
		 * Remove comment on a page
		 */
		removeComment(url: string, id: string): Promise<void> {
			return fetcher.delete(`/comment/${id}`, { url })
		},

		/**
		 * Vote for a comment
		 */
		vote(url: string, id: string, vote: Vote): Promise<{ id: string; vote: number }> {
			return fetcher.put<{ id: string; vote: number }>(`/vote/${id}`, { url, vote })
		},

		/**
		 * Get current authorized user
		 */
		getUser(): Promise<User | null> {
			return fetcher.get<User | null>('/user').catch(() => null)
		},
	}
}
