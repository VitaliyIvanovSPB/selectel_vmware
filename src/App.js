import { useState } from 'react';

export default function TelegramWebApp() {
  const initialData = {
    vcpu: "100",
    vram: "200",
    vssd: "1000",
    cpu_vendor: "any",
    cpu_min_frequency: "0",
    cpu_overcommit: "3",
    works_main: "vsphere",
    works_add: "no",
    network_card_qty: "1",
    slack_space: "0.2",
    capacity_disk_type: "ssd",
    currency: ""
  };

  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    const newErrors = {};
    const numericFields = ['vcpu', 'vram', 'vssd', 'cpu_min_frequency', 'network_card_qty'];
    
    numericFields.forEach(field => {
      if (formData[field] && !/^\d+$/.test(formData[field])) {
        newErrors[field] = 'Must be a whole number';
      }
    });

    if (formData.slack_space && 
        (formData.slack_space < 0 || formData.slack_space > 1 || formData.slack_space % 0.05 !== 0)) {
      newErrors.slack_space = 'Must be 0-1 with 0.05 step';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSuccess(false);
    
    if (!validate()) return;

    try {
      const botToken = process.env.REACT_APP_BOT_TOKEN;
      const chatId = process.env.REACT_APP_CHAT_ID;
      const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

      const query = Object.entries(formData)
        .filter(([_, v]) => v !== "")
        .map(([k, v]) => `${k}=${v}`)
        .join(" ");
        
      await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: `/calculate ${query}`
        })
      });
      
      setIsSuccess(true);
      setFormData(initialData);
    } catch (err) {
      console.error(err);
      alert('Submission error!');
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-body">
          <h3 className="card-title text-center text-primary mb-4">VMware Configuration</h3>
          
          {isSuccess && (
            <div className="alert alert-success" role="alert">
              Data sent successfully!
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              {Object.keys(formData).map(key => {
                if (key === 'cpu_vendor') {
                  return (
                    <div className="col-12" key={key}>
                      <label className="form-label">CPU Vendor</label>
                      <select 
                        className="form-select"
                        name={key}
                        value={formData[key]}
                        onChange={(e) => setFormData({...formData, [key]: e.target.value})}
                      >
                        <option value="any">any</option>
                        <option value="amd">amd</option>
                        <option value="intel">intel</option>
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
                        onChange={(e) => setFormData({...formData, [key]: e.target.value})}
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
                        onChange={(e) => setFormData({...formData, [key]: e.target.value})}
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
                        onChange={(e) => setFormData({...formData, [key]: e.target.value})}
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
                      <label className="form-label">Slack Space</label>
                      <div className="input-group">
                        <input 
                          type="number" 
                          className={`form-control ${errors[key] ? 'is-invalid' : ''}`}
                          name={key}
                          value={formData[key]}
                          onChange={(e) => setFormData({...formData, [key]: e.target.value})}
                          step="0.05"
                          min="0"
                          max="1"
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
                        onChange={(e) => setFormData({...formData, [key]: e.target.value})}
                        step="0.01"
                        placeholder="Optional"
                      />
                    </div>
                  );
                }

                return (
                  <div className="col-12" key={key}>
                    <label className="form-label">
                      {key.replace(/_/g, ' ').toUpperCase()}
                    </label>
                    <input 
                      type="number" 
                      className={`form-control ${errors[key] ? 'is-invalid' : ''}`}
                      name={key}
                      value={formData[key]}
                      onChange={(e) => setFormData({...formData, [key]: e.target.value})}
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