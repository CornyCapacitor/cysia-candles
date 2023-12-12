import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { adminAtom, themeAtom } from "../atoms";
import supabase from "../config/supabaseClient";
import './Admin.css';

export const PaymentCreate = () => {
  const [theme] = useAtom(themeAtom)
  const [isAdmin] = useAtom(adminAtom)

  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [priceString, setPriceString] = useState<string>("");
  const [available, setAvailable] = useState<boolean>(false);
  const [isAvailable, setIsAvailable] = useState<string>("");

  const navigate = useNavigate()

  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    setTimeout(scrollToTop, 250)
  }, [])

  const handleCreate = async (e: { preventDefault: () => void }) => {
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

    if (!name || price < 0 || available === true || false) {
      Swal.fire({
        icon: 'error',
        iconColor: '#e71f1f',
        background: `${themeBackground}`,
        color: `${themeColor}`,
        title: `Name can't be empty, price must be at least 0.00, availability must be either "Yes" or "No"!`,
        timer: 5000,
      })
      return
    }

    const { data, error } = await supabase
      .from('payment-options')
      .insert({ name, price, available })
      .select()

    if (data) {
      Swal.fire({
        icon: 'success',
        iconColor: 'green',
        background: `${themeBackground}`,
        color: `${themeColor}`,
        title: "You've succesfully created a new payment method!",
        showConfirmButton: true,
        confirmButtonText: "Ok",
        timer: 5000,
      }).then((result) => {
        if (result.isConfirmed || result.dismiss) {
          navigate('/admin')
        }
      })
    }

    if (error) {
      console.error(error)
    }
  }

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

  return (
    <div className={`admin-page ${theme === "light" ? "light-toned-bg dark-font" : "dark-bg white-font"}`}>
      {isAdmin ?
        <div className={`admin-display ${theme === "light" ? "light-bg black-font" : "dark-toned-bg white-font"}`}>
          <div className="section" style={{ borderTop: "none", paddingTop: "0px" }}>
            <div className={`section-single ${theme === "light" ? "light-toned-bg dark-font" : "dark-bg white-font"}`}>
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
            <div className={`section-single ${theme === "light" ? "light-toned-bg dark-font" : "dark-bg white-font"}`}>
              <header className={theme === "light" ? "light-var-font" : "dark-var-font"}>Preview</header>
              <span className={theme === "light" ? "light-var-font" : "dark-var-font"}>Name:</span>
              <span>{name}</span>
              <span className={theme === "light" ? "light-var-font" : "dark-var-font"}>Price:</span>
              <span>{Number(priceString).toFixed(2)} PLN</span>
              <span className={theme === "light" ? "light-var-font" : "dark-var-font"}>Is available:</span>
              <span>{available ? <span style={{ color: "#3dff3d" }}>&#10003;</span> : <span style={{ color: "#ff3838" }}>&#10007;</span>}</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <button style={{ height: "60px" }} className={`admin-button ${theme === "light" ? "light-var-bg" : "dark-var-bg"}`} onClick={(e) => handleCreate(e)}>Add new payment method</button>
            <Link to="/admin">
              <button className={`admin-button ${theme === "light" ? "light-var-bg" : "dark-var-bg"}`}>Cancel creating</button>
            </Link>
          </div>
        </div>
        : <>You shouldn't be here</>}
    </div>
  )
}