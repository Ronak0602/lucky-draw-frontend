import { useState } from 'react';
import { useParams } from 'react-router-dom';

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
      const res = await fetch(`${serverUrl}api/payment/upload-proof/${userId}`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Payment proof uploaded successfully!');
      } else {
        setMessage('Error: ' + data.msg || 'Unknown error');
      }
    } catch (err) {
      setMessage('Error: ' + err.message || 'Something went wrong');
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h2>Scan this QR to pay ₹1</h2>
      <img src="/QR_code.jpg" alt="QR Code" width="200" />  {/* QR image path */}
      
      <br />
      <input type="file" onChange={handleFileChange} />
      <br /><br />
      <button onClick={handleUpload}>Upload Payment Proof</button>

      {message && <p style={{ color: message.includes('Error') ? 'red' : 'green' }}>{message}</p>}
    </div>
  );
};

export default PaymentProofPage;
