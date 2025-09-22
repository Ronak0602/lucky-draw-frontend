import { useState } from "react";
import { useLocation } from "react-router-dom";
import "./IntroPage.css";

const PaymentProofPage = () => {
  // const { userId } = useParams();
  const location = useLocation();
  const { phone, email, name, userId  } = location.state || {};
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    setMessage("");

    const serverUrl = process.env.REACT_APP_SERVER_URL;

    const order_id = "order_" + Date.now();

    const customer_id = email.replace(/[^a-zA-Z0-9_-]/g, "_");

    try {
      // 1. Create Cashfree order on backend
      const res = await fetch(`${serverUrl}payment/create-cashfree-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_id,
          order_amount: "1",
          order_currency: "INR",
          customer_details: {
            customer_id,
            customer_name: name,
            customer_email: email,
            customer_phone: phone,
          }
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


        setTimeout(async () => {
    try {
      const verifyRes = await fetch(`${serverUrl}payment/verify-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId, // Ye userId pass karna hai jisse payment ka record update ho
          paymentStatus: "success",
          transactionId: order_id, // order id ya transaction id
          paymentProof: "" // agar proof image ya koi file hai toh
        }),
      });

      const verifyData = await verifyRes.json();
      console.log("✅ Payment Verified:", verifyData);
    } catch (verifyError) {
      console.error(" Error verifying payment:", verifyError.message);
    }
  }, 5000); 
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
