
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import './index.css'
import { Auth0Provider } from "@auth0/auth0-react";
import { BrowserRouter } from "react-router";

const onRedirectCallback = (appState) => {
  // Remove the Auth0 ?code & ?state params from the URL after login
  // so a refresh/back doesn't try to re-use a one-time code.
  window.history.replaceState(
    {},
    document.title,
    appState?.returnTo || window.location.pathname
  );
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
    <Auth0Provider
      domain="dev-m6ga7dm4tg1d50gm.us.auth0.com"
      clientId="e8f5dbfHPNxvYDBEl6c3BRw27ZKHnXrb"
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: "my-apiLib-demo",
      }}
      onRedirectCallback={onRedirectCallback}
      cacheLocation="localstorage"
      useRefreshTokens={true}
    >
      <App />
    </Auth0Provider>
    </BrowserRouter>
  </StrictMode>,
);
