import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import FormFields from './FormFields';
import { validate } from './Validation';
import { initializeTelegramWebApp, closeTelegramWebApp } from './TelegramWebApp';

function CalculatorPage() {
    const initialData = {
        vcpu: "200",
        vram: "400",
        vssd: "20000",
        cpu_overcommit: "3",
        cpu_vendor: "any",
        cpu_min_frequency: "2000",
        capacity_disk_type: "ssd",
        network_card_qty: "1",
        works_main: "vsphere",
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
            tg.sendData(JSON.stringify(formData));
            setIsSuccess(true);
            setFormData(initialData);
        } catch (err) {
            console.error(err);
            alert('Submission error!');
        }

    };



    return (
        <div className="container mt-4">
            <div className="card shadow-sm">
                <div className="card-body">
                    {isSuccess && (
                        <div className="alert alert-success" role="alert">
                            Данные отправлены! Закрываю окно...
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
                                Рассчитать стоимость
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CalculatorPage;