# Gruntwork Information Security Plan

Owner: Taylor Smith
Status: Not started
Created time: September 24, 2020 12:05 PM

## I. Purpose

This Information Security Policy (“Policy”) sets forth the controls Gruntwork uses to ensure that information collected, stored, managed, or accessed by Gruntwork employees and contractors or through Gruntwork products, applications, or platforms, are adequately protected. By implementing and documenting the controls below, Gruntwork has established a framework to manage risks to the company, ensure compliance with applicable legal and regulatory requirements, and safeguard the company’s information technology, reputation, intellectual property, proprietary information, personal information, and customer data from misuse or compromise.

**This serves as a central policy document with which all employees and contractors must be familiar, and defines actions and prohibitions that you must follow.** However, no single policy can cover all the possible information security issues you may face. You must seek guidance from your manager or other designated Gruntwork resource before taking any actions that create information security risks or otherwise deviating from this Policy’s requirements. Gruntwork may treat any failure to seek and follow such guidance as a violation of this Policy.

## II. Scope

This Policy covers all information and all computing resources used throughout Gruntwork’s operations. This Policy also applies to information assets owned by others, such as Gruntwork customers and sub-processors where Gruntwork has a legal, contractual, or fiduciary duty to protect those resources while they are in Gruntwork’s control or custody. All employees, contractors, or other entities acting on behalf of Gruntwork who use or access non-public information, Gruntwork-provided accounts, or other Gruntwork information systems to conduct Gruntwork business must adhere to this Policy.

## III. Definitions

**“Confidential Information”** means all information which Gruntwork has not released to the general public, including Proprietary Information and any information that Gruntwork receives from others under an obligation of confidentiality whether in written, electronic, or other form or media and whether or not marked, designated or otherwise identified as “confidential.”

**“Device”** means any desktop computer, laptop computer, tablet, handheld or mobile device, telephone or other electronic product or device that has a platform on which to download, install, or run any software program, code, script, or other content and with the capability to capture, access, or transmit Proprietary or other Confidential Information.

**“Gruntwork Business”** means all activities relating to Gruntwork’s technology, relationships, partnerships, financial affairs, and provision of DevOp services.

**“Gruntwork-Provided Account”** means any internet-based or other business account provided and controlled by Gruntwork.

**“Proprietary Information”** means all information of any kind (tangible and intangible, written and oral, and including information contained or transmitted through any electronic medium) owned by Gruntwork or licensed from third parties or that otherwise relates to Gruntwork’s actual or proposed business, which is not publicly available, including, without limitation, (i) research, development, technical data, trade secrets or know-how, drawings, engineering, hardware configuration information, products and product plans, services, marketing, selling and business plans, budgets, unpublished financial statements, licenses, prices, costs, contracts and other agreements, suppliers, customers, and customer lists, and other business information; (ii) information related to Gruntwork’s customers, including needs, preferences, terms, conditions, decision-maker and influencer identities, Gruntwork’s marketing strategies, and Gruntwork’s strategies as to individual customers, products, segments, and industries; (iii) identity, personal data, skills and compensation of employees, contractors, and consultants; (iv) specialized training; (v) information related to inventions owned by Gruntwork  or licensed from third parties; and (vi) other non-public information relating to Gruntwork that is not readily ascertainable. Proprietary Information also includes compilations of information that relate to Gruntwork’s actual or proposed business and are not made public, even if underlying information or subsets of the underlying information are public. Proprietary Information may or may not be labeled or marked “proprietary” or “confidential.” In the event of a conflict or inconsistency with any provision or definition in any offer letter, employment contract, non-disclosure agreement, or proprietary invention and assignment agreement between you and Gruntwork, the terms of that agreement shall govern.

## IV. Security Mindset

### Objectives

Gruntwork’s objectives for this Policy are the following:

- Protect the confidentiality, integrity, and availability of Gruntwork’s information assets and those of its customers;
- Respect the privacy of our customers, users, and web visitors and commit to not rent, sell, or trade any personal data in our possession or control;
- Comply with applicable privacy and data protection laws;
- Balance the need for business efficiency with the need to protect sensitive, Proprietary, and other non-public information from undue risk;
- Ensure the proper disposal of customer data; and
- Foster a strong, internal security culture.

At Gruntwork, all aspects of our operations, governance, and product development, are guided by the following principles.

**Secure by Default.** Security needs to be built-in by default and not treated as something that can be added on later. It should take effort to do something insecure. Security should be an inherent part of your process and it should always take conscious, deliberate effort to bypass that security.

Just as importantly, the secure option should be the easy option. If you try to make something super secure, but that makes it very hard to use, people will work around it, and make the system less secure overall. Usability counts for security, so you always need to strive for a good balance between secure and usable.

**Defense-in-Depth**. Humans make mistakes. Frequently. Even the most algorithmically perfect security system is not of much value if a single person making a mistake (and someone will make a mistake) leads to catastrophic failure. Therefore, a good security system is made up of many layers that back each other up, much like multiple walls in a castle, and of many isolated areas that limit the scope of any damage that happens, much like bulkheads in a ship.

**Least Privilege.** The principle of least privilege states that a principal (e.g. a user or a computer process) should be given the most minimum privileges necessary to do their job, and no more. This concept is closely related to defense-in-depth, as it limits the damage that can happen if something goes wrong (e.g., the user account gets hacked), much like a bulkhead.

## V. Governance

### Information Security Team

While security is a team effort and requires everyone’s participation, Gruntwork leadership has designated one person to serve as the main point of contact for all data privacy and security matters for Gruntwork (“Information Security Manager”). The Information Security Manager, with assistance from Gruntwork leadership is responsible for the proper implementation of the procedures outlined in this Policy and shall act as a key liaison between the Information Security Team (defined below) and Gruntwork leadership. Gruntwork leadership will ensure that the Information Security Manager has the appropriate, knowledge, training, and experience to administer these functions.

In addition to the Information Security Manager, additional Gruntwork personnel shall provide support and technical advice, as needed, including by serving as members of a standing team (“Information Security Team”). These additional members will be chosen by the Information Security Manager. Experts (internal or third-party) may also be included on the Information Security Team on a case-by-case basis. These experts will also be chosen by the Information Security Manager and Gruntwork leadership.

The current information security manager is @Yevgeniy Brikman (as of 5/18/2021).

### Risk Assessments

As appropriate, individual work groups may also conduct threat modeling exercises during the design process and perform security reviews during the development process. Specifically, Gruntwork conducts threat modeling assessments as a team for the following types of development work:

