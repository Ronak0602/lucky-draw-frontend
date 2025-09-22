import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './JoinPage.css';


const JoinPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    address: '',
    terms: false,
  });

  const [message, setMessage] = useState('');
  const [, setMessageColor] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, phone, gender, address, terms } = formData;

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      alert("Phone number must be exactly 10 digits.");
      return;
    }


    if (!name || !email || !gender || !address || !terms) {
      setMessage("Please fill all fields.");
      setMessageColor("red");
      return;
    }
    console.log(process.env.REACT_APP_SERVER_URL, "URL");
    try {

      const res = await fetch(`${process.env.REACT_APP_SERVER_URL}luckydraw/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        name,
        email,
        phone,
        gender,
        address,
        terms,
        customer_details: {   
          customer_id: email.replace(/[^a-zA-Z0-9_-]/g, "_"), 
          customer_email: email,
          customer_name: name,
          customer_phone: phone,
        }
      }),
    });
      const data = await res.json();

      if (res.ok) {
        const userId = data?.user?._id;

        if (userId) {
          navigate(`/payment/${userId}`, {
            state: { 
          phone: formData.phone,
          name:formData.name, 
          email: formData.email }  
          });
        } else {
          setMessageColor("red");
          setMessage("User ID not received from server.");
        }
      } else {
        setMessageColor("red");
        setMessage(data.message || "Error joining.");
      }
    } catch (err) {
      setMessageColor("red");
      setMessage("Server error. Try again later.");
    }
  };

  return (
    <div className="join-page">
      <h1>Lucky Draw Join Form</h1>

      <div className="main-container">
        <div className="form-wrapper"> {/* ✅ NEW wrapper added */}
          <form onSubmit={handleSubmit} id="joinForm">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label htmlFor="phone">Phone Number</label>
            <input
              type="text"
              id="phone"
              name="phone"
              placeholder="Enter your phone number"
              maxLength="10"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <label style={{ display: 'block', marginBottom: '2px' }}>Gender</label>
            <div className="gender-group">
              <input
                type="radio"
                id="male"
                name="gender"
                value="Male"
                checked={formData.gender === 'Male'}
                onChange={handleChange}
                required
              />
              <label htmlFor="male">Male</label>

              <input
                type="radio"
                id="female"
                name="gender"
                value="Female"
                checked={formData.gender === 'Female'}
                onChange={handleChange}
                required
              />

              
              <label htmlFor="female">Female</label>

              <input
                type="radio"
                id="other"
                name="gender"
                value="Other"
                checked={formData.gender === 'Other'}
                onChange={handleChange}
                required
              />
              <label htmlFor="other">Other</label>
            </div>

            <label htmlFor="address">Address</label>
            <textarea
              id="address"
              name="address"
              placeholder="Enter your address"
              rows="1"
              value={formData.address}
              onChange={handleChange}
              required
            />

            <label>
              <input
                type="checkbox"
                name="terms"
                checked={formData.terms}
                onChange={handleChange}
                required
              />{' '}
              I agree to the terms and conditions
            </label>


          </form>
          <div className="submit-button-container">
            <button type="submit" form="joinForm">Join Lucky Draw</button>

            {message && (
              <p id="message" style={{ textAlign: 'center', color: '#000', marginTop: '10px' }}>
                {message}
              </p>
            )}
          </div>





        </div>
      </div>
    </div>
  );
};

export default JoinPage;
