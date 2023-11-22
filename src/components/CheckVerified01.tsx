import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgCheckVerified01 = (
  props: SVGProps<SVGSVGElement>,
  ref: Ref<SVGSVGElement>
) => (
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
      fill="currentColor"
      d="M9.514 2.915a3.832 3.832 0 0 1-2.18.904 3.832 3.832 0 0 0-3.515 3.515 3.832 3.832 0 0 1-.904 2.18 3.832 3.832 0 0 0 0 4.972c.523.613.84 1.376.904 2.18a3.832 3.832 0 0 0 3.515 3.515c.804.064 1.567.38 2.18.904a3.832 3.832 0 0 0 4.972 0 3.832 3.832 0 0 1 2.18-.904 3.832 3.832 0 0 0 3.515-3.515c.064-.804.38-1.567.904-2.18a3.832 3.832 0 0 0 0-4.972 3.832 3.832 0 0 1-.904-2.18 3.832 3.832 0 0 0-3.515-3.515 3.832 3.832 0 0 1-2.18-.904 3.832 3.832 0 0 0-4.972 0Z"
      opacity={0.12}
    />
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m9 12 2 2 4.5-4.5M7.334 3.819a3.832 3.832 0 0 0 2.18-.904 3.832 3.832 0 0 1 4.972 0c.613.523 1.376.84 2.18.904a3.832 3.832 0 0 1 3.515 3.515c.064.804.38 1.567.904 2.18a3.832 3.832 0 0 1 0 4.972 3.832 3.832 0 0 0-.904 2.18 3.832 3.832 0 0 1-3.515 3.515 3.832 3.832 0 0 0-2.18.904 3.832 3.832 0 0 1-4.972 0 3.832 3.832 0 0 0-2.18-.904 3.832 3.832 0 0 1-3.515-3.515 3.832 3.832 0 0 0-.904-2.18 3.832 3.832 0 0 1 0-4.972c.523-.613.84-1.376.904-2.18a3.832 3.832 0 0 1 3.515-3.515Z"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgCheckVerified01);
export default ForwardRef;
