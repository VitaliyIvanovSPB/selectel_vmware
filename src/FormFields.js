import React from 'react';

const FormFields = ({ formData, setFormData, errors }) => {
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

  const handleSlackStep = (step) => () => {
    let currentValue = parseFloat(formData.slack_space) || 0;
    currentValue += step;
    if (currentValue < 0) currentValue = 0;
    if (currentValue > 1) currentValue = 1;
    const rounded = Math.round(currentValue * 20) / 20;
    setFormData({ ...formData, slack_space: rounded.toFixed(2) });
  };

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

  return (
    <div className="row g-3">
      {fieldOrder.map((key) => {
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
                <option value="any">any</option>
                <option value="amd">amd</option>
                <option value="intel">intel</option>
              </select>
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
                <option value="ssd">ssd</option>
                <option value="nvme">nvme</option>
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

        return (
          <div className="col-12" key={key}>
            <label className="form-label">
            {key === 'cpu_overcommit' ? 'CPU Overcommit' :
                key === 'network_card_qty' ? 'Network Card Qty' :
                key === 'vcpu' ? 'vCPU' :
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