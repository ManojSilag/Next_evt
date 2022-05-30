import { useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import { API_URL } from "@/config/index"
import Layout from "@/components/Layout"
import styles from "@/styles/Form.module.css"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from "moment"
import Image from "next/image"
import { FaImage } from "react-icons/fa"
import Modal from "@/components/modal"
import ImageUpload from "@/components/ImageUpload"
import { parseCookies } from "@/helpers/index"

export default function EditEventPage({evt, token}) {

  const [values, setValues] = useState({
    name: evt.attributes.name ,
    venue: evt.attributes.venue ,
    address: evt.attributes.address ,
    performers: evt.attributes.performers ,
    date: evt.attributes.date ,
    time: evt.attributes.time ,
    description: evt.attributes.description ,
  })
  const [showModal, setShowModal] = useState(false)

  const [imagePreview, setImagePreview] = 
  useState(evt.attributes.image.data ? evt.attributes.image.data.attributes.formats.thumbnail.url : null)

  const router = useRouter()

  const handleSubmit = async(e) => {
      e.preventDefault()
      console.log(values)

      //vallidation
      const hasEmptyFields =  Object.values(values).some(el=> el === '')
      if(hasEmptyFields){
        toast.error('Please fill in all Fields')
        return
      }

      const res = await fetch(`${API_URL}/api/events/${evt.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ data: values }),
      })

      if(!res.ok) {
        if(res.status === 403 || res.status === 401){
          toast.error('unAuthorized') 
          return
        }
        toast.error('Something Went wrong')
      }else{
        const evt = await res.json()
        console.log(evt)
        router.push(`/events/${evt.data.attributes.slug}`)
      }
    }


  const handleInputChange = (e) => {
    const {name:changeName, value:changeValue} = e.target
    setValues({...values, [changeName]: changeValue})
  }

  const imageUlpoaded = async() => {
    const res = await fetch(`${API_URL}/api/events/${evt.id}?[populate]=*`)
    const { data }= await res.json()
    console.log(data)
    setImagePreview(data.attributes.image.data.attributes.formats.thumbnail.url)
    setShowModal(false)
  }

  return (
    <Layout title='Add New Event'>
      <Link href='/events'>Go Back</Link>
      
      <h1>Edit Event</h1>
      <ToastContainer />

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.grid}>
          <div>
            <label htmlFor='name'>Event Name</label>
            <input
              type='text'
              id='name'
              name='name'
              value={values.name}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor='performers'>Performers</label>
            <input
              type='text'
              name='performers'
              id='performers'
              value={values.performers}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor='venue'>Venue</label>
            <input
              type='text'
              name='venue'
              id='venue'
              value={values.venue}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor='address'>Address</label>
            <input
              type='text'
              name='address'
              id='address'
              value={values.address}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor='date'>Date</label>
            <input
              type='date'
              name='date'
              id='date'
              value={moment(values.date).format('yyyy-MM-DD')}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor='time'>Time</label>
            <input
              type='text'
              name='time'
              id='time'
              value={values.time}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div>
          <label htmlFor='description'>Event Description</label>
          <textarea
            type='text'
            name='description'
            id='description'
            value={values.description}
            onChange={handleInputChange}
          ></textarea>
        </div>

        <input type='submit' value='Update Event' className='btn' />
      </form>

      <h2>Event Image</h2>
      {imagePreview ? (
        <Image src={imagePreview} width={170} height={100}/>
      ): <div>
        <p>No Image uploaded</p>
        </div>}

        <div>
          <button className="btn-secondary"
          onClick={()=> setShowModal(true)}
          style={{ display: 'flex', 'alignItems': 'center','columnGap': '5px'}}>
            <FaImage/> Set Image
          </button>
        </div>

        <Modal show={showModal} 
        onClose={()=> setShowModal(false)}>
          <ImageUpload evtId={evt.id} 
          imageUlpoaded={imageUlpoaded} token={token}/>
        </Modal>
    </Layout>
  )
}

export async function getServerSideProps({params:{id}, req}){
  const {token} = parseCookies(req)
  const res = await fetch(`${API_URL}/api/events/${id}?[populate]=*`)
  const evt = await res.json()
  console.log(req.headers.cookie)
  
  return {
    props:{
      evt : evt.data, token
    }
  }
}