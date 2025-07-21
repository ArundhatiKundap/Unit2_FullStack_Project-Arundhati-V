import { useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);
import '../styles/dashboard.css';


export default function Journal({ trades }) {

  
        const [selectedDate, setSelectedDate] = useState(new Date());

        const formatDate = (date) => {
         // if date is Date object, convert to YYYY-MM-DD string
          if (date instanceof Date) {
            return date.toISOString().split("T")[0];
           }
          return date; // if already string, return as is
        };
         

        const filteredTrades = trades.filter(
            (trade) => formatDate(trade.date) === formatDate(selectedDate)
         );
        const totalProfitLoss = filteredTrades.reduce(
            (sum, trade) => sum + Number(trade.profitLoss),
           0
        );
        
        const fillColor = totalProfitLoss >= 0 ? "rgba(0, 128, 0, 0.3)" : "rgba(255, 0, 0, 0.3)";

    const chartData = {
        labels: filteredTrades.map(trade => trade.stockName),
        datasets: [
            {
                label: 'Profit/Loss on Selected Date',
                data: filteredTrades.map(trade => Number(trade.profitLoss)),
                borderColor: totalProfitLoss >= 0 ? "green" : "red",
                backgroundColor: fillColor,
                tension: 0.3,
                fill: true,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: `Profit/Loss on ${formatDate(selectedDate)}` },
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


    return(
    <div className="row-container">
        <div className="trade-table-container">
                {filteredTrades.length === 0 ? (
                    <p>No records to show for {formatDate(selectedDate)}</p>
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
                            
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTrades.map((trade, index) => (
                            <tr key={index}>
                                <td>{trade.date}</td>
                                <td>{trade.stockName}</td>
                                <td>{trade.tradeType}</td>
                                <td>{trade.entryPrice}</td>
                                <td>{trade.exitPrice}</td>
                                <td>{trade.quantity}</td>
                                <td>{trade.profitLoss}</td>
                                <td>{trade.win ? 'Win' : 'Loss'}</td>
                    
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
        <div className="calender-container">
                <h2 className="text-xl font-bold mb-4">📅 Select a Date</h2>

                <Calendar
                    onChange={setSelectedDate}
                    value={selectedDate}
                    maxDate={new Date()} // disable future dates
                    tileDisabled={({ date, view }) => {
                    return view === 'month' && (date.getDay() === 0 || date.getDay() === 6) // Disable weekends (Saturday = 6, Sunday = 0)      
                    }}
                /> 
            </div>
            <div className="chart-container">
                <Line data={chartData} options={chartOptions} />
            </div>

    </div>
    );
}