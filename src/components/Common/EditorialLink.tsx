import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
export default function EditorialLink({
  href,
  children,
  className = "",
  external = false,
  quiet = false,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  external?: boolean;
  quiet?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`text-link ${quiet ? "text-link--quiet" : ""} ${className}`}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
      {!quiet && <ArrowUpRight aria-hidden="true" strokeWidth={1.5} />}
    </Link>
  );
}
