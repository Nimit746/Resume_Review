import React from "react";
import { cn } from "@/lib/utils";

const Card = React.forwardRef(({ className, children, hover = true, padding = "p-6", ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "bg-white border border-gray-100 rounded-[2rem] shadow-sm transition-all",
        hover && "hover:shadow-md hover:border-[#FF6B00]/10",
        padding,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

const CardHeader = ({ className, children, ...props }) => (
  <div className={cn("flex flex-col space-y-1.5", className)} {...props}>
    {children}
  </div>
);

const CardTitle = ({ className, children, ...props }) => (
  <h3 className={cn("text-2xl font-black text-gray-900 tracking-tight", className)} {...props}>
    {children}
  </h3>
);

const CardDescription = ({ className, children, ...props }) => (
  <p className={cn("text-sm font-medium text-gray-500", className)} {...props}>
    {children}
  </p>
);

const CardContent = ({ className, children, ...props }) => (
  <div className={cn("pt-0", className)} {...props}>
    {children}
  </div>
);

const CardFooter = ({ className, children, ...props }) => (
  <div className={cn("flex items-center pt-4", className)} {...props}>
    {children}
  </div>
);

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
