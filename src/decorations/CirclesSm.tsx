import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgCirclesSm = (
  props: SVGProps<SVGSVGElement>,
  ref: Ref<SVGSVGElement>
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={336}
    height={336}
    fill="none"
    viewBox="0 0 336 336"
    ref={ref}
    {...props}
  >
    <circle cx={168} cy={168} r={47.5} stroke="#EDEEF1" opacity={0.65} />
    <circle cx={168} cy={168} r={71.5} stroke="#EDEEF1" opacity={0.55} />
    <circle cx={168} cy={168} r={95.5} stroke="#EDEEF1" opacity={0.45} />
    <circle cx={168} cy={168} r={119.5} stroke="#EDEEF1" opacity={0.35} />
    <circle cx={168} cy={168} r={143.5} stroke="#EDEEF1" opacity={0.15} />
    <circle cx={168} cy={168} r={167.5} stroke="#EDEEF1" opacity={0.05} />
  </svg>
);
const ForwardRef = forwardRef(SvgCirclesSm);
export default ForwardRef;
