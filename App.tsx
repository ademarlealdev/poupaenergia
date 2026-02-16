
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import UploadPage from './pages/UploadPage';
import ResultsPage from './pages/ResultsPage';
import ChangePage from './pages/ChangePage';
import TariffsPage from './pages/TariffsPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { BillData } from './types';
import { supabase } from './services/supabaseClient';

const App: React.FC = () => {
  useEffect(() => {
    console.log('Supabase client initialized:', supabase);
  }, []);

  const [extractedData, setExtractedData] = useState<BillData | null>(null);

  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar hasData={!!extractedData} />
        <main className="flex-grow pt-16">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/upload"
              element={<UploadPage onDataExtracted={setExtractedData} />}
            />
            <Route
              path="/resultado"
              element={<ResultsPage data={extractedData} />}
            />
            <Route path="/mudar" element={<ChangePage />} />
            <Route path="/tarifarios" element={<TariffsPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
};

export default App;
