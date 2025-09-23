import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ReferralPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const ref = query.get("ref");

  useEffect(() => {
    if (ref) {
      localStorage.setItem("referrerId", ref);
    }

    navigate("/", { replace: true });
  }, [ref, navigate]);

  return null;
};

export default ReferralPage;
