import { useState } from 'react';
import '../styles/dashboard.css';
import PopupWindow from "./PopupWindow";
import Addtrade from './AddTrade';
import ShowTrades from './ShowTrades';
import Journal from './Journal';
import Search from './SearchTrades';
export default function Dashboard() {
 
    const [activeTab, setActiveTab] = useState('dashboard');
    const [showAddTrade, setShowAddTrade] = useState(false);
    const [showTrades, setShowTrades] = useState(true);
    const [selectedTrade, setSelectedTrade] = useState(null);
    const [formKey, setFormKey] = useState(0); // used to remount Addtrade this logic is adding to solve problem of when click cancel button and again add trade tab form is not displaying without refresh. 
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
    const [trades, setTrades] = useState([]);
    const [popupVisible, setPopupVisible] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    

    if (!loggedInUser.email) {
        return <div>Please log in to view your dashboard.</div>;
    }
        
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setShowAddTrade(false); // Hide form when switching tabs
        if (tab === "dashboard") {
         
            setShowTrades(true);
        }
    };
    const handleAddTradeClick = () => {
        setFormKey((prev) => prev + 1); // Force remount
        setSelectedTrade(null); // clear previous edit
        setShowAddTrade(true);
        setShowTrades(true);
    };
    const handleEditTrade = (trade) => {
        setFormKey((prev) => prev + 1);
        setSelectedTrade(trade);

        setShowAddTrade(true);
        setShowTrades(true);
    };

   

    const handleDeleteTrade = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this trade?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`https://unit1-project-tradetrail.onrender.com/trades/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete the trade.");
            }

            setPopupMessage("Trade deleted successfully.");
            setPopupVisible(true); 
            setFormKey((prev) => prev + 1); // Refresh trade list
        } catch (error) {
            
            setPopupMessage("There was an error deleting the trade.");
            setPopupVisible(true); 
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return (         
                    <div className="tabcontent">
                      
                        <div className="button-group">
                            <button className="btn-submit" onClick={handleAddTradeClick}>
                                + Add Trade
                            </button>
                        </div>
                        {showAddTrade && <Addtrade
                            key={formKey}
                            userEmail={loggedInUser.email}
                            selectedTrade={selectedTrade}
                            onSubmitSuccess={() => {
                              
                            setFormKey((prev) => prev + 1); // Refresh ShowTrades
                            }}
                            
                        />}
                    
                      <div className ="tradelist">
                            <h3>Trades</h3>
                            
                            {showTrades && <ShowTrades                       
                                userEmail={loggedInUser.email}
                                onEdit={handleEditTrade}
                                onDelete={handleDeleteTrade}
                                onTradesFetched={setTrades}
                                refreshKey={formKey}     // refresh trigger
                            />}
                      </div>
                    </div>  
                );
            case 'journal':
                return (
                    <div className="tabcontent">
                        <h3>Journal</h3>
                        <Journal trades={trades} />
                    </div>
                );
            case 'search':
                return (
                    <div className="tabcontent">
                        <h3>Search</h3>
                        <Search trades={trades}/>
                    </div>
                );
            default:
                return (
                    <div className="tabcontent">
                        <h3>No Trade</h3>
                    </div>
                );
        }
    };

    const totalProfitLoss = trades.reduce((sum, t) => sum + Number(t.profitLoss), 0);
    const totalWins = trades.filter(t => t.win).length;
    const totalLosses = trades.filter(t => !t.win).length;
    const totalTrades = trades.length;

    
    const winPercentage = totalTrades > 0 ? Math.round((totalWins / totalTrades) * 100) : 0;

    
    const grossProfit = trades.filter(t => t.profitLoss > 0).reduce((sum, t) => sum + Number(t.profitLoss), 0);
    const grossLoss = trades.filter(t => t.profitLoss < 0).reduce((sum, t) => sum + Math.abs(Number(t.profitLoss)), 0);
    const profitFactor = grossLoss > 0 ? (grossProfit / grossLoss).toFixed(2) : 'N/A';


    return (
        <>
        <div className="username">
                            <span><h2>Welcome {loggedInUser.name}</h2></span>
                        </div>
            <div className="dashboard-container">
                
              <div className="vertical-tab">
                <button className="tablinks" onClick={() => handleTabChange('dashboard')}>Dashboard</button>
                <button className="tablinks" onClick={() => handleTabChange('journal')}>Journal</button>
                <button className="tablinks" onClick={() => handleTabChange('search')}>Search</button>
              </div>

                <div className="tabcontent-container">
                    {trades.length > 0 && (
                        <div className="dashboard-cards">
                            <div className="card">
                                <h3>Total P&L</h3>
                                <p style={{ color: totalProfitLoss >= 0 ? 'green' : 'red' }}>
                                    ₹{totalProfitLoss.toFixed(2)}
                                </p>
                            </div>

                            <div className="card">
                                <h3>Win Percentage</h3>
                                <p>{winPercentage}%</p>
                            </div>

                            <div className="card">
                                <h3>Profit Factor</h3>
                                <p>{profitFactor}</p>
                            </div>
                        </div>
                    )}
                    {renderTabContent()}
                    <PopupWindow
                        show={popupVisible}
                        message={popupMessage}
                        onClose={() => setPopupVisible(false)}
                    />
              </div>
            </div>
        </>
    );
}