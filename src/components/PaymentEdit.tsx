import { useAtom } from "jotai"
import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import Swal from "sweetalert2"
import { adminAtom, themeAtom } from "../atoms"
import supabase from "../config/supabaseClient"

import './Admin.css'

type PaymentMethod = {
  id: number,
  name: string,
  price: number,
  available: boolean
}

export const PaymentEdit = () => {
  const { paymentId } = useParams()
  const [theme] = useAtom(themeAtom)
  const [isAdmin] = useAtom(adminAtom)

  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>({
    id: -1,
    name: "Example payment method",
    price: 0.00,
    available: false,
  })

  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [priceString, setPriceString] = useState<string>("");
  const [available, setAvailable] = useState<boolean>(false);
  const [isAvailable, setIsAvailable] = useState<string>("");

  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    setTimeout(scrollToTop, 250)
  }, [])

  useEffect(() => {
    const fetchPaymentMethod = async () => {
      const { data, error } = await supabase
        .from('payment-options')
        .select()
        .eq('id', paymentId)
        .single()

      if (error) {
        console.error(error)
      }

      if (data) {
        setPaymentMethod(data);
        setName(data.name)
        setPrice(data.price)
        setPriceString(data.price.toString())
        setAvailable(data.available)
        setIsAvailable(data.available)
      }
    }

    fetchPaymentMethod();
  }, [paymentId])

  const setPriceHandler = (e: string) => {
    const newPrice = Number(e)
    if (!isNaN(newPrice)) {
      setPrice(newPrice)
      setPriceString(e)
    } else {
      console.error("Invalid price entered")
    }
  }

  const setAvailableHandler = (e: string) => {
    if (e === "true") {
      setIsAvailable("true")
      setAvailable(true)
    } else if (e === "false") {
      setIsAvailable("false")
      setAvailable(false)
    }
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    const properPrice = price.toFixed(2)
    console.log(properPrice)

    let themeBackground
    let themeColor

    if (theme === "light") {
      themeBackground = "#ffffff"
      themeColor = "#000000"
    } else if (theme === "dark") {
      themeBackground = "#000000"
      themeColor = "#ffffff"
    }

    if (!name || price < 0 || available === null || available === undefined) {
      Swal.fire({
        icon: 'error',
        iconColor: '#e71f1f',
        background: `${themeBackground}`,
        color: `${themeColor}`,
        title: `Name can't be empty, price must be at least 0.00, availability must be either true or false!`,
        timer: 5000,
      })
      return
    }

    const { data, error } = await supabase
      .from('payment-options')
      .update({ name, price, available })
      .eq('id', paymentId)
      .select()

    if (error) {
      console.log(error)
    }

    if (data) {
      Swal.fire({
        icon: 'info',
        iconColor: '#f568a9',
        background: `${themeBackground}`,
        color: `${themeColor}`,
        title: `You've succesfully updated payment method!`,
      }).then((result) => {
        if (result.isConfirmed || result.dismiss) {
          navigate('/admin')
        }
      })
    }
  }

  const handleDelete = (e: { preventDefault: () => void }) => {
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

    const deletePaymentMethod = async () => {
      const { data, error } = await supabase
        .from('payment-options')
        .delete()
        .eq('id', paymentId)

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
      title: `Are you sure you want to delete "${paymentMethod.name}" from database? You won't be able to revert this!`,
    }).then((result) => {
      if (result.isConfirmed) {
        deletePaymentMethod()
        navigate('/admin')
      } else {
        return
      }
    })
  }

  return (
    <div className={`admin-page ${theme === "light" ? "light-toned-bg dark-font" : "dark-bg white-font"}`}>
      {isAdmin ?
        <div className={`admin-display ${theme === "light" ? "light-bg black-font" : "dark-toned-bg white-font"}`}>
          <div className="section" style={{ borderTop: "none", paddingTop: "0px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px", alignItems: "center" }}>
              <div id={paymentId} className={`section-single ${theme === "light" ? "light-toned-bg dark-font" : "dark-bg white-font"}`}>
                <header className={theme === "light" ? "light-var-font" : "dark-var-font"}>Before</header>
                <span className={theme === "light" ? "light-var-font" : "dark-var-font"}>Id:</span>
                <span>{paymentMethod.id}</span>
                <span className={theme === "light" ? "light-var-font" : "dark-var-font"}>Name:</span>
                <span>{paymentMethod.name}</span>
                <span className={theme === "light" ? "light-var-font" : "dark-var-font"}>Price:</span>
                <span>{paymentMethod.price}</span>
                <span className={theme === "light" ? "light-var-font" : "dark-var-font"}>Is available:</span>
                <span>{paymentMethod.available ? <span style={{ color: "#3dff3d" }}>&#10003;</span> : <span style={{ color: "#ff3838" }}>&#10007;</span>}</span>
              </div>
              <div id={paymentId} className={`section-single ${theme === "light" ? "light-toned-bg dark-font" : "dark-bg white-font"}`}>
                <header className={theme === "light" ? "light-var-font" : "dark-var-font"}>After</header>
                <span className={theme === "light" ? "light-var-font" : "dark-var-font"}>Id:</span>
                <span>{paymentMethod.id}</span>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "5px" }}>
                  <span className={theme === "light" ? "light-var-font" : "dark-var-font"}>Name:</span>
                  <input className={`admin-input ${theme === "light" ? "light-var-outline" : "dark-var-outline"}`} value={name} type="textbox" onChange={(e) => setName(e.target.value)} />
                  <span className={theme === "light" ? "light-var-font" : "dark-var-font"}>Price:</span>
                  <input className={`admin-input ${theme === "light" ? "light-var-outline" : "dark-var-outline"}`} value={priceString} type="text" onChange={(e) => setPriceHandler(e.target.value)} />
                  <span className={theme === "light" ? "light-var-font" : "dark-var-font"}>Is available:</span>
                  <select style={{ width: "100%", height: "40px" }} className={`admin-input ${theme === "light" ? "light-var-outline" : "dark-var-outline"}`} value={isAvailable} onChange={(e) => setAvailableHandler(e.target.value)}>
                    <option value="" disabled>Choose one</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
              </div>
              <div style={{ display: "flex", gap: "20px" }}>
                <button className={`admin-button ${theme === "light" ? "light-var-bg" : "dark-var-bg"}`} onClick={(e) => handleSubmit(e)}>Save changes</button>
                <button className={`admin-button ${theme === "light" ? "light-var-bg" : "dark-var-bg"}`} onClick={(e) => handleDelete(e)}>Delete payment method</button>
                <Link to="/admin">
                  <button className={`admin-button ${theme === "light" ? "light-var-bg" : "dark-var-bg"}`}>Cancel editing</button>
                </Link>
              </div>
            </div>
          </div>
        </div >
        : <>You shouldn't be here</>}
    </div>
  )
}