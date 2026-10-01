import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BOOKING_LABEL } from "@/data/positioning";
import { BOOKING_URL } from "@/lib/cal-embed";

interface BookingCTAProps {
  variant?: "primary" | "secondary" | "inline";
  className?: string;
  text?: string;
}

const BookingCTA = ({
  className = "",
  text = BOOKING_LABEL,
}: BookingCTAProps) => {
  return (
    <Link
      href={BOOKING_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`text-link ${className}`}
    >
      <span
        className={
          className.includes("hero-booking") ? "hero-booking-label" : undefined
        }
      >
        {text}
      </span>
      <ArrowUpRight aria-hidden="true" strokeWidth={1.5} />
    </Link>
  );
};

export default BookingCTA;
