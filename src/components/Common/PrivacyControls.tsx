"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  OPEN_PRIVACY_PREFERENCES_EVENT,
  readPrivacyPreference,
  writePrivacyPreference,
  type PrivacyPreference,
} from "@/lib/privacy-preferences";

export function PrivacyPreferencesButton({
  className = "",
}: {
  className?: string;
}) {
  return (
    <button
      type="button"
      className={className}
      onClick={() =>
        window.dispatchEvent(new Event(OPEN_PRIVACY_PREFERENCES_EVENT))
      }
    >
      Privacy choices
    </button>
  );
}

export default function PrivacyControls() {
  const [ready, setReady] = useState(false);
  const [preference, setPreference] = useState<PrivacyPreference | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setPreference(readPrivacyPreference());
    setReady(true);
    const open = () => {
      returnFocus.current = document.activeElement as HTMLElement | null;
      dialog.current?.showModal();
    };
    window.addEventListener(OPEN_PRIVACY_PREFERENCES_EVENT, open);
    return () =>
      window.removeEventListener(OPEN_PRIVACY_PREFERENCES_EVENT, open);
  }, []);

  function choose(next: PrivacyPreference, closeDialog = false) {
    const shouldReload = preference === "booking" && next === "essential";
    writePrivacyPreference(next);
    setPreference(next);
    if (closeDialog) dialog.current?.close();
    if (shouldReload) window.location.reload();
  }

  function restoreFocus() {
    returnFocus.current?.focus();
    returnFocus.current = null;
  }

  return (
    <>
      {ready && !preference && (
        <section
          className="privacy-banner"
          role="region"
          aria-labelledby="privacy-banner-title"
        >
          <div>
            <h2 id="privacy-banner-title">Your privacy choices</h2>
            <p>
              We use cookieless Cloudflare analytics to understand site
              performance. You can also allow Cal.com to open booking inside
              this site; otherwise booking opens on Cal.com in a new tab. We
              store your choice for six months.
            </p>
            <Link href="/privacy">Read our privacy notice</Link>
          </div>
          <div className="privacy-banner-actions">
            <button
              type="button"
              className="privacy-action-primary"
              onClick={() => choose("booking")}
            >
              Allow embedded booking
            </button>
            <button type="button" onClick={() => choose("essential")}>
              Essential only
            </button>
          </div>
        </section>
      )}

      <dialog
        ref={dialog}
        className="privacy-dialog"
        aria-labelledby="privacy-dialog-title"
        onClose={restoreFocus}
        onCancel={restoreFocus}
      >
        <div className="privacy-dialog-inner">
          <h2 id="privacy-dialog-title">Privacy choices</h2>
          <dl>
            <div>
              <dt>Site operation</dt>
              <dd>Always on. Required to deliver and protect the website.</dd>
            </div>
            <div>
              <dt>Cookieless analytics</dt>
              <dd>
                Always on. Cloudflare measures aggregate page use and
                performance without cookies or browser storage.
              </dd>
            </div>
            <div>
              <dt>Embedded booking</dt>
              <dd>
                Optional. If allowed, Cal.com loads only after you select a
                booking link. Otherwise the link opens directly on Cal.com.
              </dd>
            </div>
          </dl>
          <p>
            Your choice is stored for six months. You can change it here at any
            time. <Link href="/privacy">Read our privacy notice</Link>.
          </p>
          <div className="privacy-dialog-actions">
            <button
              type="button"
              className="privacy-action-primary"
              onClick={() => choose("booking", true)}
            >
              Allow embedded booking
            </button>
            <button type="button" onClick={() => choose("essential", true)}>
              Essential only
            </button>
            <button type="button" onClick={() => dialog.current?.close()}>
              Keep current choice
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
