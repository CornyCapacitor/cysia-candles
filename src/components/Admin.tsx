import { useAtom } from "jotai"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { themeAtom } from "../atoms"
import supabase from "../config/supabaseClient"
import './Admin.css'

type Candle = {
  id: number,
  name: string,
  image: string,
  color?: string,
  volume?: string,
  quantity?: number,
}

type Question = {
  id: number,
  created_at: Date,
  email: string,
  topic: string,
  comment: string,
}

type Order = {
  id: number,
  created_at: Date,
  customerType: string,
  customerName?: string,
  customerSecondName?: string,
  companyName?: string,
  companyNumber?: string,
  invoice: boolean,
  streetName: string,
  houseNumber: string,
  apartmentValue: string,
  city: string,
  zipCode: string,
  phoneNumber: string,
  email: string,
  comments: string,
  deliveryType: string,
  paymentMethod: string,
  totalPrice: string,
  country: string,
  items: Candle[],
}

export const Admin = () => {
  const [theme] = useAtom(themeAtom)
  const navigate = useNavigate()

  // Auth states
  const [pagePassword] = useState<string>("adminos")
  const [password, setPassword] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Management states
  const [candles, setCandles] = useState<Candle[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const getCandles = () => {
    if (candles.length === 0) {
      const fetchCandles = async () => {
        const { data, error } = await supabase.from('candles').select();

        if (error) {
          console.error(error);
        }

        if (data) {
          setCandles(data);
        }
      };

      fetchCandles();
    } else {
      setCandles([])
    }
  }

  const candleEdit = (id: number, name: string) => {
    console.log(`Editing ${name} candle with id ${id}`)
  }

  const getQuestions = () => {
    if (questions.length === 0) {
      const fetchQuestions = async () => {
        const { data, error } = await supabase.from('contact').select();

        if (error) {
          console.error(error);
        }

        if (data) {
          setQuestions(data);
        }
      };

      fetchQuestions();
    } else {
      setQuestions([])
    }
  }

  const cleanDate = (created_at: Date) => {
    const date = new Date(created_at)

    const formattedDate = date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZoneName: 'short',
    })

    return formattedDate
  }

  const getOrders = () => {
    if (orders.length === 0) {
      const fetchOrders = async () => {
        const { data, error } = await supabase.from('orders').select();

        if (error) {
          console.error(error);
        }

        if (data) {
          setOrders(data);
          console.log(data)
        }
      };

      fetchOrders();
    } else {
      setOrders([])
    }
  }

  const validate = () => {
    if (pagePassword === password) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
      navigate('/')
    }
  }

  return (
    <div className={`admin-page ${theme === "light" ? "light-toned-bg dark-font" : "dark-bg white-font"}`}>
      {!isAdmin ?
        <div className="auth-container">
          <span className={`auth-info ${theme === "light" ? "light-bg black-font" : "dark-toned-bg white-font"}`}>You probably shouldn't be here. If you should, please type correct password to proceed. Otherwise, you'll be sent to home page.</span>
          <input className={`auth-input ${theme === "light" ? "light-var-outline" : "dark-var-outline"}`} type="textbox" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className={`admin-button ${theme === "light" ? "light-var-bg" : "dark-var-bg"}`} onClick={() => validate()}>Validate</button>
        </div>
        :
        <div className={`admin-display ${theme === "light" ? "light-bg black-font" : "dark-toned-bg white-font"}`}>
          <></>
          <button className={`admin-button ${theme === "light" ? "light-var-bg" : "dark-var-bg"}`} onClick={() => getCandles()}>Manage candles</button>
          {candles.length > 0 ?
            <div className="admin-section">
              {candles.map((candle) => (
                <div key={candle.id} className="admin-candle">
                  <p className="admin-candle-info">{candle.id}</p>
                  <p className="admin-candle-info">{candle.name}</p>
                  <p className="admin-candle-info">{candle.image}</p>
                  <button className={`admin-button ${theme === "light" ? "light-var-bg" : "dark-var-bg"}`} onClick={() => candleEdit(candle.id, candle.name)}>Edit this candle</button>
                </div>
              ))}
            </div>
            : <></>}
          <button className={`admin-button ${theme === "light" ? "light-var-bg" : "dark-var-bg"}`} onClick={() => getQuestions()}>Show questions</button>
          {questions.length > 0 ?
            <div className="admin-section">
              {questions.map((question) => (
                <div key={question.id} className="admin-question">
                  <p className="admin-question-info">{question.id}</p>
                  <p className="admin-question-info">{cleanDate(question.created_at)}</p>
                  <p className="admin-question-info">{question.email}</p>
                  <p className="admin-question-info">{question.topic}</p>
                  <p className="admin-question-info">{question.comment}</p>
                </div>
              ))}
            </div>
            : <></>}
          <button className={`admin-button ${theme === "light" ? "light-var-bg" : "dark-var-bg"}`} onClick={() => getOrders()}>Show orders</button>
          {orders.length > 0 ?
            <div className="admin-section">
              {orders.map((order) => (
                <div key={order.id} className="admin-order">
                  <header>Order {order.id}</header>
                  <div className="admin-order-section">
                    <header>General info</header>
                    <div className="admin-order-section-headers">
                      <p className="admin-order-info">Id:</p>
                      <p className="admin-order-info">Date:</p>
                      <p className="admin-order-info">Customer type:</p>
                      <p className="admin-order-info">{order.customerType === "private-person" ? "Customer name:" : "Company name:"}</p>
                      <p className="admin-order-info">{order.customerType === "private-person" ? "Second name:" : "Company number:"}</p>
                      <p className="admin-order-info">Invoice:</p>
                    </div>
                    <div className="admin-order-section-data">
                      <p className="admin-order-info">{order.id}</p>
                      <p className="admin-order-info">{cleanDate(order.created_at)}</p>
                      <p className="admin-order-info">{order.customerType}</p>
                      {order.customerType === "private-person" ?
                        <p className="admin-order-info">{order.customerName}</p>
                        :
                        <p className="admin-order-info">{order.companyName}</p>
                      }
                      {order.customerType === "private-person" ?
                        <p className="admin-order-info">{order.customerSecondName}</p>
                        :
                        <p className="admin-order-info">{order.companyNumber}</p>
                      }
                      {order.invoice ?
                        <p className="admin-order-info">Yes</p>
                        :
                        <p className="admin-order-info">No</p>
                      }
                    </div>
                  </div>
                  <div className="admin-order-section">
                    <header>Localization:</header>
                    <div className="admin-order-section-headers">
                      <p className="admin-order-info">Street name:</p>
                      <p className="admin-order-info">House number:</p>
                      <p className="admin-order-info">Apartment number</p>
                      <p className="admin-order-info">City:</p>
                      <p className="admin-order-info">Zip code:</p>
                      <p className="admin-order-info">Country:</p>
                    </div>
                    <div className="admin-order-section-data">
                      <p className="admin-order-info">{order.streetName}</p>
                      <p className="admin-order-info">{order.houseNumber}</p>
                      <p className="admin-order-info">{order.apartmentValue === "0" ? "-" : order.apartmentValue}</p>
                      <p className="admin-order-info">{order.city}</p>
                      <p className="admin-order-info">{order.zipCode}</p>
                      <p className="admin-order-info">{order.country}</p>
                    </div>
                  </div>
                  <div className="admin-order-section">
                    <header>Purchase details:</header>
                    <div className="admin-order-section-headers">
                      <p className="admin-order-info">Phone number:</p>
                      <p className="admin-order-info">Email:</p>
                      <p className="admin-order-info">Delivery type:</p>
                      <p className="admin-order-info">Payment method:</p>
                      <p className="admin-order-info">Comments:</p>
                      <p className="admin-order-info">Total price:</p>
                    </div>
                    <div className="admin-order-section-data">
                      <p className="admin-order-info">{order.phoneNumber}</p>
                      <p className="admin-order-info">{order.email}</p>
                      <p className="admin-order-info">{order.deliveryType}</p>
                      <p className="admin-order-info">{order.paymentMethod}</p>
                      <p className="admin-order-info">{order.comments}</p>
                      <p className="admin-order-info">{order.totalPrice}</p>
                    </div>
                  </div>
                  <div className="admin-order-section">
                    <header>Items:</header>
                    <div className="admin-order-section-headers">
                      <p className="admin-order-info">Id:</p>
                      <p className="admin-order-info">Name:</p>
                      <p className="admin-order-info">Color:</p>
                      <p className="admin-order-info">Image:</p>
                      <p className="admin-order-info">Volume:</p>
                      <p className="admin-order-info">Quantity:</p>
                    </div>
                    {order.items.map((item) => (
                      <div className="admin-order-section-data" key={item.id}>
                        <p className="admin-order-info">{item.id}</p>
                        <p className="admin-order-info">{item.name}</p>
                        <p className="admin-order-info">{item.color}</p>
                        <p className="admin-order-info">{item.image}</p>
                        <p className="admin-order-info">{item.volume}</p>
                        <p className="admin-order-info">{item.quantity}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            : <></>}
        </div>
      }
      {isAdmin ?
        <button onClick={() => setIsAdmin(false)}>Log out</button>
        : <></>}
    </div>
  )
}