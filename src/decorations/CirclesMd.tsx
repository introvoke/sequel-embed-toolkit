import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgCirclesMd = (
  props: SVGProps<SVGSVGElement>,
  ref: Ref<SVGSVGElement>
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={480}
    height={480}
    fill="none"
    viewBox="0 0 480 480"
    ref={ref}
    {...props}
  >
    <mask
      id="b"
      width={480}
      height={480}
      x={0}
      y={0}
      maskUnits="userSpaceOnUse"
      style={{
        maskType: "alpha",
      }}
    >
      <path fill="url(#a)" d="M0 0h480v480H0z" />
    </mask>
    <g stroke="#EDEEF1" mask="url(#b)">
      <circle cx={240} cy={240} r={47.5} />
      <circle cx={240} cy={240} r={79.5} />
      <circle cx={240} cy={240} r={111.5} />
      <circle cx={240} cy={240} r={143.5} />
      <circle cx={240} cy={240} r={143.5} />
      <circle cx={240} cy={240} r={175.5} />
      <circle cx={240} cy={240} r={207.5} />
      <circle cx={240} cy={240} r={239.5} />
    </g>
    <defs>
      <radialGradient
        id="a"
        cx={0}
        cy={0}
        r={1}
        gradientTransform="rotate(90 0 240) scale(240)"
        gradientUnits="userSpaceOnUse"
      >
        <stop />
        <stop offset={1} stopOpacity={0} />
      </radialGradient>
    </defs>
  </svg>
);
const ForwardRef = forwardRef(SvgCirclesMd);
export default ForwardRef;
