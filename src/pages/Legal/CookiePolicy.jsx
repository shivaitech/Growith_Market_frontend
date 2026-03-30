export default function CookiePolicy() {
  return (
    <div className="legal-pg legal-pg--first">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-8 col-lg-9 col-12">

            <div className="legal-pg__header">
              <h6 className="sub-heading"><span>Legal</span></h6>
              <h3 className="heading">Cookie Policy</h3>
              <p className="legal-pg__meta">Last updated: 1 January 2026</p>
            </div>

            <div className="legal-pg__body">

              <div className="legal-pg__section">
                <h5 className="legal-pg__section-title">1. What Are Cookies?</h5>
                <p>Cookies are small text files placed on your device when you visit a website. They help the website remember your preferences, improve performance, and provide analytics. Growith uses cookies and similar tracking technologies in accordance with the EU ePrivacy Directive and GDPR.</p>
              </div>

              <div className="legal-pg__section">
                <h5 className="legal-pg__section-title">2. Types of Cookies We Use</h5>

                <div className="legal-pg__table-wrap">
                  <table className="legal-pg__table">
                    <thead>
                      <tr>
                        <th>Category</th>
                        <th>Purpose</th>
                        <th>Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>Essential</strong></td>
                        <td>Authentication, session management, security tokens</td>
                        <td>Session</td>
                      </tr>
                      <tr>
                        <td><strong>Functional</strong></td>
                        <td>Language preferences, UI settings, remembered inputs</td>
                        <td>1 year</td>
                      </tr>
                      <tr>
                        <td><strong>Analytics</strong></td>
                        <td>Page visits, feature usage, error tracking (anonymised)</td>
                        <td>2 years</td>
                      </tr>
                      <tr>
                        <td><strong>Marketing</strong></td>
                        <td>Conversion tracking, ad attribution (with consent only)</td>
                        <td>90 days</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="legal-pg__section">
                <h5 className="legal-pg__section-title">3. Essential Cookies</h5>
                <p>These cookies are strictly necessary for the platform to function. They enable you to log in, maintain your session, and use secure features. You cannot opt out of essential cookies while continuing to use the platform.</p>
              </div>

              <div className="legal-pg__section">
                <h5 className="legal-pg__section-title">4. Analytics Cookies</h5>
                <p>We use anonymised analytics to understand how users interact with our platform. This helps us improve the user experience and identify technical issues. We do not use analytics data to personally identify you.</p>
              </div>

              <div className="legal-pg__section">
                <h5 className="legal-pg__section-title">5. Managing Cookies</h5>
                <p>You can manage or disable non-essential cookies through your browser settings. Most browsers allow you to:</p>
                <ul className="legal-pg__list">
                  <li>View and delete existing cookies</li>
                  <li>Block cookies from specific websites</li>
                  <li>Block all third-party cookies</li>
                  <li>Clear cookies when you close your browser</li>
                </ul>
                <p>Note that disabling certain cookies may affect the functionality of the Growith platform.</p>
              </div>

              <div className="legal-pg__section">
                <h5 className="legal-pg__section-title">6. Third-Party Cookies</h5>
                <p>Some of our service providers may set their own cookies, including authentication providers (Google OAuth), analytics tools, and payment processors. These are governed by the respective provider's privacy policies.</p>
              </div>

              <div className="legal-pg__section">
                <h5 className="legal-pg__section-title">7. Updates to This Policy</h5>
                <p>We may update this Cookie Policy from time to time. Changes will be posted on this page with a revised date. Continued use of the platform after any changes constitutes your acceptance of the updated policy.</p>
              </div>

              <div className="legal-pg__section">
                <h5 className="legal-pg__section-title">8. Contact</h5>
                <p>For questions about our use of cookies, contact us at <a href="mailto:privacy@growith.io" className="legal-pg__link">privacy@growith.io</a>.</p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
