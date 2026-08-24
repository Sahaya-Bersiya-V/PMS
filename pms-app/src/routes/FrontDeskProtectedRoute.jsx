import { Navigate } from "react-router-dom";

const FrontDeskProtectedRoute = ({ children }) => {

    const employee =
        localStorage.getItem(
            "frontdesk_employee"
        );

    const hotel =
        localStorage.getItem(
            "frontdesk_hotel"
        );

    if (!employee || !hotel) {

        return (
            <Navigate
                to="/frontdesk/login"
                replace
            />
        );
    }

    return children;
};

export default FrontDeskProtectedRoute;