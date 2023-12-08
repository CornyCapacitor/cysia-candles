import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { adminAtom, themeAtom } from "../atoms";
import supabase from "../config/supabaseClient";
import './Admin.css';

export const CandleCreate = () => {
  const [theme] = useAtom(themeAtom)
  const [isAdmin] = useAtom(adminAtom)

  const [name, setName] = useState<string>("");
  const [image, setImage] = useState<string>("");

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

    if (!name || !image) {
      Swal.fire({
        icon: 'error',
        iconColor: '#e71f1f',
        background: `${themeBackground}`,
        color: `${themeColor}`,
        title: `Name and image cannot be empty!`,
        timer: 5000,
      })
      return
    }

    const { data, error } = await supabase
      .from('candles')
      .insert({ name, image })
      .select()

    if (data) {
      Swal.fire({
        icon: 'success',
        iconColor: 'green',
        background: `${themeBackground}`,
        color: `${themeColor}`,
        title: "You've succesfully created a new candle!",
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

  return (
    <div className={`admin-page ${theme === "light" ? "light-toned-bg dark-font" : "dark-bg white-font"}`}>
      {isAdmin ?
        <div className={`admin-display ${theme === "light" ? "light-bg black-font" : "dark-toned-bg white-font"}`}>
          <div className="section" style={{ borderTop: "none", paddingTop: "0px" }}>
            <div className={`section-single ${theme === "light" ? "light-toned-bg dark-font" : "dark-bg white-font"}`} style={{ gap: "5px" }}>
              <span className={theme === "light" ? "light-var-font" : "dark-var-font"}>Name:</span>
              <input className={`admin-input ${theme === "light" ? "light-var-outline" : "dark-var-outline"}`} value={name} type="textbox" onChange={(e) => setName(e.target.value)} />
              <span className={theme === "light" ? "light-var-font" : "dark-var-font"}>Image path:</span>
              <input className={`admin-input ${theme === "light" ? "light-var-outline" : "dark-var-outline"}`} value={image} type="textbox" onChange={(e) => setImage(e.target.value)} />
              <span></span>
            </div>
            <div className={`section-single ${theme === "light" ? "light-toned-bg dark-font" : "dark-bg white-font"}`} style={{ alignSelf: "center" }}>
              <header className={theme === "light" ? "light-var-font" : "dark-var-font"}>Image display:</header>
              <img className="admin-candle-image" src={`/${image}`} />
            </div>
          </div>
          <div style={{ display: "flex", gap: "20px" }}>
            <button className={`admin-button ${theme === "light" ? "light-var-bg" : "dark-var-bg"}`} onClick={(e) => handleCreate(e)}>Add new candle</button>
            <Link to="/admin">
              <button className={`admin-button ${theme === "light" ? "light-var-bg" : "dark-var-bg"}`}>Cancel creating</button>
            </Link>
          </div>
        </div>
        : <>You shouldn't be here</>}
    </div>
  )
}