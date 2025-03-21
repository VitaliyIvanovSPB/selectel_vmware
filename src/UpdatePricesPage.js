import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function UpdatePricesPage() {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [price, setPrice] = useState('');
  const navigate = useNavigate();

  // Загрузка таблиц из БД
  useEffect(() => {
    // Здесь должен быть реальный API-запрос
    const fakeTables = [
      { id: 1, name: 'Таблица 1', current_price: 100 },
      { id: 2, name: 'Таблица 2', current_price: 200 }
    ];
    setTables(fakeTables);
  }, []);

  const handleSave = async () => {
    // Здесь должна быть логика сохранения в БД
    console.log('Сохранение цены:', price, 'для таблицы', selectedTable);
    setSelectedTable(null);
    setPrice('');
  };

  return (
    <div className="container mt-5">
      <button className="btn btn-link mb-3" onClick={() => navigate(-1)}>
        ← Back
      </button>
      <div className="card shadow-sm">
        <div className="card-body">
          <h3 className="card-title text-center text-primary mb-4">Select table:</h3>
          {!selectedTable ? (
            <div>
              <ul className="list-group">
                {tables.map(table => (
                  <li 
                    key={table.id}
                    className="list-group-item list-group-item-action"
                    onClick={() => setSelectedTable(table)}
                  >
                    {table.name} (Текущая цена: {table.current_price})
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div>
              <h5>Редактирование: {selectedTable.name}</h5>
              <div className="mb-3">
                <label className="form-label">Новая цена</label>
                <input
                  type="number"
                  className="form-control"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <button 
                className="btn btn-primary"
                onClick={handleSave}
              >
                Сохранить
              </button>
              <button 
                className="btn btn-secondary ms-2"
                onClick={() => setSelectedTable(null)}
              >
                Отмена
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UpdatePricesPage;