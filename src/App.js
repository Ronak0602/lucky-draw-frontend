import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import IntroPage from "./components/IntroPage";
import JoinPage from './components/JoinPage';
import PaymentProofPage from './components/PaymentProofPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<IntroPage />} />  
        <Route path="/join" element={<JoinPage />} />
        <Route path="/payment/:userId" element={<PaymentProofPage />} /> 
      </Routes>
    </Router>
  );
}

export default App;
