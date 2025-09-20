import { useState } from 'react';
import { useParams } from 'react-router-dom';
import "./IntroPage.css";

const PaymentProofPage = () => {
  const { userId } = useParams();  // Get userId from URL params
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files ? e.target.files[0] : null);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('paymentProof', file);

    // Use the environment variable for the production URL
    const serverUrl = process.env.REACT_APP_SERVER_URL

    try {
      const res = await fetch(`${serverUrl}payment/upload-proof/${userId}`, {
        method: 'POST',
        body: formData,
      });

      const text = await res.text(); // pehle response as text lo
      let data;

      try {
        data = JSON.parse(text); // JSON parse try
      } catch {
        data = { msg: text }; // agar parse fail ho, text ko msg me daal do
      }

      if (res.ok) {
        setMessage('Congrats! You joined the contest!');
      } else {
        setMessage('Error: ' + data.msg || 'Unknown error');
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

      <div className="file-upload-container" style={{ marginTop: '-3rem' }}>
        <input
          type="file"
          id="fileInput"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <button className="start-button" onClick={() => document.getElementById('fileInput').click()}>
          Choose File
        </button>
        {file && <span style={{ marginLeft: '10px', marginTop: '-1rem' }}>{file.name}</span>}
      </div>

      <button onClick={handleUpload} className="start-button" style={{ marginTop: '2rem' }}>
        Upload Payment Proof
      </button>

      {message && <p style={{ color: message.includes('Error') ? 'red' : 'green' }}>{message}</p>}
    </div>
  );
};

export default PaymentProofPage;
