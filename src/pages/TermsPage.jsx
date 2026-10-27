import PageAdLayout from '../components/ads/PageAdLayout'

export default function TermsPage() {
  return (
    <PageAdLayout>
      <h1 className="font-heading text-4xl font-bold text-slate-100 mb-4">Terms of Service</h1>
      <p className="text-slate-500 text-sm mb-12">
        Effective Date: <time dateTime="2026-09-08">September 8, 2026</time> · Last Updated: <time dateTime="2026-09-08">September 8, 2026</time>
      </p>
      <div className="article-prose">
        <p>Welcome to IlluminAIst. By accessing or using our website, newsletters, community channels, code repositories, or paid subscriptions (collectively, the "Services"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree, please do not use our Services.</p>

        <h2>1. Eligibility &amp; Account Registration</h2>
        <ul>
          <li>You must be at least 18 years old (or the legal age of majority in your jurisdiction) to subscribe or register an account.</li>
          <li>You agree to provide accurate, current information and maintain the security of your login credentials. You are responsible for all activities occurring under your account.</li>
        </ul>

        <h2>2. Intellectual Property &amp; License</h2>
        <ul>
          <li><strong>Our Content:</strong> All original articles, architectural blueprints, graphics, editorial analyses, and brand trademarks on IlluminAIst are owned by IlluminAIst or licensed from our contributors, protected by international copyright laws.</li>
          <li><strong>Limited License:</strong> We grant you a limited, non-exclusive, non-transferable license to read, view, and share excerpts of our content for personal, non-commercial, or educational purposes, provided clear attribution and a link back to IlluminAIst are included.</li>
          <li><strong>Code Samples:</strong> Unless stated otherwise, open-source code snippets and repository templates provided by IlluminAIst are distributed under the MIT or Apache 2.0 License.</li>
        </ul>

        <h2>3. Acceptable Use &amp; Platform Integrity</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Use any automated scrapers, crawlers, or bots to harvest data or bulk-extract proprietary analyses without written consent.</li>
          <li>Attempt prompt injection, jailbreaking, or denial-of-service attacks against our APIs, search indexes, or interactive tools.</li>
          <li>Post or transmit defamatory, harassing, infringing, or illegal content within our community forums.</li>
          <li>Misrepresent your affiliation with IlluminAIst or impersonate another individual or organization.</li>
        </ul>

        <h2>4. Educational &amp; Informational Disclaimer</h2>
        <ul>
          <li><strong>No Professional Advice:</strong> All materials, code reviews, and analyses published by IlluminAIst are provided for informational and educational purposes only. They do not constitute formal legal, financial, investment, or enterprise engineering compliance advice.</li>
          <li><strong>Experimental Technology:</strong> AI frameworks and emerging technologies involve inherent uncertainty, rapid deprecation cycles, and potential edge-case failures. You assume full responsibility for evaluating the fitness and safety of any code or architectural pattern before deploying it in production environments.</li>
        </ul>

        <h2>5. Paid Subscriptions, Billing &amp; Cancellations</h2>
        <ul>
          <li><strong>Billing:</strong> Paid memberships are billed in advance on a recurring monthly or annual basis.</li>
          <li><strong>Cancellations:</strong> You may cancel your subscription at any time via your account portal. Cancellation takes effect at the conclusion of your current paid billing period; we do not offer retroactive prorated refunds, except where required by law.</li>
          <li><strong>Modifications:</strong> We reserve the right to modify subscription pricing upon providing at least 30 days’ prior notice.</li>
        </ul>

        <h2>6. Disclaimer of Warranties &amp; Limitation of Liability</h2>
        <ul>
          <li><strong>"As-Is" Basis:</strong> The Services are provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, whether express or implied.</li>
          <li><strong>Limitation of Liability:</strong> To the maximum extent permitted by law, IlluminAIst, its founders, contributors, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of or inability to use the Services.</li>
        </ul>

        <h2>7. Governing Law &amp; Dispute Resolution</h2>
        <p>These Terms shall be governed by and construed in accordance with the laws of your principal operating jurisdiction (or the State of Delaware, USA, if operating globally), without regard to its conflict of law provisions. Any disputes shall be resolved through good-faith negotiations prior to binding arbitration.</p>

        <h2>8. Changes to Terms</h2>
        <p>We may update these Terms periodically. We will notify you of material changes by updating the "Last Updated" date at the top of this page or via direct email. Continued use of our Services constitutes acceptance of the revised Terms.</p>

        <h2>9. Contact Information</h2>
        <p>For inquiries regarding these Terms of Service, contact:</p>
        <p><strong>Legal &amp; Operations Team</strong><br />Email: <a href="mailto:legal@illuminaist.com">legal@illuminaist.com</a><br />Platform: <a href="https://illuminaist.com">https://illuminaist.com</a></p>
      </div>
    </PageAdLayout>
  )
}
