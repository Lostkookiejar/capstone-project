import { getAuth } from "firebase/auth";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthProvider";

function Dashboard() {
  const auth = getAuth();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  const handleLogout = () => {
    auth.signOut();
  };
  return (
    <>
      <h1>Dashboard</h1>
      <button onClick={handleLogout}>logout</button>
    </>
  );
}

export default Dashboard;
