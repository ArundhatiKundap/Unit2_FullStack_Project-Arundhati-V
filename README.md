README.md – 

# Trading Journal 

Trading Journal:-
An essential tool for every trader's journey, the Stock Trading Journal is a web-based application designed to empower intraday traders to systematically track, analyze, and improve their trading performance. This project offers an intuitive interface for logging trades, capturing the rationale behind each decision, and visualizing outcomes, making it easier than ever to learn from past trades and refine your strategy. By centralizing trading data, providing insightful analytics, and encouraging disciplined journaling, this platform transforms trade logs into actionable intelligence for continuous improvement. Whether you are a beginner seeking structure or an experienced trader striving for consistency, the Stock Trading Journal is your companion for informed and confident trading.
## 🚀 Features

- 📋 Add, edit, delete trades
- 📊 View trade performance dashboard
- 📈 Analyze stocks using support/resistance/VWAP data
- 🔐 User authentication (basic and premium users)

## 🛠️ Tech Stack
- **Frontend:**
React.js, 
React hooks(useState,useEffect,useNavigate ),
Chart.js,
React-calendar
HTML ,
CSS 

- **Backend:** 
Springboot, 
Java,
Gemini AI API,
Financialmodelingprep API
Mysql connecter,
SpringbootJPA,
Springboot Security
- **Database:** 
  MYSQL workbench
- **Authentication:** 
 JWT (JSON Web Tokens)
- **Other Tools:** Postman (API testing), Wireframe.cc (wireframes), LucidChart (entity relationship diagrams)

## ⚙️Installation & Local Setup
### Prerequisites:
- Java 21+
- Maven
- Node.js + npm
- MySQL (or compatible DB)
- Postman (for API testing - optional)

### Clone the Repository
- Fork or clone this repo to local machine:
- git clone : https://github.com/ArundhatiKundap/Unit2_FullStack_Project-Arundhati-V
- Navigate to the project directory:
### FRONTEND SETUP:
- cd FrontEnd
- npm install            # install all dependencies
- npm start              # runs the app in development mode4. Running the Application
### BACKEND SETUP:
- cd backend
- Configure environment variables (API Keys, DB creds)
- spring.application.name=backend
- spring.datasource.url=jdbc:mysql://localhost:3306/tradetrail
- spring.datasource.username=root
- spring.datasource.password=*******
- spring.jpa.hibernate.ddl-auto=update
- spring.jpa.show-sql=true
- spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
- jwt.secret={jwt key}
- GEMINIAI_API_KEY={gemini api key}
- FINANCE_MODEL_API_KEY={finance_model API key}
- mvn clean install
- add depencies into POM.XML

### Database Setup: 
- CREATE DATABASE trade_journal;
### Wireframes:
- https://wireframe.cc/1hiUjM
### Entity Relationship Diagrams (ERDs):
- https://lucid.app/lucidchart/387f391d-3fd9-403e-a5c3-56ff41118a5b/edit?invitationId=inv_e57bbf6c-7440-49b4-9188-5dacceb83b51

### Unsolved Problems / Future Features
- Automated Trade Imports: Currently, all trades must be logged manually. In the future, the application will support direct imports from brokerage accounts (via API or CSV), streamlining the journaling process.- Real-Time Market Data: -  - Integrating live stock and options data would provide richer context to trade entries and analytics.
- Customizable Journaling Templates: Planned support for user-defined fields and custom tags to make the journal flexible for various trading styles.
- Localization & Internationalization: To make the journal accessible worldwide, interface translations and local currency/date support are planned.
- Integration with Popular Trading Tools: Connecting with TradingView, ThinkOrSwim, and others for  
  chart embedding.


