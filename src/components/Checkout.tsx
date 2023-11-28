import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { cartAtom } from '../atoms';
import './Checkout.css';

type DeliveryOption = {
  name: string,
  estimatedTime: string,
  price: number,
  available: boolean
}

type PaymentOption = {
  name: string,
  price: number,
  available: boolean
}

export const Checkout = () => {
  // Form states
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

  // Summary states
  const [cart] = useAtom(cartAtom)
  const [deliveryCost, setDeliveryCost] = useState<number>(0);
  const [paymentCost, setPaymentCost] = useState<number>(0);

  // Delivery states
  const [selectedDelivery, setSelectedDelivery] = useState<string>("");
  const [deliveryOptions] = useState<DeliveryOption[]>([
    {
      name: "DPD PickUp",
      estimatedTime: "1 day(s)",
      price: 10.90,
      available: false,
    },
    {
      name: "POCZTEX",
      estimatedTime: "2 day(s)",
      price: 9.90,
      available: false,
    },
    {
      name: "Inpost Paczkomaty 24/7",
      estimatedTime: "1 day(s)",
      price: 7.90,
      available: false,
    },
    {
      name: "Kurier Inpost",
      estimatedTime: "1 day(s)",
      price: 12.90,
      available: false,
    },
    {
      name: "Kurier DPD",
      estimatedTime: "1 day(s)",
      price: 12.90,
      available: false,
    },
    {
      name: "Personal pickup",
      estimatedTime: "2 day(s)",
      price: 0.00,
      available: true,
    },
  ])

  // Payment states
  const [selectedPayment, setSelectedPayment] = useState<string>("");
  const [paymentOptions] = useState<PaymentOption[]>([
    {
      name: "Google Pay",
      price: 0.00,
      available: false,
    },
    {
      name: "PayU",
      price: 0.00,
      available: false,
    },
    {
      name: "Skrill",
      price: 0.00,
      available: false,
    },
    {
      name: "PayPal",
      price: 0.00,
      available: false,
    },
    {
      name: "Bank transfer",
      price: 0.00,
      available: false,
    },
    {
      name: "Cryptocurrencies",
      price: 0.00,
      available: false,
    },
    {
      name: "Cash or credit card",
      price: 0.00,
      available: true,
    },
  ]);

  const candlesPrice = cart.reduce((sum, candle) => {
    const quantity = candle.quantity || 0;
    return sum + quantity * (candle.volume === "130ml" ? 15.00 : 25.00);
  }, 0).toFixed(2);

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

  useEffect(() => {
    const selectedOption = deliveryOptions.find(option => option.name === selectedDelivery)

    if (selectedOption) {
      setDeliveryCost(selectedOption.price)
    } else {
      setDeliveryCost(0)
    }
  }, [selectedDelivery, deliveryOptions])

  useEffect(() => {
    const selectedOption = paymentOptions.find(option => option.name === selectedPayment)

    if (selectedOption) {
      setPaymentCost(selectedOption.price)
    } else {
      setPaymentCost(0)
    }
  }, [selectedPayment, paymentOptions])

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
      comments: comments,
      deliveryType: selectedDelivery,
      paymentMethod: selectedPayment,
      totalPrice: (Number(candlesPrice) + deliveryCost + paymentCost).toFixed(2)
    }

    console.log(form)
  }

  return (
    <div className="checkout-page">
      <div className="checkout-display">
        <div style={{ display: `flex`, flexDirection: `column`, gap: `20px` }}>
          <div className="delivery-details">
            <header className="delivery-header">Delivery</header>
            <div className="delivery">
              <fieldset className="fieldset">
                {deliveryOptions.map((option) => (
                  <div className="delivery-option">
                    <div className="delivery-option-info">
                      <input className="radio" type="radio" id={option.name} name={option.name} value={option.name} onChange={() => setSelectedDelivery(option.name)} checked={selectedDelivery === option.name} disabled={!option.available} />
                      <label style={{ color: option.available ? `#000000` : `#aaaaaa` }}>{option.name}</label>
                    </div>
                    <span className="delivery-option-price" style={{ color: option.available ? `#000000` : `#aaaaaa` }}>{option.price.toFixed(2)} PLN</span>
                  </div>
                ))}
              </fieldset>
            </div>
          </div>
          <div className="payment-details">
            <header className="payment-header">Payment method</header>
            <div className="payment">
              <fieldset className="fieldset">
                {paymentOptions.map((option) => (
                  <div className="delivery-option">
                    <div className="delivery-option-info">
                      <input className="radio" type="radio" id={option.name} name={option.name} value={option.name} onChange={() => setSelectedPayment(option.name)} checked={selectedPayment === option.name} disabled={!option.available} />
                      <label style={{ color: option.available ? `#000000` : `#aaaaaa` }}>{option.name}</label>
                    </div>
                    <span className="delivery-option-price" style={{ color: option.available ? `#000000` : `#aaaaaa` }}>{option.price.toFixed(2)} PLN</span>
                  </div>
                ))}
              </fieldset>
            </div>
          </div>
        </div>
        <div className="customer-details">
          <header className="customer-header">Customer information</header>
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
                <input placeholder="First name" className="customer-input" type="textbox" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
                <input placeholder="Secondary name" className="customer-input" type="textbox" value={customerSecondName} onChange={(e) => setCustomerSecondName(e.target.value)} />
                <div className="fieldset-section">
                  <input className="checkbox" type="checkbox" onChange={() => setInvoice(!invoice)} checked={invoice === true} />
                  <label>I want to receive an invoice</label>
                </div>
              </>
              :
              <>
                <input placeholder="Company name" className="customer-input" type="textbox" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                <input placeholder="Company Identication Number" className="customer-input" type="textbox" value={companyNumber} onChange={(e) => setCompanyNumber(e.target.value)} />
                <span style={{ height: "25px" }}></span>
              </>}
            <input type="textbox" placeholder="Street name" className="customer-input" value={streetName} onChange={(e) => setStreetName(e.target.value)} />
            <div className="adress-details">
              <input type="textbox" className="smaller-customer-input" placeholder="House number" value={houseNumber} onChange={(e) => setHouseNumber(e.target.value)} />
              <input className="smaller-customer-input" placeholder="Apartment/flat etc." value={apartmentValue} onChange={(e) => setApartmentValue(e.target.value)} />
              <input className="smaller-customer-input" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
              <input className="smaller-customer-input" placeholder="Zip code" value={zipCode} onChange={(e) => setZipCode(e.target.value)} />
            </div>
            <input type="textbox" placeholder="Phone number*" className="customer-input" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
            <input type="textbox" placeholder="E-mail*" className="customer-input" value={email} onChange={(e) => setEmail(e.target.value)} />
            <textarea placeholder="Comment" className="comments" value={comments} onChange={(e) => setComments(e.target.value)} />
            <span style={{ fontSize: "12px" }}>* fields marked with a star are optional</span>
            <button className="customer-button" onClick={(e) => handleBuy(e)}>Buy</button>
          </form>
        </div>
        <div className="summary-details">
          <header className="summary-header">Summary</header>
          <div className="summary">
            <div className="summary-section">
              <span>Value of products:</span>
              <span>{candlesPrice} PLN</span>
            </div>
            <div className="summary-section">
              <span>Shipment cost:</span>
              <span>{deliveryCost.toFixed(2)} PLN</span>
            </div>
            <div className="summary-section">
              <span>Payment cost:</span>
              <span>{paymentCost.toFixed(2)} PLN</span>
            </div>
            <div className="summary-section">
              <span>Final price:</span>
              <span>{(Number(candlesPrice) + deliveryCost + paymentCost).toFixed(2)} PLN</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}