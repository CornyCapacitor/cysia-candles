import { useAtom } from "jotai"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { Link, useNavigate, useParams } from "react-router-dom"
import Swal from "sweetalert2"
import { adminAtom, themeAtom } from "../atoms"
import supabase from "../config/supabaseClient"
import './Admin.css'

type Candle = {
  id: number,
  name: string,
  image: string
}

export const CandleEdit = () => {
  const { candleId } = useParams()
  const [theme] = useAtom(themeAtom)
  const [isAdmin] = useAtom(adminAtom)

  const { t } = useTranslation();

  const [candle, setCandle] = useState<Candle>({
    id: -1,
    name: "Example name",
    image: "candle-placeholder.svg",
  });

  const [name, setName] = useState<string>("");
  const [image, setImage] = useState<string>("");

  const navigate = useNavigate()

  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    setTimeout(scrollToTop, 250)
  }, [])

  useEffect(() => {
    const fetchCandle = async () => {
      const { data, error } = await supabase
        .from('candles')
        .select()
        .eq('id', candleId)
        .single()

      if (error) {
        console.error(error)
      }

      if (data) {
        setCandle(data);
        setName(data.name)
        setImage(data.image)
      }
    }

    fetchCandle();
  }, [candleId])

  const handleSubmit = async (e: { preventDefault: () => void }) => {
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
        title: `${t('edit_candle_swal_error')}!`,
        timer: 5000,
      })
      return
    }

    const { data, error } = await supabase
      .from('candles')
      .update({ name, image })
      .eq('id', candleId)
      .select()

    if (error) {
      console.error(error)
    }

    if (data) {
      Swal.fire({
        icon: 'info',
        iconColor: '#f568a9',
        background: `${themeBackground}`,
        color: `${themeColor}`,
        title: `${t('edit_candle_swal_success')}!`,
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

    const deleteCandle = async () => {
      const { data, error } = await supabase
        .from('candles')
        .delete()
        .eq('id', candleId)

      if (data) {
        return data
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
      title: `${t('edit_candle_swal_1')} "${candle.name}" ${t('edit_candle_swal_2')}!`,
    }).then((result) => {
      if (result.isConfirmed) {
        deleteCandle()
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
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div id={candleId} className={`section-single ${theme === "light" ? "light-toned-bg dark-font" : "dark-bg white-font"}`}>
                <header className={theme === "light" ? "light-var-font" : "dark-var-font"}>{t('before')}</header>
                <span className={theme === "light" ? "light-var-font" : "dark-var-font"}>Id:</span>
                <span>{candle.id}</span>
                <span className={theme === "light" ? "light-var-font" : "dark-var-font"}>{t('name')}:</span>
                <span>{candle.name}</span>
                <span className={theme === "light" ? "light-var-font" : "dark-var-font"}>{t('image_path')}:</span>
                <span>{candle.image}</span>
                <span></span>
              </div>
              <div id={candleId} className={`section-single ${theme === "light" ? "light-toned-bg dark-font" : "dark-bg white-font"}`}>
                <header className={theme === "light" ? "light-var-font" : "dark-var-font"}>{t('after')}</header>
                <span className={theme === "light" ? "light-var-font" : "dark-var-font"}>Id:</span>
                <span>{candle.id}</span>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "5px" }}>
                  <span className={theme === "light" ? "light-var-font" : "dark-var-font"}>{t('name')}:</span>
                  <input className={`admin-input ${theme === "light" ? "light-var-outline" : "dark-var-outline"}`} value={name} type="textbox" onChange={(e) => setName(e.target.value)} />
                  <span className={theme === "light" ? "light-var-font" : "dark-var-font"}>{t("image_path")}:</span>
                  <input className={`admin-input ${theme === "light" ? "light-var-outline" : "dark-var-outline"}`} value={image} type="textbox" onChange={(e) => setImage(e.target.value)} />
                </div>
              </div>
            </div>
            <div id={candleId} className={`section-single ${theme === "light" ? "light-toned-bg dark-font" : "dark-bg white-font"}`} style={{ alignSelf: "center" }}>
              <header className={theme === "light" ? "light-var-font" : "dark-var-font"}>{t('image_display')}:</header>
              <img className="admin-candle-image" src={`/${image}`} />
            </div>
          </div>
          <div style={{ display: "flex", gap: "20px" }}>
            <button className={`admin-button ${theme === "light" ? "light-var-bg" : "dark-var-bg"}`} onClick={(e) => handleSubmit(e)}>{t('save_changes')}</button>
            <button className={`admin-button ${theme === "light" ? "light-var-bg" : "dark-var-bg"}`} onClick={(e) => handleDelete(e)}>{t('delete_candle')}</button>
            <Link to="/admin">
              <button className={`admin-button ${theme === "light" ? "light-var-bg" : "dark-var-bg"}`}>{t('cancel_editing')}</button>
            </Link>
          </div>
        </div>
        : <>{t('not_an_admin_warn')}</>}
    </div>
  )
}