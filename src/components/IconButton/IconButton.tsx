import { forwardRef, type ForwardedRef } from "react";
import { VariantProps, cn, cva } from "@src/styles/utils";
import { Button, type ButtonProps } from "../Button";

export const iconButtonVariants = cva("", {
  variants: {
    variant: {
      primary: "", // same as buttom
      secondary: "text-foreground-700",
      transparent: "text-foreground-700",
    },
    size: {
      xs: "h-7 min-h-[28px] w-7 min-w-[28px] p-1.5",
      sm: "h-10 min-h-[40px] w-10 min-w-[40px] p-2.5",
      md: "h-11 min-h-[44px] w-11 min-w-[44px] p-3",
      lg: "h-12 min-h-[48px] w-12 min-w-[48px] p-3.5",
      xl: "h-15 min-h-[60px] w-15 min-w-[60px] p-4.5",
      "28px": "h-7 min-h-[28px] w-7 min-w-[28px] p-1.5",
      "40px": "h-10 min-h-[40px] w-10 min-w-[40px] p-2.5",
      "44px": "h-11 min-h-[44px] w-11 min-w-[44px] p-3",
      "48px": "h-12 min-h-[48px] w-12 min-w-[48px] p-3.5",
      "60px": "h-15 min-h-[60px] w-15 min-w-[60px] p-4.5",
    },
    shape: {
      square: "rounded-lg",
      circle: "rounded-full",
    },
    destructive: {
      true: "",
      false: "",
    },
  },
  defaultVariants: {
    size: "md",
    shape: "circle",
    variant: "transparent",
  },
  compoundVariants: [
    {
      variant: "primary",
      destructive: true,
      className: "", // same as button
    },
    {
      variant: "secondary",
      destructive: true,
      className: "text-coral-600",
    },
    {
      variant: "transparent",
      destructive: true,
      className: "text-coral-600",
    },
  ],
});

const iconVariants = cva("", {
  variants: {
    size: {
      xs: "child:h-4 child:min-h-[16px] child:w-4 child:min-w-[16px]",
      sm: "child:h-5 child:min-h-[20px] child:w-5 child:min-w-[20px]",
      md: "child:h-5 child:min-h-[20px] child:w-5 child:min-w-[20px]",
      lg: "child:h-5 child:min-h-[20px] child:w-5 child:min-w-[20px]",
      xl: "child:h-6 child:min-h-[24px] child:w-6 child:min-w-[24px]",
      "28px": "child:h-4 child:min-h-[16px] child:w-4 child:min-w-[16px]",
      "40px": "child:h-5 child:min-h-[20px] child:w-5 child:min-w-[20px]",
      "44px": "child:h-5 child:min-h-[20px] child:w-5 child:min-w-[20px]",
      "48px": "child:h-5 child:min-h-[20px] child:w-5 child:min-w-[20px]",
      "60px": "child:h-6 child:min-h-[24px] child:w-6 child:min-w-[24px]",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export interface IconButtonProps
  extends Omit<
      ButtonProps,
      | "asChild"
      | "variant"
      | "destructive"
      | "size"
      | "startIcon"
      | "endIcon"
      | "ref"
      | "children"
      | "loadingPosition"
      | "fullWidth"
    >,
    VariantProps<typeof iconButtonVariants> {
  variant?: Exclude<ButtonProps["variant"], "text">;
  destructive?: ButtonProps["destructive"];
  icon: ButtonProps["startIcon"];
}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      size = "md",
      shape = "circle",
      className,
      variant = "transparent",
      destructive = false,
      ...buttonProps
    }: IconButtonProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ) => {
    return (
      <Button
        {...buttonProps}
        ref={ref}
        startIcon={icon}
        variant={variant}
        destructive={destructive}
        className={cn(
          iconButtonVariants({ size, shape, variant, destructive }),
          iconVariants({ size }),
          className,
        )}
      />
    );
  },
);

IconButton.displayName = "IconButton";

export { IconButton };
