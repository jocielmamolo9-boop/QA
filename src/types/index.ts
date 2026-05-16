export type Role = 'Tester' | 'Developer' | null;

export type Severity = 'Low' | 'Medium' | 'High' | 'Critical';
export type Status = 'Open' | 'In Progress' | 'Fixed' | 'Closed';

export interface User {
  username: string;
  role: Role;
}

export interface TestCase {
  id: string;
  title: string;
  description: string;
  steps: string;
  expectedResult: string;
  actualResult: string;
  severity: Severity;
  status: Status;
  createdBy: string;
  createdAt: number;
  testDate: string;
  feature: string;
  scenario: string;
  testerNote?: string;
  screenshot?: string;
  developerNote?: string;
  hasUnreadUpdate?: boolean; // For Tester
  unreadByDev?: boolean;     // For Developer
}
