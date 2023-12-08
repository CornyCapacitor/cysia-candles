import { useAtom } from "jotai"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
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

  const deleteOrder = (orderId: number) => {
    console.log("Deleting order with id " + orderId)
  }

  const deleteQuestion = (questionId: number) => {
    console.log("Deleting question with id " + questionId)
  }

  const candleEdit = (id: number) => {
    console.log(`Editing ${candles[id - 1].name} candle with id ${id}`)
  }

  const createNewCandle = () => {
    console.log("Creating new candle!")
  }

  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    setTimeout(scrollToTop, 250)
  }, [])

  return (
    <div className={`admin-page ${theme === "light" ? "light-toned-bg dark-font" : "dark-bg white-font"}`}>
      {!isAdmin ?
        <div className="auth-container">
          <span className={`auth-info ${theme === "light" ? "light-bg black-font" : "dark-toned-bg white-font"}`}>You probably shouldn't be here. If you should, please type correct password to proceed. Otherwise, you'll be sent to home page.</span>
          <input className={`auth-input ${theme === "light" ? "light-var-outline" : "dark-var-outline"}`} type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className={`admin-button ${theme === "light" ? "light-var-bg" : "dark-var-bg"}`} onClick={() => validate()}>Validate</button>
        </div>
        :
        <div className={`admin-display ${theme === "light" ? "light-bg black-font" : "dark-toned-bg white-font"}`}>
          <></>
          <button className={`admin-button ${theme === "light" ? "light-var-bg" : "dark-var-bg"}`} onClick={() => getCandles()}>Manage candles</button>
          {candles.length > 0 ?
            <section className="section">
              {candles.map((candle) => (
                <div key={candle.id} className={`section-single ${theme === "light" ? "light-toned-bg dark-font" : "dark-bg white-font"}`}>
                  <header className={theme === "light" ? "light-var-font" : "dark-var-font"}>{candle.name}</header>
                  <img className="admin-candle-image" src={`${candle.image}`} />
                  <Link to={'/admin/' + candle.id}>
                    <button className={`admin-button ${theme === "light" ? "light-var-bg" : "dark-var-bg"}`} style={{ alignSelf: "center" }} onClick={() => candleEdit(candle.id)}>Edit candle</button>
                  </Link>
                </div>
              ))}
              <div className={`section-single ${theme === "light" ? "light-toned-bg dark-font" : "dark-bg white-font"}`}>
                <header className={theme === "light" ? "light-var-font" : "dark-var-font"}>Create new candle</header>
                <img className="admin-candle-image" src={theme === "light" ? "/black-circled-question-mark.svg" : "/white-circled-question-mark.svg"} />
                <Link to="/admin/create">
                  <button className={`admin-button ${theme === "light" ? "light-var-bg" : "dark-var-bg"}`} style={{ alignSelf: "center" }} onClick={() => createNewCandle()}>Create</button>
                </Link>
              </div>
            </section>
            : <></>}
          <button className={`admin-button ${theme === "light" ? "light-var-bg" : "dark-var-bg"}`} onClick={() => getQuestions()}>Show questions</button>
          {questions.length > 0 ?
            <section className="section">
              {questions.map((question) => (
                <div key={question.id} className={`section-single ${theme === "light" ? "light-toned-bg dark-font" : "dark-bg white-font"}`}>
                  <header className={theme === "light" ? "light-var-font" : "dark-var-font"}>{question.id}</header>
                  <div className="single-order-details">
                    <header className={theme === "light" ? "light-var-font" : "dark-var-font"}>Date:</header>
                    <span>{cleanDate(question.created_at)}</span>
                    <header className={theme === "light" ? "light-var-font" : "dark-var-font"}>Email adress:</header>
                    <span>{question.email}</span>
                    <header className={theme === "light" ? "light-var-font" : "dark-var-font"}>Topic:</header>
                    <span>{question.topic}</span>
                    <header className={theme === "light" ? "light-var-font" : "dark-var-font"}>Comment:</header>
                    <span>{question.comment}</span>
                    <button className={`admin-button ${theme === "light" ? "light-var-bg" : "dark-var-bg"}`} style={{ alignSelf: "center" }} onClick={() => deleteQuestion(question.id)}>Delete question</button>
                  </div>
                </div>
              ))}
            </section>
            : <></>}
          <button className={`admin-button ${theme === "light" ? "light-var-bg" : "dark-var-bg"}`} onClick={() => getOrders()}>Show orders</button>
          {orders.length > 0 ?
            <section className="section">
              {orders.map((order) => (
                <div className={`section-single ${theme === "light" ? "light-toned-bg dark-font" : "dark-bg white-font"}`} key={order.id}>
                  <header className={theme === "light" ? "light-var-font" : "dark-var-font"}>{order.id} ({order.customerType === "private-person" ? `Person` : `Company`}) </header>
                  <div className="single-order-details">
                    <header className={theme === "light" ? "light-var-font" : "dark-var-font"}>Date:</header>
                    <span>{cleanDate(order.created_at)}</span>
                    <header className={theme === "light" ? "light-var-font" : "dark-var-font"}>{order.customerType === "private-person" ? "Customer name:" : "Company name"}</header>
                    <span>{order.customerType === "private-person" ? `${order.customerName}` : `${order.companyName}`}</span>
                    <header className={theme === "light" ? "light-var-font" : "dark-var-font"}>{order.customerType === "private-person" ? "Second name:" : "Company number"}</header>
                    <span>{order.customerType === "private-person" ? `${order.customerSecondName}` : `${order.companyNumber}`}</span>
                    <header className={theme === "light" ? "light-var-font" : "dark-var-font"}>Wants invoice?</header>
                    <span>{order.invoice ? `Yes` : `No`}</span>
                    <header className={theme === "light" ? "light-var-font" : "dark-var-font"}>Street name:</header>
                    <span>{order.streetName}</span>
                    <header className={theme === "light" ? "light-var-font" : "dark-var-font"}>House number:</header>
                    <span>{order.houseNumber}</span>
                    <header className={theme === "light" ? "light-var-font" : "dark-var-font"}>Apartment number:</header>
                    <span>{order.apartmentValue !== "0" ? `${order.apartmentValue}` : `-`}</span>
                    <header className={theme === "light" ? "light-var-font" : "dark-var-font"}>Country:</header>
                    <span>{order.country}</span>
                    <header className={theme === "light" ? "light-var-font" : "dark-var-font"}>City:</header>
                    <span>{order.city}</span>
                    <header className={theme === "light" ? "light-var-font" : "dark-var-font"}>Zip code:</header>
                    <span>{order.zipCode}</span>
                    <header className={theme === "light" ? "light-var-font" : "dark-var-font"}>Phone number:</header>
                    <span>{order.phoneNumber}</span>
                    <header className={theme === "light" ? "light-var-font" : "dark-var-font"}>Email adress:</header>
                    <span>{order.email}</span>
                    <header className={theme === "light" ? "light-var-font" : "dark-var-font"}>Comments:</header>
                    <span>{order.comments ? `${order.comments}` : `-`}</span>
                    <header className={theme === "light" ? "light-var-font" : "dark-var-font"}>Delivery type:</header>
                    <span>{order.deliveryType}</span>
                    <header className={theme === "light" ? "light-var-font" : "dark-var-font"}>Payment method:</header>
                    <span>{order.paymentMethod}</span>
                    <header className={theme === "light" ? "light-var-font" : "dark-var-font"}>Items:</header>
                    <div className="single-order-item">
                      <span className="item-detail">Smell:</span>
                      <span className="item-detail">Color:</span>
                      <span className="item-detail">Volume:</span>
                      <span className="item-detail">Quantity:</span>
                    </div>
                    {order.items.map((item) => (
                      <div className="single-order-item" key={item.id}>
                        <span className="item-detail">{item.name}</span>
                        <span className="item-detail">{item.color}</span>
                        <span className="item-detail">{item.volume}</span>
                        <span className="item-detail">{item.quantity}</span>
                      </div>
                    ))}
                    <header className={theme === "light" ? "light-var-font" : "dark-var-font"}>Total price:</header>
                    <span>{order.totalPrice} PLN</span>
                    <button className={`admin-button ${theme === "light" ? "light-var-bg" : "dark-var-bg"}`} style={{ alignSelf: "center" }} onClick={() => deleteOrder(order.id)}>Delete order</button>
                  </div>
                </div>
              ))}
            </section>
            : <></>}
        </div>
      }
      {isAdmin ?
        <button onClick={() => setIsAdmin(false)}>Log out</button>
        : <></>}
    </div>
  )
}