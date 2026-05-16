import { Link } from "react-router-dom";

export default function Create() {
  return (
    <section className="create">
      <div className="container">
        <div className="create__main">
          <div className="content">
            <h4 className="heading">
              Access the Next Wave of
              <br />
              Private Market Opportunities
            </h4>
            <p>Curated access to high-growth sectors including AI, deep technology, infrastructure, media, and emerging real-world asset opportunities.</p>
            <p>Built for verified investors seeking early participation in tomorrow’s market leaders.</p>
            <p>Verified Access • Digital Ownership • Long-Term Value</p>
            <Link to="/nft" className="action-btn">
              <span>Explore Marketplace</span>
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
