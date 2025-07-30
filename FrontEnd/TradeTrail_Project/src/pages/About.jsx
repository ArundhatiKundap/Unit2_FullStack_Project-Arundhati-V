
import '../styles/about.css';

export default function About() {
    return (
    <div className="about-container">
      <h1>About TradeTrail</h1>
      <p>
        <strong>TradeTrail</strong> is a personal trade journal app built to help individual traders
        keep track of their trading performance, reflect on their decisions, and improve
        over time.
      </p>

      <h2>Main Features</h2>
      <ul>
          <li className="feature log">Log and view all your trades with key details like entry/exit points, profit/loss</li>
          <li className="feature calendar">View trades by date to track daily performance</li>
          <li className="feature brain">Plan trades with reasons and risk levels</li>
          <li className="feature chart">Dashboard with charts for performance insights</li>
          <li className="feature lock">LocalStorage-based login and registration for quick access</li>
     </ul>


      <p>
        Whether you are a beginner or a seasoned trader, TradeTrail makes it easy to document and learn from your trades.
      </p>
    </div>
  );
}

    