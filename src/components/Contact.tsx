import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { themeAtom } from '../atoms';
import supabase from '../config/supabaseClient';

import '../config/i18n';
import '../theme.css';
import './Contact.css';

export const Contact = () => {
  const [topics] = useState<string[]>(["question", "bug_report", "collaboration", "other"]);
  const [email, setEmail] = useState<string>("");
  const [topic, setTopic] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [contactErrors, setContactErrors] = useState<string[]>([]);
  const [theme] = useAtom(themeAtom)

  const { t } = useTranslation();

  const navigate = useNavigate()

  const form = {
    email: email,
    topic: topic,
    comment: comment
  }

  const validate = () => {
    const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;

    setContactErrors([]);
    const addError = (errorMessage: string) => {
      setContactErrors((p) => [...p, errorMessage])
    }

    const isValidEmail = emailRegex.test(email);
    if (!isValidEmail) {
      addError("email_error")
    }

    const sendForm = async () => {
      const { data, error } = await supabase
        .from('contact')
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
      Swal.fire({
        icon: 'success',
        iconColor: 'green',
        title: 'Form has been sent! Redirecting to home page..',
        showConfirmButton: true,
        confirmButtonText: "Ok",
        timer: 5000,
      }).then((result) => {
        if (result.isConfirmed || result.dismiss) {
          navigate('/')
        }
      })
    }

    if (isValidEmail && topic && comment.length > 50) {
      sendForm();
      proceed();
    } else {
      if (!topic) {
        addError("topic_error")
      }
      if (!comment) {
        addError("description_error")
      }
      if (comment && comment.length < 50) {
        addError("description_length_error")
      }
    }
  }

  const handleSend = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    validate()
  }

  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    setTimeout(scrollToTop, 250)
  }, [])

  return (
    <div className={`contact-page ${theme === "light" ? "light-toned-bg" : "dark-bg"}`}>
      <div className={`contact-display ${theme === "light" ? "light-bg" : "dark-toned-bg"}`}>
        <div className="contact-details">
          <header className={`contact-header ${theme === "light" ? "light-var-bg" : "dark-var-bg"}`}>{t('ask_us_a_question')}</header>
          <form className="contact-form">
            <input className={`contact-input ${theme === "light" ? "light-var-outline" : "dark-var-outline"}`} type="textbox" placeholder={t('email_adress')} value={email} onChange={(e) => setEmail(e.target.value)} />
            <select className={`contact-select ${theme === "light" ? "light-var-outline" : "dark-var-outline"}`} value={topic} onChange={(e) => setTopic(e.target.value)}>
              <option value="" disabled>{t('choose_the_topic')}</option>
              {topics.map((topic) => (
                <option value={topic} key={topic}>{t(`${topic}`)}</option>
              ))}
            </select>
            <textarea className={`contact-comments ${theme === "light" ? "light-var-outline" : "dark-var-outline"}`} placeholder={t('describe_your_topic_here')} value={comment} onChange={(e) => setComment(e.target.value)} />
            <button className={`contact-button ${theme === "light" ? "light-var-bg" : "dark-var-bg"}`} onClick={(e) => handleSend(e)}>{t('send')}</button>
            {contactErrors.length !== 0 ?
              <div className="contact-error-list">
                {contactErrors.map((error, index) => (
                  <li key={index}>{t(`${error}`)}</li>
                ))}
              </div>
              : <></>}
          </form>
        </div>
      </div>
    </div >
  )
}