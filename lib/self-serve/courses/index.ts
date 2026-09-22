import type { CourseContent } from "./types.ts";
import { COURSE as aiForCustomerCommunications } from "./ai-for-customer-communications.ts";
import { COURSE as aiOutputVerification } from "./ai-output-verification.ts";
import { COURSE as buildingAWorkforceSkillsPlan } from "./building-a-workforce-skills-plan.ts";
import { COURSE as choosingTechnologyForYourTeam } from "./choosing-technology-for-your-team.ts";
import { COURSE as connectingTheToolsYourTeamAlreadyUses } from "./connecting-the-tools-your-team-already-uses.ts";
import { COURSE as digitalChangeForManagers } from "./digital-change-for-managers.ts";
import { COURSE as fromSpreadsheetsToSimpleSystems } from "./from-spreadsheets-to-simple-systems.ts";
import { COURSE as gettingValueFromTheTechnologyYouAlreadyPayFor } from "./getting-value-from-the-technology-you-already-pay-for.ts";
import { COURSE as noCodeAutomationForEverydayWork } from "./no-code-automation-for-everyday-work.ts";
import { COURSE as roboticsForNonEngineers } from "./robotics-for-non-engineers.ts";
import { COURSE as roboticsInvestmentDecisions } from "./robotics-investment-decisions.ts";
import { COURSE as roboticsSafetyAndRisk } from "./robotics-safety-and-risk.ts";
import { COURSE as runningARoboticCell } from "./running-a-robotic-cell.ts";
import { COURSE as runningATechnologyRollout } from "./running-a-technology-rollout.ts";
import { COURSE as securityDecisionsForNonTechnicalTeams } from "./security-decisions-for-non-technical-teams.ts";
import { COURSE as specifyingARoboticsProject } from "./specifying-a-robotics-project.ts";
import { COURSE as technologyDecisionsForNonTechnicalLeaders } from "./technology-decisions-for-non-technical-leaders.ts";
import { COURSE as visionSystemsAndAutomatedInspection } from "./vision-systems-and-automated-inspection.ts";
import { COURSE as warehouseAndLogisticsAutomation } from "./warehouse-and-logistics-automation.ts";

/** Courses with full lessons. An outline becomes playable when its content is registered here. */
export const COURSE_CONTENT: CourseContent[] = [
  aiForCustomerCommunications,
  aiOutputVerification,
  buildingAWorkforceSkillsPlan,
  choosingTechnologyForYourTeam,
  connectingTheToolsYourTeamAlreadyUses,
  digitalChangeForManagers,
  fromSpreadsheetsToSimpleSystems,
  gettingValueFromTheTechnologyYouAlreadyPayFor,
  noCodeAutomationForEverydayWork,
  roboticsForNonEngineers,
  roboticsInvestmentDecisions,
  roboticsSafetyAndRisk,
  runningARoboticCell,
  runningATechnologyRollout,
  securityDecisionsForNonTechnicalTeams,
  specifyingARoboticsProject,
  technologyDecisionsForNonTechnicalLeaders,
  visionSystemsAndAutomatedInspection,
  warehouseAndLogisticsAutomation,
];
