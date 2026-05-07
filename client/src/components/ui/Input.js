import React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef(({ className, type, icon: Icon, error, ...props }, ref) => {
  return (
    <div className="relative w-full">
      {Icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <Icon className="w-4 h-4" />
        </div>
      )}
      <input
        type={type}
        className={cn(
          "w-full bg-white border border-gray-100 rounded-xl text-xs font-medium focus:outline-none focus:ring-4 focus:ring-[#FF6B00]/5 transition-all shadow-sm",
          Icon ? "pl-11 pr-6 py-2.5" : "px-6 py-2.5",
          error ? "border-red-500 focus:ring-red-500/5" : "border-gray-100",
          className
        )}
        ref={ref}
        {...props}
      />
      {error && <p className="mt-1.5 text-[10px] font-bold text-red-500 uppercase tracking-widest pl-2">{error}</p>}
    </div>
  );
});

Input.displayName = "Input";

export default Input;
