import { useEffect, useState } from "react";
import '../styles/dashboard.css';
import PopupWindow from "./PopupWindow";
export default function Addtrade({selectedTrade, onSubmitSuccess }) {


    const [showForm, setShowForm] = useState(true);

    const [errors, setErrors] = useState({});
    const [popupVisible, setPopupVisible] = useState(false);    //for pop up alert
    const [popupMessage, setPopupMessage] = useState("");

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


    useEffect(() => {
        if (selectedTrade) {
            setFormData({
                instrument: selectedTrade.instrument || "Stock",
                tradeSpan: selectedTrade.tradeSpan || "Intraday",
                stockName: selectedTrade.stockName || "",
                tradeType: selectedTrade.tradeType || "Buy",
                date: selectedTrade.tradeDate
                    ? new Date(selectedTrade.tradeDate).toISOString().slice(0, 10)
                    : "",
                entryPrice: selectedTrade.entryPrice?.toString() || "",
                exitPrice: selectedTrade.exitPrice?.toString() || "",
                quantity: selectedTrade.quantity?.toString() || ""
            });
        } else {
            resetForm();
        }
    }, [selectedTrade]);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = (data) => {
        const newErrors = {};

        if (!data.stockName.trim()) newErrors.stockName = "Stock name is required";
        if (!data.date) newErrors.date = "Date is required";
        if (!data.entryPrice) newErrors.entryPrice = "Enter entry price";
        if (!data.exitPrice) newErrors.exitPrice = "Enter exit price";
        if (!data.quantity) newErrors.quantity = "Enter quantity";

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = validateForm(formData);
        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            setPopupMessage("Please fill all required fields.");
            setPopupVisible(true);            
            return;
        }

        const tradeData = {
            ...(selectedTrade && { id: selectedTrade.id }),
            tradeDate: formData.date,
            stockName: formData.stockName,
            entryPrice: parseFloat(formData.entryPrice),
            exitPrice: parseFloat(formData.exitPrice),
            tradeType: formData.tradeType,
            quantity: parseInt(formData.quantity),
            instrument: formData.instrument
        };

        try {
            const token = localStorage.getItem("token");
            const method = selectedTrade ? "PUT" : "POST";
            const url = selectedTrade
                ? `http://localhost:8080/api/trades/${selectedTrade.id}`
                : `http://localhost:8080/api/trades/add`;

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(tradeData),
            });

            if (!response.ok) throw new Error("Failed to save trade");

            setPopupMessage(selectedTrade ? "Trade Updated Successfully!" : "Trade Added Successfully");
            setPopupVisible(true);
            resetForm();
            setShowForm(true);
            onSubmitSuccess();

        } catch (err) {
            setPopupMessage("Error saving trade: " + err.message);
            setPopupVisible(true);
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
        setErrors({});
    };
      
    return (
        <div className="page-wrapper">
            {showForm && (
                <form className="form-container" onSubmit={handleSubmit}>
                    <h3>{selectedTrade ? "Edit Trade" : "Add Trade"}</h3>
                    <hr />
                    <div className="stock-info">
                        <div className="input-group">
                            <label><strong>Instrument</strong></label>
                            <input type="text" name="instrument" value={formData.instrument} readOnly />
                        </div>

                        <div className="input-group">
                            <label><strong>Stock Name</strong></label>
                            <input type="text" name="stockName" value={formData.stockName} onChange={handleChange} />
                            {errors.stockName && <span className="error-message">{errors.stockName}</span>}
                        </div>

                        <div className="input-group">
                            <label><strong>Date</strong></label>
                            <input type="date" name="date" value={formData.date} onChange={handleChange} />
                            {errors.date && <span className="error-message">{errors.date}</span>}
                        </div>

                        <div className="input-group">
                            <label><strong>Trade Type</strong></label>
                            <div className="radio-options">
                                {["Buy", "Sell"].map((type) => (
                                    <label key={type}>
                                        <input
                                            type="radio"
                                            name="tradeType"
                                            value={type}
                                            checked={formData.tradeType === type}
                                            onChange={handleChange}
                                        />
                                        {type}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="stockprice-info">
                        <div className="input-group">
                            <label><strong>Entry Price</strong></label>
                            <input
                                type="number"
                                step="0.01"
                                name="entryPrice"
                                value={formData.entryPrice}
                                onChange={handleChange}
                            />
                            {errors.entryPrice && <span className="error-message">{errors.entryPrice}</span>}
                        </div>

                        <div className="input-group">
                            <label><strong>Exit Price</strong></label>
                            <input
                                type="number"
                                step="0.01"
                                name="exitPrice"
                                value={formData.exitPrice}
                                onChange={handleChange}
                            />
                            {errors.exitPrice && <span className="error-message">{errors.exitPrice}</span>}
                        </div>

                        <div className="input-group">
                            <label><strong>Quantity</strong></label>
                            <input
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                            />
                            {errors.quantity && <span className="error-message">{errors.quantity}</span>}
                        </div>
                    </div>

                    <div className="button-group">
                        <button type="submit" className="btn-submit">
                            {selectedTrade ? "Update Trade" : "Add Trade"}
                        </button>

                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={() => {
                                resetForm();
                                setShowForm(false);
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {/* Keep PopupWindow outside the form for clean UI */}
            <PopupWindow
                show={popupVisible}
                message={popupMessage}
                onClose={() => setPopupVisible(false)}
            />
        </div>
    );
    
    
}