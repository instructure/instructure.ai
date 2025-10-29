import { InlineSVG } from "@instructure/ui";
import type { FC, ReactNode } from "react";
import { darken, lighten } from "@instructure/ui-color-utils"

type ColorSVGProps = {
	color?: string;
	children: ReactNode;
	title: string;
	viewBox: string;
	width?: string;
	height?: string;
	inline?: boolean;
};

interface SVGInfo {
	color: string;
	SVG: ReactNode;
	title: string;
	viewBox: string;
}

interface SVGProps {
	height?: string;
	width?: string;
	inline?: boolean;
	color?: string;
}


const ColorSVG: FC<ColorSVGProps> = ({
	color = "currentColor",
	children,
	title,
	viewBox,
	width = "auto",
	height = "1rem",
	inline = false,
}) => (
		<InlineSVG
			height={height}
			inline={inline}
			title={title}
			viewBox={viewBox}
			width={width}
			style={{ verticalAlign: "top" }}
		>
			<g fill={color}>{children}</g>
		</InlineSVG>
);

const Mastery: SVGInfo = {
	color: "#088744",
	SVG: (
		<>
			<path d="M8.51,24.3c-4.7,0-8.51,3.81-8.51,8.51h0c0,4.7,3.81,8.51,8.51,8.51s8.51-3.81,8.51-8.51h0c0-4.7-3.81-8.51-8.51-8.51Z" />
			<path d="M35.19,24.3c-1.03,0-2,.19-2.91.52l-5.25-9.57c2.03-1.56,3.34-3.99,3.34-6.75,0-4.7-3.81-8.51-8.51-8.51h0c-4.7,0-8.51,3.81-8.51,8.51s3.81,8.51,8.51,8.51h0c1.03,0,2-.19,2.91-.52l5.25,9.57c-2.03,1.56-3.34,3.99-3.34,6.75h0c0,4.7,3.81,8.51,8.51,8.51s8.51-3.81,8.51-8.51h0c0-4.7-3.81-8.51-8.51-8.51Z" />
			<path d="M61.87,24.3h0c-1.03,0-2,.19-2.92.52l-5.25-9.57c2.03-1.56,3.34-3.99,3.34-6.75,0-4.7-3.81-8.51-8.51-8.51s-8.51,3.81-8.51,8.51,3.81,8.51,8.51,8.51c1.03,0,2-.19,2.91-.52l5.25,9.57c-2.03,1.56-3.34,3.99-3.34,6.75h0c0,4.7,3.81,8.51,8.51,8.51h0c4.7,0,8.51-3.81,8.51-8.51h0c0-4.7-3.81-8.51-8.51-8.51Z" />
		</>
	),
	title: "Mastery Logo",
	viewBox: "0 0 70.82 53.92",
};

