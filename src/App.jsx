import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import Home from './pages/Home';
import CaseStudyPage from './pages/CaseStudyPage';

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/work/:id" element={<CaseStudyPage />} />
      </Routes>
    </BrowserRouter>
  );
}
