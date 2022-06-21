<script lang="ts">
	export let id: string
	export let name: string
	export let picture: string
	export let verified = false
	export let paid_sub = false
</script>

<article data-id={id}>
	<img src={picture} alt={name} />
	{name}
	{#if verified}<span class="verified">(verified)</span>{/if}
	{#if paid_sub}<span class="paid">(paid)</span>{/if}
</article>