const Canvas: SVGInfo = {
	color: "#e41e25",
	SVG: (
		<>
			<path d="M8.66,29.79c0-4.36-3.25-8.03-7.57-8.56-1.45,5.61-1.45,11.5,0,17.12,4.32-.53,7.57-4.2,7.57-8.56" />
			<path d="M13.67,27.08c-1.5,0-2.71,1.21-2.71,2.71s1.21,2.71,2.71,2.71,2.71-1.21,2.71-2.71h0c0-1.5-1.21-2.71-2.71-2.71h0" />
			<path d="M51.03,29.79c0,4.36,3.25,8.03,7.57,8.56,1.45-5.61,1.45-11.5,0-17.12-4.32.53-7.57,4.21-7.57,8.56" />
			<path d="M45.99,27.08c-1.5,0-2.71,1.21-2.71,2.7,0,1.5,1.21,2.71,2.7,2.71,1.5,0,2.71-1.21,2.71-2.7,0,0,0,0,0,0,0-1.49-1.21-2.71-2.7-2.71" />
			<path d="M29.78,51.05c-4.35,0-8.02,3.25-8.56,7.57,5.61,1.45,11.5,1.45,17.12,0-.53-4.32-4.21-7.57-8.56-7.57" />
			<path d="M29.79,43.32c-1.5,0-2.71,1.21-2.71,2.7,0,1.5,1.21,2.71,2.7,2.71,1.5,0,2.71-1.21,2.71-2.7,0,0,0,0,0,0,0-1.49-1.21-2.71-2.7-2.71" />
			<path d="M29.79,8.65c4.35,0,8.02-3.25,8.56-7.57-5.61-1.45-11.5-1.45-17.12,0,.54,4.32,4.21,7.57,8.56,7.57" />
			<path d="M29.79,10.97c-1.5,0-2.71,1.21-2.71,2.7,0,1.5,1.21,2.71,2.7,2.71s2.71-1.21,2.71-2.7c0,0,0,0,0,0,0-1.49-1.21-2.7-2.7-2.7h0" />
			<path d="M44.79,44.79c-3.07,3.08-3.37,7.97-.7,11.4,4.99-2.95,9.16-7.11,12.1-12.1-3.43-2.67-8.32-2.37-11.4.7" />
			<path d="M39.33,39.33c-1.06,1.06-1.06,2.77,0,3.83,1.06,1.06,2.77,1.06,3.83,0,1.06-1.06,1.06-2.77,0-3.83h0c-1.06-1.05-2.77-1.05-3.83,0" />
			<path d="M14.83,14.83c3.08-3.08,3.38-7.96.7-11.4-4.99,2.94-9.16,7.11-12.1,12.1,3.43,2.68,8.32,2.37,11.4-.7" />
			<path d="M16.46,16.46c-1.06,1.06-1.06,2.77,0,3.83,1.06,1.06,2.77,1.06,3.83,0,1.06-1.06,1.06-2.77,0-3.83h0c-1.06-1.05-2.77-1.05-3.83,0" />
			<path d="M44.77,14.8c3.08,3.07,7.97,3.37,11.4.69-2.95-4.99-7.11-9.15-12.1-12.09-2.67,3.43-2.37,8.32.7,11.4" />
			<path d="M43.14,20.26c1.06-1.06,1.05-2.77,0-3.82-1.06-1.06-2.77-1.05-3.82,0-1.05,1.06-1.05,2.77,0,3.82,1.06,1.06,2.77,1.06,3.82,0,0,0,0,0,0,0" />
			<path d="M14.81,44.76c-3.08-3.07-7.96-3.37-11.4-.7,2.94,4.99,7.11,9.16,12.1,12.1,2.67-3.43,2.37-8.32-.7-11.4" />
			<path d="M16.43,39.3c-1.06,1.06-1.06,2.77,0,3.83,1.06,1.06,2.77,1.06,3.83,0,1.06-1.06,1.06-2.77,0-3.83h0c-1.06-1.05-2.77-1.05-3.83,0" />
		</>
	),
	title: "Canvas Logo",
	viewBox: "0 0 59.68 59.68",
};

const Instructure: SVGInfo = {
	color: "#0f1923",
	SVG: (
		<>
			<rect
				fill="none"
				height="53.42"
				stroke="currentColor"
				strokeWidth="5"
				width="53.42"
			/>
			<path d="M30.24,37.26h0c0-2.05,1.66-3.71,3.71-3.71s3.71,1.66,3.71,3.71-1.66,3.71-3.71,3.71-3.71-1.66-3.71-3.71" />
			<rect height="28.52" width="6.18" x="19.28" y="12.45" />
		</>
	),
	title: "Instructure Logo",
	viewBox: "0 0 53.42 53.42",
};

const Ignite: SVGInfo = {
	color: "#9e57bc",
	SVG: (
		<g clipRule="evenodd" fillRule="evenodd" stroke="none" strokeWidth="1">
			<path d="M960 0L1219.29 700.713L1920 960L1219.29 1219.29L960 1920L700.713 1219.29L0 960L700.713 700.713L960 0Z" />
			<path d="M1600 0L1686.43 233.571L1920 320L1686.43 406.429L1600 640L1513.57 406.429L1280 320L1513.57 233.571L1600 0Z" />
		</g>
	),
	title: "Ignite AI",
	viewBox: "0 0 1920 1920",
};

const Parchment: SVGInfo = {
	color: "#2c7bb9",
	SVG: (
		<>
			<path d="M63.35,43.25c0,2.06-1.67,3.74-3.74,3.74H10.67c-2.06,0-3.74-1.67-3.74-3.74V11.21c0-2.06,1.67-3.74,3.74-3.74h35.72V.54H9.25C4.14.54,0,4.68,0,9.78v34.89c0,5.11,4.14,9.25,9.25,9.25h51.8c5.11,0,9.25-4.14,9.25-9.25v-20.24h-6.93v18.81Z" />
			<path d="M66.82,8.01c2.21,0,4-1.79,4-4s-1.79-4-4-4-4,1.79-4,4,1.79,4,4,4Z" />
			<path d="M55.04,8.01c2.21,0,4-1.79,4-4s-1.79-4-4-4-4,1.79-4,4,1.79,4,4,4Z" />
			<path d="M66.82,11.79c-2.21,0-4,1.79-4,4s1.79,4,4,4,4-1.79,4-4-1.79-4-4-4Z" />
			<circle cx="20.88" cy="33.09" r="8.29" />
		</>
	),
	title: "Parchment Logo",
	viewBox: "0 0 70.82 53.92",
};


const ParchmentBug: FC<SVGProps> = ({
	height = "1rem",
	width = "auto",
	inline = false,
	color = Parchment.color,
}) => (
	<ColorSVG
		color={color}
		height={height}
		inline={inline}
		title={Parchment.title}
		viewBox={Parchment.viewBox}
		width={width}
	>
		{Parchment.SVG}
	</ColorSVG>
);

