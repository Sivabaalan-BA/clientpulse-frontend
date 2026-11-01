export type UserRole = 'super_admin' | 'business_admin' | 'employee' | 'client';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  organizationId: string;
  avatarUrl?: string;
}

export interface Client {
  id: string;
  companyName: string;
  primaryContactName: string;
  primaryEmail: string;
  phone: string;
  status: 'lead' | 'active' | 'inactive' | 'churned';
  healthScore: number;
  totalRevenue: number;
}

export interface Enquiry {
  id: string;
  title: string;
  description: string;
  source: 'website' | 'referral' | 'linkedin' | 'direct' | 'other';
  budgetRange: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal_sent' | 'won' | 'lost';
  aiSummary?: string;
  aiIntentScore?: number;
  createdAt: string;
}

export interface QuotationItem {
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Quotation {
  id: string;
  clientId: string;
  clientName: string;
  quotationNumber: string;
  title: string;
  subtotal: number;
  discountPercent: number;
  taxPercent: number;
  totalAmount: number;
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired';
  validUntil: string;
  items: QuotationItem[];
  createdAt: string;
}

export interface Milestone {
  id: string;
  title: string;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'approved_by_client';
}

export interface Task {
  id: string;
  title: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in_progress' | 'blocked' | 'done';
  assignedToName?: string;
}

export interface Project {
  id: string;
  clientId: string;
  clientName: string;
  name: string;
  description: string;
  status: 'planned' | 'in_progress' | 'review' | 'completed' | 'on_hold';
  budget: number;
  startDate: string;
  targetEndDate: string;
  milestones: Milestone[];
  tasks: Task[];
}

export interface Invoice {
  id: string;
  clientId: string;
  clientName: string;
  projectId?: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  totalAmount: number;
  balanceDue: number;
  status: 'draft' | 'unpaid' | 'partially_paid' | 'paid' | 'overdue';
  items: Array<{ description: string; quantity: number; unitPrice: number; totalPrice: number }>;
}

export interface Feedback {
  id: string;
  clientId: string;
  clientName: string;
  rating: number;
  comment: string;
  sentimentLabel: 'positive' | 'neutral' | 'negative';
  sentimentScore: number;
  createdAt: string;
}

export interface PulseMetrics {
  paymentScore: number;
  feedbackScore: number;
  milestoneScore: number;
  activityScore: number;
  compositeScore: number;
  riskStatus: 'healthy' | 'moderate_risk' | 'high_churn_risk';
  factors: string[];
  recommendations: string[];
}
