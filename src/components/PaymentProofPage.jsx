import { useState } from "react";
import { useLocation } from "react-router-dom";
import "./IntroPage.css";

const PaymentProofPage = () => {
  // const { userId } = useParams();
  const location = useLocation();
  const { phone, email, name } = location.state || {};
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    setMessage("");

    const serverUrl = process.env.REACT_APP_SERVER_URL;

    const order_id = "order_" + Date.now();

    try {
      // 1. Create Cashfree order on backend
      const res = await fetch(`${serverUrl}payment/create-cashfree-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_id,
          order_amount: 20, // ₹1 payment
          customer_name: name,
          customer_phone: phone,
          customer_email: email,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setLoading(false);
        setMessage(data.error || "Failed to create Cashfree order");
        return;
      }

      const paymentSessionId = data.payment_session_id;

      // 2. Load Cashfree SDK
      const script = document.createElement("script");
      script.src = "https://sdk.cashfree.com/js/ui/2.0.0/cashfree.prod.js";
      script.onload = () => {
        const cashfree = new window.Cashfree(paymentSessionId);
        cashfree.redirect();
      };
      document.body.appendChild(script);

      setLoading(false);
    } catch (err) {
      setLoading(false);
      setMessage("Error: " + err.message);
    }
  };

  return (
    <div className="payment-container">
      <h2>Pay ₹1 to join the Lucky Draw</h2>

      <button onClick={handlePayment} disabled={loading} className="start-button">
        {loading ? "Processing..." : "Pay ₹1"}
      </button>

      {message && <p style={{ color: "red" }}>{message}</p>}
    </div>
  );
};

export default PaymentProofPage;
