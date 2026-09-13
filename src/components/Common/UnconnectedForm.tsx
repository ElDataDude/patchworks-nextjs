"use client";
import { useState, type ComponentProps } from "react";
// Keep presentation-only forms local until their submission endpoints exist.
export default function UnconnectedForm({
  children,
  ...props
}: Omit<ComponentProps<"form">, "onSubmit">) {
  const [unavailable, setUnavailable] = useState(false);
  return (
    <form
      {...props}
      data-submission="not-connected"
      onSubmit={(event) => {
        event.preventDefault();
        setUnavailable(true);
      }}
    >
      {children}
      {unavailable && (
        <p role="status" className="form-wide text-sm leading-relaxed">
          Online submission is currently unavailable.
        </p>
      )}
    </form>
  );
}
