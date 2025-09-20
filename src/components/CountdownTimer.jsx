import { useEffect, useState } from "react";

const CountdownTimer = ({ targetDate }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      timeLeft = null;
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  if (!timeLeft) {
    return <p style={{ color: "red", fontWeight: "bold" }}>🎉 The winner has been declared!</p>;
  }

  return (
    <div style={{ fontSize: "1rem", color: "#333", margin: "10px 0", textAlign: "center" }}>
      ⏳ Winner will be declared in:{" "}
      {timeLeft.days > 0 && `${timeLeft.days}d `}
      {timeLeft.hours.toString().padStart(2, "0")}h :
      {timeLeft.minutes.toString().padStart(2, "0")}m :
      {timeLeft.seconds.toString().padStart(2, "0")}s
    </div>
  );
};

export default CountdownTimer;
