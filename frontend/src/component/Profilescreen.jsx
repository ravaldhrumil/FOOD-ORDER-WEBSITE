import React,{useEffect,useState} from 'react'
import { Link,useNavigate } from 'react-router-dom'
import { Form,Row,Col,Button,ListGroup,Table } from 'react-bootstrap'
import { useDispatch,useSelector } from 'react-redux'
import { getUserDetails,updateUserProfile } from '../actions/Useractions'
import Loader from './Loader';
import Message from './Message'
import Messageprofilescreen from './Messageprofilescreen';
import { USER_UPDATE_PROFILE_RESET } from '../constant/Userconstants'
import { ToastContainer, toast } from 'react-toastify';
import { listMyOrders } from '../actions/Orderactions'
import setBodyColor from './setBodyColor'
import { ORDER_DETAILS_RESET } from '../constant/Orderconstant'
function Profilescreen(props) {
    setBodyColor({color: `${props.color}`})
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState('')

    const dispatch = useDispatch()

    const userDetails = useSelector(state => state.userDetails)
    const { error, loading, user } = userDetails

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const userUpdateProfile = useSelector(state => state.userUpdateProfile)
    const { success } = userUpdateProfile
    const orderListMy = useSelector(state => state.orderListMy)
    const { loading: loadingOrders, error: errorOrders, orders } = orderListMy
    const passreg=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    
    const navigate=useNavigate()

    useEffect(() => {
        if (!userInfo) {
            navigate('/login')
        } else {
            if (!user || !user.name||success ) {
                dispatch({ type: USER_UPDATE_PROFILE_RESET })
                
                dispatch(getUserDetails('profile'))
                dispatch(listMyOrders())
                setPassword("")
                setConfirmPassword("")
               
            } else {
                setName(user.name)
                setEmail(user.email)
            }
        }
    }, [dispatch, navigate, userInfo,user,success])
    function updated()
    {
        toast.success("Password Updated Successfully.",{autoClose:1000})
    }
    const submitHandler = (e) => {
        e.preventDefault()

        if (password.length<8) {
            setMessage(' Password must have Minimum eight characters')
        } 
        else if(!passreg.test(password))
        {
            setMessage("Password must have at least one uppercase letter, one lowercase letter, one number and one special character")
        }
        else if(password!==confirmPassword)
        {
            setMessage('Confirm password does not match.')
        }
        else 
        {
            setMessage('')
            dispatch(updateUserProfile({
                'id': user.id,
                'password': password
            }))
            updated()
        }

    }
    dispatch({ type:ORDER_DETAILS_RESET })
    return (<div style={{paddingTop:"8%"}} className='container-fluid'>
        {loading ? <Loader/>:<Row>
        
            <Col md={3} style={{paddingLeft:"3%"}}>
            <ListGroup variant="primary" style={{border:`2px solid ${props.color==='black'?'white':'black'}`}} >
            <ListGroup.Item style={{backgroundColor:`${props.color}`}}>
                <h2 style={{paddingTop:"2%",color:"orange",userSelect:'none'}}>User Profile</h2>
                <ToastContainer className="toastcontainer" style={{width:"300px",height:"8px",paddingTop:"5%"}} position="top-left"/>
                {message && <Messageprofilescreen mesg={message}>{error}</Messageprofilescreen>}
              
                <Form onSubmit={submitHandler}>

                    <Form.Group controlId='name' className="pt-3">
                        <Form.Label style={{color:`${props.color==='black'?'white':'black'}`,userSelect:'none'}}>Name</Form.Label>
                        <Form.Control
                            required disabled
                            type='name'
                            placeholder='Enter name'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        >
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId='email' className="pt-3">
                        <Form.Label style={{color:`${props.color==='black'?'white':'black'}`,userSelect:'none'}}>Email Address</Form.Label>
                        <Form.Control
                            required
                            type='email'
                            placeholder='Enter Email'
                            value={email} disabled
                            onChange={(e) => setEmail(e.target.value)}
                        >
                        </Form.Control>
                    </Form.Group >

                    <Form.Group controlId='password' className="pt-3">
                        <Form.Label style={{color:`${props.color==='black'?'white':'black'}`,userSelect:'none'}}>Password</Form.Label>
                        <Form.Control

                            type='password'
                            placeholder='Enter Password'
                            value={password}
                            required
                            onChange={(e) => setPassword(e.target.value)}
                        >
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId='passwordConfirm' className="pt-3 pb-3">
                        <Form.Label style={{color:`${props.color==='black'?'white':'black'}`,userSelect:'none'}}>Confirm Password</Form.Label>
                        <Form.Control

                            type='password'
                            placeholder='Confirm Password'
                            value={confirmPassword}
                            required
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        >
                        </Form.Control>
                    </Form.Group>

                    <Button type='submit' className="btn-warning">
                        Update
                </Button>

                </Form>
                </ListGroup.Item>
            </ListGroup>
            </Col>
            
            <Col md={8}>
            <ListGroup variant="primary" style={{border:`2px solid ${props.color==='black'?'white':'black'}`}} >
            <ListGroup.Item style={{backgroundColor:`${props.color}`}}>
                <h2 style={{paddingTop:"1%",color:"orange",userSelect:'none'}}>My Orders</h2>
                {loadingOrders ? (
                    <Loader />
                ) : errorOrders ? (
                    <Message variant='danger'>{errorOrders}</Message>
                ) : (
                            <Table striped responsive className='table-sm'>
                                <thead>
                                    <tr style={{color:`${props.color==='black'?'white':'black'}`,userSelect:'none'}}>
                                        <th>ID</th>
                                        <th>Date</th>
                                        <th>Total</th>
                                        <th>Paid</th>
                                        <th>Delivered</th>
                                        <th></th>
                                    </tr>
                                </thead>

                                <tbody>
                                     {orders.map(order => (
                                        <tr key={order.id} style={{color:`${props.color==='black'?'white':'black'}`,userSelect:'none'}}>
                                            <td>{order.id}</td>
                                            <td>{order.createdAt.toString().slice(0,10).split("-").reverse().join("-")}</td>
                                            <td>${order.totalPrice}</td>
                                            <td>{order.isPaid ? order.paidAt.toString().slice(0,10).split("-").reverse().join("-") : (
                                               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                                               <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                                             </svg>
                                            )}</td>
                                            <td>
                                                <Link to={`/order/${order.id}`}>
                                                    <Button className='btn-sm'>Details</Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))} 
                                </tbody>
                            </Table>
                        )}</ListGroup.Item>
            </ListGroup>
            </Col>
        </Row>}</div>
    )
}

export default Profilescreen