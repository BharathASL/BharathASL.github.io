import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import ProjectsPage from './pages/ProjectsPage.jsx';
import './styles/global.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ProjectsPage />
  </StrictMode>,
);
