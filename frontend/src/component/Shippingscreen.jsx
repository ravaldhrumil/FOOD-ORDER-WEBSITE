import React from 'react'
import  { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { saveShippingAddress } from '../actions/Cartactions'
import { useRef } from "react";
import {Form,Row,Col,Container,Button} from 'react-bootstrap'
import { StandaloneSearchBox, useJsApiLoader } from "@react-google-maps/api";
import Checkoutsteps from './Checkoutsteps'
import setBodyColor from './setBodyColor'
const libraries = ['places'];
function Shippingscreen(props) {
    setBodyColor({color:`${props.color}`})
  const cart = useSelector(state => state.cart)
  const { shippingAddress } = cart
  const navigate=useNavigate()
  const dispatch = useDispatch()

  const [street, setStreet] = useState(shippingAddress.street)
  const [city, setCity] = useState(shippingAddress.city)
  const [state, setState] = useState(shippingAddress.state)
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode)

  const submitHandler = (e) => {
      e.preventDefault()
      dispatch(saveShippingAddress({ street, city, postalCode, state }))
      navigate('/payment')
  }


  const inputRef = useRef();

    const { isLoaded, loadError } = useJsApiLoader({googleMapsApiKey: process.env.AIzaSyD3GG7Qq1XgRMAcjPejT9spgnR4RZ9xzbU,libraries});

    const handlePlaceChanged = () => { 
        const [ place ] = inputRef.current.getPlaces();
        if(place) { 
              
            let list=place.formatted_address.split(',')
            let statepincodelist=list[list.length-2].split(' ')
            let streetplace=list.slice(0,list.length-3)
            setStreet(streetplace)
            setState(statepincodelist[1])
            setPostalCode(statepincodelist[2])
            setCity(list[list.length-3])
        }
    }
function nullset(e)
{
            setStreet('')
            setState('')
            setPostalCode('')
            setCity('')
}
  return (

      <Container>
            <Row className="justify-content-md-center">
                <Col xs={12} md={6} style={{paddingTop:"10%"}}>
                <Checkoutsteps step1={"hi"} color={props.color}/>
          <h1 style={{color:"orange",userSelect:"none"}}>Delivery Address</h1>
          
          <Form onSubmit={submitHandler}>

          {isLoaded
        &&
        <StandaloneSearchBox onLoad={ref => inputRef.current = ref} onPlacesChanged={handlePlaceChanged}>
            <input
                type="text"
                className="form-control"
                placeholder="Search Here.."
                onChange={(e)=>{if(e.target.value===''){nullset()}}}
            />
        </StandaloneSearchBox>}

              <Form.Group controlId='street' className='pt-3'>
                  <Form.Label style={{color:`${props.color==='black'?'white':'black'}`,userSelect:"none"}}>Street</Form.Label>
                  <Form.Control
                      required
                      type='text'
                      placeholder='Enter street'
                      value={street ? street : ''}
                      onChange={(e) => setStreet(e.target.value)}
                  >
                  </Form.Control>
              </Form.Group>

              <Form.Group controlId='city' className='pt-3'>
                  <Form.Label style={{color:`${props.color==='black'?'white':'black'}`,userSelect:"none"}}>City</Form.Label>
                  <Form.Control
                      required
                      type='text'
                      placeholder='Enter city'
                      value={city ? city : ''}
                      onChange={(e) => setCity(e.target.value)}
                  >
                  </Form.Control>
              </Form.Group>
              <Form.Group controlId='state' className='pt-3'>
                  <Form.Label style={{color:`${props.color==='black'?'white':'black'}`,userSelect:"none"}}>State</Form.Label>
                  <Form.Control
                      required
                      type='text'
                      placeholder='Enter state'
                      value={state ? state : ''}
                      onChange={(e) => setState(e.target.value)}
              ></Form.Control>
                </Form.Group>
              
              <Form.Group controlId='postalCode' className='pt-3 pb-3'>
                  <Form.Label style={{color:`${props.color==='black'?'white':'black'}`,userSelect:"none"}}>Postal Code</Form.Label>
                  <Form.Control
                      required
                      type='text'
                      placeholder='Enter postal code'
                      value={postalCode ? postalCode : ''}
                      onChange={(e) => setPostalCode(e.target.value)}
                  >
                  </Form.Control>
              </Form.Group>

              <Button type='submit' variant='primary' className='btn btn-warning'>
                  Continue
              </Button>
          </Form>
          </Col>
            </Row>
        </Container>
  )
}

export default Shippingscreen