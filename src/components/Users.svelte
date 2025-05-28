<script>
	import user from '../model/user';
	import { Table } from 'flowbite-svelte';
</script>

<svelte:head>
	<title>Recent WADO Users</title>
</svelte:head>

<div class="w-full">
	<Table>
		<thead>
			<tr>
				<th>&nbsp;</th>
				<th>Last Activity</th>
				<th>Longest Streak</th>
				<th>Current Streak</th>
			</tr>
		</thead>
		{#await user.getRecent()}
			<tr><td colspan="4">Loading ...</td></tr>
		{:then users}
			{#each users as u}
				<tr>
					<td>{u.displayName}</td>
					<td>{u.lastActivity.toDateString()}</td>
					<td>{u.longestStreak}</td>
					<td>{u.consecutiveDays}</td>
				</tr>
			{/each}
		{/await}
	</Table>
</div>
