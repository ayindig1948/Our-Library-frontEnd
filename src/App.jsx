import BooksList from "./assets/Components/booksList";
import HomePage from "./assets/Pages/HomePage";
import { useAuth0 } from "@auth0/auth0-react";
import NavBar from "./assets/Components/NavBar";
import CheckInPage from "./assets/Pages/CheckIn";
import { Route, Routes } from "react-router";
import AboutPage from "./assets/Pages/About";
import ErrorPage from "./assets/Pages/Error";
import AdminPage from "./assets/Pages/Admin";
import Footer from "./assets/Components/Footer";

function App() {
  const {
    isLoading, // Loading state, the SDK needs to reach Auth0 on load
    isAuthenticated,
    error,
    loginWithRedirect: login, // Starts the login flow
    logout: auth0Logout, // Starts the logout flow
    user, // User profile
  } = useAuth0();

  const signup = () =>
    login({ authorizationParams: { screen_hint: "signup" } });

  const logout = () =>
    auth0Logout({ logoutParams: { returnTo: window.location.origin } });

  return (
    <>
    {isAuthenticated && <NavBar user={user} logout={logout} />  }
    <Routes>

      <Route path="/" element={<HomePage
    isLoading={isLoading}
    isAuthenticated={isAuthenticated}
    error={error}
    login={login}
    signup={signup}
    logout={logout}
    user={user}
/>} />
<Route path="About" element={<AboutPage />} />
<Route path="CheckIn" element={<CheckInPage />} />
<Route path="Admin" element={<AdminPage />} />
<Route path="*" element={<ErrorPage />} />
    </Routes>
    <Footer/>
    </>
  );
}

export default App;
