import {
  InteractionRequiredAuthError
} from '@azure/msal-browser';
import { MsalProvider, useIsAuthenticated, useMsal } from '@azure/msal-react';
import { useEffect } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { popupLoginRequest, ssoSilentLoginRequest } from './config/authConfig';
import About from './pages/About';
import Home from './pages/Home';
import { AppProps } from './types';



const App = ({ instance }: AppProps) => {
  return (
    <MsalProvider instance={instance}>
      <Router>
        <Pages />
      </Router>
    </MsalProvider>
  );
};

const Pages = () => {
  const { instance } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  // SILENT LOGIN PROCESS WILL ATTEMPT TO REFRESH THE TOKEN IN THE BACKGROUND
  useEffect(() => {
    if (!isAuthenticated) {
      instance
        .ssoSilent({ ...ssoSilentLoginRequest, loginHint: '' })
        .then((response) => instance.setActiveAccount(response.account))
        .catch((error) => {
          if (error instanceof InteractionRequiredAuthError) {
            instance.loginRedirect(popupLoginRequest);
          }
        });
    }
  }, []);

  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/about' element={<About />} />
    </Routes>
  );
};

export default App;
