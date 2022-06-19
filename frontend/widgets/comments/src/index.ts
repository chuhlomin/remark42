import Comments from './comments.svelte';

let app: Comments;

export function initCommentsWidget() {
	app = new Comments({
		target: document.body,
	});
}

export function destroyCommentsWidget() {
	app.$destroy();
}
