import Layout from "@/components/Layout";
import { API_URL } from "@/config/index";
import EventItem from "@/components/Eventitem";
var qs = require("qs");
import Link from "next/link";

export default function SearchPage({ events, term }) {
  return (
    <Layout title="Search Dj">
      <Link href="/events">Go Back</Link>
      <h1>Search Results for {term}</h1>
      {events.data.length === 0 && <h3>No events to Show</h3>}

      {events.data.map((evt) => (
        <EventItem key={evt.id} evt={evt.attributes} />
      ))}
    </Layout>
  );
}

export async function getServerSideProps({ query: { term } }) {
  // ?filters[name][$containsi]=Boom
  const query = qs.stringify(
    {
      filters: {
        $or: [
          {
            name: {
              $containsi: term,
            },
          },
          {
            performers: {
              $containsi: term,
            },
          },
          {
            description: {
              $containsi: term,
            },
          },
          {
            venue: {
              $containsi: term,
            },
          },
        ],
      },
    },
    {
      encode: false,
    }
  );

  const res = await fetch(`${API_URL}/api/events?${query}&populate=*`);
  const events = await res.json();
  return {
    props: { events: events, term },
  };
}
