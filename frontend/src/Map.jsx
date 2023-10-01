import React from "react";
import GoogleMapReact from 'google-map-react';
import {useState,useEffect} from 'react';
import loc from './img/loc.png'
const AnyReactComponent = ({ text }) => <div>{text}</div>;

export default function Map(){
  const [lat,setlat]=useState(null)
  const [long,setlong]=useState(null)
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setlat(latitude)
      setlong(longitude)
    });
  });
  const defaultProps = {
    center: {
      lat:lat,
      lng: long
    },
    zoom: 15
  };
  return (
    // Important! Always set the container height explicitly
    <div style={{backgroundColor:"white"}}><div style={{ paddingLeft:"2%",paddingTop:"2%", width: '350px',height: '350px' }}>
      { long && <GoogleMapReact
        bootstrapURLKeys={{ key: "AIzaSyD3GG7Qq1XgRMAcjPejT9spgnR4RZ9xzbU" }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
      >
        <AnyReactComponent
          lat={lat}
          lng={long}
          text={<img src={loc} alt=""/>}
        />
      </GoogleMapReact>}
      
    </div>
    
    </div>
  );
}