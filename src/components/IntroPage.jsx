
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CountdownTimer from "../components/CountdownTimer";
import "./IntroPage.css";

const previousWinners = [
    { name: "RameshBhai", comment: "I won ₹10,000 in the lucky draw — unbelievable!" },
    { name: "Kano", comment: "Amazing prizes and easy to join." },
    { name: "काजल", comment: "फिर से भाग लेने का इंतजार नहीं कर सकती!" },
    { name: "Aman", comment: "Thought it was fake, but I actually won 10,000 cash!" },
    { name: "સુરેશ", comment: "₹10,000 મળી ગયું, ભાઈ મેં ક્યારેય વિચાર્યું નહોતું, મજાનું હતું!" },
    { name: "Anjali", comment: "Such a cool surprise! Didn't expect to win." },
    { name: "Vikas", comment: "This is the most fun I’ve had online in a while!" },
    { name: "Reena", comment: "Joined for fun, ended up winning a smartwatch!" },
    { name: "Nikhil", comment: "Told all my friends about it after I won ₹10,000!" },
    { name: "Faizan", comment: "First time trying my luck and it actually worked!" }
];

const winnerDate = "2025-10-05T18:00:00";

const IntroPage = () => {
    const navigate = useNavigate();
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        setAnimate(true);
    }, []);

    const handleStart = () => {
        navigate("/join");
    };

    return (
        <div className={`intro-container ${animate ? "bounce-in" : ""}`}>
            <h1 className="intro-title">🎉 Hurray! Big Offer Just for You! 🎁</h1>

            <p className="highlight bounce-in">
                🎁 First lucky winner will get ₹10,000 cash prize! 🤑
            </p>

            <CountdownTimer targetDate={winnerDate} />

            <p className="intro-text">
                Welcome to the Lucky Draw! 🎲<br />
                One lucky winner will take home ₹10,000 in cash! Will it be you? Join now! 🤑🎉<br />
                Don't miss this limited-time offer. 🎉 <br />
                Ready to win amazing prizes? Join our lucky draw and stand a chance to win exciting gifts! 🎉
            </p>

            <div className="winners-section">
                <h2 className="sub-text">What Our Previous Winners Say:</h2>
                {previousWinners.map((winner, index) => (
                    <div key={index} className="winner-comment-container">
                        <p className="winner-comment-text">
                            <strong>{winner.name}:</strong> "{winner.comment}"
                        </p>
                    </div>
                ))}
            </div>

            <button className="start-button" onClick={handleStart}>
                Start Your Journey 🚀
            </button>
        </div>
    );
};



export default IntroPage;
