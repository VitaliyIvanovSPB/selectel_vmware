import React from 'react';

const FormFields = ({ formData, setFormData, errors }) => {
  const fieldOrder = [
    'vcpu',
    'vram',
    'vssd',
    'cpu_overcommit',
    'cpu_vendor',
    'capacity_disk_type',
    'cpu_min_frequency',
    'network_card_qty',
    'works_main',
  ];

  // Обработчик изменения cpu_overcommit
  const handleCpuOvercommitStep = (step) => () => {
    let currentValue = parseFloat(formData.cpu_overcommit) || 1; // Значение по умолчанию 1
    currentValue += step;
    if (currentValue < 1) currentValue = 1; // Минимальное значение 1
    const rounded = Math.round(currentValue * 10) / 10; // Округляем до ближайшего 0.1
    setFormData({ ...formData, cpu_overcommit: rounded.toFixed(0) });
  };

  const handleCpuOvercommitChange = (e) => {
    let value = e.target.value.replace(',', '.');
    if (value) {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        const rounded = Math.round(numValue * 10) / 10; // Округляем до ближайшего 0.1
        value = rounded.toFixed(0);
      }
    }
    if (/^(\d+([.]\d{0,1})?|)$/.test(value)) {
      setFormData({ ...formData, cpu_overcommit: value });
    }
  };

  // Обработчик изменения network_card_qty
  const handleNetworkCardStep = (step) => () => {
    let currentValue = parseInt(formData.network_card_qty, 10) || 1; // Значение по умолчанию 1
    currentValue += step;
    if (currentValue < 1) currentValue = 1; // Минимальное значение 1
    setFormData({ ...formData, network_card_qty: currentValue });
  };

  // Обработчик изменения cpu_min_frequency
  const handleCpuMinFrequencyStep = (step) => () => {
    let currentValue = parseInt(formData.cpu_min_frequency, 10) || 0; // Значение по умолчанию 0
    currentValue += step;
    if (currentValue < 0) currentValue = 0; // Минимальное значение 0
    setFormData({ ...formData, cpu_min_frequency: currentValue });
  };

  return (
    <div className="row g-3">
      {fieldOrder.map((key) => {
        if (key === 'cpu_vendor') {
          const options = ['any', 'amd', 'intel'];
          return (
            <div className="col-12" key={key}>
              <label className="form-label">CPU Vendor</label>
              <div className="btn-group w-100" role="group">
                {options.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={`btn ${formData[key] === option ? 'btn-primary' : 'btn-outline-secondary'}`}
                    onClick={() => setFormData({ ...formData, [key]: option })}
                  >
                    {option.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          );
        }

        if (key === 'capacity_disk_type') {
          const options = ['ssd', 'nvme'];
          return (
            <div className="col-12" key={key}>
              <label className="form-label">Disk Type</label>
              <div className="btn-group w-100" role="group">
                {options.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={`btn ${formData[key] === option ? 'btn-primary' : 'btn-outline-secondary'}`}
                    onClick={() => setFormData({ ...formData, [key]: option })}
                  >
                    {option.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          );
        }

        if (key === 'cpu_overcommit') {
          return (
            <div className="col-12" key={key}>
              <label className="form-label d-flex justify-content-between align-items-center">
                Переподписка ЦП
                <div className="btn-group btn-group-sm">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleCpuOvercommitStep(-1)}
                  >
                    -1
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleCpuOvercommitStep(1)}
                  >
                    +1
                  </button>
                </div>
              </label>
              <div className="input-group">
                <input
                  type="text"
                  className={`form-control ${errors[key] ? 'is-invalid' : ''}`}
                  name={key}
                  value={formData[key]}
                  onChange={handleCpuOvercommitChange}
                  placeholder="1.0"
                />
              </div>
              {errors[key] && <div className="invalid-feedback">{errors[key]}</div>}
            </div>
          );
        }

        if (key === 'network_card_qty') {
          return (
            <div className="col-12" key={key}>
              <label className="form-label d-flex justify-content-between align-items-center">
                Network Card Qty
                <div className="btn-group btn-group-sm">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleNetworkCardStep(-1)}
                  >
                    -1
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleNetworkCardStep(1)}
                  >
                    +1
                  </button>
                </div>
              </label>
              <div className="input-group">
                <input
                  type="number"
                  className={`form-control ${errors[key] ? 'is-invalid' : ''}`}
                  name={key}
                  value={formData[key]}
                  readOnly // Делаем поле только для чтения
                  min="1"
                />
              </div>
              {errors[key] && <div className="invalid-feedback">{errors[key]}</div>}
            </div>
          );
        }

        if (key === 'cpu_min_frequency') {
          return (
            <div className="col-12" key={key}>
              <label className="form-label d-flex justify-content-between align-items-center">
                CPU Min Frequency (MHz)
                <div className="btn-group btn-group-sm">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleCpuMinFrequencyStep(-100)}
                  >
                    -100
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleCpuMinFrequencyStep(100)}
                  >
                    +100
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleCpuMinFrequencyStep(-1000)}
                  >
                    -1000
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleCpuMinFrequencyStep(1000)}
                  >
                    +1000
                  </button>
                </div>
              </label>
              <div className="input-group">
                <input
                  type="number"
                  className={`form-control ${errors[key] ? 'is-invalid' : ''}`}
                  name={key}
                  value={formData[key]}
                  readOnly // Делаем поле только для чтения
                  min="0"
                />
              </div>
              {errors[key] && <div className="invalid-feedback">{errors[key]}</div>}
            </div>
          );
        }

        
        if (key === 'works_main') {
          const options = ['vsphere', 'vdi'];
          return (
            <div className="col-12" key={key}>
              <label className="form-label">
                Тип ЧО
                </label>
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
        
        return (
          <div className="col-12" key={key}>
            <label className="form-label">
              {key === 'vcpu' ? 'vCPU' :
                key === 'vram' ? 'vRAM' :
                key === 'vssd' ? 'vSSD' :
                key.replace(/_/g, ' ')}
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
  );
};

export default FormFields;