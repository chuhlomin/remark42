import Comments from './comments.svelte'

let app: Comments

export function initCommentsWidget(): void {
	app = new Comments({
		target: document.body,
	})
}

export function destroyCommentsWidget(): void {
	app.$destroy()
}
