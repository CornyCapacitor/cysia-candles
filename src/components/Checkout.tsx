import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { cartAtom, themeAtom } from '../atoms';
import supabase from '../config/supabaseClient';
import '../theme.css';
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

type CountryOption = {
  name: string,
  available: boolean
}

export const Checkout = () => {
  const [theme] = useAtom(themeAtom)
  // Customer form states
  const [customerType, setCustomerType] = useState<string>("private-person");
  const [customerName, setCustomerName] = useState<string>("");
  const [customerSecondName, setCustomerSecondName] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");
  const [companyNumber, setCompanyNumber] = useState<string>("");
  const [invoice, setInvoice] = useState<boolean>(false);
  const [streetName, setStreetName] = useState<string>("");
  const [houseNumber, setHouseNumber] = useState<string>("");
  const [apartmentValue, setApartmentValue] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [countryOptions] = useState<CountryOption[]>([
    {
      name: "Poland",
      available: true
    },
    {
      name: "United Kingdom",
      available: false
    },
    {
      name: "United States",
      available: false
    },
    {
      name: "Spain",
      available: false
    },
    {
      name: "Germany",
      available: false
    }
  ]);
  const [city, setCity] = useState<string>("");
  const [zipCode, setZipCode] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [comments, setComments] = useState<string>("");
  const [checkoutErrors, setCheckoutErrors] = useState<string[]>([]);

  // Summary states
  const [cart, setCart] = useAtom(cartAtom)
  const [deliveryCost, setDeliveryCost] = useState<number>(0);
  const [paymentCost, setPaymentCost] = useState<number>(0);

  // Delivery states
  const [selectedDelivery, setSelectedDelivery] = useState<string>("");
  const [deliveryOptions, setDeliveryOptions] = useState<DeliveryOption[]>([])

  // Payment states
  const [selectedPayment, setSelectedPayment] = useState<string>("");
  const [paymentOptions, setPaymentOptions] = useState<PaymentOption[]>([]);

  // Fetch states
  const [paymentFetch, setPaymentFetch] = useState<boolean>(false);
  const [deliveryFetch, setDeliveryFetch] = useState<boolean>(false);

  const navigate = useNavigate();

  const candlesPrice = cart.reduce((sum, candle) => {
    const quantity = candle.quantity || 0;
    return sum + quantity * (candle.volume === "130ml" ? 15.00 : 25.00);
  }, 0).toFixed(2);

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
    country: country,
    city: city,
    zipCode: zipCode,
    phoneNumber: phoneNumber,
    email: email,
    comments: comments,
    deliveryType: selectedDelivery,
    paymentMethod: selectedPayment,
    totalPrice: (Number(candlesPrice) + deliveryCost + paymentCost).toFixed(2),
    items: cart
  }

  const validate = () => {
    const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    const phoneNumberRegex = /^(?:\+(\d{1,4})\s)?\d(?:\s?\d){8}$/;
    const onlyLettersRegex = /^[A-Za-z]+$/;
    const onlyNumbersRegex = /^[0-9]+$/;
    let firstInput = false;
    let secondInput = false;

    setCheckoutErrors([]);
    const addError = (errorMessage: string) => {
      setCheckoutErrors((p) => [...p, errorMessage])
    }

    if (customerType === "private-person") {
      const isValidCustomerName = onlyLettersRegex.test(customerName);
      firstInput = isValidCustomerName
      if (!isValidCustomerName) {
        addError("Please enter proper name e.g. Michał")
      }

      const isValidCustomerSecondName = onlyLettersRegex.test(customerSecondName)
      secondInput = isValidCustomerSecondName
      if (!isValidCustomerSecondName) {
        addError("Please enter proper second name e.g. Owczarzak")
      }
    } else if (customerType === "company") {
      if (companyName !== "") {
        firstInput = true
      } else if (!companyName) {
        addError("Please enter proper company name e.g. WK sp. z o.o.")
      }

      const isValidCompanyNumber = onlyNumbersRegex.test(companyNumber)
      secondInput = isValidCompanyNumber
      if (!isValidCompanyNumber) {
        addError("Please enter proper company identification number e.g. 7010633012")
      }
    }

    const isValidStreet = onlyLettersRegex.test(streetName)
    if (!isValidStreet) {
      addError("Please enter proper street name e.g. Bydgoska")
    }

    const isValidCity = onlyLettersRegex.test(city)
    if (!isValidCity) {
      addError("Please enter proper city name e.g. Warszawa")
    }

    const isValidPhoneNumber = phoneNumberRegex.test(phoneNumber)
    if (!isValidPhoneNumber) {
      addError("Please enter proper phone number e.g. +48123456789 or 123456789")
    }

    const isValidEmail = emailRegex.test(email);
    if (!isValidEmail) {
      addError("Please enter proper e-mail adress e.g. michalowczarzak@gmail.com")
    }

    const sendForm = async () => {

      const { data, error } = await supabase
        .from('orders')
        .insert([form])
        .select()

      if (data) {
        console.log("Order sent to database")
      }

      if (error) {
        console.error(error)
      }
    }

    const proceed = () => {

      let themeBackground
      let themeColor

      if (theme === "light") {
        themeBackground = "#ffffff"
        themeColor = "#000000"
      } else if (theme === "dark") {
        themeBackground = "#000000"
        themeColor = "#ffffff"
      }

      Swal.fire({
        icon: 'info',
        iconColor: '#f568a9',
        background: `${themeBackground}`,
        color: `${themeColor}`,
        title: `Normaly you'd be sent to payment window right now, but instead, we've noticed your order and we'll message you when the order is ready :)`,
      }).then((result) => {
        if (result.isConfirmed || result.dismiss) {
          navigate('/')
        }
      })
      setCart([]);
    }

    if (candlesPrice !== "0.00" && firstInput && secondInput && isValidStreet && houseNumber && apartmentValue && isValidCity && zipCode && isValidPhoneNumber && isValidEmail && country && selectedDelivery && selectedPayment) {
      sendForm();
      proceed();
    } else {
      if (!houseNumber) {
        addError("Please enter proper house number e.g. 47")
      }
      if (!apartmentValue) {
        addError("Please enter proper apartment/flat number e.g. 1. In case there's no such a numeration for your adress, type 0")
      }
      if (!zipCode) {
        addError("Please enter proper zip code e.g. 85-047 or 12345-12345")
      }
      if (!country) {
        addError("Please select country");
      }
      if (!selectedDelivery) {
        addError("Please select one of delivery options")
      }
      if (!selectedPayment) {
        addError("Please select one payment method")
      }
      if (candlesPrice === "0.00") {
        Swal.fire({
          icon: 'error',
          iconColor: 'red',
          title: `Somehow cart went empty during checkout step! Please retry the purchasing process again :/`,
        }).then((result) => {
          if (result.isConfirmed || result.dismiss) {
            navigate('/')
          }
        })
      }
    }
  }

  const handleBuy = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    validate();
  }

  useEffect(() => {
    const fetchPaymentOptions = async () => {
      const { data, error } = await supabase.from('payment-options').select();

      if (error) {
        console.error(error);
      }

      if (data) {
        setPaymentOptions(data);
        setPaymentFetch(true);
      }
    };

    fetchPaymentOptions();
  }, []);

  useEffect(() => {
    const fetchDeliveryOptions = async () => {
      const { data, error } = await supabase.from('delivery-options').select();

      if (error) {
        console.error(error);
      }

      if (data) {
        setDeliveryOptions(data);
        setDeliveryFetch(true);
      }
    };

    fetchDeliveryOptions();
  }, []);

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

  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    setTimeout(scrollToTop, 250)
  }, [])

  return (
    <div className={`checkout-page ${theme === "light" ? "light-toned-bg" : "dark-bg"}`}>
      <div className={`checkout-display ${theme === "light" ? "light-bg" : "dark-toned-bg"}`}>
        {paymentFetch && deliveryFetch ?
          <>
            <div style={{ display: `flex`, flexDirection: `column`, gap: `20px` }}>
              <div className="delivery-details">
                <header className={`delivery-header ${theme === "light" ? "light-var-bg" : "dark-var-bg"}`}>Delivery</header>
                <div className="delivery">
                  <fieldset className={`fieldset ${theme === "light" ? "" : "white-font"}`}>
                    {deliveryOptions.map((option) => (
                      <div className="delivery-option" key={option.name}>
                        <div className="delivery-option-info">
                          <input className={`radio ${theme === "light" ? "light-var-outline" : "dark-var-outline"}`} type="radio" id={option.name} name={option.name} value={option.name} onChange={() => setSelectedDelivery(option.name)} checked={selectedDelivery === option.name} disabled={!option.available} />
                          <label style={{ color: option.available ? theme === "light" ? `#000000` : `#ffffff` : `#aaaaaa` }}>{option.name}</label>
                        </div>
                        <span className="delivery-option-price" style={{ color: option.available ? theme === "light" ? `#000000` : `#ffffff` : `#aaaaaa` }}>{option.price.toFixed(2)} PLN</span>
                      </div>
                    ))}
                  </fieldset>
                </div>
              </div>
              <div className={`payment-details ${theme === "light" ? "black-font" : "white-font"}`}>
                <header className={`payment-header ${theme === "light" ? "light-var-bg" : "dark-var-bg"}`}>Payment method</header>
                <div className="payment">
                  <fieldset className="fieldset">
                    {paymentOptions.map((option) => (
                      <div className="delivery-option" key={option.name}>
                        <div className="delivery-option-info">
                          <input className={`radio ${theme === "light" ? "light-var-outline" : "dark-var-outline"}`} type="radio" id={option.name} name={option.name} value={option.name} onChange={() => setSelectedPayment(option.name)} checked={selectedPayment === option.name} disabled={!option.available} />
                          <label style={{ color: option.available ? theme === "light" ? `#000000` : `#ffffff` : `#aaaaaa` }}>{option.name}</label>
                        </div>
                        <span className="delivery-option-price" style={{ color: option.available ? theme === "light" ? `#000000` : `#ffffff` : `#aaaaaa` }}>{option.price.toFixed(2)} PLN</span>
                      </div>
                    ))}
                  </fieldset>
                </div>
              </div>
            </div>
            <div className={`customer-details ${theme === "light" ? "black-font" : "white-font"}`}>
              <header className={`customer-header ${theme === "light" ? "light-var-bg" : "dark-var-bg"}`}>Customer information</header>
              <form className="form">
                <fieldset className="fieldset">
                  <div className="fieldset-section">
                    <input className={`radio ${theme === "light" ? "light-var-outline" : "dark-var-outline"}`} id="private-person" type="radio" name="private-person" value="private-person" onChange={() => setCustomerType("private-person")} checked={customerType === "private-person"} />
                    <label htmlFor="private-person">Private person</label>
                  </div>
                  <div className="fieldset-section">
                    <input className={`radio ${theme === "light" ? "light-var-outline" : "dark-var-outline"}`} id="company" type="radio" name="private-person" value="company" onChange={() => setCustomerType("company")} checked={customerType === "company"} />
                    <label htmlFor="company">Company</label>
                  </div>
                </fieldset>
                {customerType === "private-person" ?
                  <>
                    <input placeholder="First name" className={`customer-input ${theme === "light" ? "light-var-outline" : "dark-var-outline"}`} type="textbox" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
                    <input placeholder="Secondary name" className={`customer-input ${theme === "light" ? "light-var-outline" : "dark-var-outline"}`} type="textbox" value={customerSecondName} onChange={(e) => setCustomerSecondName(e.target.value)} />
                    <div className="fieldset-section">
                      <input className={`checkbox ${theme === "light" ? "light-var-outline" : "dark-var-outline"}`} type="checkbox" onChange={() => setInvoice(!invoice)} checked={invoice === true} />
                      <label>I want to receive an invoice</label>
                    </div>
                  </>
                  :
                  <>
                    <input placeholder="Company name" className={`customer-input ${theme === "light" ? "light-var-outline" : "dark-var-outline"}`} type="textbox" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                    <input placeholder="Company Identication Number" className={`customer-input ${theme === "light" ? "light-var-outline" : "dark-var-outline"}`} type="textbox" value={companyNumber} onChange={(e) => setCompanyNumber(e.target.value)} />
                    <span style={{ height: "25px" }}></span>
                  </>}
                <input type="textbox" placeholder="Street name" className={`customer-input ${theme === "light" ? "light-var-outline" : "dark-var-outline"}`} value={streetName} onChange={(e) => setStreetName(e.target.value)} />
                <div className="adress-details">
                  <input type="textbox" className={`smaller-customer-input ${theme === "light" ? "light-var-outline" : "dark-var-outline"}`} placeholder="House number" value={houseNumber} onChange={(e) => setHouseNumber(e.target.value)} maxLength={4} />
                  <input className={`smaller-customer-input ${theme === "light" ? "light-var-outline" : "dark-var-outline"}`} placeholder="Apartment/flat etc." value={apartmentValue} onChange={(e) => setApartmentValue(e.target.value)} maxLength={4} />
                  <input className={`smaller-customer-input ${theme === "light" ? "light-var-outline" : "dark-var-outline"}`} placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
                  <input className={`smaller-customer-input ${theme === "light" ? "light-var-outline" : "dark-var-outline"}`} placeholder="Zip code" value={zipCode} onChange={(e) => setZipCode(e.target.value)} />
                </div>
                <select className={`customer-select ${theme === "light" ? "light-var-outline" : "dark-var-outline"}`} value={country} onChange={(e) => setCountry(e.target.value)}>
                  <option value="" disabled>Choose country</option>
                  {countryOptions.map((option, index) => (
                    <option key={index} disabled={!option.available}>{option.name}</option>
                  ))}
                </select>
                <input type="textbox" placeholder="Phone number*" className={`customer-input ${theme === "light" ? "light-var-outline" : "dark-var-outline"}`} value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                <input type="textbox" placeholder="E-mail*" className={`customer-input ${theme === "light" ? "light-var-outline" : "dark-var-outline"}`} value={email} onChange={(e) => setEmail(e.target.value)} />
                <textarea placeholder="Comment" className={`comments ${theme === "light" ? "light-var-outline" : "dark-var-outline"}`} value={comments} onChange={(e) => setComments(e.target.value)} />
                <span style={{ fontSize: "12px" }}>* fields marked with a star are necessary</span>
                <button className={`customer-button ${theme === "light" ? "light-var-bg" : "dark-var-bg"}`} onClick={(e) => handleBuy(e)}>Buy</button>
                {checkoutErrors.length !== 0 ?
                  <div className="checkout-errors-list">
                    {checkoutErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </div>
                  : <></>}
              </form>
            </div>
            <div className={`summary-details ${theme === "light" ? "black-font" : "white-font"}`}>
              <header className={`summary-header ${theme === "light" ? "light-var-bg" : "dark-var-bg"}`}>Summary</header>
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
          </>
          : <>Loading checkout data..</>}
      </div>
    </div>
  )
}