import { useAuth } from "@features/auth/context";
import { Navigate, Outlet } from "react-router-dom";
import { ClipLoader } from "react-spinners";

const PrivateRoute = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <ClipLoader color="#36D7B7" size={50} />
        </div>
        )
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/auth/acceder" />;
};

export default PrivateRoute;