import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-gentle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-sage-600 text-white shadow-soft hover:bg-sage-700 dark:bg-sage-700 dark:hover:bg-sage-600",
        secondary:
          "bg-lavender-100 text-lavender-900 shadow-soft hover:bg-lavender-200 dark:bg-lavender-900 dark:text-lavender-100 dark:hover:bg-lavender-800",
        ghost:
          "hover:bg-sage-100 hover:text-sage-900 dark:hover:bg-midnight-800 dark:hover:text-sage-100",
        outline:
          "border-2 border-sage-200 bg-transparent hover:bg-sage-50 dark:border-midnight-700 dark:hover:bg-midnight-800",
        link: "text-sage-600 underline-offset-4 hover:underline dark:text-sage-400",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-lg px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
