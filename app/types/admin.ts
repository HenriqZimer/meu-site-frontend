// Admin Interfaces
export interface Project {
  _id?: string
  title: string
  description: string
  image: string
  category: string
  technologies: string[]
  demoUrl: string
  githubUrl: string
  order: number
  active: boolean
}

export interface Skill {
  _id?: string
  name: string
  category: string
  icon: string
  color: string
  bgColor: string
  order: number
  active: boolean
}

export interface Certification {
  _id?: string
  name: string
  issuer: string
  image: string
  link: string
  date: string
  skills: number
  order: number
  active: boolean
}

export interface Course {
  _id?: string
  name: string
  platform: string
  instructor: string
  duration: string
  image: string
  link: string
  year: string
  order: number
  active: boolean
}

export interface Contact {
  _id?: string
  name: string
  email: string
  subject: string
  message: string
  read?: boolean
  createdAt?: string
  updatedAt?: string
}
