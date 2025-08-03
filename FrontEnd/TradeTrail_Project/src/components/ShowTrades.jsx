import { useState, useEffect } from "react";
import PopupWindow from "./PopupWindow";
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

import '../styles/dashboard.css';

export default function ShowTrades({ onEdit, onDelete, refreshKey, onTradesFetched }) {
    const [trades, setTrades] = useState([]);

    useEffect(() => {
        const fetchTrades = async () => {
            try {
                const token = localStorage.getItem("token"); 
                const res = await fetch("http://localhost:8080/api/trades", {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });
              
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                const data = await res.json();

                const userTrades = data.sort((a, b) => new Date(b.tradeDate) - new Date(a.tradeDate));

                setTrades(userTrades);

                if (onTradesFetched) {
                    onTradesFetched(userTrades); // Send data back to Dashboard
                }
            } catch (err) {
                setPopupMessage('Failed to fetch trades', err);
            }
        };

        fetchTrades(); 
    }, [refreshKey]);

    const [popupVisible, setPopupVisible] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');

    const chartData = {
        labels: trades.map(trade => trade.tradeDate),
        datasets: [
            {
                label: 'Net Daily P&L',
                data: trades.map(trade => Number(trade.profitLoss)),
               
                backgroundColor: trades.map(trade => Number(trade.profitLoss) >= 0 ? 'green' : 'red'),
            },
        ],
    };
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Profit/Loss Bar Chart' },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: { padding: 5 },
                grid: { display: true },
            },
            x: {
                ticks: { padding: 5 },
                grid: { display: false },
            },
        },
    };
    
    
   
    return (
        <div className ="row-container">
        <div className="trade-table-container">
            {trades.length === 0 ? (
                <p>No records to show</p>
            ) : (
                <table className="trade-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Stock</th>
                            <th>Type</th>
                            <th>Entry</th>
                            <th>Exit</th>
                            <th>Quantity</th>
                            <th>Profit/Loss</th>
                            <th>Win/Loss</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {trades.map((trade, index) => (
                            <tr key={index}>
                                <td>{trade.tradeDate}</td>
                                <td>{trade.stockName}</td>
                                <td>{trade.tradeType}</td>
                                <td>{trade.entryPrice}</td>
                                <td>{trade.exitPrice}</td>
                                <td>{trade.quantity}</td>
                                <td>{trade.profitLoss}</td>
                                <td style={{
                                    color: trade.profitLoss > 0 ? 'green' : 'red',
                                    fontWeight: 'bold'
                                }}>
                                    {trade.profitLoss > 0 ? 'Win' : 'Loss'}
                                </td>
                                <td>
                                   <div className = "button-group">
                                      <button onClick={() => onEdit(trade)}><i className='fas fa-edit'></i></button>
                                      <button onClick={() => onDelete(trade.id)}><i className='far fa-trash-alt'></i></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
            <div className="chart-container">
                
                <Bar data={chartData} options={chartOptions} />
            </div>
            <PopupWindow
                show={popupVisible}
                message={popupMessage}
                onClose={() => setPopupVisible(false)}
            />

        </div>
    );
}