import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import supabase from '../config/supabaseClient';
import './Contact.css';

export const Contact = () => {
  const [topics] = useState<string[]>(["Question", "Bug report", "Collaboration", "Other"]);
  const [email, setEmail] = useState<string>("");
  const [topic, setTopic] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [contactErrors, setContactErrors] = useState<string[]>([]);

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
      addError("Please enter proper e-mail adress e.g. michalowczarzak@gmail.com")
    }

    const sendForm = async () => {
      const { data, error } = await supabase
        .from('contact')
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
        addError("Please select topic that's closest to your problem")
      }
      if (!comment) {
        addError("Please describe your problem")
      }
      if (comment && comment.length < 50) {
        addError("Problem description must be at least 50 characters long")
      }
    }
  }

  const handleSend = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    validate()
  }

  return (
    <div className="contact-page">
      <div className="contact-display">
        <div className="contact-details">
          <header className="contact-header">Ask us a question</header>
          <form className="contact-form">
            <input className="contact-input" type="textbox" placeholder="E-mail adress" value={email} onChange={(e) => setEmail(e.target.value)} />
            <select className="contact-select" value={topic} onChange={(e) => setTopic(e.target.value)}>
              <option value="" disabled>Choose the topic</option>
              {topics.map((topic) => (
                <option value={topic} key={topic}>{topic}</option>
              ))}
            </select>
            <textarea className="contact-comments" placeholder="Describe your topic here" value={comment} onChange={(e) => setComment(e.target.value)} />
            <button className="contact-button" onClick={(e) => handleSend(e)}>Send</button>
            {contactErrors.length !== 0 ?
              <div className="contact-error-list">
                {contactErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </div>
              : <></>}
          </form>
        </div>
      </div>
    </div >
  )
}