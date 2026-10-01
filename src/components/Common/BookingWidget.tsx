"use client";

import { ArrowUpRight } from "lucide-react";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { BOOKING_LABEL } from "@/data/positioning";
import {
  readPrivacyPreference,
  type PrivacyPreference,
} from "@/lib/privacy-preferences";
import {
  BOOKING_URL,
  loadCalEmbed,
  openCalBooking,
  subscribeCalClose,
  subscribeCalFailure,
} from "@/lib/cal-embed";

interface BookingWidgetProps {
  variant?: "primary" | "secondary";
  className?: string;
  buttonText?: string;
}

let activeBookingTrigger: HTMLAnchorElement | null = null;

export function shouldOpenEmbeddedBooking(
  event: Pick<
    ReactMouseEvent<HTMLAnchorElement>,
    "button" | "metaKey" | "ctrlKey" | "shiftKey" | "altKey"
  >,
  preference: PrivacyPreference | null,
) {
  return (
    preference === "booking" &&
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey
  );
}

const BookingWidget = ({
  className = "",
  buttonText = BOOKING_LABEL,
}: BookingWidgetProps) => {
  const statusId = useId();
  const trigger = useRef<HTMLAnchorElement>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "failed">("idle");

  useEffect(() => {
    const element = trigger.current;
    const restoreFocus = () => {
      if (activeBookingTrigger !== element) return;
      requestAnimationFrame(() => {
        if (element?.isConnected !== false) element?.focus();
        if (activeBookingTrigger === element) activeBookingTrigger = null;
      });
    };
    const unsubscribeFailure = subscribeCalFailure(() => {
      if (activeBookingTrigger !== element) return;
      setStatus("failed");
      requestAnimationFrame(() => {
        if (element?.isConnected !== false) element?.focus();
      });
    });
    const unsubscribeClose = subscribeCalClose(restoreFocus);
    return () => {
      if (activeBookingTrigger === element) activeBookingTrigger = null;
      unsubscribeFailure();
      unsubscribeClose();
    };
  }, []);

  async function selectBooking(event: ReactMouseEvent<HTMLAnchorElement>) {
    if (!shouldOpenEmbeddedBooking(event, readPrivacyPreference())) return;
    event.preventDefault();
    if (status === "loading") return;
    activeBookingTrigger = trigger.current;
    setStatus("loading");
    try {
      await loadCalEmbed();
      if (!openCalBooking()) throw new Error("Booking embed unavailable");
      setStatus("idle");
    } catch {
      setStatus("failed");
      requestAnimationFrame(() => trigger.current?.focus());
    }
  }

  return (
    <div className="booking-widget">
      <a
        ref={trigger}
        href={BOOKING_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`text-link ${className}`}
        onClick={selectBooking}
        aria-describedby={
          status === "loading"
            ? `${statusId}-loading`
            : status === "failed"
              ? `${statusId}-fallback`
              : undefined
        }
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
      {status === "loading" && (
        <p
          id={`${statusId}-loading`}
          className="booking-status"
          role="status"
          aria-live="polite"
        >
          Opening the booking calendar…
        </p>
      )}
      {status === "failed" && (
        <p id={`${statusId}-fallback`} className="booking-status" role="status">
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
