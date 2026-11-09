// All of Lokesh's contact links in ONE place — used by the hero, the contact section,
// and Byte's chat cards. Change a link here and it changes everywhere.

import { SOCIALS } from "@/lib/data";

const social = (name: string) => SOCIALS.find((s) => s.name === name)?.href;

export const EMAIL_ADDRESS = "hi@lokeshbuilds.in";
export const SCHEDULE_CALL_URL = "https://cal.com/lokesh1129/meeting";
export const RESUME_URL = "/Lokesh_resume.pdf";
export const RESUME_FILE_NAME = "Lokesh_Singh_Resume.pdf";
export const LINKEDIN_URL = social("Linked in") ?? "https://www.linkedin.com/in/lokeshsingh1129/";
export const GITHUB_URL = social("Github") ?? "https://github.com/LokeshXs";
export const X_URL = social("X") ?? "https://x.com/ShipItLokesh";
