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

export default function ShowTrades({ userEmail, onEdit, onDelete, refreshKey, onTradesFetched }) {
    const [trades, setTrades] = useState([]);

    useEffect(() => {
        const fetchTrades = async () => {
            try {
                const res = await fetch("https://unit1-project-tradetrail.onrender.com/trades");
                const data = await res.json();
                const userTrades = data.filter(trade => trade.userEmail === userEmail)
                                      .sort((a, b) => new Date(b.date) - new Date(a.date));
                setTrades(userTrades);
                if (onTradesFetched) {
                    onTradesFetched(userTrades); // Send data back to Dashboard
                }
            } catch (err) {
                setPopupMessage('Failed to fetch trades', err);
            }
        };

        fetchTrades(); 
    }, [userEmail, refreshKey]);

    const [popupVisible, setPopupVisible] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');

    const chartData = {
        labels: trades.map(trade => trade.date),
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
                                <td>{trade.date}</td>
                                <td>{trade.stockName}</td>
                                <td>{trade.tradeType}</td>
                                <td>{trade.entryPrice}</td>
                                <td>{trade.exitPrice}</td>
                                <td>{trade.quantity}</td>
                                <td>{trade.profitLoss}</td>
                                <td>{trade.win ? 'Win' : 'Loss'}</td>
                                <td>
                                    <button onClick={() => onEdit(trade)}>Edit</button>
                                    <button onClick={() => onDelete(trade.id)}>Delete</button>
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