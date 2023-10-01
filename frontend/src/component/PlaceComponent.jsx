import React, { useRef } from "react";
import { StandaloneSearchBox, useJsApiLoader } from "@react-google-maps/api";

const libraries = ['places'];
const PlaceComponent = () => {
    const inputRef = useRef();

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: process.env.AIzaSyD3GG7Qq1XgRMAcjPejT9spgnR4RZ9xzbU,
        libraries
    });

    const handlePlaceChanged = () => { 
        const [ place ] = inputRef.current.getPlaces();
        if(place) { 
            let list=place.formatted_address.split(',')
            console.log(place.geometry.location.lat())
            console.log(place.geometry.location.lng())
        } 
    }

    return (
        isLoaded
        &&
        <StandaloneSearchBox
            onLoad={ref => inputRef.current = ref}
            onPlacesChanged={handlePlaceChanged}
        >
            <input
                type="text"
                className="form-control"
                placeholder="Enter Location"
            />
        </StandaloneSearchBox>
    );
};

export default PlaceComponent;