import React, { useState } from "react";
import { Input, InputProps } from "../ui/input";
import { cn } from "@/lib/utils";
import { Eye, EyeIcon, EyeOff } from "lucide-react";

const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    return (
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          className={cn("pe-10", className)}
          ref={ref}
          {...props}
        />
        <button
          title={showPassword ? "Hide password" : "Show passoword"}
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 transform text-muted-foreground"
        >
          {showPassword ? <EyeOff size={15} /> : <EyeIcon size={15} />}
        </button>
      </div>
    );
  },
);
PasswordInput.displayName = "passwordInput";

export { PasswordInput };
