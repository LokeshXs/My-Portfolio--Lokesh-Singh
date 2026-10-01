import {
  IconBrandLinkedin,
  IconBrandGithub,
  IconBrandX,
  IconCalendarEvent,
  IconMail,
} from "@tabler/icons-react";
import Link from "next/link";
import { SOCIALS } from "@/lib/data";
import AnimatedSubheading from "../common/AnimatedSubHeading";

const EMAIL_ADDRESS = "hi@lokeshbuilds.in";
const SCHEDULE_CALL_URL = "https://cal.com/lokesh1129/meeting";
const X_URL = "https://x.com/ShipItLokesh";
const githubSocial = SOCIALS.find((social) => social.name === "Github");

const contactLinks = [
  {
    label: "Follow me on X",
    href: X_URL,
    icon: IconBrandX,
    external: true,
  },
  {
    label: "View my GitHub profile",
    href: githubSocial?.href ?? "https://github.com/LokeshXs",
    icon: githubSocial?.icon ?? IconBrandGithub,
    external: true,
  },
  {
    label: "Connect on LinkedIn",
    href: "https://www.linkedin.com/in/lokeshsingh1129",
    icon: IconBrandLinkedin,
    external: true,
  },
  {
    label: `Email ${EMAIL_ADDRESS}`,
    href: `mailto:${EMAIL_ADDRESS}`,
    icon: IconMail,
    external: false,
  },
  {
    label: "Schedule a call",
    href: SCHEDULE_CALL_URL,
    icon: IconCalendarEvent,
    external: true,
  },
];

export default function ContactSection() {
  return (
    <div className="px-4 py-8 max-sm:px-2 max-sm:py-6">
      <div className="flex justify-center">
        <AnimatedSubheading subheading="Connect with me ❤️" />
      </div>

      <div className="flex items-center justify-center gap-8 mt-12">
        {contactLinks.map(({ label, href, icon: Icon, external }) => (
          <Link
            key={label}
            href={href}
            aria-label={label}
            title={label}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
         
          >
          <div className="text-muted-foreground hover:text-primary-foreground shrink-0 rounded-md border  bg-muted p-2 transition-all duration-300">

            <Icon className="size-6" aria-hidden="true"  />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
