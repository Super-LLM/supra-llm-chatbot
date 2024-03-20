import { IPublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Home from './pages/Home';

type Prop = {
  instance: IPublicClientApplication;
};

const App = ({ instance }: Prop) => {
  return (
    <MsalProvider instance={instance}>
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
        </Routes>
      </Router>
    </MsalProvider>
  );
};

export default App;
