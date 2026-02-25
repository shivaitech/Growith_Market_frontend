import { Link } from "react-router-dom";

export default function Create() {
  return (
    <section className="create">
      <div className="container">
        <div className="create__main">
          <div className="content">
            <h4 className="heading">
              Begin Your Investment
              <br />
              Journey Today
            </h4>
            <p>Private placement opportunities in tomorrow's unicorns.</p>
            <p>EU-Registered Issuer · KYC Required · Non-Tradable Tokens</p>
            <Link to="/nft" className="action-btn">
              <span>Enter Marketplace</span>
            </Link>
          </div>
          <img
            src="/assets/images/svg/create.svg"
            alt="Investment Journey"
          />
        </div>
      </div>
    </section>
  );
}
