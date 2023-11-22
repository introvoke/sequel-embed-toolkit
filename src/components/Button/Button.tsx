import * as React from "react";
import { cn, cva, type VariantProps } from "@src/styles/utils";
import LoaderIcon from "@src/components/LoaderIcon";
import { IconWrapper, type IconWrapperProps } from "../IconWrapper";

const iconVariants = cva("", {
  variants: {
    size: {
      xs: "h-5 min-h-[20px] w-5 min-w-[20px]",
      sm: "h-5 min-h-[20px] w-5 min-w-[20px]",
      md: "h-5 min-h-[20px] w-5 min-w-[20px]",
      lg: "h-5 min-h-[20px] w-5 min-w-[20px]",
      xl: "h-6 min-h-[24px] w-6 min-w-[24px]",
    },
    variant: {
      primary: "",
      secondary: "",
      transparent: "",
      text: "",
    },
  },
  defaultVariants: {
    size: "sm",
    variant: "primary",
  },
  compoundVariants: [
    // text variants => make same size as text
    {
      variant: "text",
      size: ["sm", "md", "lg"],
      className: "h-4 min-h-[16px] w-4 min-w-[16px]",
    },
    {
      variant: "text",
      size: ["md", "lg"],
      className: "h-4.5 min-h-[18px] w-4.5 min-w-[18px]",
    },
    {
      variant: "text",
      size: "xl",
      className: "h-5 min-h-[20px] w-5 min-w-[20px]",
    },
  ],
});

interface ButtonIconPlacementProps
  extends Pick<ButtonProps, "size" | "variant"> {
  /**
   * Indicates that the button is loading and shows an indicator
   */
  loading?: boolean;
  /**
   * Should display the loading indicator
   */
  showLoading: boolean;
  /**
   * Icon to be displayed
   */
  icon?: IconWrapperProps["icon"];
}

const ButtonIconPlacement = ({
  loading,
  showLoading,
  icon,
  size,
  variant,
}: ButtonIconPlacementProps) => {
  if (loading && showLoading) {
    return (
      <IconWrapper
        className={cn(iconVariants({ size, variant }), "animate-spin")}
        icon={LoaderIcon}
      />
    );
  }

  if (icon) {
    return (
      <IconWrapper
        className={cn(iconVariants({ size, variant }))}
        icon={icon}
      />
    );
  }

  return null;
};

const buttonVariants = cva(
  "inline-flex min-w-fit items-center justify-center rounded-lg active:outline-none",
  {
    variants: {
      variant: {
        primary: cn(
          "bg-primary-700 text-primary-contrast-text enabled:shadow-100",
          "hover:enabled:bg-primary-800 focus-visible:enabled:bg-primary-800 active:enabled:bg-primary-900 disabled:bg-primary-300"
        ),
        secondary: cn(
          "border border-gray-200 bg-white text-gray-600 enabled:shadow-100",
          "hover:enabled:bg-gray-50 focus-visible:enabled:bg-gray-50 active:enabled:bg-gray-100",
          "disabled:border-gray-100 disabled:text-gray-200"
        ),
        transparent: cn(
          "bg-transparent text-gray-600",
          "hover:enabled:bg-gray-50 focus-visible:enabled:bg-gray-50 active:enabled:bg-gray-100",
          "disabled:text-gray-200"
        ),
        text: cn(
          "text-primary-700 hover:enabled:underline focus-visible:enabled:underline",
          "disabled:text-primary-300"
        ),
      },
      /**
       * The size of the button and it's contents (Defaults to `sm`).
       * @default "sm"
       */
      size: {
        xs: "h-8 gap-2 px-2.5 py-1.5 text-sm font-medium",
        sm: "h-10 gap-2 px-4 py-2.5 text-sm font-medium",
        md: "h-11 gap-2 px-5 py-3 text-base font-medium",
        lg: "h-12 gap-2 px-5 py-3 text-base font-medium",
        xl: "h-15 gap-3 px-7 py-4 text-lg font-semibold",
      },
      destructive: {
        true: "",
        false: "",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "sm",
      destructive: false,
      fullWidth: false,
    },
    compoundVariants: [
      // destructive variants
      {
        variant: "primary",
        destructive: true,
        className:
          "bg-red-500 text-white hover:enabled:bg-red-600 focus-visible:enabled:bg-red-600 active:enabled:bg-red-700 disabled:bg-red-300",
      },
      {
        variant: "secondary",
        destructive: true,
        className:
          "border-red-500 text-red-600 hover:enabled:bg-red-50 focus-visible:enabled:bg-red-50 active:enabled:bg-red-100 disabled:border-red-200 disabled:text-red-200",
      },
      {
        variant: "transparent",
        destructive: true,
        className:
          "text-red-600 hover:enabled:bg-red-50 focus-visible:enabled:bg-red-50 active:enabled:bg-red-100 disabled:text-red-200",
      },
      {
        variant: "text",
        destructive: true,
        className: "text-red-600 disabled:text-red-200",
      },
      // text variants
      {
        variant: "text",
        className: "h-fit rounded-none border-none p-0",
      },
    ],
  }
);

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color">,
    VariantProps<typeof buttonVariants> {
  /**
   * Should the button inherit the first child as the component to render
   *
   * _Note:_ This will remove all loading states
   * @default false
   * @example
   * ```tsx
   * <Button asChild>
   *  <a href="https://google.com/">Google</a>
   * </Button>
   * ```
   */
  asChild?: boolean;
  /**
   * Indicates that the button is destructive
   */
  destructive?: boolean;
  /**
   * Icon to be displayed at the start of the button
   */
  startIcon?: IconWrapperProps["icon"];
  /**
   * Icon to be displayed at the end of the button
   */
  endIcon?: IconWrapperProps["icon"];
  /**
   * Indicates that the button is loading and shows an indicator
   */
  loading?: boolean;
  /**
   * Placement of the loading indicator on the button, defaults to replacing text
   * @default "start"
   */
  loadingPosition?: "start" | "end";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "sm",
      asChild = false,
      startIcon,
      endIcon,
      loading = false,
      loadingPosition = "start",
      destructive = false,
      disabled = false,
      fullWidth = false,
      children,
      ...buttonProps
    },
    ref
  ) => {
    return (
      <button
        {...buttonProps}
        className={cn(
          buttonVariants({ variant, size, destructive, fullWidth }),
          className
        )}
        disabled={disabled || loading}
        ref={ref}
      >
        {loading && !loadingPosition ? (
          <ButtonIconPlacement
            loading
            showLoading
            size={size}
            variant={variant}
          />
        ) : (
          <>
            <ButtonIconPlacement
              loading={loading}
              showLoading={loadingPosition === "start"}
              icon={startIcon}
              size={size}
              variant={variant}
            />
            {children}
            <ButtonIconPlacement
              loading={loading}
              showLoading={loadingPosition === "end"}
              icon={endIcon}
              size={size}
              variant={variant}
            />
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
