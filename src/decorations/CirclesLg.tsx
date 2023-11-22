import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgCirclesLg = (
  props: SVGProps<SVGSVGElement>,
  ref: Ref<SVGSVGElement>
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={768}
    height={768}
    fill="none"
    viewBox="0 0 768 768"
    ref={ref}
    {...props}
  >
    <mask
      id="b"
      width={768}
      height={768}
      x={0}
      y={0}
      maskUnits="userSpaceOnUse"
      style={{
        maskType: "alpha",
      }}
    >
      <path fill="url(#a)" d="M0 0h768v768H0z" />
    </mask>
    <g stroke="#EDEEF1" mask="url(#b)">
      <circle cx={384} cy={384} r={47.5} />
      <circle cx={384} cy={384} r={95.5} />
      <circle cx={384} cy={384} r={143.5} />
      <circle cx={384} cy={384} r={191.5} />
      <circle cx={384} cy={384} r={239.5} />
      <circle cx={384} cy={384} r={287.5} />
      <circle cx={384} cy={384} r={335.5} />
      <circle cx={384} cy={384} r={383.5} />
    </g>
    <defs>
      <radialGradient
        id="a"
        cx={0}
        cy={0}
        r={1}
        gradientTransform="rotate(90 0 384) scale(384)"
        gradientUnits="userSpaceOnUse"
      >
        <stop />
        <stop offset={1} stopOpacity={0} />
      </radialGradient>
    </defs>
  </svg>
);
const ForwardRef = forwardRef(SvgCirclesLg);
export default ForwardRef;