- Any live, publicly-accessible web app we run
- Any application or module we build that deals with authentication.
- Any module that has access to sensitive or powerful permissions: e.g., our CI/CD pipeline code
- Any new compliance standard we take on.
- Any other work we deem necessary as it is security sensitive for Gruntwork or its customers.

When conducting a threat analysis, employees should consider using the STRIDE threat model (Spoofing Identity, Tampering with Data, Repudiation, Information Disclosure, Denial of Service, Escalation of Privilege) and create data flow diagrams (DFDs), as appropriate.

### Annual Policy Review

On at least an annual basis, the Information Security Team will review all company privacy and data security policies to ensure that they continue to accurately reflect Gruntwork’s operations and products and adhere to applicable laws and regulations, Gruntwork’s binding contractual commitments, and relevant industry standards. The Information Security Team may engage stakeholders such as legal counsel and individual work groups, as appropriate, to assist with its review.

### Audits and Testing

Gruntwork tests key controls, systems, and procedures outlined in this Policy at appropriate intervals. The scope, sequence, and frequency of testing is determined based on the risk presented by such controls, systems, and procedures, including as indicated in a risk assessment performed pursuant to Section V, Risk Assessments above. Any internal or external audits or testing, including the methodology used, the results found, and the remediations steps undertaken shall be documented and presented to Gruntwork leadership.

Gruntwork also strives to cooperate with customers in any audit of its controls, systems, policies, and procedures provided it has been afforded reasonable notice.

### Education and Training

Recognizing that an astute workforce is the best line of defense, we strive to provide security training opportunities and resources to help our employees and contractors understand and meet their information security obligations. Every employee who handles Proprietary Information or customer data must review the following plans and policies (listed below) upon hiring and every two years thereafter. Required training programs instruct employees on the definitions of data privacy and personal data; their obligations under Gruntwork privacy and security policies; how to recognize risks relating to personal data; how to recognize and respond to phishing emails and other targeted attacks; and how to report suspected misuses of data. Gruntwork’s security training also includes a review of the following core Gruntwork information security documents:

