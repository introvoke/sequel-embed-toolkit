import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgSignal01 = (
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
      d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
      opacity={0.12}
    />
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M16.243 7.757a6 6 0 0 1 0 8.486m-8.486 0a6 6 0 0 1 0-8.486M4.93 19.071c-3.905-3.905-3.905-10.237 0-14.142m14.142 0c3.905 3.905 3.905 10.237 0 14.142M14 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgSignal01);
export default ForwardRef;
