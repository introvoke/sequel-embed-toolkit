import React, { SVGProps } from "react";
import { type VariantProps, cn, cva } from "@src/styles/utils";

export const ICON_COLORS = [
  "inherit",
  "default",
  "primary",
  "secondary",
  "success",
  "error",
  "warning",
  "gray",
] as const;

export type IconColor = (typeof ICON_COLORS)[number];

export const createIconColorsVarianceObject = <T extends IconColor>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  colors: T[] = ICON_COLORS as any,
) => {
  return colors.reduce(
    (res, color) => {
      res[color] = "";
      return res;
    },
    {} as Record<T, string>,
  );
};

const iconVariants = cva("", {
  variants: {
    color: {
      inherit: "",
      default: "text-black",
      primary: "text-primary-700",
      secondary: "text-gray-600",
      success: "text-green-500",
      error: "text-red-500",
      warning: "text-orange-500",
      gray: "text-gray-400",
    },
    size: {
      inherit: "",
      xs: "h-3 min-h-[12px] w-3 min-w-[12px]",
      sm: "h-4 min-h-[16px] w-4 min-w-[16px]",
      md: "h-5 min-h-[20px] w-5 min-w-[20px]",
      input: "h-5 min-h-[20px] w-5 min-w-[20px]",
      lg: "h-6 min-h-[24px] w-6 min-w-[24px]",
      xl: "min-w-8-[32px] h-8 min-h-[32px] w-8",
    },
  },
  defaultVariants: {
    size: "inherit",
    color: "inherit",
  },
});

export interface IconWrapperProps
  extends Omit<React.SVGAttributes<SVGSVGElement>, "color">,
    VariantProps<typeof iconVariants> {
  icon:
    | React.ComponentType<SVGProps<SVGSVGElement>>
    | React.ForwardRefExoticComponent<
        Omit<React.SVGProps<SVGSVGElement>, "ref"> &
          React.RefAttributes<SVGSVGElement>
      >;
}

/**
 * A wrapper component for all the icons exported from the library
 */
const IconWrapper = React.forwardRef<React.ElementRef<"svg">, IconWrapperProps>(
  ({ icon: Icon, color, size, className, ...svgProps }, ref) => {
    return (
      <Icon
        {...svgProps}
        ref={ref}
        className={cn(iconVariants({ color, size }), className)}
      />
    );
  },
);

IconWrapper.displayName = "IconWrapper";

export { IconWrapper };
