import { useContext } from "react";
import { UserContext } from "../../App";
import { Navigate } from "react-router";
const ProtectedRoute = ({ children }) => {
  const { user } = useContext(UserContext);
  if (user===null) {
    return <Navigate to="/login" />;
  } else {
    return children;
  }
};

export default ProtectedRoute;
