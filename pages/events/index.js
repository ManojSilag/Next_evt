import Layout from "@/components/Layout"
import { API_URL } from "@/config/index";
import EventItem from "@/components/Eventitem";

export default function EventsPage({events}) {
  return (
    <Layout>
      <h1>Events</h1>
      {events.data.length === 0 && 
      <h3>No events to Show</h3>}
        
      {events.data.map(evt => (
        <EventItem key={evt.id} evt={evt.attributes}/>
      ))}

    </Layout>
  );
}

export async function getStaticProps(){
  const res = await fetch(`${API_URL}/api/events?[populate]=*&sort[0]=date:asc`)
  const events = await res.json()
  return {
    props: {events},
    revalidate: 1
  }
}
