import { useState } from 'react'
export default function TelegramWebApp() {
  const [formData, setFormData] = useState({
    vcpu: "100", vram: "200", vssd: "1000", cpu_vendor: "any", cpu_min_frequency: "0",
    cpu_overcommit: "3", works_main: "vsphere", works_add: "no", network_card_qty: "1",
    slack_space: "0.2", capacity_disk_type: "ssd", currency: "100"
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const query = Object.entries(formData)
      .map(([key, value]) => `${key}=${value}`)
      .join(" ");

    const botToken = process.env.REACT_APP_BOT_TOKEN;
    const chatId = process.env.REACT_APP_CHAT_ID; 
    const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const message = `/calculate ${query}`;
    await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: message })
    });
  };

  return (
    <div className="container mt-4" style={{ fontFamily: "Google Sans, sans-serif", maxWidth: "600px", margin: "auto", background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
      <h2 className="text-center mb-4" style={{ color: "#1a73e8" }}>VMware config</h2>
      <div className="row">
        {Object.keys(formData).map((key) => (
          <div key={key} className="mb-3 col-md-6">
            <label className="form-label" style={{ fontWeight: "500" }}>{key}</label>
            <input
              type="text"
              className="form-control"
              name={key}
              value={formData[key]}
              onChange={handleChange}
              style={{ borderRadius: "8px", border: "1px solid #ccc", padding: "10px" }}
            />
          </div>
        ))}
      </div>
      <button className="btn w-100" onClick={handleSubmit} style={{ background: "#1a73e8", color: "#fff", padding: "10px", borderRadius: "8px", fontSize: "16px" }}>Send</button>
    </div>
  );
}