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
            (trade) => formatDate(trade.tradeDate) === formatDate(selectedDate)
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

    const [expandedCardIndex, setExpandedCardIndex] = useState(null);
    return(
    <div className="row-container">
        <div className="trade-table-container">
                {filteredTrades.length === 0 ? (
                    <p>No records to show for {formatDate(selectedDate)}</p>
                ) : (
                   
                   <div className="trade-cards">
                      <h3>{formatDate(selectedDate)}</h3>
                      
                        {filteredTrades.map((trade, index) => (
                            
                            <div className="selected-date-card" key={index}>    
                                <div className="card-row">
                                   <span><strong>Stock Name:</strong> {trade.stockName}</span>
                                   <span><strong>Trade Type:</strong> {trade.tradeType}</span>
                                </div> 
                                <div className="card-row">
                                    <span><strong>Profit/Loss:</strong> {trade.profitLoss}</span>
                                    <span><strong>Result:</strong> {trade.win ? 'Win' : 'Loss'}</span>
                                 </div>
                                {/* Toggle Button */}
                                <div className="toggle-details">
                                    <button
                                        onClick={() =>
                                            setExpandedCardIndex(index === expandedCardIndex ? null : index)
                                        }
                                    >
                                        {index === expandedCardIndex ? '▲ Hide Details' : '▼ Show Details'}
                                    </button>
                                </div>

                                {/* Conditionally Rendered Details */}
                                {index === expandedCardIndex && (
                                    <div className="details-section">
                                        <p><strong>Entry Price:</strong> {trade.entryPrice}</p>
                                        <p><strong>Exit Price:</strong> {trade.exitPrice}</p>
                                        <p><strong>Quantity:</strong> {trade.quantity}</p>
                                    </div>
                                 )}
                            </div>
                                  
                        ))}
 
                      

                   </div> 
            )}
        </div>
        <div className="chart-container">
            <Line data={chartData} options={chartOptions} />
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
            

    </div>
    );
}