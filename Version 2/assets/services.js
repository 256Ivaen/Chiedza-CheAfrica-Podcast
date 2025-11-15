import { 
  FaClipboardList, 
  FaHeart, 
  FaWheelchair, 
  FaShieldAlt,
  FaHandsHelping,
} from 'react-icons/fa';
import { assets } from './assets';

export const servicesData = [
  {
    id: "family-assessment-support",
    title: "Family Assessment & Support",
    shortDescription: "Independent, evidence-based parenting and family assessments for local authorities and courts",
    fullDescription: "We carry out independent, evidence-based parenting and family assessments for local authorities and courts. Our work focuses on understanding family strengths, identifying areas of risk or concern, and supporting safe, realistic care plans that keep children's welfare central. Led by a social worker, therapist, and project manager, this model mirrors the best elements of residential parenting assessments — but takes place safely within the family home.",
    icon: FaClipboardList,
    color: "#33632c",
    accentColor: "#33632c",
    image: assets.FamilyAssessment,
    features: [
      "Reverse Parenting (24/7 Community-Based Assessment)",
      "PAMs Assessment for learning disabilities",
      "ParentAssess for cognitive needs",
      "CUBAS Assessment",
      "Viability, Kinship & SGO Assessments",
      "Fostering & Adoption Assessments",
      "Pre-Birth & Early Parenting Assessments",
      "Intensive Parenting Work",
      "Specialist Risk Assessments",
      "Culturally Sensitive & Bilingual Assessments",
      "International Social Work Assessments",
      "Private Law Assessments (Section 7 / Section 37)",
      "Immigration & Human Rights Assessments",
      "Independent Social Work Assessments"
    ],
    detailedFeatures: [
      {
        title: "Reverse Parenting (24/7 Community-Based Assessment)",
        description: "A trauma-informed alternative to residential parenting assessments. We provide 24-hour in-home support and observation so parents can be assessed safely in their natural environment. This allows professionals to see everyday routines and helps parents develop skills without being separated from their child."
      },
      {
        title: "PAMs Assessment",
        description: "A specialist assessment for parents with learning disabilities or cognitive needs. Our trained social workers use the Parent Assessment Manual (PAMs) to understand parenting capacity and provide practical guidance to help parents learn and apply safe care skills."
      },
      {
        title: "ParentAssess",
        description: "A strengths-based, visual assessment tool designed for parents with learning disabilities, autism, or communication needs. Using clear language and visual aids, it helps parents understand what is working well, what needs improvement, and how they can make positive change."
      },
      {
        title: "CUBAS Assessment",
        description: "A flexible, computer-assisted model used to assess parents' ability to meet their children's physical, emotional, and developmental needs. This approach supports reflective learning and adapts to different learning styles and family situations."
      },
      {
        title: "Viability, Kinship & SGO Assessments",
        description: "We assess relatives and connected persons who may be able to care for a child within their extended family network. Our reports are court-ready and focus on safety, stability, and the child's long-term sense of belonging. We also support Special Guardians through the panel and post-approval process."
      },
      {
        title: "Fostering & Adoption Assessments",
        description: "Comprehensive fostering and adoption assessments for both local authorities and agencies. We prepare and quality-check reports for panel submission and ensure every prospective carer or adopter is supported and well-informed throughout the process."
      },
      {
        title: "Pre-Birth & Early Parenting Assessments",
        description: "We assess expectant parents to understand strengths, risks, and areas for support before a baby is born. Where required, this extends into post-birth Reverse Parenting with 24/7 supervision and teaching to help parents build confidence and safe routines from the start."
      },
      {
        title: "Intensive Parenting Work",
        description: "Hands-on, in-home support where parenting is under pressure or risk of breakdown. Our family practitioners work alongside parents—sometimes 24/7—to build safe routines, strengthen attachment, and prevent children from entering care."
      },
      {
        title: "Specialist Risk Assessments",
        description: "We complete focused risk assessments where there are concerns about domestic abuse, sexual risk, fabricated illness, substance misuse, or mental health. Each report includes analysis, safety planning, and recommendations for multi-agency action."
      },
      {
        title: "Culturally Sensitive & Bilingual Assessments",
        description: "We match families with social workers who share or understand their cultural and linguistic background. This ensures assessments are fair, respectful, and reflect each family's identity, faith, and community values."
      },
      {
        title: "International Social Work Assessments",
        description: "We assess extended family members living overseas to support kinship and permanence decisions. Our experienced assessors carry out culturally appropriate work across Europe, Africa, Asia, and the Americas, following UK and Home Office guidance."
      },
      {
        title: "Private Law Assessments & Contact Supervision",
        description: "We provide independent assessments in private law cases, including contact supervision where needed. Our reports focus on the child's welfare, parental cooperation, and how relationships can be supported safely."
      },
      {
        title: "Immigration & Human Rights Assessments",
        description: "Independent social work, psychological, and psychiatric assessments to evidence the impact of separation, health needs, or disability on families facing immigration decisions. All reports centre on the child's welfare and the principle of keeping families together where safe to do so."
      },
      {
        title: "Independent Social Work Assessments",
        description: "A full range of professional assessments by experienced independent social workers — including SGO, Viability, Parenting (PAMs, ParentAssess, CUBAS), Risk, Kinship, and Immigration. Every assessment is trauma-informed, quality-assured, and focused on improving outcomes for children."
      }
    ],
    category: "assessments"
  },
  {
    id: "therapeutic-services",
    title: "Therapeutic Services",
    shortDescription: "Healing-focused interventions integrating therapy within family work",
    fullDescription: "We integrate therapy within family work, recognizing that behavior change must be rooted in emotional healing. Our therapeutic programmes are designed to help families process trauma, build resilience, and develop healthy relationships through evidence-based interventions.",
    icon: FaHeart,
    color: "#12324f",
    accentColor: "#12324f",
    image: assets.TherapyServices,
    features: [
      "Restorative & Solution-Focused Interventions",
      "Life Story & Identity Work",
      "Play-based & Creative Therapies",
      "Family Group Conferencing (FGC)",
      "Mediation Services",
      "Advocacy & Independent Visitor Service",
      "Trauma-Informed Therapy",
      "Attachment-focused Interventions"
    ],
    detailedFeatures: [
      {
        title: "Restorative & Solution-Focused Interventions",
        description: "For families affected by conflict, trauma, or parental separation. These interventions help families rebuild trust and develop practical solutions to current challenges."
      },
      {
        title: "Life Story & Identity Work",
        description: "Helping children process experiences and build positive self-narratives. This therapeutic approach supports children in understanding their personal history and developing a strong sense of identity."
      },
      {
        title: "Play-based & Creative Therapies",
        description: "Facilitating safe emotional expression through art, music, and sensory activities. These non-verbal approaches help children communicate and process complex emotions."
      },
      {
        title: "Family Group Conferencing (FGC) & Mediation",
        description: "Structured restorative conversations designed to rebuild trust and shared care plans. These sessions bring family members together to make decisions and plan for the future."
      },
      {
        title: "Advocacy & Independent Visitor Service",
        description: "Giving children and young people a consistent, trusted adult voice in decisions that affect them. Our advocates ensure children's views and wishes are heard and respected."
      }
    ],
    category: "therapeutic"
  },
  {
    id: "children-disabilities-support",
    title: "Children with Disabilities Support",
    shortDescription: "Specialist care and respite for children with additional needs and their families",
    fullDescription: "Our Short Breaks and Disability Support teams provide specialist care and respite for children with additional needs and their families. We work in partnership with Local Authority Short Breaks and SEND Teams to deliver comprehensive support that promotes inclusion, independence, and family stability.",
    icon: FaWheelchair,
    color: "#33632c",
    accentColor: "#33632c",
    image: assets.DisabledChildren,
    features: [
      "Structured Activity Programmes",
      "1:1 and 2:1 Support",
      "Sensory & Behavioural Support",
      "Outreach and In-Home Support",
      "24-Hour Complex Care",
      "Therapeutic Short Breaks",
      "SEND Team Partnership",
      "Family Respite Services"
    ],
    detailedFeatures: [
      {
        title: "Structured Activity Programmes",
        description: "Programmes that promote inclusion and independence through carefully designed activities tailored to each child's abilities and interests."
      },
      {
        title: "1:1 and 2:1 Support",
        description: "Tailored support for sensory or behavioural needs, providing individual attention and specialized care for children with complex requirements."
      },
      {
        title: "Outreach and In-Home Support",
        description: "Services to stabilise family life by providing support directly in the family home, helping to maintain routines and reduce stress."
      },
      {
        title: "24-Hour Availability",
        description: "Round-the-clock availability for complex care or high-risk scenarios, ensuring families have support when they need it most."
      },
      {
        title: "Therapeutic Approach",
        description: "Our approach is child-centred and therapeutic — every activity is designed to nurture joy, connection, and capability while supporting overall development."
      }
    ],
    category: "support"
  },
  {
    id: "auxiliary-services",
    title: "Auxiliary Services",
    shortDescription: "Practical support addressing relational and safety needs for long-term change",
    fullDescription: "Our auxiliary services complement the core family-support work by addressing practical, relational, and safety needs that sustain long-term change. These services provide essential support systems that help families maintain stability and progress.",
    icon: FaShieldAlt,
    color: "#12324f",
    accentColor: "#12324f",
    image: assets.AuxiliaryServices,
    features: [
      "Contact Supervision",
      "Appropriate Adult Support",
      "Secure / Therapeutic Transport",
      "Emergency Response / Out-of-Hours Support",
      "Community Outreach & Mentoring",
      "Housing, Financial & Practical Support",
      "Welfare Checks & Safety Planning",
      "Life Skills Development"
    ],
    detailedFeatures: [
      {
        title: "Contact Supervision",
        description: "Safe, child-centred contact in home, community, or contact centres. We ensure contact arrangements are positive and secure for all involved."
      },
      {
        title: "Appropriate Adult Support",
        description: "Providing trained professionals to safeguard young people or vulnerable adults during police or legal processes, ensuring their rights are protected."
      },
      {
        title: "Secure / Therapeutic Transport",
        description: "For children and young people requiring safe, trauma-aware transfers between locations, ensuring their emotional and physical safety during transitions."
      },
      {
        title: "Emergency Response / Out-of-Hours Support",
        description: "Rapid mobilisation of staff for family crises, welfare checks, and safety planning. Available 24/7 for urgent situations."
      },
      {
        title: "Community Outreach & Mentoring",
        description: "Supporting young people aged 10–18 through life-skills, motivation, and re-engagement in education or employment."
      },
      {
        title: "Housing, Financial & Practical Support",
        description: "Stabilising families through guidance on budgeting, tenancy, and benefits access, helping to address practical barriers to family stability."
      }
    ],
    category: "support"
  }
];

export const serviceCategories = {
  assessments: {
    title: "Family Assessments",
    icon: FaClipboardList,
    color: "#33632c",
    description: "Comprehensive parenting and family assessment services"
  },
  therapeutic: {
    title: "Therapeutic Services",
    icon: FaHeart,
    color: "#12324f",
    description: "Healing-focused interventions for emotional wellbeing"
  },
  support: {
    title: "Support Services",
    icon: FaHandsHelping,
    color: "#33632c",
    description: "Specialist care and practical support services"
  }
};

// Helper function to get service by ID
export const getServiceById = (id) => {
  return servicesData.find(service => service.id === id);
};

// Helper function to get services by category
export const getServicesByCategory = (category) => {
  return servicesData.filter(service => service.category === category);
};

// All available service IDs for dynamic routing
export const serviceIds = servicesData.map(service => service.id);