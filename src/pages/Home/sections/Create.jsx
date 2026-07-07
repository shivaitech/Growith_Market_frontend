import { Link } from "react-router-dom";

export default function Create() {
  return (
    <section className="create">
      <div className="container">
        <div className="create__main">
          <div className="content">
            <h4 className="heading">
              Don&apos;t Just Watch the Future. Own a Part of It.
            </h4>
            <p>Access innovative startups and high-growth projects across AI, technology, media and emerging sectors.</p>
            <p>Built for people who want to participate early in tomorrow&apos;s businesses.</p>
            <p>Digital Ownership • Early Access • Long-Term Participation</p>
            <Link to="/nft" className="action-btn">
              <span>Explore Opportunities</span>
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
