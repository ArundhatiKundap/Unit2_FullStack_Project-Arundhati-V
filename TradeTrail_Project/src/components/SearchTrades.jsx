import { useState } from "react";
import Select from "react-select";
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);
import '../styles/dashboard.css';
export default function SearchTrades({ trades }) {

    const [selectedStock, setSelectedStock] = useState({ value: '', label: '' });
    const [filterWin, setFilterWin] = useState(true);
    const [filterLoss, setFilterLoss] = useState(true);

    const stockOptions = [...new Set(trades.map(trade => trade.stockName))].map(stock => ({
        value: stock,
        label: stock.toUpperCase()
    }));

    
    const filteredTrades = trades
        .filter(trade =>
            selectedStock.value ? trade.stockName === selectedStock.value : true
        )
        .filter(trade => {
            if (filterWin && filterLoss) return true;
            if (filterWin) return trade.win === true;
            if (filterLoss) return trade.win === false;
            return true;
        });

    const totalProfitLoss = filteredTrades.reduce(
        (sum, trade) => sum + Number(trade.profitLoss),
        0
    );
    const investedamount = filteredTrades.reduce(
        (sum, trade) => sum + Number(trade.entryPrice),
        0
    );

    const winCount = filteredTrades.filter(trade => trade.win).length;
    const lossCount = filteredTrades.filter(trade => !trade.win).length;
    const total = winCount + lossCount;

    const winPercentage = total ? Math.round((winCount / total) * 100) : 0;
    const lossPercentage = total ? Math.round((lossCount / total) * 100) : 0;

    const chartData = {
        labels: ['Win', 'Loss'], 
        datasets: [
            {
                label: 'Trade Outcome',
                data: [winPercentage, lossPercentage],
                backgroundColor: ['green', 'red'],
                borderWidth: 1,
                
            },
        ],
    }

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `${context.label}: ${context.raw}%`;
                    }
                }
            },
            title: {
                display: true,
                text: `Win/Loss % for ${selectedStock.label || "All Stocks"}`,
            },
        },
    };


    return (
        <div className="row-container">
        <div>
            <div className="search-container">
                <h3>Search by Stock Name</h3>
                <Select
                    options={stockOptions}
                    value={selectedStock}
                    onChange={setSelectedStock}
                    isSearchable
                    placeholder="Select stock..."
                />

                <div className = "checkbox-group">
                    <label>
                        <input
                            type="checkbox"
                            checked={filterWin}
                            onChange={(e) => setFilterWin(e.target.checked)}
                        /> Win
                    </label>
                    <label style={{ marginLeft: "10px" }}>
                        <input
                            type="checkbox"
                            checked={filterLoss}
                            onChange={(e) => setFilterLoss(e.target.checked)}
                        /> Loss
                    </label>
                </div>
            </div>

            <div className="row-container">
                <div className="trade-table-container">
                    <table className="trade-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Stock</th>
                                <th>Type</th>
                                <th>Profit/Loss</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTrades.map((trade, idx) => (
                                <tr key={idx}>
                                    <td>{trade.date}</td>
                                    <td>{trade.stockName}</td>
                                    <td>{trade.tradeType}</td>
                                    <td>{trade.profitLoss}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
            <div className="chart-container">
              <div className="pie-chart-wrapper">
                
                   <Pie data={chartData} options={chartOptions} />
                   
                </div>
            </div>
        </div>
    );
}
