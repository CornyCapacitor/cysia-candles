import { useAtom } from "jotai"
import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import Swal from "sweetalert2"
import { adminAtom, themeAtom } from "../atoms"
import supabase from "../config/supabaseClient"

import { useTranslation } from "react-i18next"
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

  const { t } = useTranslation();

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
        title: `${t('payment_edit_swal_error')}!`,
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
        title: `${t('payment_edit_swal_success')}!`,
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
      title: `${t('payment_edit_swal_1')} "${paymentMethod.name}" ${t('payment_edit_swal_2')}!`,
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
                <header className={theme === "light" ? "light-var-font" : "dark-var-font"}>{t('before')}</header>
                <span className={theme === "light" ? "light-var-font" : "dark-var-font"}>Id:</span>
                <span>{paymentMethod.id}</span>
                <span className={theme === "light" ? "light-var-font" : "dark-var-font"}>{t('name')}:</span>
                <span>{paymentMethod.name}</span>
                <span className={theme === "light" ? "light-var-font" : "dark-var-font"}>{t('price')}:</span>
                <span>{paymentMethod.price}</span>
                <span className={theme === "light" ? "light-var-font" : "dark-var-font"}>{t('is_available')}:</span>
                <span>{paymentMethod.available ? <span style={{ color: "#3dff3d" }}>&#10003;</span> : <span style={{ color: "#ff3838" }}>&#10007;</span>}</span>
              </div>
              <div id={paymentId} className={`section-single ${theme === "light" ? "light-toned-bg dark-font" : "dark-bg white-font"}`}>
                <header className={theme === "light" ? "light-var-font" : "dark-var-font"}>{t('after')}</header>
                <span className={theme === "light" ? "light-var-font" : "dark-var-font"}>Id:</span>
                <span>{paymentMethod.id}</span>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "5px" }}>
                  <span className={theme === "light" ? "light-var-font" : "dark-var-font"}>{t('name')}:</span>
                  <input className={`admin-input ${theme === "light" ? "light-var-outline" : "dark-var-outline"}`} value={name} type="textbox" onChange={(e) => setName(e.target.value)} />
                  <span className={theme === "light" ? "light-var-font" : "dark-var-font"}>{t('price')}:</span>
                  <input className={`admin-input ${theme === "light" ? "light-var-outline" : "dark-var-outline"}`} value={priceString} type="text" onChange={(e) => setPriceHandler(e.target.value)} />
                  <span className={theme === "light" ? "light-var-font" : "dark-var-font"}>{t('is_available')}:</span>
                  <select style={{ width: "100%", height: "40px" }} className={`admin-input ${theme === "light" ? "light-var-outline" : "dark-var-outline"}`} value={isAvailable} onChange={(e) => setAvailableHandler(e.target.value)}>
                    <option value="" disabled>{t('choose_one')}</option>
                    <option value="true">{t('yes')}</option>
                    <option value="false">{t('no')}</option>
                  </select>
                </div>
              </div>
              <div style={{ display: "flex", gap: "20px" }}>
                <button className={`admin-button ${theme === "light" ? "light-var-bg" : "dark-var-bg"}`} onClick={(e) => handleSubmit(e)}>{t('save_changes')}</button>
                <button className={`admin-button ${theme === "light" ? "light-var-bg" : "dark-var-bg"}`} onClick={(e) => handleDelete(e)}>{t('delete_payment_method')}</button>
                <Link to="/admin">
                  <button className={`admin-button ${theme === "light" ? "light-var-bg" : "dark-var-bg"}`}>{t('cancel_editing')}</button>
                </Link>
              </div>
            </div>
          </div>
        </div >
        : <>{t('not_an_admin_warn')}</>}
    </div>
  )
}
