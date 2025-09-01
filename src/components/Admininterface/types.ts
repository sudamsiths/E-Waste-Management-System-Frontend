// Agent interface
export interface Agent {
  id?: number;
  agentId?: number;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  status?: string;
  assignBranch?: string;
  branchName?: string;
  branch?: string;
}

// Agent response from the API
export interface AgentResponse {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  branch: string;
  status: string;
}
