import { useState } from "react";
import { useParams } from "react-router-dom";
import "./IntroPage.css";

const PaymentProofPage = () => {
  const { userId } = useParams();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    setMessage("");

    const serverUrl = process.env.REACT_APP_SERVER_URL;

    try {
      // 1. Create order on backend
      const orderRes = await fetch(`${serverUrl}payment/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: 1 }), // ₹1 payment
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        setLoading(false);
        setMessage(orderData.msg || "Failed to create order");
        return;
      }

      const { order } = orderData;
      console.log("Razorpay Key:", process.env.REACT_APP_RAZORPAY_KEY_ID);
      // 2. Setup Razorpay options
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: "Lucky Draw Contest",
        description: "Entry fee payment",
        handler: async function (response) {
          // 3. Verify payment on backend
          try {
            const verifyRes = await fetch(`${serverUrl}payment/verify`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                userId: userId,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok) {
              setMessage("Payment Successful! You have joined the contest.");
            } else {
              setMessage("Payment verification failed: " + (verifyData.msg || ""));
            }
          } catch (err) {
            setMessage("Verification error: " + err.message);
          }
        },
      };

      setLoading(false);
      // 4. Open Razorpay Checkout
      const rzp = new window.Razorpay(options);
      rzp.open();
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

      {message && <p style={{ color: message.includes("error") ? "red" : "green" }}>{message}</p>}
    </div>
  );
};

export default PaymentProofPage;
