import { useState } from 'react';
import '../styles/dashboard.css';
export default function Analyse() {
    const [stockName, setStockName] = useState('');
    const [tradePlan, setTradePlan] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setTradePlan('');
        setError(null);

        if (!stockName.trim()) {
            setError('Please enter a stock name.');
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(`http://localhost:8080/api/trade-plan/${stockName}`, {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch trade plan');
            }

            const data = await response.text(); // backend returns plain text
            setTradePlan(data);

        } catch (err) {
            setError('Error fetching trade plan: ' + err.message);
        }
    };

    const handleChange = (e) => {
        setStockName(e.target.value);
    };

    return (
        <div className="page-wrapper">
            <form className="form-container" onSubmit={handleSubmit}>
                <div className="input-group">
                    <label><strong>Stock Name</strong></label>
                    <input
                        type="text"
                        name="stockName"
                        value={stockName}
                        placeholder="Enter Stock Ticker"
                        onChange={handleChange}
                    />
                </div>

                <div className="button-group">
                    <button type="submit" className="btn-submit">
                        Generate Trade Plan
                    </button>
                </div>

                {error && (
                    <div className="error" style={{ color: 'red', margin: '10px 0' }}>
                        {error}
                    </div>
                )}

                <div className="input-group">
                    <textarea value={tradePlan} readOnly rows={10} />
                </div>
            </form>
        </div>
    );
}
