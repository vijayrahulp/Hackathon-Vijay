
_DEWA Store for Employees _Page 1 of 13 Business Requirements Document Confidential Business Relationship Management 

## <Document Version Number> <Date of submission> **Innovation & The Future - Process Engineering 
Business Relationship Management (BRM) **
 
** 
 
DEWA Store V2.0 ** 
** 
Business Requirements Document **

---PAGE---
**Statement of Confidentiality**
The information contained in this document and related artefacts constitute confidential information of Dubai Electricity & Water Authority (DEWA) and intended for internal usage purposes only. In consideration of receipt of this document, the recipient agrees to maintain such information as confidential and not to reproduce or otherwise disclose this information to any person outside the group directly responsible for evaluation of its contents, unless otherwise authorized by DEWA in writing.

**Revision Sheet**
**Change Record**

| Date | Author | Version | Change reference |
|---|---|---|---|
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |

---PAGE---
**Table of Contents**
1. OVERVIEW  
1.1 INITIATIVE DETAILS  
1.2 INITIATIVE DESCRIPTION  
1.3 USER EXPERIENCE DETAILS  
1.4 SAP MODULE / PROCESS DESCRIPTION  
2. REQUIREMENTS DETAILS:  
2.1 PROCESS/SCENARIO REQUIREMENTS  
2.2 BUSINESS REQUIREMENTS  
2.3 REPORTING & DASHBOARD REQUIREMENT  
3. APPENDICES  
3.1 APPENDIX I - DEFINITIONS, ACRONYMS, AND ABBREVIATIONS  
3.2 APPENDIX II – REFERENCE MATERIAL  
4. APPROVALS & ACKNOWLEDGMENTS

---PAGE---
# 1. Overview

## 1.1 Initiative Details
| Field | Value |
|---|---|
| Initiative Name | **DEWA Store V2.0** |
| Department/Division | Digital Products & Solutions |

## 1.2 Initiative Description
DEWA Store is an innovative initiative from DEWA for its customers & employees. It allows all DEWA customers/employees to redeem offers from different outlets depending on their category. The offers are exclusive to DEWA customers/employees, who can only redeem them through the DEWA Mobile App available on (Apple iOS, Android systems).

The purpose of the project targets two goals:
1. Increase customer happiness by offering value-added services from private and public sectors, so more DEWA customers will use DEWA’s smart app and its smart services. This will reduce the environmental footprint, which is an important strategic objective for DEWA.
2. Increase employee happiness by offering discounts to services helpful in their day-to-day life.

The DEWA Store V2 project aims to enhance the existing DEWA Store platform to provide an improved user experience for customers, employees and vendors. The following document outlines the business requirements for the project, including functionalities for customers, vendors, products, portal, and dashboard.

## 1.3 User Experience Details
**1.3.1 Marketing Name**  
- English & Arabic: **DEWA Store / متجر ديوا**

**1.3.2 Related Services Affected**  
- DEWA Website, Customer App, Freejna, Smart Office

**1.3.3 Affected User Categories (multiple)**  
| # | Product Name | Selection |
|---|---|---|
| 1 | Individual – Expats | ✓ |
| 2 | Individual – UAE Nationals | ✓ |
| 3 | Business – Commercial |  |
| 4 | Business – Industrial |  |
| 5 | Government/Semi Government |  |
| 6 | Developers |  |
| 7 | Contractors/Consultants |  |
| 8 | Partners | ✓ |
| 9 | Suppliers |  |
| 10 | Public |  |
| 11 | Employee (all employees) | ✓ |
| 12 | Others |  |

**1.3.4 Hosting Channels (multiple)**  
- DEWA Website  
- DEWA Smart Application (iOS)  
- DEWA Smart Application (Android)  
- Internal/Employee Platforms: **DEWA Store Admin Portal, Freejna**  
- Smart Office App  
- Other platforms (as applicable)

**1.3.5 Additional Needs (multiple)**  
| # | Item | Needed |
|---|---|---|
| 1 | Policy change |  |
| 2 | Updating information related to the service/product | ✓ |
| 3 | Marketing campaign (attach plan) | ✓ |
| 4 | Staff training | ✓ |
| 5 | New/update MOU with partners |  |
| 6 | Other (specify) |  |

**1.3.6 Services/Products Affected**  
List current services/products impacted by implementation (e.g., accessibility, speed, professionalism, privacy, ease of use, information quality, appearance), and specify how each is impacted.

## 1.4 SAP Module / Process Description
| Field | Value |
|---|---|
| Process Owner | I&TF, EH |
| IT System | DEWA Store Platform |

---
# 2. Requirements Details

## 2.1 Process/Scenario Requirements
This subsection provides details of all business requirements for processes/scenarios.

### Process/Scenario 1 (Employee Requirements)
**Process Identifier:** DEWA Store  
**Process Name:** DEWA Store

