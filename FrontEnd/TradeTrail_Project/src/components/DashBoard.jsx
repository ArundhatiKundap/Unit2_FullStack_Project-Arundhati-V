import { useState } from 'react';
import '../styles/dashboard.css';
import PopupWindow from "./PopupWindow";
import Addtrade from './AddTrade';
import ShowTrades from './ShowTrades';
import Journal from './Journal';
import Search from './SearchTrades';
import { useNavigate } from "react-router-dom";
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
    const navigate = useNavigate();

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

        setSelectedTrade(null); // clear previous edit
        setShowAddTrade(true);
        setShowTrades(true);
       
    };
    const handleEditTrade = (trade) => {  
        setSelectedTrade(trade);
        setShowAddTrade(true);
        setShowTrades(true);
       
    };

    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("loggedInUser");
        navigate("/");
        window.location.reload(); // refresh to re-trigger protected routes, etc.
    };

   

    const handleDeleteTrade = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this trade?");
        if (!confirmDelete) return;
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`http://localhost:8080/api/trades/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to delete the trade.");
            }
            setPopupMessage("Trade deleted successfully.");
            setPopupVisible(true);
            setShowTrades(true);           
            setFormKey((prev) => prev + 1); // Refresh trade list
            

        } catch (error) {
            setPopupMessage("There was an error deleting the trade.");
            setPopupVisible(true);
        }
        setShowAddTrade(false);
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return (         
                    <div className="tabcontent">

                        <div className="section-header">
                        
                          <h3>Trades</h3>
                          <div className="button-group">
                            <button className="btn-submit" onClick={handleAddTradeClick}>
                                + Add Trade
                            </button>
                          </div>
                        </div>
                        {showAddTrade && <Addtrade
                            refreshKey={formKey}                           
                            selectedTrade={selectedTrade}
                            onSubmitSuccess={() => {                                    
                                setFormKey((prev) => prev + 1);// Refresh ShowTrades
                                setShowAddTrade(false);
                            }}                                                                                        
                        />}
                    
                      <div className ="tradelist">
                           
                            {showTrades && <ShowTrades                           
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
    const totalWins = trades.filter(t => t.profitLoss > 0).length;
    const totalLosses = trades.filter(t => t.profitLoss < 0).length;
    const totalTrades = trades.length;
    const winPercentage = totalTrades > 0 ? Math.round((totalWins / totalTrades) * 100) : 0;
   
    
    const grossProfit = trades.filter(t => t.profitLoss > 0).reduce((sum, t) => sum + Number(t.profitLoss), 0);
    const grossLoss = trades.filter(t => t.profitLoss < 0).reduce((sum, t) => sum + Math.abs(Number(t.profitLoss)), 0);
    
    const profitFactor = grossLoss > 0 ? parseFloat((grossProfit / grossLoss).toFixed(2)) : 0;
   

    return (
        <>
            < div className="dashboard-container">
                
                <div className="vertical-tab">
                    <div className="username">
                        <div className="avatar">
                            <i className="fas fa-user"></i>
                        </div>
                        <h3>Welcome {loggedInUser.name}</h3>
                    </div>
                    <nav className="main-nav">
                        <ul>
                            <li className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => handleTabChange('dashboard')}>
                                <i className="fas fa-home"></i> Dashboard
                            </li>
                            <li className={activeTab === 'journal' ? 'active' : ''} onClick={() => handleTabChange('journal')}>
                                <i className="fas fa-book"></i> Journal
                            </li>
                            <li className={activeTab === 'search' ? 'active' : ''} onClick={() => handleTabChange('search')}>
                                <i className="fas fa-search"></i> Search
                            </li>
                            <li
                                className={activeTab === 'logout' ? 'active' : ''} onClick={handleLogout}>                     
                                <i className="fas fa-sign-out-alt"></i> Logout
                            </li>                          
                        </ul>
                    </nav>
                
              </div>

                <main className="main-content">
                    {trades.length > 0 && (
                        <div className="dashboard-cards">
                            <div className="card">
                                <h3>Total P&L</h3>
                                <p style={{ color: totalProfitLoss >= 0 ? 'green' : 'red' }}>
                                    <strong>${totalProfitLoss.toFixed(2)}</strong>
                                </p>
                            </div>

                            <div className="card">
                                <h3>Win Percentage</h3>
                                <p>
                                    <strong>{winPercentage.toFixed(2)}%</strong>
                                </p>
                            </div>

                            <div className="card">
                                <h3>Profit Factor</h3>
                                <p>                                 
                                    <strong>{profitFactor.toFixed(2)}</strong>
                                </p>
                            </div>
                        </div>
                    )}
                    {renderTabContent()}
                    <PopupWindow
                        show={popupVisible}
                        message={popupMessage}
                        onClose={() => setPopupVisible(false)}
                    />
              </main>
            </div>
        </>
    );
}