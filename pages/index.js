import Layout from "@/components/Layout"
import { API_URL } from "../config/index";
import EventItem from "@/components/Eventitem";
import Link from "next/link";

export default function HomePage({events}) {
  return (
    <Layout>
      <h1>Upcomming Events</h1>
      {events.data.length === 0 && 
      <h3>No events to Show</h3>}
        
      {events.data.map(evt => (
        <EventItem key={evt.id} evt={evt.attributes}/>
      ))}

      {events.data.length > 0 && (
        <Link href={'/events'}>
          <a className="btn-secondary">View All Events</a>
        </Link>
      )}
    </Layout>
  );
}

export async function getStaticProps(){
  const res = await fetch(`${API_URL}/api/events?[populate]=*&sort[0]=date:asc&pagination[limit]=3`)
  const events = await res.json()
  return {
    props: {events},
    revalidate: 1
  }
}
