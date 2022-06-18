export type ClientParams = {
	siteId: string
	baseUrl: string
}

export type OAuthProvider =
	| 'facebook'
	| 'twitter'
	| 'google'
	| 'yandex'
	| 'github'
	| 'microsoft'
	| 'patreon'
	| 'telegram'
	| 'dev'
export type FormProvider = 'email' | 'anonymous'
export type Provider = OAuthProvider | FormProvider

export type Config = {
	version: string
	auth_providers: Provider[]
	edit_duration: number
	max_comment_size: number
	admins: string[]
	admin_email: string
	low_score: number
	critical_score: number
	positive_score: boolean
	readonly_age: number
	max_image_size: number
	simple_view: boolean
	anon_vote: boolean
	email_notifications: boolean
	telegram_bot_username: string
	emoji_enabled: boolean
}

export type User = {
	id: string
	name: string
	/** url to avatar */
	picture: string
	admin: boolean
	block: boolean
	verified: boolean
	/** subscription to email notification */
	email_subscription?: boolean
	/** users with Patreon auth can have paid status */
	paid_sub?: boolean
}

export type Locator = {
	/** site id */
	site: string
	/** page url */
	url: string
}

export type Comment = {
	/** comment id */
	id: string
	/** parent id */
	pid: string
	/** comment text, after md processing */
	text: string
	/** original comment text */
	orig?: string
	user: User
	locator: Locator
	score: number
	voted_ips: { Timestamp: string; Value: boolean }[]
	/**
	 * vote delta,
	 * if user hasn't voted delta will be 0,
	 * -1/+1 for downvote/upvote
	 */
	vote: 0 | 1 | -1
	/** comment controversy */
	controversy?: number
	/** pointer to have empty default in json response */
	edit?: {
		time: string
		summary: string
	}
	/** timestamp */
	time: string
	pin?: boolean
	delete?: boolean
	/** page title */
	title?: string
}

export type Thread = {
	comment: Comment
	replies?: Thread[]
}

export type PageInfo = {
	url: string
	count: number
	read_only?: boolean
	first_time?: string
	last_time?: string
}

export type CommentsThree = {
	comments: Thread[]
	info: PageInfo
}
