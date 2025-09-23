import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import IntroPage from "./components/IntroPage";
import JoinPage from './components/JoinPage';
import PaymentProofPage from './components/PaymentProofPage';
import ReferralPage from "./components/ReferralPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<IntroPage />} />  
        <Route path="/join" element={<JoinPage />} />
        <Route path="/payment/:userId" element={<PaymentProofPage />} /> 
        <Route path="/referral" element={<ReferralPage />} /> 
      </Routes>
    </Router>
  );
}

export default App;
