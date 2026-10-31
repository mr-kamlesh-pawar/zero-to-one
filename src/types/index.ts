export interface CourseStat {
  label: string;
  value: string;
  prefix?: string;
  highlight?: boolean;
}

export interface InstructorProfile {
  name: string;
  role: string;
  tagline: string;
  avatarUrl: string;
  tags: string[];
  bio?: string;
}

export interface NavigationItem {
  id: string;
  title: string;
  href: string;
  iconName: string;
  badge?: string;
}

export interface CourseRating {
  rating: number;
  totalRatings: number;
  platform: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  isSubscribed: boolean;
  plan?: string;
  createdAt?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: string;
  billingPeriod: string;
  features: string[];
  popular?: boolean;
  badge?: string;
}
