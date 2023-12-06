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
          {candles ?
            <div>
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
          {questions ?
            <div>
              {questions.map((question) => (
                <div key={question.id} className="admin-question">
                  <p>{question.id}</p>
                  {cleanDate(question.created_at)}
                  <p>{question.email}</p>
                  <p>{question.topic}</p>
                  <p>{question.comment}</p>
                </div>
              ))}
            </div>
            : <></>}
          <button className={`admin-button ${theme === "light" ? "light-var-bg" : "dark-var-bg"}`} onClick={() => getOrders()}>Show orders</button>
          {orders ?
            <div>
              {orders.map((order) => (
                <div key={order.id}>
                  <p>{order.id}</p>
                  <p>{cleanDate(order.created_at)}</p>
                  <p>{order.customerType}</p>
                  {order.customerType === "private-person" ?
                    <p>{order.customerName}</p>
                    :
                    <p>{order.companyName}</p>
                  }
                  {order.customerType === "private-person" ?
                    <p>{order.customerSecondName}</p>
                    :
                    <p>{order.companyNumber}</p>
                  }
                  {order.invoice ?
                    <p>Invoice</p>
                    :
                    <p>No invoice</p>
                  }
                  <p>{order.streetName}</p>
                  <p>{order.houseNumber}</p>
                  <p>{order.apartmentValue}</p>
                  <p>{order.city}</p>
                  <p>{order.zipCode}</p>
                  <p>{order.country}</p>
                  <p>{order.phoneNumber}</p>
                  <p>{order.email}</p>
                  <p>{order.comments}</p>
                  <p>{order.deliveryType}</p>
                  <p>{order.paymentMethod}</p>
                  <p>{order.totalPrice}</p>
                  {order.items.map((item) => (
                    <div key={item.id}>
                      <p>{item.id}</p>
                      <p>{item.name}</p>
                      <p>{item.color}</p>
                      <p>{item.image}</p>
                      <p>{item.volume}</p>
                      <p>{item.quantity}</p>
                    </div>
                  ))}
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