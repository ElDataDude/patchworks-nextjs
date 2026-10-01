import Link from "next/link";
import type { ComponentProps } from "react";

// Keep presentation-only forms visibly unavailable until their endpoints exist.
export default function UnconnectedForm({
  children,
  ...props
}: Omit<ComponentProps<"form">, "onSubmit">) {
  return (
    <form {...props} data-submission="not-connected">
      <p role="status" className="unconnected-form-notice form-wide">
        This form is unavailable and does not collect or submit details.{" "}
        <Link href="/contact">Contact Patchworks AI instead</Link>.
      </p>
      <fieldset className="unconnected-form-fields" disabled>
        {children}
      </fieldset>
    </form>
  );
}
