import { useAtom } from "jotai"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { themeAtom } from "../atoms"
import './Admin.css'

export const Admin = () => {
  const [theme] = useAtom(themeAtom)
  const [pagePassword] = useState<string>("adminos")
  const [password, setPassword] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const navigate = useNavigate()

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
          <button className={`auth-button ${theme === "light" ? "light-var-bg" : "dark-var-bg"}`} onClick={() => validate()}>Validate</button>
        </div>
        :
        <div className={`admin-display ${theme === "light" ? "light-bg black-font" : "dark-toned-bg white-font"}`}>
          <span>Welcome to admin page!</span>
          <button>Manage candles</button>
          <button>Show questions</button>
          <button>Show orders</button>
        </div>
      }
    </div>
  )
}