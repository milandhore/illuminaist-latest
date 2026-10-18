import PageAdLayout from '../components/ads/PageAdLayout'

export default function PrivacyPage() {
  return (
    <PageAdLayout>
      <h1 className="font-heading text-4xl font-bold text-slate-100 mb-4">Privacy Policy</h1>
      <p className="text-slate-500 text-sm mb-12">
        Effective Date: <time dateTime="2026-09-08">September 8, 2026</time> · Last Updated: <time dateTime="2026-09-08">September 8, 2026</time>
      </p>
      <div className="article-prose">
        <p>IlluminAIst ("we," "our," or "us") respects your personal privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, subscribe to our publications, or engage with our community platforms.</p>

        <h2>1. Information We Collect</h2>
        <h3>Information You Provide Directly</h3>
        <ul>
          <li><strong>Account &amp; Subscription Data:</strong> Name, email address, company/job title, password, and billing information (processed securely through third-party payment processors like Stripe; we do not store full credit card numbers).</li>
          <li><strong>Communications:</strong> Inquiries, feedback, survey responses, and comments submitted to our community channels.</li>
        </ul>
        <h3>Information Collected Automatically</h3>
        <ul>
          <li><strong>Usage &amp; Analytics:</strong> IP address, browser type, operating system, referring URLs, access times, pages viewed, and newsletter open/click engagement metrics.</li>
          <li><strong>Cookies and Tracking Technologies:</strong> We use functional and performance cookies to maintain sessions, remember preferences, and analyze platform traffic.</li>
        </ul>

        <h2>2. AI &amp; Automated Processing Disclosures</h2>
        <ul>
          <li><strong>No Selling of Personal Data:</strong> We do not sell, rent, or trade your personal data to third parties or data brokers.</li>
          <li><strong>No Model Training on Private Data:</strong> Your personal identifiable information (PII) and private account correspondence are <strong>never</strong> used to train public generative AI foundation models.</li>
          <li><strong>Automated Processing:</strong> We may use internal algorithmic tools for content indexing, spam detection, search relevance, and aggregated analytics.</li>
        </ul>

        <h2>3. How We Use Your Information</h2>
        <p>We process your data to:</p>
        <ul>
          <li>Deliver newsletter editions, research briefs, and platform updates.</li>
          <li>Manage subscriptions, process transactions, and send billing receipts.</li>
          <li>Improve platform performance, content relevance, and user experience.</li>
          <li>Prevent unauthorized access, malicious prompt injections, spam, and platform abuse.</li>
          <li>Comply with applicable legal obligations and resolve disputes.</li>
        </ul>

        <h2>4. Legal Bases for Processing (GDPR &amp; Global Compliance)</h2>
        <p>If you reside in the European Economic Area (EEA), UK, India (under the Digital Personal Data Protection Act), or California (CCPA/CPRA), we process your data under:</p>
        <ul>
          <li><strong>Contractual Necessity:</strong> To provide requested services and subscriptions.</li>
          <li><strong>Legitimate Interests:</strong> To improve security, analyze platform performance, and communicate relevant updates.</li>
          <li><strong>Consent:</strong> Where you have explicitly opted into specific newsletters or marketing communications.</li>
          <li><strong>Legal Obligation:</strong> To comply with financial, tax, or regulatory requirements.</li>
        </ul>

        <h2>5. Third-Party Service Providers</h2>
        <p>We share data only with vetted third-party infrastructure partners under strict data protection agreements:</p>
        <ul>
          <li><strong>Cloud &amp; Hosting Providers:</strong> (e.g., AWS, Cloudflare, Google Cloud Platform)</li>
          <li><strong>Payment Processors:</strong> (e.g., Stripe)</li>
          <li><strong>Newsletter Delivery &amp; CRM:</strong> (e.g., Ghost, Substack, Postmark)</li>
          <li><strong>Analytics Providers:</strong> Privacy-centric telemetry services.</li>
        </ul>

        <h2>6. Data Retention and Security</h2>
        <p>We implement industry-standard encryption (TLS 1.3 in transit, AES-256 at rest) and strict access controls. We retain personal data only as long as necessary to fulfill the purposes described in this policy, unless a longer retention period is mandated by law.</p>

        <h2>7. Your Data Rights</h2>
        <p>Depending on your jurisdiction, you have the right to:</p>
        <ul>
          <li>Access, review, or request a portable copy of your personal data.</li>
          <li>Request rectification of inaccurate information.</li>
          <li>Request deletion ("Right to be Forgotten") of your personal data.</li>
          <li>Opt out of marketing communications at any time via the "Unsubscribe" link in any email.</li>
          <li>Restrict or object to certain forms of data processing.</li>
        </ul>
        <p>To exercise any of these rights, email us at: <a href="mailto:privacy@illuminaist.com">privacy@illuminaist.com</a>.</p>

        <h2>8. Contact Us</h2>
        <p>If you have questions regarding this Privacy Policy, please contact:</p>
        <p><strong>Data Protection Officer (DPO)</strong><br />Email: <a href="mailto:privacy@illuminaist.com">privacy@illuminaist.com</a><br />Platform: <a href="https://illuminaist.com">https://illuminaist.com</a></p>
      </div>
    </PageAdLayout>
  )
}
