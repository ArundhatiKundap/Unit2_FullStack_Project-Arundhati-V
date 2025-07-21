import '../styles/footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <p>© 2025 TradeTrail All rights reserved.</p>
      <p>
         <a href="/privacy">Privacy Policy</a> |{" "}
         <a href="/terms">Terms of Service</a> |{" "}
         <a href="/contact">Contact</a>
      </p>
    </footer>
  );
}