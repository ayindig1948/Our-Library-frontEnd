import{ NavLink } from "react-router";
const ErrorPage = () => {
    return (
        <div>
            <h1>Oops!</h1>
            <p>The page you're looking for doesn't exist.</p>
            <p><NavLink to="/">Return to Home</NavLink></p>
        </div>
    );
};

export default ErrorPage;