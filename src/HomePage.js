import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-body">
          <h3 className="card-title text-center text-primary mb-4">Menu</h3>
          <div className="d-grid gap-3">
            <button 
              className="btn btn-primary" 
              onClick={() => navigate('/calculator')}
            >
              Calculator
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={() => navigate('/update-prices')}
            >
              Update hardware prices
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;