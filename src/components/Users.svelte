<script>
	import user from '../model/user';
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
</script>

<svelte:head>
	<title>Recent WADO Users</title>
</svelte:head>

<div class="w-full">
	<Table striped={true}>
		<TableHead>
			<TableHeadCell>&nbsp;</TableHeadCell>
			<TableHeadCell>Last Activity</TableHeadCell>
			<TableHeadCell>Longest Streak</TableHeadCell>
			<TableHeadCell>Current Streak</TableHeadCell>
		</TableHead>
		<TableBody>
			{#await user.getRecent()}
				<TableBodyRow><TableBodyCell colspan="4">Loading ...</TableBodyCell></TableBodyRow>
			{:then users}
				{#each users as u}
					<TableBodyRow>
						<TableBodyCell>{u.displayName}</TableBodyCell>
						<TableBodyCell>{u.lastActivity.toDateString()}</TableBodyCell>
						<TableBodyCell>{u.longestStreak}</TableBodyCell>
						<TableBodyCell>{u.consecutiveDays}</TableBodyCell>
					</TableBodyRow>
				{/each}
			{/await}
		</TableBody>
	</Table>
</div>
