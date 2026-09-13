import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface BookingCTAProps {
  variant?: "primary" | "secondary" | "inline";
  className?: string;
  text?: string;
}

const BookingCTA = ({
  className = "",
  text = "Book Your Free 30-Minute AI Strategy Call",
}: BookingCTAProps) => {
  return (
    <Link
      href="https://cal.com/bryanj"
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
