export interface ResumeData {
  id: string;
  userId: string;
  title: string;
  updatedAt: any;
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    summary: string;
  };
  experience: Experience[];
  education: Education[];
  skills: string[];
  projects: Project[];
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  achievements: string[];
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  location: string;
  startDate: string;
  endDate: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  link: string;
  technologies: string[];
}

export interface AnalysisResult {
  score: number;
  keywordMatch: string[];
  missingKeywords: string[];
  atsCompatibility: {
    score: number;
    issues: string[];
  };
  suggestions: string[];
}
