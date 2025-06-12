"use client";

import { useEffect, useState } from "react";

interface BookingWidgetProps {
  variant?: "primary" | "secondary";
  className?: string;
  buttonText?: string;
}

// Global flag to track if Cal.com script is loaded
let isCalScriptLoaded = false;

const BookingWidget = ({ 
  variant = "primary", 
  className = "",
  buttonText = "Book Your Free 30-Minute AI Strategy Call"
}: BookingWidgetProps) => {
  const [isLoaded, setIsLoaded] = useState(isCalScriptLoaded);

  useEffect(() => {
    // Check if script is already loaded
    if (isCalScriptLoaded || document.querySelector('script[src="https://app.cal.com/embed/embed.js"]')) {
      setIsLoaded(true);
      return;
    }

    // Load Cal.com embed script only once
    const script = document.createElement("script");
    script.src = "https://app.cal.com/embed/embed.js";
    script.async = true;
    script.onload = () => {
      isCalScriptLoaded = true;
      setIsLoaded(true);
    };
    document.head.appendChild(script);
  }, []);

  const handleClick = () => {
    // Fallback to direct link if Cal.com embed fails
    if (!isLoaded) {
      window.open('https://cal.com/bryanj/30min', '_blank');
    }
  };

  const baseButtonClasses = "inline-flex items-center justify-center rounded-sm px-8 py-4 text-base font-semibold transition duration-300 ease-in-out";
  
  const variantClasses = {
    primary: "bg-primary text-white hover:bg-primary/80 hover:shadow-signUp",
    secondary: "bg-black text-white hover:bg-black/90 dark:bg-white/10 dark:text-white dark:hover:bg-white/5"
  };

  const buttonClasses = `${baseButtonClasses} ${variantClasses[variant]} ${className}`;

  return (
    <div className="booking-widget">
      <button
        className={buttonClasses}
        data-cal-link="bryanj/30min"
        data-cal-config='{"layout":"month_view","theme":"light"}'
        onClick={handleClick}
      >
        <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10m6-10v10m-6-4h6" />
        </svg>
        {buttonText}
      </button>
    </div>
  );
};

export default BookingWidget;
