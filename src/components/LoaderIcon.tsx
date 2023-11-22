import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgLoaderIcon = (
  props: SVGProps<SVGSVGElement>,
  ref: Ref<SVGSVGElement>
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="lucide lucide-loader-2"
    viewBox="0 0 24 24"
    ref={ref}
    {...props}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);
const ForwardRef = forwardRef(SvgLoaderIcon);
export default ForwardRef;
