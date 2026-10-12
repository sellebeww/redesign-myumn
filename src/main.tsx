import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import PortalSession from './components/PortalSession';
import { PreferencesProvider } from './lib/preferences';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PreferencesProvider>
      <PortalSession />
    </PreferencesProvider>
  </StrictMode>,
);
