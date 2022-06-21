// import type { User } from '@remark42/api'

import { writable, get } from 'svelte/store'
import { publicClient } from '../api/public'

type User = {
	X: 1
}
const loaded = writable(false)
export const loading = writable(false)
export const user = writable<User | null>(null)

export function initUserStore(initialUser: User | null): void {
	if (initialUser === null) {
		return
	}

	loaded.set(true)
	user.set(initialUser)
}

export function loadUser(force?: boolean): void {
	if (get(loading) || (get(loaded) && !force)) {
		return
	}

	loading.set(true)
	publicClient
		.getUser()
		.then((data) => {
			user.set(data)
			loading.set(false)
			loaded.set(true)
		})
		.catch((...args) => {
			console.error(args)
		})
}
