import { useEffect, useState } from "react";
import '../styles/dashboard.css';
import PopupWindow from "./PopupWindow";
export default function Addtrade({selectedTrade, onSubmitSuccess }) {

    useEffect(() => {
        if (selectedTrade) {
            setFormData({
                ...selectedTrade,
                //date: selectedTrade.date?.slice(0, 10), // trim timestamp
                date: selectedTrade.tradeDate
                    ? new Date(selectedTrade.tradeDate).toISOString().slice(0, 10)
                    : "",
            });
        } else {
            resetForm(); // or set empty formData
        }
    }, [selectedTrade]);

    const [showForm, setShowForm] = useState(true);

    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        instrument: "Stock",
        tradeSpan: "Intraday",
        stockName: "",
        tradeType: "Buy",
        date: "",
        entryPrice: "",
        exitPrice: "",
        quantity: ""

    });

    const [popupVisible, setPopupVisible] = useState(false);    //for pop up alert
    const [popupMessage, setPopupMessage] = useState("");
    
    
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const val = type === "checkbox" ? checked : value;

        setFormData((prev) => ({
            ...prev,
            [name]: val,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validateForm(formData);
        setErrors(newErrors);
       
        const tradeData = {
            ...(selectedTrade && { id: selectedTrade.id }), // only adds `id` if selectedTrade exists
            tradeDate: formData.date,
            stockName: formData.stockName,
            entryPrice: parseFloat(formData.entryPrice),
            exitPrice: parseFloat(formData.exitPrice),
            tradeType: formData.tradeType,
            quantity: parseInt(formData.quantity),
            instrument: formData.instrument,
        };

        if (Object.keys(errors).length === 0) {
            try {
                const token = localStorage.getItem("token");
                
                const method = selectedTrade ? "PUT" : "POST";
                const url = selectedTrade
                    ? `http://localhost:8080/api/trades/${selectedTrade.id}`
                    : `http://localhost:8080/api/trades/add`;
                const addrecord = await fetch(url, {
                    method: method,
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    }, 
                    body: JSON.stringify(tradeData),
                });

                if (!addrecord.ok) {
                    throw new Error("Failed to save trade");
                }

                 setPopupMessage(selectedTrade ? "Trade Updated Successfully!" :"Trade Added Successfully");  
                 resetForm();
                 setShowForm(true);              
                 onSubmitSuccess(); 
                setPopupVisible(true);
                setTimeout(() => setPopupVisible(false), 3000);

            } catch (err) {
                setPopupMessage("Error saving trade:", err);
                setPopupVisible(true);
                setTimeout(() => setPopupVisible(false), 3000);
            }
        }
        else {
            setPopupMessage("Please fill all fields")
            setPopupVisible(true);
            setTimeout(() => setPopupVisible(false), 3000);
        }     
        
    };

    const resetForm = () => {
        setFormData({
            instrument: "Stock",
            tradeSpan: "Intraday",
            stockName: "",
            tradeType: "Buy",
            date: "",
            entryPrice: "",
            exitPrice: "",
            quantity: ""
        });
    };
      
    const date = formData.date;

    const validateForm = (data) => {
        const errors = {};

        if (!data.stockName.trim()) {
            errors.stockName = 'StockName is required';
        } 

        if (!data.tradeDate) {
            errors.tradeDate = 'Date is required';
        } 

        if (!data.entryPrice) {
            errors.entryPrice = 'Enter Entry price';
        }
        if (!data.exitPrice) {
            errors.exitPrice = 'Enter Exit price';
        } 

        if (!data.quantity) {
            errors.quantity = 'Enter quantity';
        }

        return errors;
    };

    return (
        <div className="page-wrapper">
            
            {showForm && (
                <form className="form-container" onSubmit={handleSubmit}>
                    <h3>Add Trade</h3>

                    <hr />
                    <div className="stock-info">
                        <div className="input-group">
                        <label>
                            <strong>Instrument</strong>
                        </label>
                        
                        <input
                            type="Text"
                            name="instrument"
                            value={formData.instrument}
                            onChange={handleChange}
                                maxLength={30}
                                readOnly
                        />
                        </div>
                        <div className="input-group">
                        <label>
                            <strong>Stock Name</strong>
                        </label>
                        <input
                            type="Text"
                            name="stockName"
                            value={formData.stockName}
                            onChange={handleChange}
                            maxLength={30}
                            />
                        </div>
                        {errors.stockName && (
                            <span className="error-message">
                                {errors.stockName}
                            </span>
                        )}
                        <div className="input-group">
                        <label>
                            <strong>Date</strong>
                        </label>
                        <input
                            type="date"
                                name="date"
                                value={date}
                            onChange={handleChange}
                            maxLength={30}
                            />
                        </div>
                        {errors.date && (
                            <span className="error-message">
                                {errors.date}
                            </span>
                        )}
                        <div className="input-group">
                            <label><strong>Trade Type</strong></label>
                            <div className="radio-options">
                                <label>
                                    <input
                                        type="radio"
                                        name="tradeType"
                                        value="Buy"
                                        checked={formData.tradeType === "Buy"}
                                        onChange={handleChange}
                                    />
                                    Buy
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="tradeType"
                                        value="Sell"
                                        checked={formData.tradeType === "Sell"}
                                        onChange={handleChange}
                                    />
                                    Sell
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="stockprice-info">
                        <div className="input-group">
                        <label>
                            <strong>Entry Price</strong>
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            name="entryPrice"
                            value={formData.entryPrice}
                            onChange={handleChange}
                            
                            />
                        </div>
                        {errors.entryPrice && (
                            <span className="error-message">
                                {errors.entryPrice}
                            </span>
                        )}
                        <div className="input-group">
                        <label>
                            <strong>Exit Price</strong>
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            name="exitPrice"
                            value={formData.exitPrice}
                            onChange={handleChange}
                            
                            />
                        </div>
                        {errors.exitPrice && (
                            <span className="error-message">
                                {errors.exitPrice}
                            </span>
                        )}
                        <div className="input-group">
                        <label>
                            <strong>Quantity</strong>
                        </label>
                        <input
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            
                            />
                        </div>
                        {errors.quantity && (
                            <span className="error-message">
                                {errors.quantity}
                            </span>
                        )}
                    </div>

                        <div className="button-group">
                        <button type="submit" className="btn-submit" > {selectedTrade ? "Update Trade" : "Add Trade"}</button>
                        <PopupWindow
                            show={popupVisible}
                            message={popupMessage}
                            onClose={() => setPopupVisible(false)}
                        />
                            <button type="button" className="btn-cancel" onClick={() => {
                                resetForm();
                                setShowForm(false);
                            }}>Cancel</button>
                        </div>
                    
                </form>
                
            )}


        </div>
       
    );
    
}