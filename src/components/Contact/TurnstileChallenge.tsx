"use client";
import { useEffect, useRef, useState } from "react";
import { loadTurnstile } from "@/lib/turnstile";

const CHALLENGE_LOAD_TIMEOUT = 10_000;

interface Props {
  siteKey: string;
  resetKey: number;
  onToken: (token: string) => void;
  onError: (message: string) => void;
  onRefresh: () => void;
}
export default function TurnstileChallenge({
  siteKey,
  resetKey,
  onToken,
  onError,
  onRefresh,
}: Props) {
  const container = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("Loading secure verification…");
  const [widgetSize, setWidgetSize] = useState<"flexible" | "compact">();

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const selectSize = (width: number) => {
      const next = width < 300 ? "compact" : "flexible";
      setWidgetSize((current) => (current === next ? current : next));
    };
    selectSize(element.getBoundingClientRect().width);
    const observer = new ResizeObserver(([entry]) => {
      selectSize(
        entry?.contentRect.width ?? element.getBoundingClientRect().width,
      );
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!widgetSize) return;
    let cancelled = false;
    let stopped = false;
    let widget: string | undefined;
    // Each (re)render of the external widget starts from the loading state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStatus("loading");
    setMessage("Loading secure verification…");
    onToken("");

    const fail = (next: string) => {
      if (cancelled || stopped) return;
      stopped = true;
      onToken("");
      onError(next);
      setStatus("error");
      setMessage(next);
    };
    const watchdog = window.setTimeout(
      () =>
        fail(
          "Verification is taking too long to load. Refresh it, email us or book a conversation.",
        ),
      CHALLENGE_LOAD_TIMEOUT,
    );

    void loadTurnstile()
      .then((turnstile) => {
        if (cancelled || stopped || !container.current) return;
        try {
          widget = turnstile.render(container.current, {
            sitekey: siteKey,
            action: "contact",
            theme: "light",
            // Flexible Turnstile has a provider-enforced 300px minimum.
            size: widgetSize,
            "response-field": false,
            callback: (token) => {
              if (cancelled) return;
              onError("");
              onToken(token);
              setStatus("ready");
              setMessage("Secure verification complete.");
            },
            "expired-callback": () => {
              fail(
                "Verification expired. Refresh it before sending your enquiry.",
              );
            },
            "error-callback": () => {
              fail(
                "Verification is unavailable. Refresh it, email us or book a conversation.",
              );
              return true;
            },
          });
          window.clearTimeout(watchdog);
          setStatus("ready");
          setMessage(
            "Secure verification is ready. Complete the check if prompted.",
          );
        } catch {
          fail(
            "Verification could not start. Refresh it, email us or book a conversation.",
          );
        }
      })
      .catch(() => {
        fail(
          "Verification could not load. Refresh it, email us or book a conversation.",
        );
      });
    return () => {
      cancelled = true;
      window.clearTimeout(watchdog);
      if (widget !== undefined) window.turnstile?.remove(widget);
    };
  }, [siteKey, resetKey, onToken, onError, widgetSize]);

  return (
    <section
      className="contact-challenge"
      aria-label="Enquiry spam protection"
      aria-busy={status === "loading"}
    >
      <p
        className={`challenge-status challenge-status--${status}`}
        role="status"
      >
        {status === "loading" && <span aria-hidden="true" />}
        {message}
      </p>
      <div ref={container} className="contact-verification" />
      {status === "error" && (
        <button type="button" className="text-link" onClick={onRefresh}>
          Refresh verification
        </button>
      )}
    </section>
  );
}
