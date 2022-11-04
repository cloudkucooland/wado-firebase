<script>
  import {
    Spinner,
    Container,
    Row,
    Col,
    Card,
    CardHeader,
    CardBody,
    Table,
  } from "sveltestrap";
  import { collection, query, where, getDocs } from "firebase/firestore";
  import { db } from "../firebase";

  import prayer from "../model/prayer";
  import psalm from "../model/psalm";
  import hymn from "../model/hymn";
  import lection from "../model/lection";
  import heartword from "../model/heartword";
  import association from "../model/association";

  export let params = { id };
  const id = params.id ? params.id : "GENERAL-ANYTHING";

  const classes = new Map([
    ["prayer", prayer],
    ["psalm", psalm],
    ["hymn", hymn],
    ["lection", lection],
    ["heartword", heartword],
  ]);

  const prayers = new Map();
  const associations = new Map();

  async function loadLocation() {
    try {
      const q = query(
        collection(db, "associations"),
        where("Location", "==", id)
      );
      const res = await getDocs(q);
      for (const a of res.docs) {
        // console.log(a.data());

        associations.set(a.id, new association(a));

        // const rawprayer = await getDoc(a.data().Reference);
        // const prayerdata = rawprayer.data();
        // const c = classes.get(prayerdata.Class);
        // const prayer = new c(d);
        // docs.set(dd.id, prayer);
      }

      // console.log(associations);
      return associations;
    } catch (e) {
      console.log(e);
      return associations;
    }
  }
</script>

{#await loadLocation()}
  <Spinner color="primary" />
{:then associations}
  <Container>
    <Row>
      <Col>
        <Card>
          <CardHeader>Associations for {id}</CardHeader>
          <CardBody>
            <Table>
              <thead>
                <tr>
                  <th>Prayer</th>
                  <th>Calendar Date</th>
                  <th>Season</th>
                  <th>Proper</th>
                  <th>Weekday</th>
                  <th>Lectionary Year</th>
                  <th>Weight</th>
                  <th>&nbsp;</th>
                </tr>
              </thead>
              <tbody>
                {#each [...associations] as [k, v]}
                  <tr id={k}>
                    <td>
                      <a href="#/edit/{v.Reference.id}">
                        {v.PrayerName}
                      </a>
                    </td>
                    <td>{v.CalendarDate}</td>
                    <td>{v.Season}</td>
                    <td>{v.Proper}</td>
                    <td>{v.Weekday}</td>
                    <td>{v.Year}</td>
                    <td>{v.Weight}</td>
                    <td>edit / delete</td>
                  </tr>
                {/each}
              </tbody>
            </Table>
          </CardBody>
        </Card>
      </Col>
    </Row>
  </Container>
{:catch e}
  <div>{e}</div>
{/await}
