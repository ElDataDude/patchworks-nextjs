import Image from "next/image";
import Link from "next/link";
import { brandWordmarks } from "@/data/brand";
import styles from "./BrandLogo.module.css";

export default function BrandLogo({
  placement = "header",
}: {
  placement?: "header" | "footer";
}) {
  return (
    <Link
      href="/"
      className={`wordmark ${styles.link} ${styles[placement]}`}
      aria-label="Patchworks AI home"
    >
      <Image
        src={brandWordmarks[placement === "footer" ? "dark" : "light"]}
        width={600}
        height={105}
        alt=""
        className={styles.image}
        priority={placement === "header"}
        unoptimized
      />
    </Link>
  );
}
