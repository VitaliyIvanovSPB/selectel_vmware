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

  // Универсальный обработчик изменения значений с шагом
  const handleStep = (field, step) => () => {
    const currentValue = parseInt(formData[field], 10) || 0;
    const newValue = Math.max(currentValue + step, 0); // Минимум 0
    setFormData({ ...formData, [field]: newValue });
  };

  return (
    <div className="row g-3">
      {fieldOrder.map((key) => {
        if (key === 'cpu_vendor') {
          const options = ['any', 'amd', 'intel'];
          return (
            <div className="col-12" key={key}>
              <label className="form-label">Производитель ЦП</label>
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
              <label className="form-label">Тип дисков vSAN</label>
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
                    onClick={handleStep('cpu_overcommit', -1)}
                  >
                    -1
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleStep('cpu_overcommit', 1)}
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
                  readOnly
                  min="1"
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
                Кол-во сетевых карт
                <div className="btn-group btn-group-sm">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleStep('network_card_qty', -1)}
                  >
                    -1
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleStep('network_card_qty', 1)}
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
                  readOnly
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
                Минимальная частота ЦП (MHz)
                <div className="btn-group btn-group-sm">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleStep('cpu_min_frequency', -100)}
                  >
                    -100
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleStep('cpu_min_frequency', 100)}
                  >
                    +100
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleStep('cpu_min_frequency', -1000)}
                  >
                    -1000
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleStep('cpu_min_frequency', 1000)}
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
                  readOnly
                  min="0"
                />
              </div>
              {errors[key] && <div className="invalid-feedback">{errors[key]}</div>}
            </div>
          );
        }

        if (key === 'works_main') {
          const options = [
            { value: 'vsphere', label: 'ЧО' },
            { value: 'vdi', label: 'VDI' },
          ];
          return (
            <div className="col-12" key={key}>
              <label className="form-label">Тип ЧО</label>
              <div className="btn-group w-100" role="group">
                {options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`btn ${formData[key] === option.value ? 'btn-primary' : 'btn-outline-secondary'}`}
                    onClick={() => setFormData({ ...formData, [key]: option.value })}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          );
        }

        // Стандартные числовые поля
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