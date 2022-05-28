import Layout from "@/components/Layout";
import { API_URL } from "@/config/index";
import EventItem from "@/components/Eventitem";
import Pagination from "@/components/Pagination";
import { PER_PAGE } from "@/config/index";

export default function EventsPage({ events, page, total }) {

  return (
    <Layout>
      <h1>Events</h1>
      {events.data.length === 0 && <h3>No events to Show</h3>}

      {events.data.map((evt) => (
        <EventItem key={evt.id} evt={evt.attributes} />
      ))}

      <Pagination page={page} total={total}/>
    </Layout>
  );
}

export async function getServerSideProps({ query: { page = 1 } }) {
  const start = +page === 1 ? 0 : (+page - 1) * PER_PAGE;

  const res = await fetch(
    `${API_URL}/api/events?[populate]=*&sort[0]=date:asc&pagination[start]=${start}&pagination[limit]=${PER_PAGE}`
  );
  const events = await res.json();
  return {
    props: { events, page: +page, total: events.meta.pagination.total },
  };
}
