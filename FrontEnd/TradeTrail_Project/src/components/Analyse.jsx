import { useState } from 'react';

export default function Analyse() {
    const [stockName, setStockName] = useState('');
    const [vwap, setVwap] = useState('');
    const [support, setSupport] = useState('');
    const [resistance, setResistance] = useState('');
    const [tradePlan, setTradePlan] = useState('');
    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await axios.post('http://localhost:8080/api/trade-plan', { stockName });
        setTradePlan(response.data.tradePlan);
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
     
    };
    return (      
        <div className="page-wrapper">
            <form className="form-container" onSubmit={handleSubmit}>
                <div className="input-group">
                    <label><strong>Stock Name</strong></label>
                    <input type="text" name="stockName" value="AAPL" onChange={handleChange} />
                    {errors.stockName && <span className="error-message">{errors.stockName}</span>}
                </div>

                <div className="input-group">
                    <label><strong>Date</strong></label>
                    <input
                        type="date"
                        name="date"
                        value= "2025-06-07"
                        onChange={handleChange}
                        max={new Date().toISOString().split("T")[0]} // optional, if you want to disallow past dates
                        onKeyDown={(e) => e.preventDefault()} // prevent manual typing
                        onInput={(e) => {
                            const selectedDate = new Date(e.target.value);
                            const day = selectedDate.getDay();

                            if (
                                day === 0 || // Sunday
                                day === 6    // Saturday
                            ) {
                                e.target.setCustomValidity("weekends are not allowed.");
                            } else {
                                e.target.setCustomValidity("");
                            }
                        }}
                    />
                    {errors.date && <span className="error-message">{errors.date}</span>}
                </div>
                <div className="input-group">
                    <label><strong>Support</strong></label>
                    <input
                        type="number"
                        step="0.01"
                        name="support"
                        value= "225"
                        onChange={handleChange}
                    />
                    {errors.entryPrice && <span className="error-message">{errors.entryPrice}</span>}
                </div>

                <div className="input-group">
                    <label><strong>Resistance</strong></label>
                    <input
                        type="number"
                        step="0.01"
                        name="resistance"
                        value="230"
                        onChange={handleChange}
                    />
                    {errors.exitPrice && <span className="error-message">{errors.exitPrice}</span>}
                </div>

                <div className="input-group">
                    <label><strong>VWAP</strong></label>
                    <input
                        type="number"
                        step="0.01"
                        name="vwap"
                        value="235"
                        onChange={handleChange}
                    />
                    {errors.quantity && <span className="error-message">{errors.quantity}</span>}
                </div>
                <div className="button-group">
                    <button type="submit" className="btn-submit">
                        Generate Trade plan
                    </button>
                </div>
                <div className="input-group">
                    <textarea value={tradePlan} readOnly rows={10} />
                </div>
            </form>
            
        </div>
    );
}