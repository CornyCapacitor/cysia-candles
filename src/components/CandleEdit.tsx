import { useAtom } from "jotai"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { themeAtom } from "../atoms"
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
  const [candle, setCandle] = useState<Candle>({
    id: -1,
    name: "Example name",
    image: "candle-placeholder.svg",
  });

  const [name, setName] = useState<string>("");
  const [image, setImage] = useState<string>("");

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

    if (!name || !image) {
      console.error("Inputs cant be empty")
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
      console.log("Popup")
    }
  }

  return (
    <div className={`admin-page ${theme === "light" ? "light-toned-bg dark-font" : "dark-bg white-font"}`}>
      <div className={`admin-display ${theme === "light" ? "light-bg black-font" : "dark-toned-bg white-font"}`}>
        <div className="section" style={{ borderTop: "none", paddingTop: "0px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div id={candleId} className={`section-single ${theme === "light" ? "light-toned-bg dark-font" : "dark-bg white-font"}`}>
              <header className={theme === "light" ? "light-var-font" : "dark-var-font"}>Before</header>
              <span className={theme === "light" ? "light-var-font" : "dark-var-font"}>Id:</span>
              <span>{candle.id}</span>
              <span className={theme === "light" ? "light-var-font" : "dark-var-font"}>Name:</span>
              <span>{candle.name}</span>
              <span className={theme === "light" ? "light-var-font" : "dark-var-font"}>Image path:</span>
              <span>{candle.image}</span>
              <span></span>
            </div>
            <div id={candleId} className={`section-single ${theme === "light" ? "light-toned-bg dark-font" : "dark-bg white-font"}`}>
              <header className={theme === "light" ? "light-var-font" : "dark-var-font"}>After</header>
              <span className={theme === "light" ? "light-var-font" : "dark-var-font"}>Id:</span>
              <span>{candle.id}</span>
              <span className={theme === "light" ? "light-var-font" : "dark-var-font"}>Name:</span>
              <input value={name} type="textbox" onChange={(e) => setName(e.target.value)} />
              <span className={theme === "light" ? "light-var-font" : "dark-var-font"}>Image path:</span>
              <input value={image} type="textbox" onChange={(e) => setImage(e.target.value)} />
              <span></span>
            </div>
          </div>
          <div id={candleId} className={`section-single ${theme === "light" ? "light-toned-bg dark-font" : "dark-bg white-font"}`} style={{ alignSelf: "center" }}>
            <header className={theme === "light" ? "light-var-font" : "dark-var-font"}>Image display:</header>
            <img className="admin-candle-image" src={`/${candle.image}`} />
          </div>
        </div>
        <div style={{ display: "flex", gap: "20px" }}>
          <button className={`admin-button ${theme === "light" ? "light-var-bg" : "dark-var-bg"}`} onClick={(e) => handleSubmit(e)}>Save changes</button>
          <Link to="/admin">
            <button className={`admin-button ${theme === "light" ? "light-var-bg" : "dark-var-bg"}`}>Cancel editing</button>
          </Link>
        </div>
      </div>
    </div>
  )
}