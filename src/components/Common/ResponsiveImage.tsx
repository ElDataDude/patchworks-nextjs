type ResponsiveImageProps = {
  src: string;
  alt: string;
  sizes: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  className?: string;
};

const editorialImageWidths: Record<string, number> = {
  "/images/editorial/about-bridge.webp": 1254,
  "/images/editorial/article-leadership.webp": 1600,
  "/images/editorial/article-manufacturing.webp": 1600,
  "/images/editorial/article-roi.webp": 1600,
  "/images/editorial/careers-system.webp": 1792,
  "/images/editorial/drilling-study.webp": 1532,
  "/images/editorial/home-systems.webp": 1983,
  "/images/editorial/industries-system.webp": 1792,
  "/images/editorial/services-system.webp": 1792,
};

function responsiveSourceSet(src: string) {
  const intrinsicWidth = editorialImageWidths[src];
  if (!intrinsicWidth) return undefined;

  const filename = src.slice(src.lastIndexOf("/") + 1, -".webp".length);
  const generated = [480, 768, 1200]
    .filter((width) => width < intrinsicWidth)
    .map(
      (width) =>
        `/images/editorial/responsive/${filename}-${width}.webp ${width}w`,
    );

  return [...generated, `${src} ${intrinsicWidth}w`].join(", ");
}

export default function ResponsiveImage({
  src,
  alt,
  sizes,
  width,
  height,
  fill = false,
  priority = false,
  className,
}: ResponsiveImageProps) {
  const srcSet = responsiveSourceSet(src);
  const fillStyle = fill
    ? {
        position: "absolute" as const,
        inset: 0,
        width: "100%",
        height: "100%",
      }
    : {
        display: "block",
        width: "100%",
        height: "auto",
      };

  return (
    <picture>
      {srcSet && <source type="image/webp" srcSet={srcSet} sizes={sizes} />}
      <img
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        className={className}
        style={fillStyle}
      />
    </picture>
  );
}
