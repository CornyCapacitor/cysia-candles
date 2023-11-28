import { useEffect, useState } from 'react';
import './Checkout.css';

// type Form = {
//   customerType: string,
//   customerName: string,
//   customerSecondName: string,
//   customerNumber: "";
//   street: string,
//   houseNumber: number,
//   apartmentNumber: number,
//   city: string,
//   zipCode: string,
//   country: string,
//   phoneNumber: string | "",
//   email: string | "",
//   comments: string,
//   newsletter: boolean,
//   promotionAlerts: boolean,
//   rules: boolean
// }

export const Checkout = () => {
  const [customerType, setCustomerType] = useState<string>("private-person");
  const [customerName, setCustomerName] = useState<string>("");
  const [customerSecondName, setCustomerSecondName] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");
  const [companyNumber, setCompanyNumber] = useState<string>("");
  const [invoice, setInvoice] = useState<boolean>(false);
  const [streetName, setStreetName] = useState<string>("");
  const [houseNumber, setHouseNumber] = useState<string>("");
  const [apartmentValue, setApartmentValue] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [zipCode, setZipCode] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [comments, setComments] = useState<string>("");

  useEffect(() => {
    if (customerType === "private-person") {
      setCompanyName("");
      setCompanyNumber("");
    } else if (customerType === "company") {
      setCustomerName("");
      setCustomerSecondName("");
      setInvoice(false);
    }
  }, [customerType])

  const handleBuy = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    const form = {
      customerType: customerType,
      customerName: customerName,
      customerSecondName: customerSecondName,
      companyName: companyName,
      companyNumber: companyNumber,
      invoice: invoice,
      streetName: streetName,
      houseNumber: houseNumber,
      apartmentValue: apartmentValue,
      city: city,
      zipCode: zipCode,
      phoneNumber: phoneNumber,
      email: email,
      comments: comments
    }

    console.log(form)
  }

  return (
    <div className="checkout-page">
      <div className="checkout-display">
        <div className="checkout-details">
          <header className="form-header">Fill the form in order to proceed your order</header>
          <form className="form">
            <fieldset className="fieldset">
              <div className="fieldset-section">
                <input className="radio" id="private-person" type="radio" name="private-person" value="private-person" onChange={() => setCustomerType("private-person")} checked={customerType === "private-person"} />
                <label htmlFor="private-person">Private person</label>
              </div>
              <div className="fieldset-section">
                <input className="radio" id="company" type="radio" name="private-person" value="company" onChange={() => setCustomerType("company")} checked={customerType === "company"} />
                <label htmlFor="company">Company</label>
              </div>
            </fieldset>
            {customerType === "private-person" ?
              <>
                <input placeholder="First name" className="checkout-input" type="textbox" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
                <input placeholder="Secondary name" className="checkout-input" type="textbox" value={customerSecondName} onChange={(e) => setCustomerSecondName(e.target.value)} />
                <div className="fieldset-section">
                  <input className="checkbox" type="checkbox" onChange={() => setInvoice(!invoice)} checked={invoice === true} />
                  <label>I want to receive an invoice</label>
                </div>
              </>
              :
              <>
                <input placeholder="Company name" className="checkout-input" type="textbox" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                <input placeholder="Company Identication Number" className="checkout-input" type="textbox" value={companyNumber} onChange={(e) => setCompanyNumber(e.target.value)} />
                <span style={{ height: "25px" }}></span>
              </>}
            <input type="textbox" placeholder="Street name" className="checkout-input" value={streetName} onChange={(e) => setStreetName(e.target.value)} />
            <div className="adress-details">
              <input type="textbox" className="smaller-checkout-input" placeholder="House number" value={houseNumber} onChange={(e) => setHouseNumber(e.target.value)} />
              <input className="smaller-checkout-input" placeholder="Apartment/flat etc." value={apartmentValue} onChange={(e) => setApartmentValue(e.target.value)} />
              <input className="smaller-checkout-input" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
              <input className="smaller-checkout-input" placeholder="Zip code" value={zipCode} onChange={(e) => setZipCode(e.target.value)} />
            </div>
            <input type="textbox" placeholder="Phone number*" className="checkout-input" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
            <input type="textbox" placeholder="E-mail*" className="checkout-input" value={email} onChange={(e) => setEmail(e.target.value)} />
            <textarea placeholder="Comment" className="comments" value={comments} onChange={(e) => setComments(e.target.value)} />
            <span style={{ fontSize: "12px" }}>* fields marked with a star are optional</span>
            <button className="checkout-button" onClick={(e) => handleBuy(e)}>Buy</button>
          </form>
        </div>
      </div>
    </div>
  )
}