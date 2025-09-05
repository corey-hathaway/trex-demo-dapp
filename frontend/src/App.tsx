import "./App.css";
import { Navigation } from "./components/Navigation";
import { Dashboard } from "./components/Dashboard";
import { Footer } from "./components/Footer";
import { NewHomepage } from "./components/NewHomepage";
import { useState } from "react";

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'dashboard'>('home');

  const handlePageChange = (page: 'home' | 'dashboard') => {
    setCurrentPage(page);
  };

  return (
    <div className="app-container">
      {/* Navigation */}
      <Navigation currentPage={currentPage} onPageChange={handlePageChange} />
      
      {/* Page Content */}
      {currentPage === 'home' && <NewHomepage />}


      {currentPage === 'dashboard' && (
        <div className="container mx-auto px-6 py-8">
          <Dashboard />
        </div>
      )}
      
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