[Policies](https://www.notion.so/Policies-6567599f50a64c9ba9560360fc8a6fea?pvs=21)

Employees must certify in writing that they have completed the training and have read and agree to comply with documents within the link above.

In addition, Gruntwork promotes security awareness and educates employees through regular newsletters and ad hoc security awareness campaigns.

Gruntwork may provide specialized training, where appropriate, to ensure that personnel are sufficiently knowledgeable to protect non-public information in their role.

Gruntwork also encourages staff to pursue technical certifications and continuing education opportunities, including training in secure coding practices. Gruntwork engineers currently hold a range of certifications including AWS Solutions Architect, AWS Cloud Practitioner, Hashicorp Terraform Associate, and Certified Information Systems Security Professional (CISSP) certifications.

### Company Policies and Resources

In addition to this Policy, Gruntwork implements and maintains a variety of additional written privacy and data security policies, notices, and standards designed to ensure the integrity, availability, and confidentiality of all non-public information and Gruntwork’s information technology assets. Relevant policies, procedures, and contractual commitments include the following:

- Terms of Service. [https://gruntwork.io/terms/](https://gruntwork.io/terms/)
- Website Privacy Policy. ****[https://gruntwork.io/legal/privacy-policy/](https://gruntwork.io/legal/privacy-policy/)
- Cookie Policy. ****[https://gruntwork.io/legal/cookie-policy](https://gruntwork.io/legal/cookie-policy)
- Data Processing Agreement. ****[https://gruntwork.io/legal/dpa](https://gruntwork.io/legal/dpa)
- Data Sub-processors List. ****[https://gruntwork.io/legal/subprocessors](https://gruntwork.io/legal/subprocessors)
- [Gruntwork PIIA](https://docs.google.com/document/d/1R1WfyhA9nvYeMFehIKRuCOpysDGcIpEY9BOUplm46DI/edit) (Proprietary Information and Inventions Agreement)

[Gruntwork Incident Response Plan ](https://www.notion.so/Gruntwork-Incident-Response-Plan-02f5a54f511448e8833d32a99f53d62a?pvs=21)

Furthermore, Gruntwork may, from time to time, approve and make available more detailed or location or work-group specific plans, policies, procedures, standards, or processes to address specific issues. These additional plans, policies, procedures, standards, and processes, as well as those listed above, are extensions of this Information Security Policy. You must comply with them, where applicable, unless you obtain an exception.

### Customer Policies

In some cases, Gruntwork may agree to comply with specific customer information security policies or standards. To minimize special cases, Gruntwork has designed this Policy to include the requirements common to most of our customers.

If Gruntwork agrees to comply with additional customer-specific information security policies or standards, we will notify affected personnel and make those policies or standards available. **You must comply with any such policies or standards, including any related training or additional background screening requirements.**

### Exceptions

Gruntwork recognizes that specific business needs and local situations may occasionally call for an exception to this Policy. Exception must be granted, in writing, in advance by Gruntwork leadership.

**You should not assume that Gruntwork leadership will approve an exception simply because he or she has previously approved a similar exception.** Each non-compliant situation requires a review of the specific facts and risks to Gruntwork’s information assets and those of our customers.

Gruntwork leadership will periodically review all granted exceptions to confirm that a business need for the exception still exists.

### Compliance Management and Sanctions

Any confirmed violation of this Policy may result in disciplinary action or other sanctions. Sanctions may include suspension, access restrictions, work assignment limitations, or more severe penalties up to and including termination, in accordance with applicable law. If Gruntwork suspects illegal activities, it may report its concerns to the applicable authorities and aid in any investigation or prosecution of the individuals involved.

## VI. Compliance: Legal, Regulatory, and Contractual Obligations

Like most companies, Gruntwork is subject to a collection of laws, regulations, industry standards, frameworks, and contractual commitments, some of which vary or overlap. This section highlights the obligations that you are most likely to encounter.

**Privacy and Security Laws**

There are a variety of laws at the state, federal, and international level designed to protect individuals’ personal information. Personal information includes details that alone or in combination with other information may identify a specific individual. This includes details such as names, email addresses, unique device identifiers, internet browsing history, and information about a person’s interactions with a website, mobile app, email, or advertisement. It can also include financial account information, government identification numbers, and other sensitive data.

Privacy and security laws generally fall into three categories:

1. Laws that apply to specific jurisdictions. For instance, information collected from European residents is subject to the European Union’s General Data Protection Regulation (“GDPR”) and information collected from California residents may be subject to California privacy statutes.
2. Laws that apply to specific types of information. For instance, financial information can be subject to the Gramm-Leach-Bliley Act and may be covered by certain regulations promulgated by the Office of the Comptroller of the Currency.
3. Laws that apply to specific types of individuals (particularly vulnerable populations). For instance, information collected from children under certain age thresholds is subject to the Children’s Online Privacy Protection Act and is subject to stricter regulations under both the GDPR and California privacy law.

Among other things these laws may:

- Impose certain requirements when personal information is transferred across borders;
- Require that personal information be protected using reasonable data security measures or more specific controls; and
- Grant individuals certain rights with respect to information relating to them, including rights to access that information, object to its use, and request its correction or deletion.

Many jurisdictions have also enacted breach notification laws that require organizations to notify affected individuals if personal information is lost or accessed by unauthorized parties.

Information Gruntwork collects from and about its employees, web visitors, customers, service providers, and users may qualify as personal information and should be treated with care. When collecting, creating, or using new or different types of information, always consult with your manager and, as appropriate, the Information Security Manager to understand your obligations.

**Other Applicable Laws, Regulations, Standards, or Contractual Commitments**

- Intellectual Property Rights. ****A variety of legal, regulatory, and contractual requirements related to intellectual property rights may apply to the use of customer and service provider data and proprietary software products.****
- Recordkeeping Requirements. ****Records must be protected from loss, destruction, falsification, unauthorized access and unauthorized release, in accordance with a variety of legal, regulatory, and contractual requirements.
- Cryptographic controls. ****Cryptographic controls must be used in compliance with all relevant contractual agreements and export control statutes.

Do not assume that these are the only laws or requirements that may apply. To identify specific obligations, seek guidance from your manager and, where appropriate, the Information Security Manager.

## VII. Data: Information Inventory, Classification and Risk-Based Controls

### Data Inventory

Gruntwork recognizes that the first step in establishing an effective information security program is identifying all data it collects, stores, manages, and accesses. Accordingly, the Information Security Manager shall ensure that all data is inventoried and classified to assist in designating proper security controls and to enable compliance with laws, regulations, policies, standards, and other appropriate criteria, including customer contracts. Everyone is responsible for data classification and inventory in their respective roles. It is the direct responsibility of all data handlers and data stakeholders to ensure that their data inventories are reported to the Information Security Manager, who shall maintain a comprehensive inventory.

At a minimum, the following information should be included in any data inventory: data type, data classification, source of data, location of data storage, ways in which data may be transmitted, identify of any third-parties with whom data may be shared, categories of Gruntwork employees who may have access to such data.

Inventories of data may be used for the following:

- Risk assessments of systems
- Security management
- System design
- Disaster recovery planning
- Monitoring of systems
- Incident response

[Data Access, Use and Storage Inventory](https://www.notion.so/Data-Access-Use-and-Storage-Inventory-259ecf99596242f1b9e01a7ca0059d1f?pvs=21)

[Data Collection Inventory](https://www.notion.so/Data-Collection-Inventory-ed9e31b0d7694701af4c88aa135afc69?pvs=21)

### Classification and Risk-Based Controls

Gruntwork has established a three-tier classification scheme to protect information according to risk level. The information classification scheme allows Gruntwork to select appropriate security controls and balance protection needs with costs and business efficiencies.

All Gruntwork information is classified as (from least to most sensitive): (1) Public Information, (2) Confidential Information, or (3) Highly Confidential Information.

Unless it is marked otherwise or clearly intended to be Public Information, treat all Gruntwork and customer information as if it is at least Confidential Information, regardless of its source or form, including electronic, paper, verbal, or other information.

**You must apply security controls appropriate for the assigned information classification level to all information you store, transmit, or otherwise handle.** Use classification level markings, where feasible.

**Public Information**

Public Information is information that Gruntwork has made available to the general public. Information received from another party including a customer that is covered under a current, signed non-disclosure agreement must not be classified or treated as Public Information.

Some Public Information examples include, but are not limited to the following:

- Press releases;
- Gruntwork marketing materials;
- Job announcements; and
- Any information that Gruntwork makes available on its publicly-accessible website.

Do not assume that any information you obtain from Gruntwork’s internal network or systems is publicly available. For example, draft marketing materials are typically Confidential Information until their release. **Consider all information to be at least Confidential Information, and not available for public disclosure without authorization, until you verify it is Public Information.**

**Confidential Information**

Confidential Information is information that may cause harm to Gruntwork, its customers, employees, or other entities or individuals if improperly disclosed, or that is not otherwise publicly available. Harms may relate to an individual's privacy, Gruntwork’s marketplace position or that of its customers, or legal or regulatory liabilities.

Mark Confidential Information to denote its status when technically feasible. Applications or databases that contain Confidential Information may be marked with an initial banner shown upon system access.

You must have authorization to disclose Confidential Information to an external party. Seek guidance from your manager or the Information Security Manager before disclosing Confidential Information and verify that an appropriate non-disclosure or other agreement is in effect.

Some Confidential Information examples include, but are not limited to the following:

- Gruntwork financial data, customer lists, revenue forecasts, program or project plans, and intellectual property
- Customer-provided data, information, and intellectual property
- Customer contracts and contracts with other external parties, including vendors
- Communications or records regarding internal Gruntwork matters and assets, including operational details and audits
- Gruntwork policies, procedures, standards, and processes (for example, this Policy is Confidential Information and should not be shared without authorization from the Information Security Manager)
- Any information designated as “confidential” or some other protected information classification by an external party and subject to a non-disclosure or other agreement
- Information regarding employees (see also **Section VII, Highly Confidential Information**, regarding personal information);
- Any summaries, reports, or other documents that contain Confidential Information; and
- Drafts, summaries, or other working versions of any of the above.

You must protect Confidential Information with specific administrative, physical, and technical safeguards implemented according to risks, including (but not necessarily limited to) the following:

- Authentication. Electronically stored Confidential Information should be protected with authentication checkpoints and only accessible after logging in.
- Discussions. Only discuss Confidential Information in non-public places, or if a discussion in a public place is absolutely necessary, take reasonable steps to avoid being overheard.
- Copying, Printing, Scanning. Only scan, make copies, and distribute Confidential Information to the extent necessary or allowed under any applicable non-disclosure agreement or other applicable agreement. Take reasonable steps to ensure that others who do not have a business need to know do not view the information.
- Encryption. Encrypt Confidential Information when storing it on a laptop, smartphone, or other mobile Device. Consider encrypting Confidential Information when transmitting or transporting it externally, based on specific risks. Seek assistance from your manager or the Information Security Manager, if needed.
- Mailing. Use a service that requires a signature for receipt of the information when sending Confidential Information outside Gruntwork. Be aware that some customer contracts include restrictions on sending Confidential Information outside Gruntwork.
- Need to Know. Only access, share, or include Confidential Information in documents, presentations, or other resources when there is a business need to know.
- Physical Security. Only house systems that contain Confidential Information or store Confidential Information in paper or other forms in physically secured areas.

**Highly Confidential Information**

Highly Confidential Information is information that may cause serious and potentially irreparable harm to Gruntwork, its customers, employees, or other entities or individuals if disclosed or used in an unauthorized manner. Highly Confidential Information is a subset of Confidential Information that requires additional protection.

Mark Highly Confidential Information to denote its status when technically feasible. Applications or databases that contain Highly Confidential Information may be marked with an initial banner shown upon system access.

You may not remove Highly Confidential Information from Gruntwork's environment without authorization.

You must have authorization to disclose Highly Confidential Information to an external party. Seek guidance from your manager and, if appropriate, the Information Security Manager prior to disclosing Highly Confidential Information externally to ensure Gruntwork meets its legal obligations.

Some Highly Confidential Information examples include, but are not limited to the following:

- Personal information for employees, customers, business partners, or others; and
- Sensitive Gruntwork business information, such as budgets, financial results, or strategic plans.

You must protect Highly Confidential Information with specific administrative, physical, and technical safeguards implemented according to risks and as prescribed by applicable laws, regulations, and standards, including (but not necessarily limited to) the following:

- Authentication. Electronically stored Highly Confidential Information must be subject to authentication checkpoints and only be accessible to an individual after logging in and with specific authorization.
- Discussions. Only discuss Highly Confidential Information in non-public places.
- Copying, Printing, Scanning. Do not scan, copy, or distribute Highly Confidential Information unless absolutely necessary. Take reasonable steps to ensure that others who do not have a specific business need to know do not view the information.
- Encryption. You must encrypt Highly Confidential Information when transmitting it, whether externally or internally, or when storing it on a laptop, smartphone, or other mobile Device, including removable storage media such as USB drives. You should also encrypt Highly Confidential Information when storing it on a server, database, or other stationary Device.
- Mailing. Do not mail Highly Confidential Information unless absolutely necessary. Use a service that requires a signature for receipt of the information when sending Highly Confidential Information outside Gruntwork. If you use electronic media to mail Highly Confidential Information, you must encrypt and password protect it. You must use Keybase to encrypt any secrets that you share.
- Need to Know. Only access, share, or include Highly Confidential Information in documents, presentations, or other resources when there is a specific business need to know.
- Network Segmentation. Where feasible, Highly Confidential Information should be segmented from other less sensitive information. This may be achieved through firewalls, privilege restrictions, or other security mechanisms.
- Physical Security. Only house systems that contain Highly Confidential Information or store Highly Confidential Information in paper or other forms in physically secured areas, accessible only to those with a specific business need to know.

## VIII. People: Roles, Access Control, and Acceptable Use

Good security requires directing attention to three areas: people, process, and technology. Of these, people remain the weakest link. Humans make mistakes. Frequently. They can also act carelessly or maliciously.

This section describes controls Gruntwork has developed to protect against the risks posed by its staff and external parties with whom it works You must support these controls to the extent they apply to you.

### Background Checks

Gruntwork requires employees to undergo background check before they are allowed access to Proprietary Information or customer data. In the United States, Gruntwork uses an external screening agency to perform pre-employment background checks for prospective hires. Personnel screening in other countries varies according to local laws, employment regulations, and local Gruntwork policy. Gruntwork may require employees who handle Highly Confidential Information to undergo additional background screening and testing where permitted by applicable laws. All information obtained as a result of a background check will be used solely for employment purposes and will be kept confidential. You are entitled to request copies of any background check information to the extent permitted by state and federal law.

Supervising managers may request access for their employees only to those Gruntwork systems and data required to meet business needs.

### External Parties

**Service Providers and Business Partners**

Gruntwork grants systems access to approved external parties, such as contractors, vendors, service providers, business partners, or others with a demonstrated business need that cannot be reasonably met through other means (see **Section XI, Service Providers: Risks and Governance).** Gruntwork may support different access levels for different business situations.

A sponsoring employee must be designated for any external party before Gruntwork grants access to its systems, accounts, or data. The sponsoring employee is responsible for supervising the external party, including overseeing the external party’s compliance with this Policy.

The sponsoring employee may request access only to those Gruntwork resources necessary to meet business needs. The sponsoring employee must also request that any access granted be terminated when the business need ends.

**Customers and Users**

All organizations (i.e., either a company or a team within a company) are manually vetted prior to granting them access to the Gruntwork subscription. All individuals associated with an organization (“users”) are manually reviewed by a Gruntwork team member and preventative measures are in place prohibiting individuals with @gmail.com or @yahoo.com email addresses from being added as users. If a user tried to gain access with these, Gruntwork will block access and ask the user to send a request from an address associated with their organization.

### Add, Change, Terminate Access

Gruntwork restricts access to specific resources to those with a business need to know. Responsible managers and sponsoring employees should direct requests to add or change access levels to Gruntwork leadership. The Information Security Team must periodically review access levels to confirm that a legitimate business need for the access still exists.

When an employee leaves the business, Gruntwork will timely deactivate the individual's account(s). For external parties, the sponsoring employee must notify the Information Security Manager and request that access be revoked when there is no longer a business need. Managers should seek guidance from the Information Security Manager regarding access for employees on extended leaves.

### Authorization Levels and Least Privilege

Adhering to the principle of least privilege ensures that Gruntwork only grants individuals the privileges they need to perform their assigned activities and no more. Least privilege applies to user and administrative access. Managers must not grant administrative privileges unless there is a specific business need and should limit them to the extent feasible.

### **Role-Based Access Controls**

Managers should use role-based access control methods whenever feasible to assign authorization levels according to business functions, rather than uniquely for each individual. This method supports the least privilege approach by standardizing access. It also simplifies periodic access reviews.

### Privacy and Security Code of Conduct

As a fully distributed company, Gruntwork staff work on their own Devices and their own networks. To provide guidance and set expectations about the minimum security requirements required when staff use or access Proprietary Information, customer data, Gruntwork-Provided Accounts, or connect to other information systems owned or controlled by Gruntwork, Gruntwork has prepared and maintains a written Privacy and Security Code of Conduct (“Code of Conduct” or “Code”). Employees are provided a copy of the Code of Conduct upon hire and must certify in writing that they have read and agree to abide by the terms in the Code before they are granted access to any non-public information. For more detail regarding acceptable uses of Gruntwork’s information assets, please see the [Gruntwork Privacy and Security Code of Conduct](https://www.notion.so/INTERNAL-Gruntwork-Privacy-and-Security-Code-of-Conduct-0ed8988d3dcf4b59b00fd49a7e77242e?pvs=21).

## IX. Information Assets: Protecting and Managing Gruntwork's Information Technology Environment

This section describes key safeguards that Gruntwork uses to protect and manage its information assets, including cloud accounts. You must support their use to the extent that they apply to you.

**Secure Storage**

Data - and the assets containing that data - must be stored in a manner commensurate with their sensitivity. Gruntwork uses several categories of control for data “at rest”.

**Physical Security**

Gruntwork uses physical safeguards to avoid theft, unauthorized use, or other abuses of its information assets. As a fully remote company with no physical offices, Gruntwork focuses on anti-theft and anti-tampering controls that prevent or track unauthorized removal or changes to physical assets. **Key physical security requirements and recommendations are outlined in the Code of Conduct. You must comply with them to the extent they apply.** Specifically, you must:

- Protect Device Access. Keep laptops and other Devices used to conduct Gruntwork Business with you or in a safe, locked space at all times. Do not leave devices unattended, even for short periods of time. If a Device absolutely must be left in a vehicle, lock it in the truck.
- Exercise Caution When Using Removable Media. Use extreme caution when using removable storage media such as USB drives. Never use a USB drive if you do not know where it came from and do not continue to use a USB drive if you have plugged it into a system the safety of which you cannot verify.
- Practice a “Clean Desk” Policy. Take reasonable steps to ensure that all Confidential and Highly Confidential Information in paper or electronic form is secured in your work area at the end of the day and when you will be gone for an extended time. Screen-lock Devices when not in use, lock Confidential and Highly Confidential Information in paper form and or stored on removable media such as USB drives in a drawer or file cabinet when not in use; and securely dispose of Confidential and Highly Confidential Information in paper form or stored on removable media when such information is no longer needed.
- Exercise Caution When Working in Public Places. Be vigilant when working in public places to ensure that unauthorized individuals behind or beside you cannot view your computer or mobile screen or overhear confidential business conversations. When accessing Gruntwork-Provided Accounts or other Gruntwork information systems on an unsecured network (e.g., a public WiFi hotspot at a coffeeshop or an airport), ensure that all communication over the network is encrypted, at a minimum, with TLS. If possible, use a second layer of protection, such as a virtual private network (VPN), which encrypts traffic between a computer or other Device and the internet.
- Utilize “Find My Device” Services, if Available. Register with applicable “Find My Devices” services, if available, for any Device you use to conduct Gruntwork Business. These services allow you to locate, ring, lock, and/or wipe a Device if it is lost or stolen.

**Security Features/Configurations**

In addition to physical protections, technological protections must be installed or configured on assets containing sensitive data.

- *Password Protection.* Secure Devices with a strong, unique password that complies with Gruntwork’s defined password construction guidelines, which can be found in the Privacy and Security Code of Conduct. All employees must use a well-known, reputable password manager such as 1Password or LastPass, to make it easier to maintain multiple, unique passwords. Gruntwork can provide subscriptions as necessary. Passwords, credentials, and secrets of all kinds should not be stored in plaintext, under any circumstances. Protect your passwords and never disclose them to others, including co-workers and members of your family or household. You must use multi-factor authentication for any Device or Gruntwork-Provided Account used to conduct Gruntwork Business that offers this option. All personal SSH keys must be encrypted and protected with a password.
- *Anti-Virus Software.* Take all reasonable steps to prevent the installation of malicious software on Devices containing or used to access Confidential or Highly Confidential Information. For Windows users, this includes using up-to-date anti-virus and anti-spyware software from a reputable provider. For mac users, this includes using proper user and file permissions and signed software.
- *Monitoring/Alerting Software.* Where offered, Gruntwork takes advantage of monitoring/alerting software made available by its third-party cloud partners to use software to record logs, track metrics, and fire automated alerts. Alerting/monitoring software Gruntwork currently uses include AWS CloudWatch and CloudTrail. Such software periodically examines activity on systems and searches for indicators of compromise.
- *Logging Utilities.* Where offered Gruntwork takes advantage of logging utilities made available by its third-party cloud partners. Such tools document activity on a system that can be used to audit access or identify incidents.
- *File-level or Full Disk Encryption.* You must encrypt entire Devices, as well as sensitive files and folders, as appropriate, to ensure that only authorized individuals may gain access. This includes, without limitation desktop computers, laptops, tablets, and mobile phones as well as any removable storage media such as USB “flash” drives used to store, backup, or transfer Confidential or Highly Confidential Information. You must use industry-standard and publicly tested encryption standards.
- *Host and/or Network Firewalls.* For its internal operations, Gruntwork leverages a variety of sophisticated third-party cloud providers, who employ both host and network firewalls. Employees and contractors must activate personal firewalls on all Devices used to conduct Gruntwork Business.
- *Data Storage Prohibitions.* You may not store Confidential or Highly Confidential Information on local drives or in personal cloud storage accounts. Upon termination, you must certify that you have deleted and destroyed any Confidential or Highly Confidential Information in your possession or control.
- *Secure Backups.* Gruntwork backs up data on a regular basis to protect against loss of integrity or availability of data. Back-up frequency and schedules are determined by legal, contractual, and workflow considerations as well as how often changes are made to data and what extent of data loss can be tolerated. Our code from GitHub is backed up to S3 via BackHub.
- *Data Retention.* Gruntwork has developed and maintains a written [Data Retention Policy](https://www.notion.so/Gruntwork-Data-Retention-Policy-df3b3a46c101491a8739ab2871a80ceb?pvs=21) addressing long-term data storage and data removal, including setting maximum and minimum periods of time for data retention. These policies include procedures for returning or deleting customer data upon request or termination of the relationship.
- *Disaster Preparedness.* To ensure that Gruntwork is prepared to quickly and efficiently respond to and recover from different levels of disasters or interruptions in service, Gruntwork has developed and maintains a written Disaster Recovery Plan. The Disaster Recovery Plan sets out the roles and responsibilities of various Gruntwork personnel in recovering from disasters and interruptions in service, including assessing the extent of a given disaster; mitigating damage; and communicating with staff, vendors, and customers. In addition, Gruntwork may, from time to time, implement location or work-group specific plans, policies, or procedures to address specific issues or response processes.
    - To assure maximum preparedness, the Gruntwork Disaster Recovery Plan undergoes comprehensive internal testing at least once a year. Partial tests of individual components and recovery plans of specific teams may be carried out at additional intervals, as appropriate. Testing may include, verbal walkthroughs, technical simulations, and staged restorations of systems and data sets from back-ups. Gruntwork will also review its disaster recovery processes in the event of any re-organization of the business; changes in key personnel, the addition or removal of systems, and material gaps or weaknesses identified through invocation of the plan or through testing. For more information please refer to the [Gruntwork Disaster Recovery Plan](https://www.notion.so/Gruntwork-Disaster-Recovery-Plan-4c5d0db5c95940e5bab94f14bebf26a4?pvs=21).
- *Secure Disposal.* When there is no longer a business need for data, it should be removed from any relevant Device or system and made highly difficult or impossible to retrieve. This may involve the use of tools such as hard drive destruction, paper shredders, or special security software. This may also include de-identifying data such that it cannot reasonably identify an individual. Consult your manager for guidance on appropriate means to securely dispose of data.
- *Legal Compulsion.* It is Gruntwork’s policy to disclose non-public information about individuals in connection with a civil or criminal investigation only with the individual’s consent or upon receipt of a valid subpoena, civil investigative demand, court order, search warrant, or other similar valid legal process. In certain exigent circumstances, we may also share limited information but only corresponding to the nature of the circumstances, and require legal process for anything beyond that. Gruntwork reserves the right to object to any requests for non-public information. Where Gruntwork agrees to produce non-public information in response to a lawful request, we will conduct a reasonable search for the requested information. If you receive a request for non-public information in connection with a civil, criminal, or regulatory investigation, notify your manager immediately. Do not provide any information with approval from Gruntwork leadership.
- *Secure Transmission*. In addition to protecting data in its storage location(s), personnel should must protect data in transit between systems.
    - *Network Encryption.* Where feasible and commensurate with the risk, Gruntwork supports the use of network encryption to prevent unauthorized access to data as it travels across a network. Examples of network encryption include HTTPS, SSL/TLS, and VPN tunnels. You must ensure that your home wireless networks are encrypted using industry standard encryption. When accessing Gruntwork-Provided Accounts or other Gruntwork information systems on an unsecured network (e.g., a public WiFi hotspot at a coffeeshop or an airport), you should use a VPN account. The Gruntwork website and Gruntwork portal uses HTTPS.
    - *Data Transmission Policies.* Acceptable methods for transmission depend on the sensitivity of the data to be transmitted. Enhanced security measures may be required where Confidential or Highly Confidential Information is being transmitted. Such measures may include encrypting email transmissions containing such information, using-password protection for attachments, or using a well-vetted and secure third-party cloud-storage system approved by Gruntwork to exchange documents or other data. **Secrets, such as passwords, API keys, and SSH keys should never be sent over an unencrypted channel.** For guidance, please refer to the Privacy and Security Code of Conduct and consult with your manager.
    - *Sharing Secrets.* Gruntwork employees at times may need to share secrets within the Gruntwork team and with customers. Gruntwork uses Keybase to send one-off secrets to customers and share persistent secrets internally within the Gruntwork team.
    Keybase is a system where users can prove their identity and store encryption keys. Keybase can be used to (a) safely identify another user, and (b) encrypt data for them, using their encryption keys, in a way where only that user can decrypt that data. Once encrypted with Keybase, we can safely send this data (the “ciphertext”) via email to customers without any worry of anyone else being able to read it. Alternatively, you may use Keybase chat to exchange secrets with customers. Keybase supports fully encrypted, real-time chat, as well as time-bound messages that are erased after a configurable period of time. Keybase allows for users to be invited to private team and to encrypt data in such a way that only members of that team can decrypt it. Gruntwork internal teams can use this functionality to encrypt secrets that need to be shared with the entire team. The encrypted data (the “ciphertext”) is then stored in Gruntwork’s internal wiki, so no one will be albe to read it unless they are part of that Keybase team and use Keybase to decrypt the data.

**Authentication and Authorization**

Gruntwork uses the following authentication and authorization controls to restrict access to Confidential and Highly Confidential Information to specific sets of individuals with specific permissions.

- *Least Privilege. *****Each user is assigned the minimum permissions level required in order to perform his or her job functions. This includes both the breadth of access (what data is accessible) and the depth of access (what actions the user is able to perform on that data). The Information Security Manager periodically reviews permission levels to ensure a business need still exists.
- *Strong Password Requirements.* ****Gruntwork requires that employees use multi-factor authentication when available, and strong passwords at all times. You must use multi-factor authentication for any Device or Gruntwork-Provided Account used to conduct Gruntwork Business that offers this option. If multi-factor authentication is not available, you must secure Devices and Gruntwork-Provided Accounts used to conduct Gruntwork Business with a strong, unique password that complies with Gruntwork’s defined password construction guidelines. All Gruntwork employees are required to use a password manager such as 1Password or LastPass.
- *Authentication Checkpoints.* ****Where feasible and appropriate, Gruntwork implements authentication checkpoints to affirm or re-affirm access permissions at various stages of data access.****
- *Audit Logs.* Where offered, Gruntwork takes advantage of audit logging tools made available by its third-party cloud partners to record both failed and successful log-in attempts. Such tools can help identify attempts to breach a system and gain unauthorized access to data. Gruntwork also uses audit logs to detect attempts to gain unauthorized access to its portal.
- *Secure Hiring, Termination, and Role Change Practices.* Gruntwork places a strong emphasis on personnel security. The company has ongoing initiatives designed to minimize risks associated with human error, theft, fraud, and misuse of facilities, including background screening, confidentiality agreements, procedures for de-provisioning credentials and changing access permissions, and enforcement of disciplinary actions. See **Section VIII. People: Roles, Access Control, and Acceptable Use** above for more information.

### Managing Information Assets

**Procurement**

To avoid unexpected business impacts, Gruntwork leadership, or the Information Security Manager, if authorized by Gruntwork leadership, must approve all information assets, including cloud-based productivity tools, before they may be used in or connected to Gruntwork's operations. This Policy applies whether the software, service, or other asset is purchased, open source, or made available to Gruntwork at no cost.

Before using cloud computing services to access, store, or manage Confidential or Highly Confidential Information, you must obtain authorization from the Information Security Manager who will evaluate the cloud computing service with input from legal counsel (see **Section XI, Service Providers: Risks and Governance**).

**Application and Software Development**

Gruntwork uses defensive coding techniques, regular code review, and application-level scanning to identify and remediate any information security issues before releasing software.

**Secrets Management in Code**

Sometimes, to execute code, secrets are needed. Gruntwork has expertise in secrets management and has produced a [blog post](https://blog.gruntwork.io/a-comprehensive-guide-to-managing-secrets-in-your-terraform-code-1d586955ace1) that serves as a resource for sharing best practices with Gruntwork employees, as well as customers. You should review this blog post to understand Gruntwork’s expectations with respect to managing secrets in code. Specifically, Gruntwork practices and recommends the following:

- Never define or store secrets in plain text.
- When running code manually (e.g., on your own computer) read the secrets from a secure password manager and expose it to your code via environment variables. For example, when authenticating to AWS on the command-line, use aws-vault to store your AWS credentials securely (e.g., in OS X Keychain), and the aws-vault exec <PROFILE> -- <COMMAND> command to expose the credentials for profile <PROFILE> as environment variables to command <COMMAND>.
- When running code automatically, such as an app automatically deploying in AWS, manually setting environment variables may not be an option. In these cases, we recommend one of the following two options for secrets management:
    - Config files with encrypted secrets.
        - In general, all application configuration should be stored in config files (using whatever config format works best for the given framework: e.g. config.yml, config.json, etc) that are checked into the same repo as the application code, tested with the app, packaged with the app (e.g., into the AMI or Docker image), and versioned with the app.
        - If the configuration for the app contains secrets—e.g., a database password or API key—those secrets should be encrypted. To encrypt something, you need to store the encryption key somewhere. We recommend using a secure store such as [KMS](https://aws.amazon.com/kms/). You can then use Gruntwork's CLI tool [gruntkms](https://github.com/gruntwork-io/gruntkms) to easily encrypt with a KMS key. Since the secrets are encrypted, it’s safe to write them into a config file and check them into version control. When an app is booting, the app can load the proper config file for the current environment (e.g. config-stage.yml in the staging environment) and decrypt any secrets within it using [gruntkms](https://github.com/gruntwork-io/gruntkms).
    - Reading secrets from a secret store.
        - Another option is to store secrets in a dedicated secret store, such as [AWS Secrets Manager](https://aws.amazon.com/secrets-manager/) or [HashiCorp Vault](https://www.vaultproject.io/).
        - An administrator can write secrets to the secret store.

**Change Management/Version Control**

Gruntwork maintains a change management process to minimize business impacts or disruptions when changes are made during software development. Among other things, Gruntwork uses a distributed version control system known as [Git](https://git-scm.com) and a third-party service provider called [GitHub](https://www.github.com) to track changes in source code, provide change control history, and audit Gruntwork’s software. This allows Gruntwork to track identified problems, fixes, and releases during software development and preserves code so that earlier versions can be recovered and rebuilt, if necessary.

**Code Reviews**

Gruntwork conducts all code changes through pull requests. Every pull request must be reviewed by at least one other person before it can be merged. Gruntwork enforces this requirement through GitHub protected branches, as well as through GitHub’s internal tool, github-audit.

**Testing**

All of Gruntwork code requires automated tests. Gruntwork uses a mixture of static analysis, unit tests, integration tests, and end-to-end tests, testing both application and infrastructure code. Every repo is configured to run tests after every single commit. Test results are visible in pull requests and are part of what maintainers take into consideration before merging.

Automated testing in the infrastructure code space is still fairly novel. We’ve had to pioneer our own infrastructure test library, called [Terratest](https://www.terratest.gruntwork.io), which we've open sourced, and has become popular in the community. All of our infrastructure code is tested with Terratest: it supports testing for tools such as Terraform, Packer, Docker, Kubernetes, AWS, Google Cloud, Azure, and more.

If we discover a bug in a public cloud provider or Terraform itself, we codify it explicitly using a test case. Likewise, we use test cases to verify our source code and product features work as intended by creating, modifying and destroying live infrastructure in the public cloud providers we support. You should follow these principles to the extent they apply to you.

- Gruntwork's coding process is expanded on [here](https://gruntwork.io/guides/foundations/how-to-use-gruntwork-infrastructure-as-code-library/#contributing-to-the-gruntwork-infrastructure-as-code-library). After each merge to master, we release a new version (new Git tag). Customers can follow Git repos to be notified, or via our newsletter, which goes out once every month or two.

**Addressing Vulnerabilities**

In addition to the scrutiny we apply internally, our code is subjected to numerous third-party audits conducted by our customers and their external vendors. Some of these audits include audits for compliance standards such as PCI and HIPAA, pen testing, and security reviews. We have created and maintain a responsible disclosure channel to enable our customers and users to report vulnerabilities they discover. This ensures that security warnings are promptly brought our attention and that we can act on them quickly. For more information, please see our Vulnerability Disclosure Policy below.

[Gruntwork Vulnerability Disclosure Policy](https://www.notion.so/Gruntwork-Vulnerability-Disclosure-Policy-9e15c5f551494fef819344535428d85a?pvs=21)

Additionally, we have a [Security Bug Bounty program](https://www.notion.so/Security-Bug-Bounty-597375284b8042578d046e385768d110?pvs=21). Currently this program is not publicly advertised on our website but we plan to do so in 2021.

**Adhering to Industry Security Best Practices**

Gruntwork adheres to multiple industry frameworks and standards including the following:

- Center for Internet Security’s Amazon Web Services Foundations Benchmark. The CIS AWS Foundations Benchmark is an objective, consensus-driven security guideline for Amazon Webs Services Cloud Providers. Gruntwork is currently compliant with the **1.3.0 version** of the AWS Foundations Benchmark. You can read more about the on the Center for Internet Security's website [here](https://www.cisecurity.org/benchmark/amazon_web_services/). Gruntwork is committed to updating to the newest version of the AWS Foundations Benchmark once per quarter.
- AWS Well-Architected. AWS Well-Architected helps cloud architects build secure, high-performing, resilient, and efficient infrastructure for their application and workloads. Gruntwork adheres to the best practices outlined in the AWS Well-Architected Framework surrounding operational excellence, security, site reliability, performance efficiency and cost optimization. More information regarding AWS Well-Architected is available [here](https://aws.amazon.com/architecture/well-architected/?wa-lens-whitepapers.sort-by=item.additionalFields.sortDate&wa-lens-whitepapers.sort-order=desc).
- OWASP Top 10. The OWASP Top 10 is a standard awareness document for developers and web application security. It represents a broad consensus in the industry about the most critical security risks to web application. Gruntwork has adopted the OWASP Top 10 document to ensure that its web applications minimize risks. More information regarding the OWASP Top 10 document can be found [here](https://owasp.org/www-project-top-ten/).
- OWASP Password Storage. The OWASP Password storage cheat sheet advises on industry best practices for storing passwords. Gruntwork follows OWASP's recommendations on best practices for storing passwords. More information regarding the Password Storage Cheat Sheet can be found [here](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html).
- Twelve-Factor App. The twelve-factor app is a methodology for building software-as-service apps that can be applied to applications written in any programming language. Gruntwork follows the twelve-factor app methodology, including by using Git for version control and GitHub for storage of repositories, thereby satisfying the requirement of “one codebase tracked in revision control, many deploys.”

## X. Incident Reporting and Response

The [Gruntwork Incident Response Policy](https://www.notion.so/Gruntwork-Incident-Response-Plan-02f5a54f511448e8833d32a99f53d62a?pvs=21) details the processes Gruntwork uses for detecting and responding to unauthorized access or disclosure of Confidential or Highly Confidential Information for which Gruntwork is responsible. It defines the roles and responsibilities of various Gruntwork personnel in reporting, investigating, and remedying a security incident; outlines the timing, direction, and general content of communications with affected stakeholders; and describes the relevant phases of incident response including post-incident review and process improvement.

All Gruntwork employees have a responsibility to remain vigilant and protect the data stored within the systems we support. If you discover a security vulnerability or suspect a breach of Confidential or Highly Confidential Information, follow the notification and response processes described in the [Gruntwork Incident Response Plan](https://www.notion.so/Gruntwork-Incident-Response-Plan-02f5a54f511448e8833d32a99f53d62a?pvs=21). Do not act on your own or make any external notifications without prior guidance and authorization.

Treat any information regarding security incidents as Highly Confidential Information and do not share it, internally or externally, without specific authorization.

## XI. Service Providers: Risks and Governance

The Information Security Manager maintains a service provider governance program to oversee service providers that interact with Gruntwork's systems or with Confidential or Highly Confidential Information. The service provider governance program includes processes to track service providers, evaluate service provider capabilities, and periodically assess service provider risks and compliance with this Policy.

### Service Provider Approval Required

Obtain approval from the Information Security Manager before engaging a service provider to perform functions that involve access to Gruntwork's systems or Confidential or Highly Confidential Information. All vendors must be reviewed and approved by Gruntwork management, in consultation with company legal counsel, as appropriate, prior to allowing any third party to collect, access, store, process, transmit, or dispose of any non-public information. Prior to engagement, Gruntwork must conduct a risk-based review of the vendor’s security practice in order to make a fact-based decision about whether or not to enter into a relationship with that vendor.

### **Contract Obligations**

Service providers that access Gruntwork's systems or Confidential or Highly Confidential Information must agree by contract to comply with applicable law, regulation, and Gruntwork policy or similar information security measures.

### **Oversight**

Gruntwork may require service providers to demonstrate their compliance with applicable laws and this Policy by submitting to independent audits or other forms of review or certification based on risks.

## XII. Customer Information: Managing Intake, Maintenance and Customer Requests

In certain situations, Gruntwork creates, receives, and manages data on behalf of our customers. With guidance from the Information Security Manager, individual teams may develop, implement, and maintain processes and procedures to manage customer data intake and protection.

Work group-specific customer data intake and protection processes may vary but must include, at minimum, means for (1) identifying customer data and any pertinent requirements prior to data intake or creation; (2) maintaining an inventory of customer data created or received; (3) ensuring Gruntwork processes such data in according with customer instructions and its contractual commitments, and (4) implementing and maintaining appropriate information security measures, including proper data and media disposal when Gruntwork no longer has a business need to retain the customer data (or is no longer permitted to do so by customer agreement).

### Requirements Identification

Identify any pertinent customer data requirements prior to data intake or creation according to your team’s customer data intake and protection process. Requirements may be contractual, the result of applicable law or regulations, or both (see **Section VI, Compliance: Legal, Regulatory, and Contractual Obligations**).

### Intake Management

Work group-specific customer data intake processes and procedures must provide for secure data transfer. Maintain an inventory of customer data that includes, at a minimum:

- a description of the customer data;
- the location(s) where the data is stored;
- who is authorized to access the data (by category or role, if appropriate);
- whether the data is Confidential or Highly Confidential Information;
- how long the data is to be retained (using criteria, if appropriate); and
- any specific contractual or regulatory obligations or other identified data protection or management requirements.

**Treat any customer-provided personal information as Highly Confidential Information (see Section VII, Highly Confidential Information).** To minimize risks for customers and Gruntwork, engage customers in an ongoing dialogue to determine whether business objectives can be met without transferring personal information to Gruntwork.

### Customer Data Protection

Protect all customer data Gruntwork creates or receives in accordance with this Policy and the data's information classification level, whether Confidential or Highly Confidential Information, in addition to any specific client-identified requirements.

### Customer Data and Media Disposal

Ensure that any customer data or media containing customer data is securely disposed of when it is no longer required for Gruntwork business purposes, or as required by customer agreement (see **Section IX, Information Assets: Protecting and Managing Gruntwork’s Information Technology Environment, Secure Storage - Secure Disposal**). Update the applicable work group customer data inventory accordingly.

## XIII. Our Support Model

[https://gruntwork.io/terms/#support](https://gruntwork.io/terms/#support)

## XIV. Gruntwork Security-Related Policies & Resources

### Our Security Best Practices Training

All Gruntwork employees are trained on our security best practices which include the review of the following documents:

1. Information Security Plan (this document)
2. [Incident Response Plan](https://www.notion.so/Gruntwork-Incident-Response-Plan-02f5a54f511448e8833d32a99f53d62a?pvs=21)
3. [Common Security-related questions](https://www.notion.so/Security-Questions-a7ad78a76bab4f758bbae594efab76b5?pvs=21)

Once all documents are reviewed, employees sign saying they have implemented the appropriate security measures aligned with company policy and that they have read all the above documents.

### Our Terms of Service

[https://gruntwork.io/terms/](https://gruntwork.io/terms/)

### Our Website Privacy Policy

[https://gruntwork.io/legal/privacy-policy/](https://gruntwork.io/legal/privacy-policy/)

### Gruntwork Data Subprocessors

[https://gruntwork.io/legal/subprocessors](https://gruntwork.io/legal/subprocessors)

### Our Cookie Policy

[https://gruntwork.io/legal/cookie-policy](https://gruntwork.io/legal/cookie-policy)

### Data Processing Agreement

[https://gruntwork.io/legal/dpa](https://gruntwork.io/legal/dpa)