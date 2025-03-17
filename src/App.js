import React, { useState, useEffect } from 'react';
import FormFields from './FormFields';
import { validate } from './Validation';
import { initializeTelegramWebApp, closeTelegramWebApp } from './TelegramWebApp';

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

  useEffect(() => {
    initializeTelegramWebApp();
  }, []);

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => closeTelegramWebApp(), 2000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSuccess(false);

    if (!validate(formData, setErrors)) return;

    try {
      window.Telegram.WebApp.sendData(JSON.stringify(formData));
      setIsSuccess(true);
      setFormData(initialData);
    } catch (err) {
      console.error(err);
      alert('Submission error!');
    }

    // Получаем queryId из Telegram WebApp
    const queryId = tg?.initDataUnsafe?.query_id;
    const userId = tg?.initDataUnsafe?.user?.id;
    // Формируем данные для отправки
    const data = {
      data: JSON.stringify(formData),
      queryId: queryId,
      userId:userId,
    };


    await fetch('http://31.129.33.223:80/calculate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });



  };

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
            <FormFields formData={formData} setFormData={setFormData} errors={errors} />
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