import { useState } from 'react';
import { useParams } from 'react-router-dom';
import "./IntroPage.css";

const PaymentProofPage = () => {
  const { userId } = useParams();  // Get userId from URL params
  const [utrId, setUtrId] = useState('');
  const [message, setMessage] = useState('');


  // const handleUpload = async () => {
  //   if (!file) {
  //     setMessage('Please select a file to upload.');
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append('paymentProof', file);

  //   // Use the environment variable for the production URL
  //   const serverUrl = process.env.REACT_APP_SERVER_URL

  //   try {
  //     const res = await fetch(`${serverUrl}payment/upload-proof/${userId}`, {
  //       method: 'POST',
  //       body: formData,
  //     });

  //     const text = await res.text(); // pehle response as text lo
  //     let data;

  //     try {
  //       data = JSON.parse(text); // JSON parse try
  //     } catch {
  //       data = { msg: text }; 
  //     }

  //     if (res.ok) {
  //       setMessage('Congrats! You joined the contest!');
  //     } else {
  //       setMessage('Error: ' + data.msg || 'Unknown error');
  //     }
  //   } catch (err) {
  //     setMessage('Error: ' + err.message || 'Something went wrong');
  //   }
  // };

  const handleConfirm = async () => {
    if (!utrId.trim()) {
      setMessage('Please enter a valid UTR ID.');
      return;
    }

    const serverUrl = process.env.REACT_APP_SERVER_URL;

    try {
      const res = await fetch(`${serverUrl}payment/confirm-utr/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ utrId }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.msg);
      } else {
        setMessage('Error: ' + (data.msg || 'Unknown error'));
      }
    } catch (err) {
      setMessage('Error: ' + err.message || 'Something went wrong');
    }
  };


  return (
    <div className="payment-container">
      <h2>Scan this QR to pay ₹1</h2>

      <img src="/QR_code.jpg" alt="QR Code" width="200" style={{ marginBottom: '-0.35rem' }} />

      <a href="upi://pay?pa=sumit.verma0991-3@oksbi&pn=MyShop&tn=Payment for test&am=1&cu=INR">
        <button className="start-button">Pay ₹1</button>
      </a>

      <div style={{ marginTop: '2rem' }}>
        <label htmlFor="utrInput">Enter your UTR ID:</label>
        <input
          id="utrInput"
          type="text"
          value={utrId}
          onChange={(e) => setUtrId(e.target.value)}
          placeholder="Enter UTR ID here"
          style={{ marginLeft: '10px', padding: '5px', width: '250px' }}
        />

      </div>

      <button
        onClick={handleConfirm}
        className="start-button"
        style={{ marginTop: '1rem' }}
      >
        Confirm
      </button>



      {message && <p style={{ color: message.includes('Error') ? 'red' : 'green' }}>{message}</p>}
    </div>
  );
};

export default PaymentProofPage;
