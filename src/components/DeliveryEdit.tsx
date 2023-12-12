import { useAtom } from "jotai"
import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import Swal from "sweetalert2"
import { adminAtom, themeAtom } from "../atoms"
import supabase from "../config/supabaseClient"

import './Admin.css'

type DeliveryType = {
  id: number,
  name: string,
  price: number,
  estimatedTime: string,
  available: boolean
}

export const DeliveryEdit = () => {
  const { deliveryId } = useParams()
  const [theme] = useAtom(themeAtom)
  const [isAdmin] = useAtom(adminAtom)

  const navigate = useNavigate();

  const [deliveryType, setDeliveryType] = useState<DeliveryType>({
    id: -1,
    name: "Example delivery type",
    price: 0.00,
    estimatedTime: "0 days",
    available: false,
  })

  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [priceString, setPriceString] = useState<string>("");
  const [estimatedTime, setEstimatedTime] = useState<string>("");
  const [available, setAvailable] = useState<boolean>(false);
  const [isAvailable, setIsAvailable] = useState<string>("");

  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    setTimeout(scrollToTop, 250)
  }, [])

  useEffect(() => {
    const fetchDeliveryType = async () => {
      const { data, error } = await supabase
        .from('delivery-options')
        .select()
        .eq('id', deliveryId)
        .single()

      if (error) {
        console.error(error)
      }

      if (data) {
        setDeliveryType(data);
        setName(data.name)
        setPrice(data.price)
        setPriceString(data.price.toString())
        setEstimatedTime(data.estimatedTime)
        setAvailable(data.available)
        setIsAvailable(data.available)
      }
    }

    fetchDeliveryType();
  }, [deliveryId])

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

    if (!name || price < 0 || !estimatedTime || available === null || available === undefined) {
      Swal.fire({
        icon: 'error',
        iconColor: '#e71f1f',
        background: `${themeBackground}`,
        color: `${themeColor}`,
        title: `Name can't be empty, price must be at least 0.00, estimated time can't be empty, availability must be either true or false!`,
        timer: 5000,
      })
      return
    }

    const { data, error } = await supabase
      .from('delivery-options')
      .update({ name, price, estimatedTime, available })
      .eq('id', deliveryId)
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
        title: `You've succesfully updated delivery type!`,
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

    const deleteDeliveryType = async () => {
      const { data, error } = await supabase
        .from('delivery-options')
        .delete()
        .eq('id', deliveryId)

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
      title: `Are you sure you want to delete "${deliveryType.name}" from database? You won't be able to revert this!`,
    }).then((result) => {
      if (result.isConfirmed) {
        deleteDeliveryType()
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
              <div id={deliveryId} className={`section-single ${theme === "light" ? "light-toned-bg dark-font" : "dark-bg white-font"}`}>
                <header className={theme === "light" ? "light-var-font" : "dark-var-font"}>Before</header>
                <span className={theme === "light" ? "light-var-font" : "dark-var-font"}>Id:</span>
                <span>{deliveryType.id}</span>
                <span className={theme === "light" ? "light-var-font" : "dark-var-font"}>Name:</span>
                <span>{deliveryType.name}</span>
                <span className={theme === "light" ? "light-var-font" : "dark-var-font"}>Price:</span>
                <span>{deliveryType.price}</span>
                <span className={theme === "light" ? "light-var-font" : "dark-var-font"}>Is available:</span>
                <span>{deliveryType.available ? <span style={{ color: "#3dff3d" }}>&#10003;</span> : <span style={{ color: "#ff3838" }}>&#10007;</span>}</span>
              </div>
              <div id={deliveryId} className={`section-single ${theme === "light" ? "light-toned-bg dark-font" : "dark-bg white-font"}`}>
                <header className={theme === "light" ? "light-var-font" : "dark-var-font"}>After</header>
                <span className={theme === "light" ? "light-var-font" : "dark-var-font"}>Id:</span>
                <span>{deliveryType.id}</span>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "5px" }}>
                  <span className={theme === "light" ? "light-var-font" : "dark-var-font"}>Name:</span>
                  <input className={`admin-input ${theme === "light" ? "light-var-outline" : "dark-var-outline"}`} value={name} type="textbox" onChange={(e) => setName(e.target.value)} />
                  <span className={theme === "light" ? "light-var-font" : "dark-var-font"}>Price:</span>
                  <input className={`admin-input ${theme === "light" ? "light-var-outline" : "dark-var-outline"}`} value={priceString} type="text" onChange={(e) => setPriceHandler(e.target.value)} />
                  <span className={theme === "light" ? "light-var-font" : "dark-var-font"}>Estimated time:</span>
                  <input className={`admin-input ${theme === "light" ? "light-var-outline" : "dark-var-outline"}`} value={estimatedTime} type="text" onChange={(e) => setEstimatedTime(e.target.value)} />
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
                <button className={`admin-button ${theme === "light" ? "light-var-bg" : "dark-var-bg"}`} onClick={(e) => handleDelete(e)}>Delete delivery type</button>
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