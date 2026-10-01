import { SOCIALS } from "@/lib/data";
import Link from "next/link";

export default function Footer() {
  return (
    <div className="flex items-center justify-between px-4 py-4">
      <p className="text-secondary text-sm">Built by <Link target="_blank" href={SOCIALS[0].href} className=" underline">Lokesh Singh</Link></p>

      <div className="flex items-center gap-2">
        {SOCIALS.map((social, idx) => (
          <Link  href={social.href} key={`social-${idx}`} target="_blank">
            <div className="text-muted-foreground hover:text-primary-foreground shrink-0 rounded-full border  bg-muted p-1 transition-all duration-300">
              <social.icon className="h-5 w-5" />{" "}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
