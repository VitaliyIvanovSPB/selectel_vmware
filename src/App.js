import { useState, useEffect } from 'react';

export default function App() {
  const initialData = {
    vcpu: "100",
    vram: "200",
    vssd: "1000",
    cpu_overcommit: "3",
    cpu_vendor: "any",
    cpu_min_frequency: "0",
    slack_space: "0.2",
    capacity_disk_type: "ssd",
    network_card_qty: "1",
    works_main: "vsphere",
    works_add: "no",
    currency: ""
  };

  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);
  const tg = window.Telegram?.WebApp;

  // Инициализация Telegram WebApp
  useEffect(() => {
    if (tg) {
      tg.ready();
      tg.expand(); // Расширяем веб-приложение на весь экран
    }
  }, [tg]);

  // Автоматическое закрытие после успешной отправки
  useEffect(() => {
    if (isSuccess && tg) {
      const timer = setTimeout(() => tg.close(), 2000); // Закрываем через 2 секунды
      return () => clearTimeout(timer);
    }
  }, [isSuccess, tg]);

  // Валидация формы
  const validate = () => {
    const newErrors = {};
    const numericFields = ['vcpu', 'vram', 'vssd', 'cpu_min_frequency', 'network_card_qty'];

    numericFields.forEach(field => {
      if (formData[field] && !/^\d+$/.test(formData[field])) {
        newErrors[field] = 'Must be a whole number';
      }
    });

    const slackValue = parseFloat(formData.slack_space);
    if (formData.slack_space) {
      if (isNaN(slackValue)) {
        newErrors.slack_space = 'Invalid number format';
      } else if (slackValue < 0 || slackValue > 1) {
        newErrors.slack_space = 'Must be between 0-1';
      } else if ((slackValue * 100) % 5 !== 0) {
        newErrors.slack_space = 'Must be multiple of 0.05';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Обработчик изменения Slack Space
  const handleSlackChange = (e) => {
    let value = e.target.value.replace(',', '.');

    if (value) {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        const rounded = Math.round(numValue * 20) / 20; // Округляем до ближайшего 0.05
        value = rounded.toFixed(2);
      }
    }

    if (/^(\d+([.]\d{0,2})?|)$/.test(value)) {
      setFormData({ ...formData, slack_space: value });
    }
  };

  // Обработчик кнопок +/- для Slack Space
  const handleSlackStep = (step) => () => {
    let currentValue = parseFloat(formData.slack_space) || 0;
    currentValue += step;

    if (currentValue < 0) currentValue = 0;
    if (currentValue > 1) currentValue = 1;

    const rounded = Math.round(currentValue * 20) / 20;
    setFormData({ ...formData, slack_space: rounded.toFixed(2) });
  };

  // Отправка данных боту
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSuccess(false);

    if (!validate()) return;

    try {
      // Отправляем данные боту через Telegram WebApp sendData
      tg.sendData(JSON.stringify(formData));
      setIsSuccess(true);
      setFormData(initialData);
    } catch (err) {
      console.error(err);
      alert('Submission error!');
    }
  };

  // Порядок полей
  const fieldOrder = [
    'vcpu',
    'vram',
    'vssd',
    'cpu_overcommit',
    'cpu_vendor',
    'cpu_min_frequency',
    'slack_space',
    'capacity_disk_type',
    'network_card_qty',
    'works_main',
    'works_add',
    'currency'
  ];

  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-body">
          <h3 className="card-title text-center text-primary mb-4">VMware Configuration</h3>

          {isSuccess && (
            <div className="alert alert-success" role="alert">
              Data sent successfully! Closing...
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              {fieldOrder.map(key => {
                if (key === 'cpu_vendor') {
                  return (
                    <div className="col-12" key={key}>
                      <label className="form-label">CPU Vendor</label>
                      <select
                        className="form-select"
                        name={key}
                        value={formData[key]}
                        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                      >
                        <option value="any">Any</option>
                        <option value="amd">AMD</option>
                        <option value="intel">Intel</option>
                      </select>
                    </div>
                  );
                }

                if (key === 'cpu_min_frequency') {
                  return (
                    <div className="col-12" key={key}>
                      <label className="form-label">CPU Min Frequency (MHz)</label>
                      <input
                        type="number"
                        className={`form-control ${errors[key] ? 'is-invalid' : ''}`}
                        name={key}
                        value={formData[key]}
                        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                        step="100"
                        min="0"
                      />
                      {errors[key] && <div className="invalid-feedback">{errors[key]}</div>}
                    </div>
                  );
                }

                if (['works_main', 'works_add'].includes(key)) {
                  const options = ['no', 'vsphere', 'dr', 'veeam', 'alb', 'tanzu',
                    'vdi', 'vdi_public', 'vdi_gpu', 'vdi_gpu_public', 'nsx'];

                  return (
                    <div className="col-12" key={key}>
                      <label className="form-label">{key === 'works_main' ? 'Main Workload' : 'Additional Workload'}</label>
                      <select
                        className="form-select"
                        name={key}
                        value={formData[key]}
                        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                      >
                        {options.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                  );
                }

                if (key === 'capacity_disk_type') {
                  return (
                    <div className="col-12" key={key}>
                      <label className="form-label">Disk Type</label>
                      <select
                        className="form-select"
                        name={key}
                        value={formData[key]}
                        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                      >
                        <option value="ssd">SSD</option>
                        <option value="nvme">NVMe</option>
                      </select>
                    </div>
                  );
                }

                if (key === 'slack_space') {
                  return (
                    <div className="col-12" key={key}>
                      <label className="form-label d-flex justify-content-between align-items-center">
                        Slack Space
                        <div className="btn-group btn-group-sm">
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={handleSlackStep(-0.05)}
                          >
                            -0.05
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={handleSlackStep(0.05)}
                          >
                            +0.05
                          </button>
                        </div>
                      </label>
                      <div className="input-group">
                        <input
                          type="text"
                          className={`form-control ${errors[key] ? 'is-invalid' : ''}`}
                          name={key}
                          value={formData[key]}
                          onChange={handleSlackChange}
                          placeholder="0.00"
                        />
                        <span className="input-group-text">%</span>
                      </div>
                      {errors[key] && <div className="invalid-feedback">{errors[key]}</div>}
                    </div>
                  );
                }

                if (key === 'currency') {
                  return (
                    <div className="col-12" key={key}>
                      <label className="form-label">USD Rate</label>
                      <input
                        type="number"
                        className="form-control"
                        name={key}
                        value={formData[key]}
                        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                        step="0.01"
                        placeholder="Optional"
                      />
                    </div>
                  );
                }

                return (
                  <div className="col-12" key={key}>
                    <label className="form-label">
                      {key === 'cpu_overcommit' ? 'CPU Overcommit' :
                        key === 'network_card_qty' ? 'Network Card Qty' :
                          key.replace(/_/g, ' ').toUpperCase()}
                    </label>
                    <input
                      type="number"
                      className={`form-control ${errors[key] ? 'is-invalid' : ''}`}
                      name={key}
                      value={formData[key]}
                      onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                      min={key === 'network_card_qty' ? 1 : 0}
                    />
                    {errors[key] && <div className="invalid-feedback">{errors[key]}</div>}
                  </div>
                );
              })}
            </div>

            <div className="d-grid mt-4">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={Object.keys(errors).length > 0}
              >
                Calculate Cost
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}