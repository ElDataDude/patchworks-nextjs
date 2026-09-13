"use client";

import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import {
  BOOKING_URL,
  loadCalEmbed,
  openCalBooking,
  subscribeCalFailure,
} from "@/lib/cal-embed";

interface BookingWidgetProps {
  variant?: "primary" | "secondary";
  className?: string;
  buttonText?: string;
}

const BookingWidget = ({
  className = "",
  buttonText = "Book Your Free 30-Minute AI Strategy Call",
}: BookingWidgetProps) => {
  const [embedFailed, setEmbedFailed] = useState(false);

  useEffect(() => {
    let mounted = true;
    const unsubscribe = subscribeCalFailure(() => setEmbedFailed(true));
    void loadCalEmbed().catch(() => {
      if (mounted) setEmbedFailed(true);
    });
    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  return (
    <div className="booking-widget">
      <a
        href={BOOKING_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`text-link ${className}`}
        onClick={(event) => {
          if (
            event.button !== 0 ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey
          )
            return;
          if (openCalBooking()) event.preventDefault();
        }}
      >
        <span
          className={
            className.includes("hero-booking")
              ? "hero-booking-label"
              : undefined
          }
        >
          {buttonText}
        </span>
        <ArrowUpRight aria-hidden="true" strokeWidth={1.5} />
      </a>
      {embedFailed && (
        <p className="mt-3 text-sm text-body-color" role="status">
          The embedded calendar is unavailable.{" "}
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Open booking directly
          </a>
          .
        </p>
      )}
    </div>
  );
};

export default BookingWidget;
