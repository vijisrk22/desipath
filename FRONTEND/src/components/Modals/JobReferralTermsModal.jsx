import React from 'react';

const JobReferralTermsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black bg-opacity-50 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col my-auto relative">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Job Referral Program - Terms & Conditions</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-grow text-gray-700 space-y-6 whitespace-pre-wrap font-mono text-sm leading-relaxed bg-gray-50">
{`================================================================
        DESIPATH JOB REFERRAL PROGRAM
        DISCLAIMER & TERMS AND CONDITIONS
================================================================
Last Updated: May 2025
Applicable To: All DesiPath Community Members Participating
               in the Job Referral Program

----------------------------------------------------------------
OVERVIEW
----------------------------------------------------------------

DesiPath operates a voluntary, community-driven Job Referral
Program as a free service for its members. This document
outlines the terms, conditions, and disclaimers that govern
participation in the program. By participating in any job
referral activity within the DesiPath community — whether as
a referrer, a job seeker, or a hiring contact — you agree to
be bound by the terms set out below.

Please read this document carefully before participating.

================================================================
SECTION 1: NATURE OF SERVICE
================================================================

1.1  The DesiPath Job Referral Program is a community service
     offered entirely on a voluntary, goodwill basis.

1.2  DesiPath is a peer community platform and does NOT operate
     as a recruitment agency, staffing firm, employment
     exchange, or professional placement service of any kind.

1.3  The sole purpose of the Job Referral Program is to
     facilitate connections between community members who may
     be seeking employment opportunities and those who may be
     in a position to refer or recommend them within their
     professional networks.

1.4  Participation in this program is entirely voluntary.
     No member is obligated to refer, recommend, share, or
     respond to any referral request.

================================================================
SECTION 2: NO FEES — NO PAYMENTS
================================================================

2.1  FREE SERVICE
     DesiPath does not charge any fee, commission, subscription,
     or payment of any kind for the Job Referral Program. The
     service is provided free of cost to all community members.

2.2  NO PAYMENTS TO MEMBERS
     DesiPath does not pay, compensate, incentivize, or
     remunerate any member for referring, recommending, or
     sharing job opportunities on behalf of another member.
     No monetary or non-monetary reward is offered or implied.

2.3  NO THIRD-PARTY CHARGES
     No member of DesiPath has the authority to collect fees,
     charge commissions, or demand payment from any other member
     in connection with the Job Referral Program. Any member
     who solicits payment in the name of DesiPath referrals is
     acting strictly outside the scope of this program.

2.4  If any person — whether claiming to be a DesiPath member
     or otherwise — requests money in exchange for a job
     referral, introduction, or resume sharing, you are strongly
     advised to refuse, report the matter to DesiPath
     administrators immediately, and cease all communication
     with that individual.

================================================================
SECTION 3: MEMBER RESPONSIBILITIES & VERIFICATION PROTOCOL
================================================================

3.1  VERIFY BEFORE YOU ENGAGE
     Before sharing your resume, personal information, or
     professional details with any community member, you are
     strongly advised to:

     (a) Connect with the member on a private/direct chat
         channel within the group platform.

     (b) Verify their LinkedIn profile independently.
         Confirm that their name, current employer, job title,
         and professional background are authentic and
         consistent with what they have represented in the group.

     (c) Have a meaningful conversation about the opportunity,
         the company, the role, and the referral process before
         proceeding further.

3.2  PRIVATE COMMUNICATION FIRST
     All resume sharing and referral discussions should take
     place through private, direct messaging between members
     and not through open group chat or public forums. This
     protects the privacy of job seekers and ensures that
     sensitive personal data is shared only with verified,
     consenting parties.

3.3  DO NOT SHARE RESUMES PUBLICLY
     Members should never post their resumes or personal
     details (phone number, home address, Aadhar, PAN, or
     other identity documents) in open group chats or public
     community spaces. Resume sharing must always be done
     privately, after mutual verification and consent.

3.4  DUE DILIGENCE IS YOUR RESPONSIBILITY
     Each member is solely responsible for exercising their
     own judgment and conducting their own due diligence
     before engaging with another member, sharing personal
     data, or relying on any referral provided through this
     community. DesiPath cannot and does not verify the
     identity, credentials, employer affiliation, or intent
     of any community member on your behalf.

3.5  REFERRER RESPONSIBILITIES
     Members who agree to refer another member's resume
     should:

     (a) Only refer individuals whose professional background,
         skills, and experience they have personally reviewed
         and are comfortable endorsing.

     (b) Be transparent with the job seeker about the nature
         of the referral — whether it is a formal internal
         referral, an informal introduction, or simply a
         resume pass-through.

     (c) Not guarantee interviews, job offers, or any specific
         outcome as a result of the referral.

     (d) Not share a member's resume with third parties,
         external recruiters, or other platforms without the
         explicit written or documented consent of the job
         seeker.

3.6  JOB SEEKER RESPONSIBILITIES
     Members seeking referrals should:

     (a) Ensure their resume and LinkedIn profile are
         up-to-date, accurate, and free from misleading
         information before sharing them.

     (b) Be clear and specific about the role, company, and
         location they are seeking a referral for.

     (c) Not misrepresent their qualifications, experience,
         or credentials to any referrer or community member.

     (d) Understand that a referral is a professional favour
         extended in good faith and does not guarantee any
         employment outcome.

================================================================
SECTION 4: LINKEDIN PROFILE VERIFICATION
================================================================

4.1  Before proceeding with any referral or resume exchange,
     members are encouraged to:

     (a) Request and review the LinkedIn profile URL of the
         other member involved.

     (b) Confirm that the profile is publicly accessible,
         appears authentic, and matches the details shared
         in the group.

     (c) Check for mutual connections, employment history,
         endorsements, and activity as reasonable indicators
         of authenticity.

4.2  While LinkedIn verification is strongly recommended,
     DesiPath acknowledges that it is not foolproof. Members
     must use their own judgment beyond this step.

4.3  DesiPath does not validate, certify, or vouch for any
     member's LinkedIn profile or professional credentials.

================================================================
SECTION 5: PRIVACY & DATA PROTECTION
================================================================

5.1  Members must treat any personal or professional
     information shared privately — including resumes,
     contact details, or employment history — with strict
     confidentiality.

5.2  Personal data shared for the purpose of a referral must
     not be used for any other purpose, including but not
     limited to marketing, solicitation, commercial outreach,
     or data resale.

5.3  Members who misuse personal information shared in the
     context of the Job Referral Program will be subject to
     removal from the DesiPath community and may be reported
     to relevant authorities depending on the nature of
     the misuse.

5.4  By participating in this program, you consent to other
     members sharing your professional details (such as your
     name and LinkedIn profile) with potential referrers
     or hiring contacts solely for the purpose of facilitating
     a job referral, and only after your explicit approval.

================================================================
SECTION 6: NO GUARANTEE OF EMPLOYMENT
================================================================

6.1  DesiPath makes no representation, warranty, or guarantee
     that participation in the Job Referral Program will
     result in any employment offer, interview, callback,
     or career outcome of any kind.

6.2  Job referrals are informal, community-based actions.
     The decision to hire rests entirely with the employer
     and is outside the control of DesiPath or any individual
     member.

6.3  DesiPath is not liable for any loss of opportunity,
     financial loss, reputational harm, or any other damage
     arising from a referral that does not result in
     employment or that results in an unsatisfactory outcome.

================================================================
SECTION 7: PROHIBITED CONDUCT
================================================================

The following actions are strictly prohibited within the
DesiPath Job Referral Program:

7.1  Charging money or soliciting any form of payment or gift
     in exchange for a referral or resume sharing.

7.2  Sharing a member's resume without their knowledge
     or explicit consent.

7.3  Impersonating an employer, recruiter, or hiring manager
     to extract personal information from job seekers.

7.4  Posting fake job openings or fabricated referral
     opportunities to collect resumes or personal data.

7.5  Discriminating against any member on the basis of gender,
     religion, caste, nationality, age, disability, or any
     other protected characteristic.

7.6  Using the program to solicit leads, promote services,
     or conduct any commercial activity.

7.7  Sharing confidential job descriptions, internal hiring
     data, or non-public company information without
     appropriate authorization from the employer.

7.8  Harassing, pressuring, or coercing any member into
     sharing their resume or personal information.

================================================================
SECTION 8: LIMITATION OF LIABILITY
================================================================

8.1  DesiPath, its administrators, moderators, and community
     members acting in good faith shall not be held liable
     for any direct, indirect, incidental, consequential, or
     punitive damages arising from:

     (a) Reliance on any referral made through this program.

     (b) Inaccurate, misleading, or fraudulent information
         provided by any member.

     (c) Failure of a referral to result in an employment offer.

     (d) Unauthorized use or disclosure of personal information
         by another member.

     (e) Any dispute arising between two or more members in
         connection with the referral process.

8.2  DesiPath's role is limited to providing a community
     platform for connection. It does not mediate, arbitrate,
     or adjudicate disputes between members arising from
     referral activities.

================================================================
SECTION 9: REPORTING & GRIEVANCE
================================================================

9.1  If you experience any of the following, please report
     it to a DesiPath group administrator immediately:

     (a) A member asking for money in exchange for a referral.

     (b) Suspicious behavior, fake profiles, or impersonation.

     (c) Unauthorized sharing of your resume or personal data.

     (d) Harassment or coercion related to the referral process.

9.2  DesiPath administrators reserve the right to remove any
     member found to be in violation of these terms, without
     prior notice.

================================================================
SECTION 10: AMENDMENTS
================================================================

10.1 DesiPath reserves the right to update, modify, or
     revise these Terms and Conditions at any time.

10.2 Members will be notified of material changes through
     the community group. Continued participation in the
     Job Referral Program after such notification constitutes
     acceptance of the revised terms.

================================================================
ACCEPTANCE OF TERMS
================================================================

By participating in the DesiPath Job Referral Program —
whether by posting a referral request, responding to one,
sharing a resume, or referring a candidate — you acknowledge
that you have read, understood, and agree to abide by these
Terms and Conditions in full.

If you do not agree with any part of these terms, please
refrain from participating in the Job Referral Program.

----------------------------------------------------------------
For questions or to report concerns, please contact a
DesiPath group administrator directly.

                  --- DesiPath Job referral  Community ---
         "Connecting People. Building Careers. Together."
================================================================`}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-white rounded-b-xl flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobReferralTermsModal;
