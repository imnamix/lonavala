import { CourtCommitteeMember, AdalatUpdate, CourtSession } from "@/types";

// -------------------------------------------------------------
// Members Service (API Integrated)
// -------------------------------------------------------------
export {
  getAllCourtMembers as getAllMembers,
  getCourtMemberById as getMemberById,
  createCourtMember as createMember,
  updateCourtMember as updateMember,
  deleteCourtMember as deleteMember,
} from './court-member.service';
export * from './court-member.service';

// -------------------------------------------------------------
// Proceedings Service (API Integrated)
// -------------------------------------------------------------
export {
  getAllCourtProceedings as getAllProceedings,
  getCourtProceedingById as getProceedingById,
  createCourtProceeding as createProceeding,
  updateCourtProceeding as updateProceeding,
  deleteCourtProceeding as deleteProceeding,
  seedCourtProceedingsApi as seedProceedings,
} from './court-proceeding.service';
export * from './court-proceeding.service';

// -------------------------------------------------------------
// Sessions Service (API Integrated)
// -------------------------------------------------------------
export {
  getAllCourtSessions as getAllSessions,
  getNextCourtSession as getNextSession,
  getCourtSessionById as getSessionById,
  createCourtSession as createSession,
  updateCourtSession as updateSession,
  deleteCourtSession as deleteSession,
  seedCourtSessionsApi as seedSessions,
} from './court-session.service';
export * from './court-session.service';
