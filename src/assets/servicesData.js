// Import assets but NOT React components
import { assets } from "./assets";

// Define icon types as strings instead of JSX
export const servicesData = [
  {
    id: "social-work-assessments",
    title: "Social Work Assessments",
    shortDescription: "Delivering insightful, high-quality assessments commissioned by local authorities, solicitors, Cafcass, and UK courts.",
    fullDescription: "Better Families Social Work Services (BFSWS) provides a comprehensive suite of social work assessments, primarily commissioned by local authorities, solicitors, Cafcass, and UK courts, ensuring compliance with the Children Act 1989, Children and Families Act 2014, and Care Act 2014. Our Independent Social Workers (ISWs), deliver thorough, evidence-based evaluations to inform safeguarding, care planning, and legal proceedings. Operating within a CQC-registered framework, our assessments meet the highest standards, supporting vulnerable children, young people, and families across the UK health and social care sector.",
    image: assets.SocialWorkAssessments,
    iconType: "CheckCircle", // Use string instead of JSX
    iconBg: "#047857",
    accentColor: "#047857",
    assessmentTypes: [
      "Parenting Assessments",
      "PAMS & ParentAssess",
      "Pre-Birth Assessments",
      "Risk Assessments",
      "Domestic Violence Risk and Vulnerability Assessments",
      "Form F Assessments",
      "Viability Assessments",
      "Special Guardianship Assessments",
      "Immigration Assessments",
      "Connected Person Assessments",
      "PAR Assessments",
      "Age Assessments",
      "Annex A Assessments",
      "International Assessments",
      "Section 7 and 37 Reports",
      "Together and Apart Assessments",
      "Wishes and Feelings Assessments"
    ],
    process: [
      "Referral and Scoping",
      "Data Collection",
      "Analysis",
      "Report Writing",
      "Quality Assurance",
      "Submission and Follow-Up"
    ],
    accessibility: [
      "Easy Read Materials: Co-produced with service users to support those with learning disabilities, ensuring comprehension of assessment processes.",
      "Multilingual Support: Assessments and reports available in multiple languages.",
      "Cultural Competence: Training on anti-racist practice ensures assessments respect cultural, religious, and ethnic diversity, per Equality Act 2010."
    ],
    impact: [
      "Prevented placement breakdowns by identifying support needs early (e.g., 80% of pre-birth assessments led to tailored interventions).",
      "Informed court decisions, with 95% of reports accepted without revision.",
      "Empowered families through accessible, transparent processes, with 90% positive feedback on Easy Read summaries."
    ],
    whyUs: [
      "Expertise: Led by a team with extensive experience in statutory child protection.",
      "Rigorous Standards: Consultant-led quality assurance ensures court-ready reports.",
      "Secure Systems: Microsoft 365, Egress Protect, and ESET Cloud Office Security safeguard data.",
      "Person-Centered: Accessible, inclusive processes prioritize service user voices."
    ]
  },
  {
    id: "support-work",
    title: "Support Work",
    shortDescription: "Providing 24/7 emergency and ongoing support to local authorities, fostering agencies, and families.",
    fullDescription: "BFSWS's 24/7 Support Work services provide emergency and ongoing support to local authorities, fostering agencies, and families, aligned with Children Act 1989 and Care Act 2014. Services include urgent welfare visits, risk assessments, Appropriate Adult support, and secure transport, with a 1-hour response time.",
    image: assets.SupportWork,
    iconType: "Shield",
    iconBg: "#1E3A8A",
    accentColor: "#1E3A8A",
    services: [
      "Welfare visits",
      "Monitoring",
      "24/7 parenting support",
      "Appropriate Adult roles",
      "Transport for high-risk cases and hospital visits"
    ],
    process: [
      "Referral handling (via Egress Protect)",
      "Intervention planning",
      "Reporting"
    ],
    compliance: [
      "CQC standards",
      "UK GDPR (ICO ZB713742)",
      "Safeguarding training"
    ],
    accessibility: [
      "Easy Read communication for service users with learning disabilities"
    ],
    impact: [
      "Case studies (e.g., preventing placement disruption)",
      "Metrics (e.g., 95% response within 1 hour)"
    ],
    whyUs: [
      "24 FTEs",
      "Secure systems (Microsoft 365, ESET)",
      "SME partnerships"
    ]
  },
  {
    id: "short-breaks-family-support",
    title: "Short Breaks & Family Support",
    shortDescription: "Supporting children with disabilities and their carers with specialized care services.",
    fullDescription: "Aligned with Children and Families Act 2014 and Breaks for Carers of Disabled Children Regulations 2011, BFSWS offers Short Breaks, Personal Assistant Support, and hospital watch for children with disabilities and their carers.",
    image: assets.ShortBreaksFamilySupport,
    iconType: "Users",
    iconBg: "#BE185D",
    accentColor: "#BE185D",
    services: [
      "Personal care",
      "Education support",
      "Respite care",
      "Hospital inpatient support (emotional, practical, advocacy)"
    ],
    process: [
      "Needs assessments",
      "Co-produced care plans",
      "Post-discharge support"
    ],
    compliance: [
      "CQC",
      "UK GDPR",
      "Equality Act 2010"
    ],
    accessibility: [
      "Easy Read and multilingual care plans"
    ],
    impact: [
      "Metrics (e.g., 80% carer satisfaction)",
      "Case studies (e.g., respite care enabling carer well-being)"
    ],
    whyUs: [
      "Tailored, accessible support with robust systems"
    ]
  },
  {
    id: "contact-supervision",
    title: "Contact Supervision",
    shortDescription: "Facilitating safe parent-child reunions through supervised, supported, and community contact.",
    fullDescription: "BFSWS facilitates safe parent-child reunions through supervised, supported, and community contact, aligned with Children Act 1989.",
    image: assets.ContactSupervision,
    iconType: "Heart",
    iconBg: "#7C3AED",
    accentColor: "#7C3AED",
    services: [
      "Supervised contact",
      "Handovers",
      "Room hire",
      "Community settings"
    ],
    process: [
      "Risk assessments",
      "Session planning",
      "Feedback loops"
    ],
    compliance: [
      "CQC",
      "UK GDPR",
      "Safeguarding training"
    ],
    accessibility: [
      "Easy Read schedules and family-friendly venues"
    ],
    impact: [
      "Metrics (e.g., 90% positive session feedback)",
      "Case studies (e.g., reunified family)"
    ],
    whyUs: [
      "Safe, nurturing environments with secure systems"
    ]
  },
  {
    id: "appropriate-adult-service",
    title: "Appropriate Adult Service",
    shortDescription: "Providing 24/7 support for vulnerable individuals in police custody.",
    fullDescription: "BFSWS's 24/7 Appropriate Adult Service supports vulnerable individuals in police custody, per Police and Criminal Evidence Act 1984.",
    image: assets.AppropriateAdultService,
    iconType: "Clock",
    iconBg: "#0369A1",
    accentColor: "#0369A1",
    services: [
      "Advocacy",
      "Communication support",
      "24/7 availability"
    ],
    process: [
      "Referral response",
      "Custody support",
      "Follow-up"
    ],
    compliance: [
      "CQC",
      "UK GDPR",
      "Legal standards"
    ],
    accessibility: [
      "Easy Read rights explanations"
    ],
    impact: [
      "Case studies (e.g., supported juvenile in custody)",
      "Metrics (e.g., 100% availability)"
    ],
    whyUs: [
      "Trained, empathetic professionals with secure systems"
    ]
  },
  {
    id: "secure-transport",
    title: "Secure Transport",
    shortDescription: "Offering secure and non-secure transport for vulnerable individuals.",
    fullDescription: "BFSWS provides secure and non-secure transport for vulnerable individuals, aligned with Care Act 2014 and Children Act 1989.",
    image: assets.SecureTransport,
    iconType: "MapPin",
    iconBg: "#D97706",
    accentColor: "#D97706",
    services: [
      "Secure escorts",
      "High-risk transport",
      "School runs",
      "Court appearances"
    ],
    process: [
      "Risk mitigation",
      "Real-time monitoring",
      "Route planning"
    ],
    compliance: [
      "CQC",
      "UK GDPR",
      "Vehicle safety standards"
    ],
    accessibility: [
      "Easy Read travel plans"
    ],
    impact: [
      "Metrics (e.g., 99% on-time delivery)",
      "Case studies (e.g., safe hospital transport)"
    ],
    whyUs: [
      "Specialized vehicles",
      "Trained drivers",
      "ESET security"
    ]
  },
  {
    id: "domestic-violence-support",
    title: "Domestic Violence Support",
    shortDescription: "Offering bespoke weekend interventions for domestic violence cases.",
    fullDescription: "BFSWS offers bespoke weekend interventions for domestic violence, per Domestic Abuse Act 2021.",
    image: assets.DomesticViolenceSupport,
    iconType: "AlertTriangle",
    iconBg: "#DC2626",
    accentColor: "#DC2626",
    services: [
      "1:1 support for perpetrators and victims",
      "Risk assessments"
    ],
    process: [
      "Tailored interventions",
      "Progress monitoring",
      "Safety planning"
    ],
    compliance: [
      "CQC",
      "UK GDPR",
      "Safeguarding protocols"
    ],
    accessibility: [
      "Easy Read support materials"
    ],
    impact: [
      "Case studies (e.g., perpetrator behavior change)",
      "Outcomes (e.g., 80% victim empowerment)"
    ],
    whyUs: [
      "Trauma-informed",
      "Secure systems"
    ]
  },
  {
    id: "social-work-interventions",
    title: "Social Work Interventions",
    shortDescription: "Delivering targeted interventions including welfare visits and family therapy.",
    fullDescription: "BFSWS delivers targeted interventions, including welfare visits and family therapy, per Children Act 1989.",
    image: assets.SocialWorkInterventions,
    iconType: "Phone",
    iconBg: "#059669",
    accentColor: "#059669",
    services: [
      "Return home interviews",
      "Life story work",
      "Case audits",
      "Complaints handling"
    ],
    process: [
      "Needs assessment",
      "Intervention delivery",
      "Quality assurance"
    ],
    compliance: [
      "CQC",
      "UK GDPR",
      "Ofsted standards"
    ],
    accessibility: [
      "Easy Read therapy materials"
    ],
    impact: [
      "Metrics (e.g., 85% improved family outcomes)",
      "Case studies (e.g., successful reunification)"
    ],
    whyUs: [
      "Expert-led",
      "Accessible interventions"
    ]
  },
  {
    id: "consultancy-training",
    title: "Consultancy & Training",
    shortDescription: "Providing expert training in anti-racist practice, domestic violence, and foster care.",
    fullDescription: "BFSWS provides expert training in anti-racist practice, domestic violence, and foster care, aligned with CQC Fundamental Standards.",
    image: assets.ConsultancyTraining,
    iconType: "Briefcase",
    iconBg: "#7C2D12",
    accentColor: "#7C2D12",
    services: [
      "Anti-racist training",
      "Domestic violence workshops",
      "Foster carer programs"
    ],
    process: [
      "Curriculum design",
      "Delivery",
      "Evaluation"
    ],
    compliance: [
      "CQC",
      "UK GDPR",
      "Equality Act 2010"
    ],
    accessibility: [
      "Easy Read training materials"
    ],
    impact: [
      "Metrics (e.g., 90% staff competency)",
      "Case studies (e.g., improved foster care outcomes)"
    ],
    whyUs: [
      "Real-world expertise",
      "Secure systems"
    ]
  },
  {
    id: "childrens-home",
    title: "Children's Home",
    shortDescription: "Offering a nurturing environment for young people requiring residential care in Croydon.",
    fullDescription: "Our Ofsted-registered children's home in Croydon offers a nurturing environment for young people requiring residential care. Aligned with Children Act 1989 and Ofsted Inspection Frameworks, our home provides a safe haven for children in need of specialized care.",
    image: assets.ChildrensHome,
    iconType: "Home",
    iconBg: "#4F46E5",
    accentColor: "#4F46E5",
    services: [
      "Personalized Care: Tailored plans for emotional, educational, and social needs.",
      "Skilled Staff: Trained in trauma-informed care, supported by annual training.",
      "Secure Systems: AES-256 encryption protects records.",
      "Community Integration: SME partnerships provide activities and transport."
    ],
    commitment: "Commitment to excellence, ensuring positive outcomes through collaboration with families and local authorities."
  },
  {
    id: "semi-independent-placements",
    title: "Semi-Independent Placements",
    shortDescription: "Supporting young people aged 16–24 with transitional living arrangements.",
    fullDescription: "BFSWS's semi-independent placements (Ofsted inspection pending) support young people aged 16–24, per Care Act 2014. Operating 6 staffed homes in South London, we offer comprehensive support to help young adults transition to independent living.",
    image: assets.SemiIndependentPlacements,
    iconType: "BookOpen",
    iconBg: "#9D174D",
    accentColor: "#9D174D",
    services: [
      "24/7 Staffed Homes: Furnished flats with CCTV, Wi-Fi, and starter packs.",
      "Personalized Support: 1:1 staffing, job search, educational support, and mentorship.",
      "Outreach Services: Support for standalone accommodations.",
      "Community Access: Near transport, colleges, and amenities."
    ],
    team: "Our teams ensure high standards, preparing youth for independent living with secure systems (Egress Protect, ESET).",
    testimonial: {
      quote: "BFSWS helped me build my future.",
      author: "Resident, 19"
    }
  }
];