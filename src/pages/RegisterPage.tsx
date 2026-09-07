import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import RegistrationPage from "@/components/RegistrationPage";

const RegisterPage = () => {
  const { mode } = useParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="animate-in fade-in duration-500">
      <RegistrationPage mode={mode || "list-studio"} onBack={() => navigate(-1)} />
    </div>
  );
};

export default RegisterPage;
