import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import FloatingWidgets from './components/FloatingWidgets.jsx';

import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Transportation from './pages/Transportation.jsx';
import StoneRange from './pages/StoneRange.jsx';
import StoneDetail from './pages/StoneDetail.jsx';
import StoneProducts from './pages/StoneProducts.jsx';
import Contact from './pages/Contact.jsx';
import NotFound from './pages/NotFound.jsx';

function ScrollToTopOnNavigate() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <div className="page-wrapper">
      <ScrollToTopOnNavigate />
      <Header />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/transportation" element={<Transportation />} />
          <Route path="/stone-range" element={<StoneRange />} />
          <Route path="/stone-range/:slug" element={<StoneDetail />} />
          <Route path="/stone-products" element={<StoneProducts />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
      <FloatingWidgets />
    </div>
  );
}
