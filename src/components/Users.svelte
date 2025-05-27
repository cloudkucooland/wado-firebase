<script>
  import user from "../model/user";
  // import { Col, Container, Row, Table } from "sveltestrap";
</script>

<svelte:head>
  <title>Recent WADO Users</title>
</svelte:head>

<Container>
  <Row>
    <Col xs="12">
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
    </Col>
  </Row>
</Container>
