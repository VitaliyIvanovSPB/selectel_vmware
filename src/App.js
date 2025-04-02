import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import HomePage from './HomePage';
import CalculatorPage from './CalculatorPage';
// import UpdatePricesPage from './UpdatePricesPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/selectel_vmware" element={<CalculatorPage />} />
        {/* <Route path="/calculator" element={<CalculatorPage />} /> */}
        {/* <Route path="/update-prices" element={<UpdatePricesPage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;