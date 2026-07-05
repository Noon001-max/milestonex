export const CATEGORIES = [
  { value: "community", label: "Community Development" },
  { value: "education", label: "Education" },
  { value: "healthcare", label: "Healthcare" },
  { value: "infrastructure", label: "Infrastructure" },
  { value: "environment", label: "Environment" },
  { value: "agriculture", label: "Agriculture" },
  { value: "technology", label: "Technology & Innovation" },
  { value: "arts", label: "Arts & Culture" },
  { value: "women", label: "Women & Youth" },
  { value: "microenterprise", label: "Microenterprise" },
] as const

export type CategoryValue = (typeof CATEGORIES)[number]["value"]
