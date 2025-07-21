import { useEffect, useState } from "react";
import '../styles/dashboard.css';
import PopupWindow from "./PopupWindow";
export default function Addtrade({ userEmail, selectedTrade, onSubmitSuccess }) {

    useEffect(() => {
        if (selectedTrade) {
            setFormData({
                ...selectedTrade,
                date: selectedTrade.date?.slice(0, 10), // trim timestamp
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
        entryPrice: null,
        exitPrice: null,
        quantity: null,
        profitLoss: null,
        win: ""

    });

    const [popupVisible, setPopupVisible] = useState(false);    //for pop up alert
    const [popupMessage, setPopupMessage] = useState('');
    
    
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const val = type === "checkbox" ? checked : value;

        setFormData((prev) => ({
            ...prev,
            [name]: val,
        }));
    };

    const isWinningTrade = () => {
        const { entryPrice, exitPrice, tradeType } = formData;
        if (entryPrice == null || exitPrice == null) return null;

        if (tradeType.toLowerCase() === "buy") {
            return exitPrice > entryPrice;
        } else if (tradeType.toLowerCase() === "sell") {
            return entryPrice > exitPrice;
        }
        return null;
    };

    const calculateProfitLoss = () => {
        const { entryPrice, exitPrice, quantity, tradeType } = formData;
        if (entryPrice == null || exitPrice == null || quantity == null) return 0;
        let profitloss;

        if (tradeType.toLowerCase() === "sell") {
            profitloss = (entryPrice - exitPrice) * quantity;
        } else if (tradeType.toLowerCase() === "buy") {
            profitloss = (exitPrice - entryPrice) * quantity;
        } else {
            profitloss = null;
        }
        const isWin = isWinningTrade();

        return isWin ? Math.abs(profitloss) : -Math.abs(profitloss);
        
        
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validateForm(formData);
        setErrors(newErrors);
       
        const winResult = isWinningTrade();
        const profitLossResult = calculateProfitLoss();
        const date = String(formData.date);
       
        const tradeData = {
            ...formData,
            date,
            profitLoss: profitLossResult,
            win: winResult,
            userEmail,
        };


        if (Object.keys(newErrors).length === 0) {
            try {
                const method = selectedTrade ? "PUT" : "POST";
                const url = selectedTrade
                    ? `https://unit1-project-tradetrail.onrender.com/trades/${selectedTrade.id}`
                    : "https://unit1-project-tradetrail.onrender.com/trades";
                const addrecord = await fetch(url, {
                    method: method,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(tradeData),
                });
                if (addrecord.ok) {
                    setPopupMessage(selectedTrade ? "Trade Updated Successfully!" :"Trade Added Successfully"); 
                    setPopupVisible(true); 
                    resetForm();
                    setShowForm(true);
                    onSubmitSuccess();
                    
                }
                else {
                    setPopupMessage("Failed to save trade");
                    
                }
            } catch (err) {
                setPopupMessage("Error saving trade:", err);
               
            }
        }
        else {
            setPopupMessage("Please fill all fields")
            
        }
        setPopupVisible(true);

        // Auto-close after 3 seconds (optional)
        setTimeout(() => {
            setPopupVisible(false);
        }, 3000);
        
    };

    const resetForm = () => {
        setFormData({
            instrument: "Stock",
            tradeSpan: "Intraday",
            stockName: "",
            tradeType: "Buy",
            date: "",
            entryPrice: null,
            exitPrice: null,
            quantity: null,
            profitLoss: null,
            win: ""
        });
    };
    const winLossText =
        formData.entryPrice > 0 &&
            formData.exitPrice > 0 &&
            formData.quantity > 0
            ? isWinningTrade()
                ? "Win"
                : "Loss"
            : "";
    
 
    const date = String(formData.date);

    const validateForm = (data) => {
        const errors = {};

        if (!data.stockName.trim()) {
            errors.stockName = 'StockName is required';
        } 

        if (!data.date) {
            errors.date = 'Date is required';
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
                        <div class="input-group">
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
                    <div className="stockprice-info">
                        <div class="input-group">
                        <label>
                            <strong>Profit/Loss</strong>
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            name="profitLoss"
                                value={calculateProfitLoss().toFixed(2)}
                                readOnly
                                disabled
                            />
                        </div>
                        <div className="input-group">
                        <label><strong>Win/Loss</strong></label>
                        <input
                            type="text"
                            name="win"
                            value={winLossText}
                               
                                readOnly
                                disabled
                            />
                          </div>
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