import React, { useState, useEffect } from "react";
import Image from 'next/image'
import ReactMapGl, { Marker } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

export default function EventMap({evt}) {
  const [lat, setLat] = useState(null)
  const [lng, setLng] = useState(null)
  const [loading, setLoading] = useState(true)
  const [viewport, setViewport] = useState({
    latitude: 27.173891,
    longitude: 78.042068,
    width: '100%',
    height: '500px',
    zoom: 12,
  })

  useEffect(() => {
    setLat(27.173891);
    setLng(78.042068);
    setLoading(false);
  }, []);

  if (loading) return false
  return (
    <>
    <ReactMapGl
    {...viewport}
    mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN}
    onViewportChange={(vp) => setViewport(vp)}
    >
      <Marker key={evt.id} latitude={lat} longitude={lng} >
        <Image src='/images/pin.svg' width={30} height={30} />
      </Marker>
    </ReactMapGl>
     </>
  )
}