**Functionalities targeting end users of Employee DEWA Store**
1. **Freejna & Smart Office UI**: Revamp DEWA Store designs in Freejna and Smart Office.  
2. **Bilingual Support**: English and Arabic for all functions including search and filters.  
3. **Highlighted Offers as Home Banners**: Sliding banners, clickable to access the offer; set banner expiry; set a default banner.  
4. **Quick Access to Employee Digital Card**: QR code to validate and claim offers at redemption points.  
5. **Frontend Revamp (UI/UX)**: Improve UX in Freejna and Smart Office; use location services to display nearby offers.  
6. **Branding**: Use the same DEWA Store branding logo across employee and customer stores.  
7. **Search by Location with Filters**.  
8. **Offers Near Me** listing.  
9. **Offer Sharing** via permitted channels with defined rules.  
10. **Favorites Access** for quick navigation.  
11. **“Grab Before Too Late”**: Surface offers expiring soon.  
12. **Mobile Integration**: Link employee digital card to mobile wallet; Smart Office toggle for DEWA Store notifications; Admin module to create push notifications (e.g., deal of the day, new offers).  
13. **Offer Views/Categorization** for easy browsing.  
14. **Multiple Offer Views**: by category, by company, by location. Company pages aggregate all offers and an overview.  
15. **Website/App Offers & Redemption** in Freejna and Smart Office.  
16. **Cart Option** for purchasing special vouchers/discount codes before checkout.  
17. **Suggestions Submission** from users/vendors.  
18. **Raffle Draw Planning** capabilities.  
19. **Targeted Offers**: “Recommended for you” based on prior redemptions and behavior.

### Process/Scenario 2 (Vendor Offer Requirements)
**Functionalities for Admin & Vendors in Employee DEWA Store Portal**
1. **Vendor Management & Onboarding (Back Office)**:  
   - Vendor dashboard for offer progress tracking and submission.  
   - Surveys to collect end-user feedback; survey-based reporting.  
   - Mandatory company logo upload and supporting images.  
   - Offer quotas (unlimited or specified).  
   - Prospect vendor database: search, outreach (campaign emails).  
   - Manage active vendors/offers (renewal campaigns; hold offer; block vendor).  
2. **Campaign Module**:  
   - Create campaigns and auto-distribute invitations to selected vendors with registration links.  
   - Support physical events (e.g., DEWA Store Souq) and virtual date-bounded campaigns.  
   - Maintain comprehensive campaign analytics (count of campaigns, registrations, offers per vendor per campaign, redemptions, etc.).  
3. **Workflow Management**:  
   - Approval/rejection workflows for vendor offers in collaboration with DEWA.  
   - Both Vendor/Admin can add/edit/disable offers with justification; changes trigger notifications and SLA-bound review.  
   - Adding new offers under same vendor triggers approval workflow.  
4. **Category Reorganization**:  
   - Propose/restructure categories for better navigation.  
   - Admin can define/edit category master data (icons, descriptions, titles).  
   - Category visibility windows (e.g., time-bound/event-specific).  
5. **Vendor Database Analysis** for opportunities and marketing.  
6. **Reporting & Analytics** (filters for date ranges, status, discount range, location, etc.):  
   - Vendor journey analytics  
   - Redemption trends (MoM/YoY)  
   - Active Offers  
   - Expired Offers  
   - Soon-to-Expire (weekly schedule to Admin + vendor pre-expiry notifications)  
   - Offers created by (Vendor/DEWA staff)  
   - Offers modified by (Vendor/DEWA staff)  
   - Full audit logs (Offers & Vendor Management)  
   - New Offers statistics  
   - Views vs. Redemptions  
   - Vendor performance (ratings)

## 2.2 Business Requirements
**User Segments Impacted:** All DEWA Staff  
**Channels:** Freejna, Smart Office, DEWA Store Application  
**Integrations:** Freejna, Smart Office, Power BI  
**Security & Authorization:** External access portal hosted in DMZ; vendors self-register; after DEWA approval they can log in, maintain offers and view statistics.  
**Authorization Roles:** DEWA Store Portal — Coordinator / Manager / SM / Higher Management; permissions: Admin / Read / Read & Write.  
**Communications:** Email notifications; Smart Office push notifications.  
**Dependencies:** N/A

## 2.3 Reporting & Dashboard Requirement
| Field | Value |
|---|---|
| Name | DEWA Store |
| Description | Reports listed under Admin & Vendor functionalities |
| Source of data | DEWA Store Database |
| Owner | Digital Products & Solutions |
| Type | BI Dashboards (and related systems, as needed) |
| Frequency | Daily, Weekly, Monthly |
| Parameters | As per detailed requirements above |

---
# 3. Appendices
## 3.1 Definitions, Acronyms, and Abbreviations
(Add relevant terms and descriptions here.)

## 3.2 Reference Material
| Document Title | Location |
|---|---|
| DEWA Store V2.0 experience design targeting Customer DEWA Store | PDF File |

---
# 4. Approvals & Acknowledgments

## Approvals
| Role | Name | Signature | Date |
|---|---|---|---|
| Business Owner | Manea Juma Salem Alkendi |  |  |
| Business Representatives / SMEs | Hessa Mohammad Abdulla Alzaffin |  |  |
|  | Maha Mohd Alshaer Almarooshad |  |  |

## Acknowledged By
| Role | Name | Signature | Date |
|---|---|---|---|
| Product Manager | Elsa Prakash |  |  |

(Dates referenced in the source: 12/05/2024, 03.06.2024)
