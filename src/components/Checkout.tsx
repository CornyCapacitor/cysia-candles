import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { cartAtom, themeAtom } from '../atoms';
import supabase from '../config/supabaseClient';

import '../config/i18n';
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

  const { t } = useTranslation()

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
        addError("first_name_error")
      }

      const isValidCustomerSecondName = onlyLettersRegex.test(customerSecondName)
      secondInput = isValidCustomerSecondName
      if (!isValidCustomerSecondName) {
        addError("second_name_error")
      }
    } else if (customerType === "company") {
      if (companyName !== "") {
        firstInput = true
      } else if (!companyName) {
        addError("company_name_error")
      }

      const isValidCompanyNumber = onlyNumbersRegex.test(companyNumber)
      secondInput = isValidCompanyNumber
      if (!isValidCompanyNumber) {
        addError("company_id_error")
      }
    }

    const isValidStreet = onlyLettersRegex.test(streetName)
    if (!isValidStreet) {
      addError("street_error")
    }

    const isValidCity = onlyLettersRegex.test(city)
    if (!isValidCity) {
      addError("city_error")
    }

    const isValidPhoneNumber = phoneNumberRegex.test(phoneNumber)
    if (!isValidPhoneNumber) {
      addError("phone_error")
    }

    const isValidEmail = emailRegex.test(email);
    if (!isValidEmail) {
      addError("email_error")
    }

    const sendForm = async () => {

      const { data, error } = await supabase
        .from('orders')
        .insert([form])
        .select()

      if (data) {
        return data
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
        title: `${t('checkout_swal_title_1')}`,
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
        addError("house_error")
      }
      if (!apartmentValue) {
        addError("apartment_error")
      }
      if (!zipCode) {
        addError("zip_code_error")
      }
      if (!country) {
        addError("country_error");
      }
      if (!selectedDelivery) {
        addError("delivery_error")
      }
      if (!selectedPayment) {
        addError("payment_error")
      }
      if (candlesPrice === "0.00") {
        Swal.fire({
          icon: 'error',
          iconColor: 'red',
          title: `${t('checkout_swal_title_2')}`,
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
                <header className={`delivery-header ${theme === "light" ? "light-var-bg" : "dark-var-bg"}`}>{t('delivery')}</header>
                <div className="delivery">
                  <fieldset className={`fieldset ${theme === "light" ? "" : "white-font"}`}>
                    {deliveryOptions.map((option) => (
                      <div className="delivery-option" key={option.name}>
                        <div className="delivery-option-info">
                          <input className={`radio ${theme === "light" ? "light-var-outline" : "dark-var-outline"}`} type="radio" id={option.name} name={option.name} value={option.name} onChange={() => setSelectedDelivery(option.name)} checked={selectedDelivery === option.name} disabled={!option.available} />
                          <label style={{ color: option.available ? theme === "light" ? `#000000` : `#ffffff` : `#aaaaaa` }}>{t(`${option.name}`)}</label>
                        </div>
                        <span className="delivery-option-price" style={{ color: option.available ? theme === "light" ? `#000000` : `#ffffff` : `#aaaaaa` }}>{option.price.toFixed(2)} PLN</span>
                      </div>
                    ))}
                  </fieldset>
                </div>
              </div>
              <div className={`payment-details ${theme === "light" ? "black-font" : "white-font"}`}>
                <header className={`payment-header ${theme === "light" ? "light-var-bg" : "dark-var-bg"}`}>{t('payment_method')}</header>
                <div className="payment">
                  <fieldset className="fieldset">
                    {paymentOptions.map((option) => (
                      <div className="delivery-option" key={option.name}>
                        <div className="delivery-option-info">
                          <input className={`radio ${theme === "light" ? "light-var-outline" : "dark-var-outline"}`} type="radio" id={option.name} name={option.name} value={option.name} onChange={() => setSelectedPayment(option.name)} checked={selectedPayment === option.name} disabled={!option.available} />
                          <label style={{ color: option.available ? theme === "light" ? `#000000` : `#ffffff` : `#aaaaaa` }}>{t(`${option.name}`)}</label>
                        </div>
                        <span className="delivery-option-price" style={{ color: option.available ? theme === "light" ? `#000000` : `#ffffff` : `#aaaaaa` }}>{option.price.toFixed(2)} PLN</span>
                      </div>
                    ))}
                  </fieldset>
                </div>
              </div>
            </div>
            <div className={`customer-details ${theme === "light" ? "black-font" : "white-font"}`}>
              <header className={`customer-header ${theme === "light" ? "light-var-bg" : "dark-var-bg"}`}>{t('customer_information')}</header>
              <form className="form">
                <fieldset className="fieldset">
                  <div className="fieldset-section">
                    <input className={`radio ${theme === "light" ? "light-var-outline" : "dark-var-outline"}`} id="private-person" type="radio" name="private-person" value="private-person" onChange={() => setCustomerType("private-person")} checked={customerType === "private-person"} />
                    <label htmlFor="private-person">{t('private_person')}</label>
                  </div>
                  <div className="fieldset-section">
                    <input className={`radio ${theme === "light" ? "light-var-outline" : "dark-var-outline"}`} id="company" type="radio" name="private-person" value="company" onChange={() => setCustomerType("company")} checked={customerType === "company"} />
                    <label htmlFor="company">{t('company')}</label>
                  </div>
                </fieldset>
                {customerType === "private-person" ?
                  <>
                    <input placeholder={t('first_name')} className={`customer-input ${theme === "light" ? "light-var-outline" : "dark-var-outline"}`} type="textbox" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
                    <input placeholder={t('second_name')} className={`customer-input ${theme === "light" ? "light-var-outline" : "dark-var-outline"}`} type="textbox" value={customerSecondName} onChange={(e) => setCustomerSecondName(e.target.value)} />
                    <div className="fieldset-section">
                      <input className={`checkbox ${theme === "light" ? "light-var-outline" : "dark-var-outline"}`} type="checkbox" onChange={() => setInvoice(!invoice)} checked={invoice === true} />
                      <label>{t('invoice_information')}</label>
                    </div>
                  </>
                  :
                  <>
                    <input placeholder={t('company_name')} className={`customer-input ${theme === "light" ? "light-var-outline" : "dark-var-outline"}`} type="textbox" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                    <input placeholder={t('company_id')} className={`customer-input ${theme === "light" ? "light-var-outline" : "dark-var-outline"}`} type="textbox" value={companyNumber} onChange={(e) => setCompanyNumber(e.target.value)} />
                    <span style={{ height: "25px" }}></span>
                  </>}
                <input type="textbox" placeholder={t('street_name')} className={`customer-input ${theme === "light" ? "light-var-outline" : "dark-var-outline"}`} value={streetName} onChange={(e) => setStreetName(e.target.value)} />
                <div className="adress-details">
                  <input type="textbox" className={`smaller-customer-input ${theme === "light" ? "light-var-outline" : "dark-var-outline"}`} placeholder={t('house_number')} value={houseNumber} onChange={(e) => setHouseNumber(e.target.value)} maxLength={4} />
                  <input className={`smaller-customer-input ${theme === "light" ? "light-var-outline" : "dark-var-outline"}`} placeholder={t('apartment')} value={apartmentValue} onChange={(e) => setApartmentValue(e.target.value)} maxLength={4} />
                  <input className={`smaller-customer-input ${theme === "light" ? "light-var-outline" : "dark-var-outline"}`} placeholder={t('city')} value={city} onChange={(e) => setCity(e.target.value)} />
                  <input className={`smaller-customer-input ${theme === "light" ? "light-var-outline" : "dark-var-outline"}`} placeholder={t('zip_code')} value={zipCode} onChange={(e) => setZipCode(e.target.value)} />
                </div>
                <select className={`customer-select ${theme === "light" ? "light-var-outline" : "dark-var-outline"}`} value={country} onChange={(e) => setCountry(e.target.value)}>
                  <option value="" disabled>{t('choose_country')}</option>
                  {countryOptions.map((option, index) => (
                    <option key={index} disabled={!option.available}>{t(`${option.name}`)}</option>
                  ))}
                </select>
                <input type="textbox" placeholder={`${t('phone_number')}*`} className={`customer-input ${theme === "light" ? "light-var-outline" : "dark-var-outline"}`} value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                <input type="textbox" placeholder={`${t('email_adress')}*`} className={`customer-input ${theme === "light" ? "light-var-outline" : "dark-var-outline"}`} value={email} onChange={(e) => setEmail(e.target.value)} />
                <textarea placeholder={t('comment')} className={`comments ${theme === "light" ? "light-var-outline" : "dark-var-outline"}`} value={comments} onChange={(e) => setComments(e.target.value)} />
                <span style={{ fontSize: "12px" }}>{t('star_info')}</span>
                <button className={`customer-button ${theme === "light" ? "light-var-bg" : "dark-var-bg"}`} onClick={(e) => handleBuy(e)}>Buy</button>
                {checkoutErrors.length !== 0 ?
                  <div className="checkout-errors-list">
                    {checkoutErrors.map((error, index) => (
                      <li key={index}>{t(`${error}`)}</li>
                    ))}
                  </div>
                  : <></>}
              </form>
            </div>
            <div className={`summary-details ${theme === "light" ? "black-font" : "white-font"}`}>
              <header className={`summary-header ${theme === "light" ? "light-var-bg" : "dark-var-bg"}`}>{t('summary')}</header>
              <div className="summary">
                <div className="summary-section">
                  <span>{t('value_of_products')}</span>
                  <span style={{ textAlign: "end" }}>{candlesPrice} PLN</span>
                </div>
                <div className="summary-section">
                  <span>{t('shipment_cost')}:</span>
                  <span>{deliveryCost.toFixed(2)} PLN</span>
                </div>
                <div className="summary-section">
                  <span>{t('payment_cost')}:</span>
                  <span>{paymentCost.toFixed(2)} PLN</span>
                </div>
                <div className="summary-section">
                  <span>{t('final_price')}:</span>
                  <span>{(Number(candlesPrice) + deliveryCost + paymentCost).toFixed(2)} PLN</span>
                </div>
              </div>
            </div>
          </>
          : <>{t('loading_checkout_data')}</>}
      </div>
    </div>
  )
}