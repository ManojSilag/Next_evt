import React  from "react";
import Layout from "@/components/Layout";
import { parseCookies } from "@/helpers/index";
import { API_URL } from "@/config/index";
import styles from "@/styles/Dashboard.module.css"
import DashboardEvent from "@/components/DashboardEvent";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/router";

export default function DashboardPage({events, token}) {
  const router = useRouter()
  
  const deleteEvent = async(id) => {
     if(confirm('Are you Sure?')){
      const res = await fetch(`${API_URL}/api/events/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`
        },
      })
      
      const data = await res.json()
      console.log(data)

      if(!res.ok){
        if(res.status === 403 || res.status === 401){
          toast.error('unAuthorized') 
          return
         }
        toast.error(data.message)
      }else{
        router.push('/events')
      }
    }
  }

  
  return <Layout title="User Dashboard">
    <div className={styles.dash}>
      <h1>Dashboard</h1>
      <ToastContainer />
       <h3>My Events</h3>
       {events.map((evt)=>{
        return <DashboardEvent handleDelete={deleteEvent} evt={evt} key={evt.id}/>
       })}
    </div>
    </Layout>;
}


export async function getServerSideProps({req}){
  
  const {token} = parseCookies(req)

  const res = await fetch(`${API_URL}/api/events/me`,{
    headers:{
      Authorization: `Bearer ${token}`
    },
    method: "GET"
  })
  const events = await res.json()
  return {
    props: {events, token}
  }
}