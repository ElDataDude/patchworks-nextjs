import Link from "next/link";

interface BookingCTAProps {
  variant?: "primary" | "secondary" | "inline";
  className?: string;
  text?: string;
}

const BookingCTA = ({ 
  variant = "primary", 
  className = "",
  text = "Book Your Free 30-Minute AI Strategy Call"
}: BookingCTAProps) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition duration-300 ease-in-out hover:opacity-80";
  
  const variantClasses = {
    primary: "bg-primary px-8 py-4 text-base text-white hover:bg-primary/90",
    secondary: "border-2 border-primary px-6 py-3 text-base text-primary hover:bg-primary hover:text-white",
    inline: "text-primary underline hover:text-primary/80"
  };

  return (
    <Link
      href="https://cal.com/bryanj"
      target="_blank"
      rel="noopener noreferrer"
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {text}
    </Link>
  );
};

export default BookingCTA;
