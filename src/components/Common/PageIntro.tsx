import Image from "next/image";
export default function PageIntro({
  title,
  description,
  image,
  imageAlt = "",
  imageWidth = 1792,
  imageHeight = 1200,
  children,
}: {
  title: React.ReactNode;
  description: string;
  image?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  children?: React.ReactNode;
}) {
  return (
    <div className={`page-hero ${image ? "page-hero-grid" : ""}`}>
      <div>
        <h1 className="page-title">{title}</h1>
        <p className="body-copy">{description}</p>
        {children}
      </div>
      {image && (
        <div className="media-frame">
          <Image
            src={image}
            alt={imageAlt}
            width={imageWidth}
            height={imageHeight}
            sizes="(max-width: 767px) 100vw, 50vw"
            priority
          />
        </div>
      )}
    </div>
  );
}
