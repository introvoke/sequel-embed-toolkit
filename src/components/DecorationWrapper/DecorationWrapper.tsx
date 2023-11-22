import React, { SVGProps } from "react";
import { type VariantProps, cn, cva } from "@src/styles/utils";

const decorationVariants = cva("pointer-events-none touch-none select-none", {
  variants: {
    size: {
      inherit: "",
      sm: "h-[336px] w-[336px]",
      md: "h-[480px] w-[480px]",
      lg: "h-[768px] w-[768px]",
    },
  },
  defaultVariants: {
    size: "inherit",
  },
});

export interface DecorationWrapperProps
  extends Omit<React.SVGAttributes<SVGSVGElement>, "color">,
    VariantProps<typeof decorationVariants> {
  decoration:
    | React.ComponentType<SVGProps<SVGSVGElement>>
    | React.ForwardRefExoticComponent<
        Omit<React.SVGProps<SVGSVGElement>, "ref"> &
          React.RefAttributes<SVGSVGElement>
      >;
}

/**
 * A wrapper component for all the decorations exported from the library
 */
const DecorationWrapper = ({
  decoration: Decoration,
  size,
  className,
  ...svgProps
}: DecorationWrapperProps) => {
  return (
    <Decoration
      {...svgProps}
      className={cn(decorationVariants({ size }), className)}
    />
  );
};

DecorationWrapper.displayName = "DecorationWrapper";

export { DecorationWrapper };
