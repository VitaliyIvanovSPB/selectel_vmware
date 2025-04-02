import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializeTelegramWebApp, closeTelegramWebApp } from './TelegramWebApp';

const TABLES = [
  'parameters',
  'cpus',
  'servers',
  'rams',
  'esxi_disks',
  'network_cards',
  'hba_adapters',
  'capacity_disks',
  'cache_disks'
];

function UpdatePricesPage() {
  const [tablesData, setTablesData] = useState({});
  const [selectedTable, setSelectedTable] = useState(null);
  const [editingItemId, setEditingItemId] = useState(null);
  const [newPrice, setNewPrice] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  const tg = window.Telegram?.WebApp;

  useEffect(() => {
    initializeTelegramWebApp();
  }, []);

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => closeTelegramWebApp(), 2000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!newPrice || isNaN(newPrice)) {
      alert('Введите корректную цену');
      return;
    }

    try {
      const dataToSend = {
        table: selectedTable,
        itemId: editingItemId,
        newPrice: parseFloat(newPrice)
      };

      tg.sendData('upd=' + JSON.stringify(dataToSend));
      setIsSuccess(true);
      
      // Обновляем локальные данные
      setTablesData(prev => ({
        ...prev,
        [selectedTable]: prev[selectedTable].map(item =>
          item.id === editingItemId ? { ...item, price: newPrice } : item
        )
      }));

      setEditingItemId(null);
      setNewPrice('');
    } catch (err) {
      console.error(err);
      alert('Ошибка отправки данных!');
    }
  };

  // Загрузка данных (замените на реальный API)
  useEffect(() => {
    const fakeData = {};
    TABLES.forEach(table => {
      fakeData[table] = Array.from({ length: 5 }, (_, i) => ({
        id: i + 1,
        name: `${table}_item_${i + 1}`,
        price: Math.floor(Math.random() * 1000)
      }));
    });
    setTablesData(fakeData);
  }, []);

  return (
    <div className="container mt-5">
      <button 
        className="btn btn-link mb-3" 
        onClick={() => navigate('/selectel_vmware')}
      >
        ← Назад
      </button>
      
      <div className="card shadow-sm">
        <div className="card-body">
          <h3 className="card-title text-center text-primary mb-4">
            Обновление цен
          </h3>
          
          {isSuccess ? (
            <div className="alert alert-success">
              Данные успешно отправлены! Закрытие...
            </div>
          ) : (
            <>
              {!selectedTable ? (
                <div className="list-group">
                  {TABLES.map(table => (
                    <div
                      key={table}
                      className="list-group-item list-group-item-action"
                      onClick={() => setSelectedTable(table)}
                    >
                      <div className="d-flex justify-content-between">
                        <span>{table}</span>
                        <span className="badge bg-secondary">
                          {tablesData[table]?.length || 0} записей
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <button 
                    className="btn btn-link mb-3" 
                    onClick={() => setSelectedTable(null)}
                  >
                    ← Назад к списку
                  </button>
                  
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Название</th>
                        <th>Цена</th>
                        <th>Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tablesData[selectedTable]?.map(item => (
                        <tr key={item.id}>
                          <td>{item.id}</td>
                          <td>{item.name}</td>
                          <td>{item.price}</td>
                          <td>
                            <button 
                              className="btn btn-sm btn-primary"
                              onClick={() => {
                                setEditingItemId(item.id);
                                setNewPrice(item.price);
                              }}
                            >
                              Редактировать
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}

              {editingItemId && (
                <form onSubmit={handleSave} className="mt-4 p-3 border rounded bg-light">
                  <h5>Редактирование цены</h5>
                  <div className="mb-3">
                    <label className="form-label">Новая цена</label>
                    <input
                      type="number"
                      className="form-control"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      required
                    />
                  </div>
                  <button 
                    type="submit"
                    className="btn btn-success me-2"
                  >
                    Сохранить в Telegram
                  </button>
                  <button 
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setEditingItemId(null);
                      setNewPrice('');
                    }}
                  >
                    Отмена
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default UpdatePricesPage;