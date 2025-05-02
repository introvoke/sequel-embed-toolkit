import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgXClose = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 24 24"
    ref={ref}
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M18 6 6 18M6 6l12 12"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgXClose);
export default ForwardRef;
