import emailjs from 'emailjs-com';
import React, { useState, useEffect } from 'react'
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap'
import { Link,useParams,useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { PayPalButton } from 'react-paypal-button-v2'
import Messageorderscreen from './Messageorderscreen'
import Loader from './Loader'
import { getOrderDetails,payOrder } from '../actions/Orderactions'
import { ORDER_PAY_RESET } from '../constant/Orderconstant'
import setBodyColor from './setBodyColor'
function Orderscreen(props) {
    
    setBodyColor({color:`${props.color}`})
    const {id} = useParams()
    const dispatch = useDispatch()

    const navigate=useNavigate()
    const [sdkReady, setSdkReady] = useState(false)
    const [toEmail, setToEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');

    const orderDetails = useSelector(state => state.orderDetails)
    const { order, error, loading } = orderDetails
    const cart = useSelector(state => state.cart)
    const orderPay = useSelector(state => state.orderPay)
    const { loading: loadingPay, success: successPay } = orderPay
  

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin


    if (!loading && !error) {
        order.itemsPrice = order.orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)
    }
   

    const addPayPalScript = () => {
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = 'https://www.paypal.com/sdk/js?client-id=AfRHaP6G8Cf10KYGTuCopdPbCg1F8aiBAS040dgvTDzAaBPyART33IsvUT95ABM0Jev9fb80n8tRWnO_'
        script.async = true
        script.onload = () => {
            setSdkReady(true)
        }
        document.body.appendChild(script)
    }
    let subjectcontent=`HI ${order?.user.name.toUpperCase()} YOUR ORDER IS SUCCESSFULLY PLACED!!`
    let messagecontent=""
    messagecontent+="YOUR ORDER DETAILS:"+"\n"
    const sendmessage=async ()=>{order && 
        order.orderItems.map((i)=>{
 
            messagecontent=messagecontent+i.name.toString()+"\n";
            
            return messagecontent;}
            )}
            sendmessage()
           
    useEffect(() => {

        if (!userInfo) {
            navigate('/login')
        }

        if (!order  ||successPay|| order.id !== parseInt(id) ) 
        {
            dispatch({ type: ORDER_PAY_RESET })
         
            dispatch(getOrderDetails(id))

        }
         else if (!order.isPaid) {
            
         
            if (!window.paypal) {
                addPayPalScript()
                
            } else {
                setSdkReady(true)

            }
        }
        messagecontent+="TOTAL PRICE: ₹"+order?.totalPrice+"\n";
        setToEmail(order?.user.email)
                setSubject(subjectcontent)
                setMessage(messagecontent)
    }, [dispatch, order,id,successPay,navigate,userInfo])

   
    
    const serviceId = 'service_kq6lmog';
    const templateId = 'template_rdbps0e';
    const userId = 'ymzK1ppAZ5y8KoLpp';
    const emailParams = {
        to_email: toEmail,
        subject: subject,
        message: message,
        to_name:`${order?.user.name}`,
      };
    const successPaymentHandler = (paymentResult) => {
        dispatch(payOrder(id, paymentResult))
        emailjs.send(serviceId, templateId, emailParams, userId)
      .then((response) => {
        console.log('Email sent successfully:', response);
        messagecontent="";
      })
      .catch((error) => {
        console.error('Email sending failed:', error);
      });
      setMessage('')
        setSubject('')
        setToEmail('')
    }
   
    
    return loading ? (
        <Loader />
    ) : error ? (
        <Messageorderscreen var='danger' message={error}></Messageorderscreen>
    ) : (
                <div style={{paddingTop:"5%"}}>
                    <Row>
                        <Col md={8}>
                            <ListGroup variant='flush' style={{border:`2px solid ${props.color==='black'?'white':'black'}`}}>
                                <ListGroup.Item style={{backgroundColor:`${props.color}`}}>
                                    <h2 style={{color:`${props.color==='black'?'white':'black'}`,userSelect:'none'}}>Delivery Address</h2>
                                    <p style={{color:`${props.color==='black'?'white':'black'}`,userSelect:'none'}}><strong>Name: </strong> {order.user.name}</p>
                                    <p style={{color:`${props.color==='black'?'white':'black'}`,userSelect:'none'}}><strong>Email: </strong>{order.user.email}</p>
                                    <p style={{color:`${props.color==='black'?'white':'black'}`,userSelect:'none'}}>
                                        <strong>Shipping: </strong>
                                        {cart.shippingAddress.street},  {order.shippingAddress.city}
                                        {'  '}
                                        {order.shippingAddress.state},
                                        {'  '}
                                        {order.shippingAddress.postalCode}
                                    </p>

                                    {order.isDelivered ? (
                                        <Messageorderscreen var='success' message={"Delivered on"} delivered={order.deliveredAt.toString().slice(0,10).split("-").reverse().join("-")}></Messageorderscreen>
                                    ) : (
                                            <Messageorderscreen var='danger' message={"Not Delivered"}></Messageorderscreen>
                                        )}
                                </ListGroup.Item>

                                <ListGroup.Item style={{backgroundColor:`${props.color}`}}>
                                    <h2 style={{color:`${props.color==='black'?'white':'black'}`,userSelect:'none'}}>Payment</h2>
                                    <p style={{color:`${props.color==='black'?'white':'black'}`,userSelect:'none'}}>
                                        <strong>Method: </strong>
                                        {order.paymentMethod}
                                    </p>
                                    {order.isPaid ? (
                                        <Messageorderscreen var='success' message={"Paid on "} paid={order.paidAt.toString().slice(0,10).split("-").reverse().join("-")}></Messageorderscreen>
                                    ) : (
                                            <Messageorderscreen var='danger' message={"Not Paid"}></Messageorderscreen>
                                        )}

                                </ListGroup.Item>

                                <ListGroup.Item style={{backgroundColor:`${props.color}`}}>
                                    <h2 style={{color:`${props.color==='black'?'white':'black'}`,userSelect:'none'}}>Order Items</h2>
                                    {order.orderItems.length === 0 ? <Messageorderscreen var='info' message={"Order is empty"}>
                                        
                            </Messageorderscreen> : (
                                            <ListGroup variant='flush'>
                                                {order.orderItems.map((item, index) => (
                                                    <ListGroup.Item key={index} style={{backgroundColor:`${props.color}`}}>
                                                        <Row style={{color:`${props.color==='black'?'white':'black'}`}}>
                                                            <Col md={1} >
                                                                <Image src={item.img} alt={item.name} fluid rounded />
                                                            </Col>

                                                            <Col style={{userSelect:'none'}}>
                                                                {item.name}
                                                            </Col>

                                                            <Col md={4} style={{userSelect:'none'}}>
                                                                {item.quantity} X ₹{item.price} = ₹{(item.quantity * item.price).toFixed(2)}
                                                            </Col>
                                                        </Row>
                                                    </ListGroup.Item>
                                                ))}
                                            </ListGroup>
                                        )}
                                </ListGroup.Item>

                            </ListGroup>

                        </Col>

                        <Col md={4}>
                            <Card>
                                <ListGroup variant='flush' style={{border:`2px solid ${props.color==='black'?'white':'black'}`}}>
                                    <ListGroup.Item style={{backgroundColor:`${props.color}`}}>
                                        <h2 style={{color:`${props.color==='black'?'white':'black'}`,userSelect:'none'}}>Order Summary</h2>
                                    </ListGroup.Item>

                                    <ListGroup.Item style={{backgroundColor:`${props.color}`}}>
                                        <Row style={{color:`${props.color==='black'?'white':'black'}`}}>
                                            <Col style={{userSelect:'none'}}>Items:</Col>
                                            <Col style={{userSelect:'none'}}>₹{order.itemsPrice}</Col>
                                        </Row>
                                    </ListGroup.Item>

                                    <ListGroup.Item style={{backgroundColor:`${props.color}`}}>
                                        <Row style={{color:`${props.color==='black'?'white':'black'}`}}>
                                            <Col style={{userSelect:'none'}}>Shipping:</Col>
                                            <Col style={{userSelect:'none'}}>₹{order.shippingPrice}</Col>
                                        </Row>
                                    </ListGroup.Item>

                                    <ListGroup.Item style={{backgroundColor:`${props.color}`}}>
                                        <Row style={{color:`${props.color==='black'?'white':'black'}`}}>
                                            <Col style={{userSelect:'none'}}>Tax:</Col>
                                            <Col style={{userSelect:'none'}}>₹{order.taxPrice}</Col>
                                        </Row>
                                    </ListGroup.Item>

                                    <ListGroup.Item style={{backgroundColor:`${props.color}`}}>
                                        <Row style={{color:`${props.color==='black'?'white':'black'}`}}>
                                            <Col style={{userSelect:'none'}}>Total:</Col>
                                            <Col style={{userSelect:'none'}}>₹{order.totalPrice}</Col>
                                        </Row>
                                    </ListGroup.Item>


                                    {!order.isPaid && (
                                        <ListGroup.Item style={{backgroundColor:`${props.color}`}}>
                                            {loadingPay && <Loader />}

                                            {!sdkReady ? (
                                                <Loader />
                                            ) : (
                                                order.orderItems.length === 0?"":<PayPalButton
                                                amount={order.totalPrice}
                                                onSuccess={successPaymentHandler}/>
                                                )}
                                        </ListGroup.Item>
                                    )}
                                </ListGroup>
                               
                            </Card>
                        </Col>
                    </Row>
                </div>
            )
}

export default Orderscreen