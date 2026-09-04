export type Certification = {
  title: string
  issuer: string
  date: string
  /** Awards get a distinct accent from ordinary course certificates. */
  isAward?: boolean
}

export const certifications: Certification[] = [
  {
    title: 'Best MSc Dissertation (Specialist Degree) — annual graduation award',
    issuer: 'Cardiff University',
    date: 'July 2025',
    isAward: true,
  },
  {
    title:
      'Building Generative AI with AWS: Amazon Q Developer, Bedrock Inference, and SageMaker Canvas',
    issuer: 'LinkedIn',
    date: 'February 2025',
  },
  {
    title: 'Generative AI Fundamentals',
    issuer: 'Databricks',
    date: 'February 2025',
  },
  {
    title: 'Build a Backend REST API with Python & Django — Advanced',
    issuer: 'Udemy',
    date: 'July 2024',
  },
]
