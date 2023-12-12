import { useAtom } from "jotai"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import { adminAtom, themeAtom } from "../atoms"
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

type PaymentMethod = {
  id: number,
  name: string,
  price: number,
  available: boolean,
}

type DeliveryType = {
  id: number,
  name: string,
  estimatedTime: string,
  price: number,
  available: boolean,
}

export const Admin = () => {
  const [theme] = useAtom(themeAtom)
  const navigate = useNavigate()

  // Auth states
  const [pagePassword] = useState<string>("adminos")
  const [password, setPassword] = useState<string>("");
  const [isAdmin, setIsAdmin] = useAtom(adminAtom);

  // Management states
  const [candles, setCandles] = useState<Candle[]>([]);
  const [showCandles, setShowCandles] = useState<boolean>(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showQuestions, setShowQuestions] = useState<boolean>(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [showOrders, setShowOrders] = useState<boolean>(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [showPaymentMethods, setShowPaymentMethods] = useState<boolean>(false);
  const [deliveryTypes, setDeliveryTypes] = useState<DeliveryType[]>([]);
  const [showDeliveryTypes, setShowDeliveryTypes] = useState<boolean>(false);

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

  const getDeliveryTypes = () => {
    if (deliveryTypes.length === 0) {
      const fetchDeliveryTypes = async () => {
        const { data, error } = await supabase.from('delivery-options').select();

        if (error) {
          console.error(error);
        }

        if (data) {
          setDeliveryTypes(data);
        }
      };

      fetchDeliveryTypes();
    } else {
      setDeliveryTypes([])
    }
  }

  const getPaymentMethods = () => {
    if (paymentMethods.length === 0) {
      const fetchPaymentMethods = async () => {
        const { data, error } = await supabase.from('payment-options').select();

        if (error) {
          console.error(error);
        }

        if (data) {
          setPaymentMethods(data);
        }
      };

      fetchPaymentMethods();
    } else {
      setPaymentMethods([])
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

  const validate = () => {
    if (pagePassword === password) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
      navigate('/')
    }
  }

  const deleteQuestion = (e: { preventDefault: () => void }, id: number) => {
    e.preventDefault()

    let themeBackground
    let themeColor

    if (theme === "light") {
      themeBackground = "#ffffff"
      themeColor = "#000000"
    } else if (theme === "dark") {
      themeBackground = "#000000"
      themeColor = "#ffffff"
    }

    const deleteQuestion = async () => {
      const { data, error } = await supabase
        .from('contact')
        .delete()
        .eq('id', id)

      if (data) {
        console.log(data)
      }

      if (error) {
        console.error(error)
      }
    }

    Swal.fire({
      icon: 'info',
      iconColor: '#f568a9',
      background: `${themeBackground}`,
      color: `${themeColor}`,
      confirmButtonText: "Proceed",
      title: `Are you sure you want to delete "Question ${id}" from database? You won't be able to revert this!`,
    }).then((result) => {
      if (result.isConfirmed) {
        deleteQuestion()
        setQuestions([])
        Swal.fire(`Succesfully deleted "Question ${id}"`)
        return
      } else {
        return
      }
    })
  }

  const deleteOrder = (e: { preventDefault: () => void }, id: number) => {
    e.preventDefault()

    let themeBackground
    let themeColor

    if (theme === "light") {
      themeBackground = "#ffffff"
      themeColor = "#000000"
    } else if (theme === "dark") {
      themeBackground = "#000000"
      themeColor = "#ffffff"
    }

    const deleteOrder = async () => {
      const { data, error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id)

      if (data) {
        console.log(data)
      }

      if (error) {
        console.error(error)
      }
    }

    Swal.fire({
      icon: 'info',
      iconColor: '#f568a9',
      background: `${themeBackground}`,
      color: `${themeColor}`,
      confirmButtonText: "Proceed",
      title: `Are you sure you want to delete "Order ${id}" from database? You won't be able to revert this!`,
    }).then((result) => {
      if (result.isConfirmed) {
        deleteOrder()
        setOrders([])
        Swal.fire(`Succesfully deleted "Order ${id}"`)
        return
      } else {
        return
      }
    })
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

    getCandles();
    getQuestions();
    getOrders();
    getPaymentMethods();
    getDeliveryTypes();

    setTimeout(scrollToTop, 250)
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          <button className={`admin-button ${theme === "light" ? "light-var-bg" : "dark-var-bg"}`} onClick={() => setShowCandles(!showCandles)}>{showCandles ? "Hide candles" : "Show candles"}</button>
          {showCandles === true ?
            <section className="section">
              <div className={`section-single ${theme === "light" ? "light-toned-bg dark-font" : "dark-bg white-font"}`}>
                <header className={theme === "light" ? "light-var-font" : "dark-var-font"}>Create new candle</header>
                <img className="admin-candle-image" src={theme === "light" ? "/black-circled-question-mark.svg" : "/white-circled-question-mark.svg"} />
                <Link to="/admin/create">
                  <button className={`admin-button ${theme === "light" ? "light-var-bg" : "dark-var-bg"}`} style={{ alignSelf: "center" }} onClick={() => createNewCandle()}>Create</button>
                </Link>
              </div>
              {candles.map((candle) => (
                <div key={candle.id} className={`section-single ${theme === "light" ? "light-toned-bg dark-font" : "dark-bg white-font"}`}>
                  <header className={theme === "light" ? "light-var-font" : "dark-var-font"}>{candle.name}</header>
                  <img className="admin-candle-image" src={`${candle.image}`} />
                  <Link to={'/admin/candle/' + candle.id}>
                    <button className={`admin-button ${theme === "light" ? "light-var-bg" : "dark-var-bg"}`} style={{ alignSelf: "center" }} onClick={() => candleEdit(candle.id)}>Edit candle</button>
                  </Link>
                </div>
              ))}
            </section>
            : <></>}
          <button className={`admin-button ${theme === "light" ? "light-var-bg" : "dark-var-bg"}`} onClick={() => setShowQuestions(!showQuestions)}>{showQuestions ? "Hide questions" : "Show questions"}</button>
          {showQuestions === true ?
            <section className="section">
              {questions.length > 0 ?
                <>
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
                        <button className={`admin-button ${theme === "light" ? "light-var-bg" : "dark-var-bg"}`} style={{ alignSelf: "center" }} onClick={(e) => deleteQuestion(e, question.id)}>Delete question</button>
                      </div>
                    </div>
                  ))}
                </> : <span>You don't have any new question</span>}
            </section>
            : <></>}
          <button className={`admin-button ${theme === "light" ? "light-var-bg" : "dark-var-bg"}`} onClick={() => setShowOrders(!showOrders)}>{showOrders ? "Hide orders" : "Show orders"}</button>
          {showOrders === true ?
            <section className="section">
              {orders.length > 0 ?
                <>
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
                            <span className="item-detail" style={{ backgroundColor: `${item.color}`, color: `${item.color}`, border: "solid 1px black" }}>{item.color}</span>
                            <span className="item-detail">{item.volume}</span>
                            <span className="item-detail">{item.quantity}</span>
                          </div>
                        ))}
                        <header className={theme === "light" ? "light-var-font" : "dark-var-font"}>Total price:</header>
                        <span>{order.totalPrice} PLN</span>
                        <button className={`admin-button ${theme === "light" ? "light-var-bg" : "dark-var-bg"}`} style={{ alignSelf: "center" }} onClick={(e) => deleteOrder(e, order.id)}>Delete order</button>
                      </div>
                    </div>
                  ))}
                </> : <span>You don't have any new orders</span>}
            </section>
            : <></>}
          <button className={`admin-button ${theme === "light" ? "light-var-bg" : "dark-var-bg"}`} onClick={() => setShowPaymentMethods(!showPaymentMethods)}>{showPaymentMethods ? "Hide payment methods" : "Show payment methods"}</button>
          {showPaymentMethods === true ?
            <section style={{ width: "100%" }} className="section">
              {paymentMethods.length > 0 ?
                <section className="section">
                  {paymentMethods.map((method) => (
                    <div className={`section-single ${theme === "light" ? "light-toned-bg dark-font" : "dark-bg white-font"}`} key={method.id}>
                      <header className={theme === "light" ? "light-var-font" : "dark-var-font"}>Name:</header>
                      <span>{method.name}</span>
                      <header className={theme === "light" ? "light-var-font" : "dark-var-font"}>Price:</header>
                      <span>{method.price}</span>
                      <header className={theme === "light" ? "light-var-font" : "dark-var-font"}>Is available:</header>
                      <span>{method.available ? <span style={{ color: "#3dff3d" }}>&#10003;</span> : <span style={{ color: "#ff3838" }}>&#10007;</span>}</span>
                      <Link to={'/admin/payment/' + method.id}>
                        <button style={{ marginTop: "10px" }} className={`admin-button ${theme === "light" ? "light-var-bg" : "dark-var-bg"}`} >Edit</button>
                      </Link>
                    </div>
                  ))}
                </section> : <span>Failed to load payment methods</span>}
            </section>
            : <></>}
          <button className={`admin-button ${theme === "light" ? "light-var-bg" : "dark-var-bg"}`} onClick={() => setShowDeliveryTypes(!showDeliveryTypes)}>{showDeliveryTypes ? "Hide delivery types" : "Show delivery types"}</button>
          {showDeliveryTypes === true ?
            <section style={{ width: "100%" }} className="section">
              {deliveryTypes.length > 0 ?
                <section className="section">
                  {deliveryTypes.map((delivery) => (
                    <div className={`section-single ${theme === "light" ? "light-toned-bg dark-font" : "dark-bg white-font"}`} key={delivery.id}>
                      <header className={theme === "light" ? "light-var-font" : "dark-var-font"}>Name:</header>
                      <span>{delivery.name}</span>
                      <header className={theme === "light" ? "light-var-font" : "dark-var-font"}>Price:</header>
                      <span>{delivery.price}</span>
                      <header className={theme === "light" ? "light-var-font" : "dark-var-font"}>Estimated time:</header>
                      <span>{delivery.estimatedTime}</span>
                      <header className={theme === "light" ? "light-var-font" : "dark-var-font"}>Is available:</header>
                      <span>{delivery.available ? <span style={{ color: "#3dff3d" }}>&#10003;</span> : <span style={{ color: "#ff3838" }}>&#10007;</span>}</span>
                      <Link to={'/admin/delivery/' + delivery.id}>
                        <button style={{ marginTop: "10px" }} className={`admin-button ${theme === "light" ? "light-var-bg" : "dark-var-bg"}`} >Edit</button>
                      </Link>
                    </div>
                  ))}
                </section> : <span>Failed to load delivery types</span>}
            </section>
            : <></>}
        </div >
      }
      {
        isAdmin ?
          <button onClick={() => setIsAdmin(false)}>Log out</button>
          : <></>
      }
    </div >
  )
}