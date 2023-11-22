import { DecorationWrapper } from "../DecorationWrapper";
import {
  IconColor,
  IconWrapper,
  IconWrapperProps,
  createIconColorsVarianceObject,
} from "../IconWrapper";
import { cn, cva, VariantProps } from "@src/styles/utils";

import CirclesDecoration from "@src/decorations/CirclesSm";
import DotsDecoration from "@src/decorations/DotsSm";

const featuredIconVariants = cva("absolute flex items-center justify-center", {
  variants: {
    variant: {
      square: "h-14 w-14 rounded-xl border border-gray-200 bg-white",
      circle: "h-16 w-16 rounded-full border-8",
    },
    color: createIconColorsVarianceObject([
      "primary",
      "secondary",
      "success",
      "error",
      "warning",
    ]),
  },
  defaultVariants: {
    color: "primary",
    variant: "square",
  },
  compoundVariants: [
    {
      variant: "circle",
      color: "primary",
      className: "border-primary-100 bg-primary-200",
    },
    {
      variant: "circle",
      color: "secondary",
      className: "border-gray-50 bg-gray-100",
    },
    {
      variant: "circle",
      color: "success",
      className: "border-green-50 bg-green-100",
    },
    {
      variant: "circle",
      color: "error",
      className: "border-red-50 bg-red-100",
    },
    {
      variant: "circle",
      color: "warning",
      className: "border-orange-50 bg-orange-100",
    },
  ],
});

export interface FeaturedIconProps
  extends Omit<IconWrapperProps, "color">,
    VariantProps<typeof featuredIconVariants> {
  color?: Extract<
    IconColor,
    "primary" | "secondary" | "success" | "error" | "warning"
  >;
  /**
   * The decoration to be used for the icon
   * @default "circles"
   */
  decoration?: "circles" | "dots";
}

const FeaturedIcon = ({
  className,
  variant,
  color = "primary",
  decoration = "circles",
  ...props
}: FeaturedIconProps) => {
  return (
    <div
      className={cn(
        "relative flex h-14 w-14 items-center justify-center",
        className
      )}
    >
      <DecorationWrapper
        className="pointer-events-none absolute z-0"
        size="sm"
        decoration={
          decoration === "circles" ? CirclesDecoration : DotsDecoration
        }
      />
      <div className={cn(featuredIconVariants({ variant, color }))}>
        <IconWrapper size="lg" {...props} color={color} />
      </div>
    </div>
  );
};

FeaturedIcon.displayName = "FeaturedIcon";

export { FeaturedIcon };
