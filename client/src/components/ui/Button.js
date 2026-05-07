import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const Button = React.forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  href, 
  isLoading, 
  children, 
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-xl font-black transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-[#FF6B00] text-white hover:bg-[#E66000] shadow-xl shadow-orange-100",
    secondary: "bg-white text-gray-900 border-2 border-gray-100 hover:border-[#FF6B00]/30",
    outline: "bg-transparent border-2 border-[#FF6B00] text-[#FF6B00] hover:bg-[#FF6B00]/5",
    ghost: "bg-transparent text-gray-400 hover:text-[#FF6B00] hover:bg-[#FF6B00]/5",
    dark: "bg-gray-900 text-white hover:bg-gray-800 shadow-xl",
    danger: "bg-red-500 text-white hover:bg-red-600 shadow-xl shadow-red-100",
  };

  const sizes = {
    sm: "px-4 py-2 text-[10px] tracking-widest uppercase",
    md: "px-6 py-3 text-sm",
    lg: "px-10 py-5 text-xl",
    icon: "p-2.5",
  };

  const combinedClassName = cn(
    baseStyles,
    variants[variant],
    sizes[size],
    className
  );

  if (href) {
    return (
      <Link href={href} className={combinedClassName} ref={ref} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClassName} ref={ref} disabled={isLoading} {...props}>
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </span>
      ) : children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;