const InstructureBug: FC<SVGProps> = ({
	height = "1rem",
	width = "auto",
	inline = false,
}) => (
		<InlineSVG
			height={height}
			inline={inline}
			title={Instructure.title}
			viewBox={Instructure.viewBox}
			width={width}
			style={{ verticalAlign: "text-bottom" }}
		>
			<rect fill="none" stroke="#fff" strokeWidth="3" height="53.42" width="53.42" />
			<path
				d="M30.24,37.26h0c0-2.05,1.66-3.71,3.71-3.71s3.71,1.66,3.71,3.71-1.66,3.71-3.71,3.71-3.71-1.66-3.71-3.71"
				fill={Canvas.color}
			/>
			<rect height="28.52" fill="#fff" width="6.18" x="19.28" y="12.45" />
		</InlineSVG>
);

const MasteryBug: FC<SVGProps> = ({
	height = "1rem",
	width = "auto",
	inline = false,
	color = Mastery.color,
}) => (
	<ColorSVG
		color={color}
		height={height}
		inline={inline}
		title={Mastery.title}
		viewBox={Mastery.viewBox}
		width={width}
	>
		{Mastery.SVG}
	</ColorSVG>
);

const CanvasBug: FC<SVGProps> = ({
	height = "1rem",
	width = "auto",
	inline = false,
	color = Canvas.color,
}) => (
	<ColorSVG
		color={color}
		height={height}
		inline={inline}
		title={Canvas.title}
		viewBox={Canvas.viewBox}
		width={width}
	>
		{Canvas.SVG}
	</ColorSVG>
);

const IgniteBug: FC<SVGProps> = ({
	height = "1rem",
	width = "auto",
	inline = false,
	color = undefined
}) => (
	<ColorSVG
		height={height}
		inline={inline}
		title={Ignite.title}
		viewBox={Ignite.viewBox}
		width={width}
	>
		{color ? <g fill={color}>{Ignite.SVG}</g> :<>
		<g clipPath="url(#clip0_11521_4097)">
			<path
				d="M960 0L1219.29 700.713L1920 960L1219.29 1219.29L960 1920L700.713 1219.29L0 960L700.713 700.713L960 0Z"
				fill="url(#paint0_linear_11521_4097)"
			/>
			<path
				d="M1600 0L1686.43 233.571L1920 320L1686.43 406.429L1600 640L1513.57 406.429L1280 320L1513.57 233.571L1600 0Z"
				fill="url(#paint1_linear_11521_4097)"
			/>
		</g>
		<defs>
			<linearGradient
				gradientUnits="userSpaceOnUse"
				id="paint0_linear_11521_4097"
				x1="-476.25"
				x2="-7.61685"
				y1="-392.727"
				y2="3078.25"
			>
				<stop stopColor="#9E58BD" />
				<stop offset="1" stopColor="#00828E" />
			</linearGradient>
			<linearGradient
				gradientUnits="userSpaceOnUse"
				id="paint1_linear_11521_4097"
				x1="1121.25"
				x2="1277.46"
				y1="-130.909"
				y2="1026.08"
			>
				<stop stopColor="#9E58BD" />
				<stop offset="1" stopColor="#00828E" />
			</linearGradient>
			<clipPath id="clip0_11521_4097">
				<rect fill="#fff" height="1920" width="1920" />
			</clipPath>
		</defs></>}
	</ColorSVG>
);

const CardBackground: FC<SVGProps> = ({
	height = "160px",
	width = "374px",
	inline = false,
	color = Instructure?.color
}) => {
	const circle1 = lighten(color, 15);
	const circle2 = color;
	const circle3 = darken(color, 10);
	const bg = darken(color, 20);
	console.debug("color:", color)
	return(
	<ColorSVG
		height={height}
		inline={inline}
		title="Card Background"
		viewBox="0 0 374 160"
		width={width}
	>
		<rect
			fill={bg}
			height="160"
			width="374"
		/>
			<circle cx="374" cy="160" r="200" fill={circle3} />	
			<circle cx="374" cy="160" r="140" fill={circle2} />	
			<circle cx="374" cy="160" r="80" fill={circle1} />
	</ColorSVG>
)};

const Logos = {
	canvas: CanvasBug,
	ignite: IgniteBug,
	instructure: InstructureBug,
	mastery: MasteryBug,
	parchment: ParchmentBug,
	studio: CanvasBug,
	CardBackground: CardBackground,
};

const Colors = {
	canvas: Canvas.color,
	ignite: Ignite.color,
	instructure: Instructure.color,
	mastery: Mastery.color,
	studio: Canvas.color,
	parchment: Parchment.color,
}

export default Logos;
export { Logos, Colors };
