import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const CheckPurpleZoomInfo = (
  props: SVGProps<SVGSVGElement>,
  ref: Ref<SVGSVGElement>
) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 14 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    ref={ref}
    {...props}
  >
    <path
      d="M13.6957 0.304212C14.1014 0.678627 14.1014 1.33385 13.6957 1.70827L5.70457 9.69579C5.32999 10.1014 4.67447 10.1014 4.29989 9.69579L0.304348 5.70203C-0.101449 5.32761 -0.101449 4.67239 0.304348 4.29797C0.67893 3.89236 1.33445 3.89236 1.70903 4.29797L5.01784 7.5741L12.291 0.304212C12.6656 -0.101404 13.3211 -0.101404 13.6957 0.304212Z"
      fill="#390577"
    />
  </svg>
);
const ForwardRef = forwardRef(CheckPurpleZoomInfo);
export default ForwardRef;
