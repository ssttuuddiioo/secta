'use client'

import Link from 'next/link'

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-black">
      <main className="max-w-[800px] mx-auto px-5 sm:px-10 md:px-[60px] py-16 md:py-20">
        {/* Page Header */}
        <header className="mb-12">
          <h1 
            className="text-4xl md:text-5xl font-bold text-white mb-3"
            style={{ fontFamily: 'var(--font-sofia-sans)' }}
          >
            SECTA Legal Documents
          </h1>
          <p 
            className="text-sm text-white/50"
            style={{ fontFamily: 'var(--font-sofia-sans)' }}
          >
            Last Updated: December 10, 2024
          </p>
        </header>

        {/* Quick Navigation */}
        <nav className="mb-12 pb-8 border-b border-white/20">
          <p 
            className="text-sm text-white/50 mb-3"
            style={{ fontFamily: 'var(--font-sofia-sans)' }}
          >
            Jump to:
          </p>
          <div className="flex gap-4">
            <a 
              href="#privacy-policy" 
              className="text-[#3AAAFF] hover:underline text-base font-medium"
              style={{ fontFamily: 'var(--font-sofia-sans)' }}
            >
              Privacy Policy
            </a>
            <span className="text-white/30">|</span>
            <a 
              href="#terms-of-service" 
              className="text-[#3AAAFF] hover:underline text-base font-medium"
              style={{ fontFamily: 'var(--font-sofia-sans)' }}
            >
              Terms of Service
            </a>
            <span className="text-white/30">|</span>
            <a 
              href="#contact" 
              className="text-[#3AAAFF] hover:underline text-base font-medium"
              style={{ fontFamily: 'var(--font-sofia-sans)' }}
            >
              Contact
            </a>
          </div>
        </nav>

        {/* Content */}
        <article 
          className="text-white leading-[1.7] text-base md:text-[17px]"
          style={{ fontFamily: 'var(--font-sofia-sans)' }}
        >
          {/* Privacy Policy Section */}
          <section id="privacy-policy" className="mb-16 scroll-mt-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-white">
              Privacy Policy
            </h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold mb-4">1. Introduction</h3>
                <p className="mb-4">
                  SECTA (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) operates secta.com (the &ldquo;Site&rdquo;). This Privacy Policy explains how we collect, use, disclose, and protect your personal information when you visit our Site or use our services.
                </p>
                <p>
                  By using our Site, you agree to the collection and use of information in accordance with this Privacy Policy.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4">2. Information We Collect</h3>
                
                <h4 className="text-lg font-semibold mb-3">2.1 Information You Provide</h4>
                <p className="mb-3">When you contact us through our website form, we collect:</p>
                <ul className="list-disc pl-6 mb-6 space-y-1">
                  <li>Name</li>
                  <li>Email address</li>
                  <li>Message content</li>
                  <li>Mailing list preference (opt-in only)</li>
                </ul>

                <h4 className="text-lg font-semibold mb-3">2.2 Automatically Collected Information</h4>
                <p className="mb-3">We use Google Analytics 4 configured without cookies to collect anonymized information about how visitors use our Site, including:</p>
                <ul className="list-disc pl-6 mb-4 space-y-1">
                  <li>Page views and navigation patterns</li>
                  <li>General geographic location (country/region level)</li>
                  <li>Device type and browser type</li>
                  <li>Referring website</li>
                </ul>
                <p>
                  This analytics data is collected in an anonymized, aggregated form and cannot be used to identify individual visitors.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4">3. How We Use Your Information</h3>
                <p className="mb-3">We use the information we collect to:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Respond to your inquiries and requests</li>
                  <li>Provide information about our services</li>
                  <li>Add you to our mailing list (only if you explicitly opt in)</li>
                  <li>Improve our website and services</li>
                  <li>Analyze website traffic and user behavior in aggregate</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4">4. Legal Basis for Processing (GDPR)</h3>
                <p className="mb-3">We process your personal information based on the following legal grounds:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Consent:</strong> When you submit a contact form or opt into our mailing list</li>
                  <li><strong>Legitimate Interests:</strong> To analyze website traffic, improve our services, and respond to inquiries</li>
                  <li><strong>Legal Obligations:</strong> To comply with applicable laws and regulations</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4">5. Third-Party Services</h3>
                
                <h4 className="text-lg font-semibold mb-3">5.1 Formspree</h4>
                <p className="mb-6">
                  We use Formspree to process form submissions. When you submit a form, your information is transmitted through Formspree&apos;s servers before reaching us. Formspree acts as a data processor on our behalf. Formspree&apos;s privacy practices are governed by their privacy policy, available at{' '}
                  <a href="https://formspree.io/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-[#3AAAFF] hover:underline">
                    https://formspree.io/legal/privacy-policy
                  </a>
                </p>

                <h4 className="text-lg font-semibold mb-3">5.2 Google Analytics 4</h4>
                <p>
                  We use Google Analytics 4 configured to operate without cookies and with IP anonymization enabled. This allows us to understand website usage patterns while respecting your privacy. You can learn more about Google&apos;s privacy practices at{' '}
                  <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#3AAAFF] hover:underline">
                    https://policies.google.com/privacy
                  </a>
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4">6. Data Sharing and Disclosure</h3>
                <p className="mb-3">
                  We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Service Providers:</strong> With third-party service providers (such as Formspree) who assist us in operating our website and are contractually obligated to protect your data</li>
                  <li><strong>Legal Requirements:</strong> When required by law, court order, or to protect our rights, property, or safety</li>
                  <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets, with notice to affected users</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4">7. Data Retention</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Contact Form Submissions:</strong> We retain contact form submissions for 7 years from the date of submission to maintain business records, unless you request earlier deletion.</li>
                  <li><strong>Mailing List:</strong> We retain your email address for as long as you remain subscribed to our mailing list. You can unsubscribe at any time using the link in any email we send.</li>
                  <li><strong>Analytics Data:</strong> Google Analytics data is retained in anonymized, aggregated form according to Google&apos;s data retention policies.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4">8. Your Rights</h3>
                <p className="mb-3">Depending on your location, you may have the following rights regarding your personal information:</p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li><strong>Access:</strong> Request access to your personal information</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                  <li><strong>Opt-out:</strong> Unsubscribe from our mailing list at any time</li>
                  <li><strong>Data Portability:</strong> Request a copy of your data in a portable format</li>
                  <li><strong>Withdraw Consent:</strong> Withdraw consent at any time where we rely on consent as the legal basis</li>
                  <li><strong>Object to Processing:</strong> Object to processing based on legitimate interests</li>
                </ul>
                <p className="mb-6">
                  To exercise these rights, contact us at{' '}
                  <a href="mailto:pablo@studiostudio.nyc" className="text-[#3AAAFF] hover:underline">
                    pablo@studiostudio.nyc
                  </a>
                </p>

                <h4 className="text-lg font-semibold mb-3">California Residents (CCPA/CPRA)</h4>
                <p className="mb-3">California residents have additional rights under the California Consumer Privacy Act, including:</p>
                <ul className="list-disc pl-6 space-y-1 mb-6">
                  <li>The right to know what personal information we collect, use, disclose, and sell</li>
                  <li>The right to delete personal information</li>
                  <li>The right to opt-out of the sale of personal information (note: we do not sell personal information)</li>
                  <li>The right to non-discrimination for exercising your privacy rights</li>
                </ul>

                <h4 className="text-lg font-semibold mb-3">European Residents (GDPR)</h4>
                <p className="mb-3">
                  If you are located in the European Economic Area (EEA) or United Kingdom, you have rights under the General Data Protection Regulation (GDPR), including the rights listed above. You also have the right to lodge a complaint with your local data protection authority.
                </p>
                <p>
                  <strong>Data Controller:</strong> SECTA, 874 Del Mar Downs Rd, Solana Beach, CA 92075
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4">9. Children&apos;s Privacy</h3>
                <p>
                  Our Site is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately, and we will take steps to delete such information.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4">10. Security</h3>
                <p>
                  We implement reasonable technical and organizational measures to protect your personal information from unauthorized access, use, alteration, or disclosure. However, no internet transmission or electronic storage is completely secure, and we cannot guarantee absolute security.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4">11. International Data Transfers</h3>
                <p className="mb-4">
                  Your information may be transferred to and processed in the United States and other countries where we or our service providers operate. These countries may have data protection laws that differ from those in your country. By using our Site, you consent to the transfer of your information to these countries.
                </p>
                <p>
                  For users in the EEA or UK, we ensure appropriate safeguards are in place for international transfers, such as Standard Contractual Clauses or other mechanisms approved by the European Commission.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4">12. Changes to This Privacy Policy</h3>
                <p>
                  We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the &ldquo;Last Updated&rdquo; date. Your continued use of the Site after changes are posted constitutes acceptance of the updated Privacy Policy.
                </p>
              </div>
            </div>
          </section>

          {/* Visual Separator */}
          <hr className="border-t-2 border-white/20 my-16" />

          {/* Terms of Service Section */}
          <section id="terms-of-service" className="mb-16 scroll-mt-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-white">
              Terms of Service
            </h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold mb-4">1. Acceptance of Terms</h3>
                <p>
                  Welcome to SECTA (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;). By accessing or using secta.com (the &ldquo;Site&rdquo;), you agree to be bound by these Terms of Service (&ldquo;Terms&rdquo;). If you do not agree to these Terms, please do not use our Site.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4">2. Description of Services</h3>
                <p>
                  SECTA is a creative agency specializing in motion and stills production for brands and clients. Our Site provides information about our services and allows potential clients to contact us regarding project inquiries.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4">3. Use of the Site</h3>
                
                <h4 className="text-lg font-semibold mb-3">3.1 Permitted Use</h4>
                <p className="mb-3">You may use our Site for lawful purposes only. You agree not to:</p>
                <ul className="list-disc pl-6 space-y-1 mb-6">
                  <li>Use the Site in any way that violates applicable laws or regulations</li>
                  <li>Attempt to gain unauthorized access to our systems, networks, or data</li>
                  <li>Interfere with, disrupt, or damage the Site, servers, or networks</li>
                  <li>Transmit viruses, malware, or other harmful code</li>
                  <li>Collect or harvest information from the Site through automated means without permission</li>
                  <li>Impersonate any person or entity or misrepresent your affiliation</li>
                  <li>Use the Site to transmit spam, chain letters, or unsolicited communications</li>
                </ul>

                <h4 className="text-lg font-semibold mb-3">3.2 Intellectual Property</h4>
                <p className="mb-4">
                  All content on the Site, including but not limited to text, graphics, logos, images, videos, audio, software, and the compilation thereof (the &ldquo;Content&rdquo;), is the property of SECTA or its licensors and is protected by United States and international copyright, trademark, and other intellectual property laws.
                </p>
                <p className="mb-3">You may view, download, and print Content from the Site for your personal, non-commercial use only. You may not:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Reproduce, distribute, modify, create derivative works, publicly display, or publicly perform any Content without our prior written consent</li>
                  <li>Use any Content for commercial purposes without a written license agreement</li>
                  <li>Remove or alter any copyright, trademark, or other proprietary notices</li>
                  <li>Frame or link to the Site in a manner that suggests endorsement or association without permission</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4">4. Contact Form and Communications</h3>
                
                <h4 className="text-lg font-semibold mb-3">4.1 Form Submissions</h4>
                <p className="mb-3">When you submit an inquiry through our contact form, you represent and warrant that:</p>
                <ul className="list-disc pl-6 space-y-1 mb-6">
                  <li>All information you provide is accurate, current, and complete</li>
                  <li>You have the authority to provide the information</li>
                  <li>You consent to us using your contact information to respond to your inquiry</li>
                </ul>

                <h4 className="text-lg font-semibold mb-3">4.2 Mailing List</h4>
                <p className="mb-3">If you opt in to our mailing list by checking the appropriate box on the contact form, you consent to receiving periodic emails from us about our services, projects, and updates. You may unsubscribe at any time by:</p>
                <ul className="list-disc pl-6 space-y-1 mb-4">
                  <li>Clicking the &ldquo;unsubscribe&rdquo; link in any email we send</li>
                  <li>Contacting us directly at pablo@studiostudio.nyc</li>
                </ul>
                <p className="mb-6">
                  We will not add you to our mailing list unless you explicitly opt in. Submitting a contact form inquiry does not automatically subscribe you to our mailing list.
                </p>

                <h4 className="text-lg font-semibold mb-3">4.3 No Client Relationship</h4>
                <p>
                  Submitting an inquiry through our contact form does not create a client-agency relationship, partnership, joint venture, or any obligation on our part to provide services. Any formal engagement for services requires a separate written agreement signed by both parties.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4">5. Client Services and Agreements</h3>
                
                <h4 className="text-lg font-semibold mb-3">5.1 Separate Service Agreements</h4>
                <p className="mb-6">
                  All client projects and services are governed by separate written agreements that outline the specific scope of work, deliverables, timelines, payment terms, and other conditions. These Terms of Service do not constitute a service agreement or proposal.
                </p>

                <h4 className="text-lg font-semibold mb-3">5.2 Estimates and Proposals</h4>
                <p>
                  Any estimates, proposals, or pricing information provided by us are for informational purposes only and are non-binding unless formalized in a signed written agreement. We reserve the right to modify or withdraw any estimate or proposal at any time before a formal agreement is executed.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4">6. Third-Party Links and Services</h3>
                <p className="mb-4">
                  Our Site may contain links to third-party websites, services, or resources that are not owned or controlled by SECTA. We are not responsible for and do not endorse the content, privacy practices, terms of service, or availability of any third-party sites or services.
                </p>
                <p>
                  Your use of third-party websites and services is at your own risk and subject to their respective terms and policies. We encourage you to review the terms and privacy policies of any third-party sites you visit.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4">7. Disclaimer of Warranties</h3>
                <p className="mb-4 text-sm uppercase tracking-wide text-white/80">
                  THE SITE AND ALL CONTENT, SERVICES, AND INFORMATION PROVIDED THROUGH THE SITE ARE PROVIDED ON AN &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.
                </p>
                <p className="mb-3 text-sm uppercase tracking-wide text-white/80">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, SECTA DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
                </p>
                <ul className="list-disc pl-6 space-y-1 mb-4 text-sm text-white/80">
                  <li>IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT</li>
                  <li>WARRANTIES REGARDING THE ACCURACY, RELIABILITY, OR COMPLETENESS OF CONTENT</li>
                  <li>WARRANTIES THAT THE SITE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE</li>
                  <li>WARRANTIES THAT DEFECTS WILL BE CORRECTED</li>
                </ul>
                <p>
                  We do not warrant that the Site or any content will meet your requirements or expectations. The information on the Site is for general informational purposes only and does not constitute professional, legal, financial, or technical advice.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4">8. Limitation of Liability</h3>
                <p className="mb-3 text-sm uppercase tracking-wide text-white/80">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, SECTA, ITS OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, AND AFFILIATES SHALL NOT BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, REVENUE, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, WHETHER FORESEEABLE OR UNFORESEEABLE, RESULTING FROM:
                </p>
                <ul className="list-disc pl-6 space-y-1 mb-4 text-sm text-white/80">
                  <li>Your use or inability to use the Site</li>
                  <li>Any unauthorized access to or use of our servers or any personal information stored therein</li>
                  <li>Any interruption or cessation of transmission to or from the Site</li>
                  <li>Any bugs, viruses, trojan horses, or similar harmful code transmitted through the Site</li>
                  <li>Any errors, omissions, or inaccuracies in any content or materials</li>
                  <li>Any conduct or content of any third party on or related to the Site</li>
                  <li>Any other matter relating to the Site or these Terms</li>
                </ul>
                <p className="mb-4">
                  This limitation of liability applies regardless of the legal theory on which the claim is based, including breach of contract, tort (including negligence), strict liability, or any other basis.
                </p>
                <p>
                  Some jurisdictions do not allow the exclusion or limitation of certain damages, so some of the above limitations may not apply to you. In such jurisdictions, our liability shall be limited to the greatest extent permitted by law.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4">9. Indemnification</h3>
                <p className="mb-3">
                  You agree to indemnify, defend, and hold harmless SECTA, its officers, directors, employees, agents, licensors, and service providers from and against any and all claims, liabilities, damages, losses, costs, expenses, or fees (including reasonable attorneys&apos; fees) arising from or related to:
                </p>
                <ul className="list-disc pl-6 space-y-1 mb-4">
                  <li>Your use or misuse of the Site</li>
                  <li>Your violation of these Terms</li>
                  <li>Your violation of any law, regulation, or third-party right</li>
                  <li>Any content or information you submit through the Site</li>
                  <li>Any dispute between you and any third party</li>
                </ul>
                <p>
                  We reserve the right to assume the exclusive defense and control of any matter subject to indemnification by you, and you agree to cooperate with our defense of such claims.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4">10. Geographic Restrictions and Governing Law</h3>
                
                <h4 className="text-lg font-semibold mb-3">10.1 United States Focus</h4>
                <p className="mb-6">
                  SECTA is based in California, United States, and the Site is intended for use by individuals and businesses located in the United States. We make no representation that the Site, Content, or services are appropriate or available for use in other locations. If you access the Site from outside the United States, you do so at your own risk and are responsible for compliance with local laws and regulations.
                </p>

                <h4 className="text-lg font-semibold mb-3">10.2 Governing Law</h4>
                <p className="mb-6">
                  These Terms and any disputes arising out of or related to these Terms or your use of the Site shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law principles.
                </p>

                <h4 className="text-lg font-semibold mb-3">10.3 Jurisdiction and Venue</h4>
                <p>
                  Any disputes, claims, or controversies arising out of or relating to these Terms or your use of the Site shall be resolved exclusively in the state or federal courts located in San Diego County, California. You irrevocably consent to the personal jurisdiction and venue of these courts and waive any objection to jurisdiction or venue in these courts.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4">11. Modification and Termination</h3>
                
                <h4 className="text-lg font-semibold mb-3">11.1 Changes to the Site</h4>
                <p className="mb-3">We reserve the right at any time to:</p>
                <ul className="list-disc pl-6 space-y-1 mb-4">
                  <li>Modify, suspend, or discontinue the Site (or any part thereof) temporarily or permanently</li>
                  <li>Change the features, functionality, or content of the Site</li>
                  <li>Impose limits on certain features or restrict access to parts or all of the Site</li>
                </ul>
                <p className="mb-6">
                  We shall not be liable to you or any third party for any modification, suspension, or discontinuation of the Site.
                </p>

                <h4 className="text-lg font-semibold mb-3">11.2 Changes to These Terms</h4>
                <p className="mb-6">
                  We may update, modify, or revise these Terms from time to time at our sole discretion. Changes will be effective immediately upon posting on the Site with an updated &ldquo;Last Updated&rdquo; date at the top of this page. Your continued use of the Site after any changes to these Terms constitutes your acceptance of the updated Terms. If you do not agree to the modified Terms, you must stop using the Site. We encourage you to review these Terms periodically to stay informed of any updates.
                </p>

                <h4 className="text-lg font-semibold mb-3">11.3 Termination of Access</h4>
                <p className="mb-3">We reserve the right, in our sole discretion, to terminate or suspend your access to the Site at any time, with or without notice, for any reason or no reason, including but not limited to:</p>
                <ul className="list-disc pl-6 space-y-1 mb-4">
                  <li>Violation of these Terms</li>
                  <li>Fraudulent, abusive, or illegal activity</li>
                  <li>Behavior that harms or could harm SECTA, our users, or third parties</li>
                  <li>Extended periods of inactivity</li>
                  <li>Technical or security reasons</li>
                </ul>
                <p>
                  Termination of your access does not relieve you of any obligations incurred prior to termination.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4">12. General Provisions</h3>
                
                <h4 className="text-lg font-semibold mb-3">12.1 Entire Agreement</h4>
                <p className="mb-6">
                  These Terms, together with our Privacy Policy, constitute the entire agreement between you and SECTA regarding your use of the Site and supersede all prior or contemporaneous understandings, agreements, representations, and warranties, whether written or oral.
                </p>

                <h4 className="text-lg font-semibold mb-3">12.2 Severability</h4>
                <p className="mb-6">
                  If any provision of these Terms is found to be invalid, illegal, or unenforceable by a court of competent jurisdiction, the remaining provisions shall remain in full force and effect. The invalid provision shall be modified to the minimum extent necessary to make it valid and enforceable, or if such modification is not possible, it shall be severed from these Terms.
                </p>

                <h4 className="text-lg font-semibold mb-3">12.3 Waiver</h4>
                <p className="mb-6">
                  Our failure to enforce any right or provision of these Terms shall not constitute a waiver of such right or provision unless acknowledged and agreed to in writing by us. A waiver of any breach or default shall not constitute a waiver of any subsequent breach or default.
                </p>

                <h4 className="text-lg font-semibold mb-3">12.4 Assignment</h4>
                <p className="mb-6">
                  You may not assign, transfer, or delegate these Terms or your rights and obligations hereunder without our prior written consent. We may freely assign or transfer these Terms and our rights and obligations hereunder. Any attempted assignment in violation of this provision is void.
                </p>

                <h4 className="text-lg font-semibold mb-3">12.5 No Third-Party Beneficiaries</h4>
                <p className="mb-6">
                  These Terms do not and are not intended to confer any rights or remedies upon any person or entity other than you and SECTA.
                </p>

                <h4 className="text-lg font-semibold mb-3">12.6 Headings</h4>
                <p className="mb-6">
                  The section and paragraph headings in these Terms are for convenience only and shall not affect the interpretation of these Terms.
                </p>

                <h4 className="text-lg font-semibold mb-3">12.7 Survival</h4>
                <p>
                  Any provisions of these Terms that by their nature should survive termination shall survive, including but not limited to intellectual property provisions, disclaimers, limitations of liability, indemnification, and dispute resolution provisions.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4">13. Acknowledgment and Acceptance</h3>
                <p className="uppercase tracking-wide text-sm text-white/80">
                  BY ACCESSING OR USING THE SITE, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREE TO BE BOUND BY THESE TERMS OF SERVICE AND OUR PRIVACY POLICY. IF YOU DO NOT AGREE, YOU MUST NOT USE THE SITE.
                </p>
              </div>
            </div>
          </section>

          {/* Visual Separator */}
          <hr className="border-t-2 border-white/20 my-16" />

          {/* Contact Section */}
          <section id="contact" className="scroll-mt-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white">
              Contact Us
            </h2>
            <p className="mb-6">
              If you have questions, concerns, or requests regarding this Privacy Policy or Terms of Service, please contact us:
            </p>
            <address className="not-italic space-y-1">
              <p className="font-bold">SECTA</p>
              <p>874 Del Mar Downs Rd</p>
              <p>Solana Beach, CA 92075</p>
              <p>
                Email:{' '}
                <a href="mailto:pablo@studiostudio.nyc" className="text-[#3AAAFF] hover:underline">
                  pablo@studiostudio.nyc
                </a>
              </p>
              <p>
                Website:{' '}
                <a href="https://secta.com" className="text-[#3AAAFF] hover:underline">
                  secta.com
                </a>
              </p>
            </address>
          </section>
        </article>

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-white/20">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <p className="text-sm text-white/40" style={{ fontFamily: 'var(--font-sofia-sans)' }}>
              © {new Date().getFullYear()} SECTA. All rights reserved.
            </p>
            <Link 
              href="/" 
              className="text-sm text-[#3AAAFF] hover:underline"
              style={{ fontFamily: 'var(--font-sofia-sans)' }}
            >
              ← Back to Homepage
            </Link>
          </div>
        </footer>
      </main>
    </div>
  )
}
