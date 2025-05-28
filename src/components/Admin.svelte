<script>
	// import { Container, Col, Row } from "sveltestrap";
</script>

<svelte:head>
	<title>WADO Admin</title>
</svelte:head>

<Container>
	<Row>
		<Col>
			<h2>WADO Overview</h2>
			<div>
				<em>The top level of WADO are the offices.</em> These are hard-coded into the system, but
				can be viewed on
				<a href="https://github.com/cloudkucooland/wado-firebase/tree/main/src/components">GitHub</a
				>. Offices contain some fixed elements, such as rubrics, and many dynamic elements that
				change from seasons-to-season, week-to-week, and day-to-day.
			</div>
			<div>
				<em>The dynamic elements are locations</em>. A location consists of
				<em>associations</em>
				to <em>prayers</em>.
			</div>
			<div>
				A location can be unique or used in multiple offices. Each location has a name. By
				convention, location names are defined in ALL-CAPITOL-LETTERS. Locations that are used in a
				specific office start with that office name, (e.g. LAUDS-CONFESSION). Locations that are
				used in multiple offices do not (e.g. FORGIVEN)
			</div>
			<div>
				An association consists of the location, the prayer, and data about when to display that
				prayer.
			</div>
			<div>
				If a <em>calendar date</em> (mm-dd month-day, year is ignored) is set, all other values are
				ignored, that association matches only that date.
				<i>Calendar dates should be avoided unless they are the only way to achieve the goal</i>.
				Calendar dates should be used for saint feast days and the like.
			</div>
			<div>
				<em>Association are evaluated in most-to-least precise order.</em> Seasons, Proper, Weekday,
				Lectionary Year. The more items that are set, the mpre precise it is. "Lent, 1, Wednesday, A"
				would match ONLY on Wednesdays during year A during the first week of Lent. but "Leent, Any,
				Any, Any" would match any day in Lent. The Location Edit screen should give a good indication
				of the evaluation order.
			</div>
			<div>
				<em>Prayers have a "class" that determines how they are displayed.</em>
				A prayer with the class "hymn" will display with meter/tune information.
				<i>When adding new prayers, it is important to make sure you select the proper class.</i>
			</div>
		</Col>
	</Row>

	<Row>
		<Col>
			<h2>Assocation Evaluation Order</h2>
			<ol>
				<li>Calendar Date</li>
				<li>Season, Proper, Weekday, Year</li>
				<li>Season, Proper, Weekday, Any</li>
				<li>Season, Proper, Any, Any</li>
				<li>Season, Any, Weekday, Any</li>
				<li>Season, Any, Any, Any</li>
				<li>Any, Any, Any, Any</li>
			</ol>
		</Col>
	</Row>

	<Row>
		<Col>
			<h2>Known Bugs/Quirks/Issues</h2>
			<div>
				soft-breaks (shift-enter) doesn't work in the body on macOS (untested on windows). Edit the
				prayer in your word processor, copy-and-paste into the WADO editor
			</div>
			<div>The Workflow for adding data is sub-optimal</div>
		</Col>
	</Row>
</Container>
