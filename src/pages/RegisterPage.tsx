import { useParams, useNavigate } from "react-router-dom";
import RegistrationPage from "@/components/RegistrationPage";

const RegisterPage = () => {
  const { mode } = useParams();
  const navigate = useNavigate();
  return <RegistrationPage mode={mode || "list-studio"} onBack={() => navigate("/")} />;
};

export default RegisterPage;
