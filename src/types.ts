export type UserRole = 'Lead Investigator' | 'Forensic Specialist' | 'Cyber Intelligence Officer' | 'Chief Commander';

export interface UserProfile {
  name: string;
  email: string;
  id: string;
  clearance: string;
  avatar: string;
  role: UserRole;
}

export type EvidenceType = 
  | 'CCTV_VIDEO' 
  | 'PHOTO_IMAGE' 
  | 'AUDIO_RECORDING' 
  | 'PDF_DOCUMENT' 
  | 'WITNESS_STATEMENT' 
  | 'FIR_CASE_REPORT' 
  | 'CALL_RECORD_CDR' 
  | 'VEHICLE_INFO' 
  | 'SUSPECT_VICTIM_INFO' 
  | 'LOCATION_GPS_CELL' 
  | 'DATE_TIME' 
  | 'INVESTIGATOR_NOTE';

export const EVIDENCE_TYPE_LABELS: Record<EvidenceType, string> = {
  CCTV_VIDEO: 'CCTV / Video',
  PHOTO_IMAGE: 'Photos & Images',
  AUDIO_RECORDING: 'Audio Recordings',
  PDF_DOCUMENT: 'PDFs / Documents',
  WITNESS_STATEMENT: 'Witness Statements',
  FIR_CASE_REPORT: 'FIR / Case Reports',
  CALL_RECORD_CDR: 'Call Records (CDR)',
  VEHICLE_INFO: 'Vehicle Info',
  SUSPECT_VICTIM_INFO: 'Suspect / Victim Info',
  LOCATION_GPS_CELL: 'Locations (GPS / Cell)',
  DATE_TIME: 'Dates & Times',
  INVESTIGATOR_NOTE: 'Investigator Notes'
};

export interface EvidenceItem {
  id: string;
  caseId: string;
  userId: string;
  title: string;
  type: EvidenceType;
  filename?: string;
  originalName?: string;
  fileSize?: string;
  fileUrl?: string;
  hashSha256: string;
  uploadedAt: string;
  uploadedBy: string;
  status: 'Verified' | 'Pending Ingestion' | 'Tamper Alert';
  details?: string;
  extractedEntities?: string[];
  version: number;
}

export interface HypothesisSource {
  evidenceId: string;
  evidenceTitle: string;
  type: EvidenceType;
  excerpt: string;
}

export interface Hypothesis {
  id: string;
  caseId: string;
  title: string;
  confidence: number; // 0 to 100
  confidenceLabel: 'Low' | 'Medium' | 'High';
  category?: 'PRIMARY' | 'SUPPORTING' | 'ALTERNATIVE_VIEWPOINT';
  description: string;
  reasoning: string;
  supportingEvidenceIds: string[];
  contradictingEvidenceIds: string[];
  missingInformation: string;
  alternativeExplanation: string;
  sourcesUsed: HypothesisSource[];
  humanReviewStatus: 'Pending' | 'Accepted' | 'Rejected' | 'Annotated';
  investigatorNotes?: string;
}

export interface AnalysisVersion {
  id: string;
  caseId: string;
  userId: string;
  analysisVersion: number;
  evidenceSnapshot: { id: string; version: number; title: string; type: EvidenceType }[];
  summary: string;
  keyFindings: string[];
  hypotheses: Hypothesis[];
  limitations: string;
  modelName: string;
  createdAt: string;
}

export interface CrossLink {
  id: string;
  caseId: string;
  sourceEvidenceId: string;
  sourceTitle: string;
  relationship: string;
  targetEvidenceId: string;
  targetTitle: string;
  confidence: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  actionType: 'UPLOAD' | 'AI_INGESTION' | 'HYPOTHESIS_GENERATION' | 'REVIEW_UPDATE' | 'VERDICT_LOGGED' | 'EXPORT_REPORT' | 'AUTH' | 'DELETE_EVIDENCE' | 'EDIT_EVIDENCE';
  details: string;
  hash: string;
}

export interface CaseItem {
  id: string;
  userId: string;
  caseNumber: string;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Active' | 'Closed' | 'Pending Review';
  evidenceCount: number;
  leadInvestigator: string;
  createdAt: string;
  storageGb: number;
}
