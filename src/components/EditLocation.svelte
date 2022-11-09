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
  import {
    collection,
    query,
    where,
    getDocs,
    getDoc,
  } from "firebase/firestore";
  import { db, recordEvent } from "../firebase";
  import association from "../model/association";
  import { onMount } from "svelte";

  export let params = { id };
  const id = params.id ? params.id : "GENERAL-ANYTHING";

  $: associations = new Map();

  async function loadLocation() {
    try {
      const q = query(
        collection(db, "associations"),
        where("Location", "==", id)
      );
      const res = await getDocs(q);
      for (const a of res.docs) {
        associations.set(a.id, new association(a));

        /* const rawprayer = await getDoc(a.data().Reference);
        const prayerdata = rawprayer.data();
        // console.log(a.data(), prayerdata);
        if (prayerdata.Name != a.data().PrayerName) {
          console.log(
            "prayer name wrong in association",
            prayerdata.Name,
            a.data().PrayerName
          );
          // bother updating?
          // a.Name = prayerdata.Name;
        }
        */
      }

      associations = new Map([...associations].sort(association.sort));
    } catch (e) {
      console.log(e);
    }
  }

  onMount(async () => {
    recordEvent("screen_view", { firebase_screen: "EditLocation", id: id });
    await loadLocation();
    // editorPerm = await isEditor();
  });
</script>

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
                  <td>{v.ProperDisplay}</td>
                  <td>{v.WeekdayDisplay}</td>
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
