import Layout from "@/components/Layout";
import { API_URL } from "@/config/index";
import Image from "next/image";
import styles from "@/styles/Event.module.css";
import Link from "next/link";
import { FaPenAlt, FaTimes } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/router";
import EventMap from "@/components/EventMap";
export default function Eventpage({ evt }) {
  const router = useRouter()

  // const deleteEvent = async(e) => {
  //   if(confirm('Are you Sure?')){
  //     const res = await fetch(`${API_URL}/api/events/${evt.id}`, {
  //       method: 'DELETE',
  //     })
      
  //     const data = await res.json()
  //     console.log(data)

  //     if(!res.ok){
  //       toast.error(data.message)
  //     }else{
  //       router.push('/events')
  //     }
  //   }
  // };
  // console.log(evt.attributes.image.data.attributes.formats.medium.url)
  console.log(evt.attributes);

  return (
    <Layout>
      <div className={styles.event}>
        {/* <div className={styles.controls}>
          <Link href={`/events/edit/${evt.id}`}>
            <a>
              <FaPenAlt /> Edit Event
            </a>
          </Link>
          <a href="#" className={styles.delete} onClick={deleteEvent}>
            <FaTimes /> Delete Event
          </a>
        </div> */}

        <span>
          {new Date(evt.attributes.date).toLocaleDateString("en-US")} at{" "}
          {evt.attributes.time}
        </span>
        <h1>{evt.attributes.name}</h1>
        <ToastContainer />
        {evt.attributes.image && (
          <div className={styles.image}>
            <Image
              src={
                evt.attributes.image.data
                  ? evt.attributes.image.data.attributes.formats.medium.url
                  : "/images/event-default.png"
              }
              width={960}
              height={600}
            />
          </div>
        )}

        <h3>Performes:</h3>
        <p>{evt.attributes.performers}</p>
        <h3>Description:</h3>
        <p>{evt.attributes.description}</p>
        <h3>Venue: {evt.attributes.venue}</h3>
        <p>{evt.attributes.address}</p>
  
         <EventMap evt={evt}/>
        <Link href={"/events"}>
          <a className={styles.back}>{"<"} Go Back</a>
        </Link>
      </div>
    </Layout>
  );
}

// export async function getStaticPaths() {
//   const res = await fetch(`${API_URL}/api/events`);
//   const events = await res.json();
//   const paths = events.data.map((evt) => ({
//     params: { slug: evt.attributes.slug },
//   }));

//   return {
//     paths,
//     fallback: true,
//   };
// }

// export async function getStaticProps({ params: { slug } }) {
//   const res = await fetch(
//     `${API_URL}/api/events?filters[slug][$eq]=${slug}&[populate]=*`
//   );
//   const events = await res.json();
//   return {
//     props: {
//       evt: events.data[0],
//     },
//     revalidate: 1,
//   };
// }

export async function getServerSideProps({query: {slug}}){
  console.log(slug)
  const res = await fetch(`${API_URL}/api/events?filters[slug][$eq]=${slug}&[populate]=*`)
  const events = await res.json()
  return {
    props: {
      evt: events[0]
    }
  }
}
