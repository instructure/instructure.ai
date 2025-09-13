import { InlineSVG, type InlineSVGProps } from "@instructure/ui";
import type { FC, ReactNode } from "react";
import { useId } from "react";
import { colors } from "./";

interface SVGInfo {
	color: string;
	SVG: ReactNode;
	title: string;
	viewBox: string;
}

export type SVGWrapperProps = Omit<
	InlineSVGProps,
	"children" | "viewBox" | "title" | "color"
> & {
	children?: ReactNode;
	viewBox?: string;
	title?: string;
	color?: string;
};

const SVGWrapper: FC<SVGWrapperProps> = ({
	title,
	children,
	viewBox,
	height,
	width,
	color,
	...rest
}) => (
	<InlineSVG
		height={height}
		title={title}
		viewBox={viewBox}
		width={width}
		{...rest}
	>
		{color ? <g fill={color}>{children}</g> : children}
	</InlineSVG>
);

const MasteryLogo: SVGInfo = {
	color: colors.mastery,
	SVG: (
		<>
			<path d="M8.51,24.3c-4.7,0-8.51,3.81-8.51,8.51h0c0,4.7,3.81,8.51,8.51,8.51s8.51-3.81,8.51-8.51h0c0-4.7-3.81-8.51-8.51-8.51Z" />
			<path d="M35.19,24.3c-1.03,0-2,.19-2.91.52l-5.25-9.57c2.03-1.56,3.34-3.99,3.34-6.75,0-4.7-3.81-8.51-8.51-8.51h0c-4.7,0-8.51,3.81-8.51,8.51s3.81,8.51,8.51,8.51h0c1.03,0,2-.19,2.91-.52l5.25,9.57c-2.03,1.56-3.34,3.99-3.34,6.75h0c0,4.7,3.81,8.51,8.51,8.51s8.51-3.81,8.51-8.51h0c0-4.7-3.81-8.51-8.51-8.51Z" />
			<path d="M61.87,24.3h0c-1.03,0-2,.19-2.92.52l-5.25-9.57c2.03-1.56,3.34-3.99,3.34-6.75,0-4.7-3.81-8.51-8.51-8.51s-8.51,3.81-8.51,8.51,3.81,8.51,8.51,8.51c1.03,0,2-.19,2.91-.52l5.25,9.57c-2.03,1.56-3.34,3.99-3.34,6.75h0c0,4.7,3.81,8.51,8.51,8.51h0c4.7,0,8.51-3.81,8.51-8.51h0c0-4.7-3.81-8.51-8.51-8.51Z" />
		</>
	),
	title: "Mastery",
	viewBox: "0 0 70.82 53.92",
};

const MasteryBug: FC<SVGWrapperProps> = ({
	title = MasteryLogo.title,
	viewBox = MasteryLogo.viewBox,
	color,
}) => (
	<SVGWrapper color={color} title={title} viewBox={viewBox}>
		{MasteryLogo.SVG}
	</SVGWrapper>
);

const CanvasLogo: SVGInfo = {
	color: colors.canvas,
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
	title: "Canvas",
	viewBox: "0 0 59.68 59.68",
};

const CanvasBug: FC<SVGWrapperProps> = ({
	title = CanvasLogo.title,
	viewBox = CanvasLogo.viewBox,
	color,
}) => (
	<SVGWrapper color={color} title={title} viewBox={viewBox}>
		{CanvasLogo.SVG}
	</SVGWrapper>
);

const ParchmentLogo: SVGInfo = {
	color: colors.parchment,
	SVG: (
		<>
			<path d="M63.35,43.25c0,2.06-1.67,3.74-3.74,3.74H10.67c-2.06,0-3.74-1.67-3.74-3.74V11.21c0-2.06,1.67-3.74,3.74-3.74h35.72V.54H9.25C4.14.54,0,4.68,0,9.78v34.89c0,5.11,4.14,9.25,9.25,9.25h51.8c5.11,0,9.25-4.14,9.25-9.25v-20.24h-6.93v18.81Z" />
			<path d="M66.82,8.01c2.21,0,4-1.79,4-4s-1.79-4-4-4-4,1.79-4,4,1.79,4,4,4Z" />
			<path d="M55.04,8.01c2.21,0,4-1.79,4-4s-1.79-4-4-4-4,1.79-4,4,1.79,4,4,4Z" />
			<path d="M66.82,11.79c-2.21,0-4,1.79-4,4s1.79,4,4,4,4-1.79,4-4-1.79-4-4-4Z" />
			<circle cx="20.88" cy="33.09" r="8.29" />
		</>
	),
	title: "Parchment",
	viewBox: "0 0 70.82 53.92",
};

const ParchmentBug: FC<SVGWrapperProps> = ({
	title = ParchmentLogo.title,
	viewBox = ParchmentLogo.viewBox,
	color,
}) => (
	<SVGWrapper color={color} title={title} viewBox={viewBox}>
		{ParchmentLogo.SVG}
	</SVGWrapper>
);

const StudioLogo: SVGInfo = {
	color: colors.canvas,
	SVG: (
		<>
			<polygon points="59.8 21.81 59.8 45.28 80.11 33.55 59.8 21.81" />
			<path d="M123.57,80.37c-5.9,0-10.83,4.18-12.01,9.73h-3.73c-.68,0-1.23-.55-1.23-1.23v-10.74h5.7c4.61,0,8.36-3.75,8.36-8.36V8.36c0-4.61-3.75-8.36-8.36-8.36H23.12c-4.61,0-8.36,3.75-8.36,8.36v61.42c0,4.61,3.75,8.36,8.36,8.36h5.05v9.56c0,.68-.55,1.23-1.23,1.23h-3.02c-1.59-4.95-6.17-8.56-11.64-8.56-6.77,0-12.28,5.5-12.28,12.27s5.51,12.28,12.28,12.28c5.67,0,10.41-3.88,11.81-9.12h2.85c4.47,0,8.11-3.64,8.11-8.11v-9.56h14.73v16.27c-5.71,1.05-10.07,6.04-10.07,12.05,0,6.77,5.51,12.28,12.28,12.28s12.28-5.51,12.28-12.28c0-5.12-3.15-9.5-7.61-11.34v-16.98h21.46v16.76c-4.82,1.66-8.32,6.18-8.32,11.56,0,6.77,5.51,12.28,12.28,12.28s12.28-5.51,12.28-12.28c0-5.76-4-10.57-9.36-11.88v-16.43h14.73v10.74c0,4.47,3.64,8.11,8.11,8.11h4.29c1.76,4.63,6.21,7.94,11.45,7.94,6.77,0,12.28-5.51,12.28-12.28s-5.51-12.27-12.28-12.27ZM12.28,98.04c-2.98,0-5.4-2.42-5.4-5.4s2.42-5.4,5.4-5.4,5.4,2.42,5.4,5.4-2.42,5.4-5.4,5.4ZM51.99,111.85c-2.98,0-5.4-2.42-5.4-5.4s2.42-5.4,5.4-5.4,5.4,2.42,5.4,5.4-2.42,5.4-5.4,5.4ZM87.48,106.45c0,2.98-2.42,5.4-5.4,5.4s-5.4-2.42-5.4-5.4,2.42-5.4,5.4-5.4,5.4,2.42,5.4,5.4ZM23.12,6.88h89.19c.82,0,1.48.66,1.48,1.48v49.64H21.64V8.36c0-.82.66-1.48,1.48-1.48ZM21.64,69.77v-4.9h92.14v4.9c0,.82-.66,1.48-1.48,1.48H23.12c-.82,0-1.48-.66-1.48-1.48ZM123.57,98.04c-2.98,0-5.4-2.42-5.4-5.4s2.42-5.4,5.4-5.4,5.4,2.42,5.4,5.4-2.42,5.4-5.4,5.4Z" />
		</>
	),
	title: "Studio",
	viewBox: "0 0 135.85 118.73",
};
const StudioBug: FC<SVGWrapperProps> = ({
	title = StudioLogo.title,
	viewBox = StudioLogo.viewBox,
	color,
}) => (
	<SVGWrapper color={color} title={title} viewBox={viewBox}>
		{StudioLogo.SVG}
	</SVGWrapper>
);

const IgniteLogo: SVGInfo = {
	color: colors.igniteai,
	SVG: (
		<g clipRule="evenodd" fillRule="evenodd" stroke="none" strokeWidth="1">
			<path d="M960 0L1219.29 700.713L1920 960L1219.29 1219.29L960 1920L700.713 1219.29L0 960L700.713 700.713L960 0Z" />
			<path d="M1600 0L1686.43 233.571L1920 320L1686.43 406.429L1600 640L1513.57 406.429L1280 320L1513.57 233.571L1600 0Z" />
		</g>
	),
	title: "IgniteAI",
	viewBox: "0 0 1920 1920",
};

const IgniteBug: FC<SVGWrapperProps> = ({
	title = IgniteLogo.title,
	viewBox = IgniteLogo.viewBox,
	color,
}) => {
	const uniqueId = useId();

	const paint0Id = `paint0_linear_${uniqueId}`;
	const paint1Id = `paint1_linear_${uniqueId}`;
	const clip0Id = `clip0_${uniqueId}`;

	return (
		<SVGWrapper title={title} viewBox={viewBox}>
			{color ? (
				<>
					<g clipPath={`url(#${clip0Id})`}>
						<path
							d="M960 0L1219.29 700.713L1920 960L1219.29 1219.29L960 1920L700.713 1219.29L0 960L700.713 700.713L960 0Z"
							fill={`url(#${paint0Id})`}
						/>
						<path
							d="M1600 0L1686.43 233.571L1920 320L1686.43 406.429L1600 640L1513.57 406.429L1280 320L1513.57 233.571L1600 0Z"
							fill={`url(#${paint1Id})`}
						/>
					</g>
					<defs>
						<clipPath id={clip0Id}>
							<rect fill="#fff" height="1920" width="1920" />
						</clipPath>
						<linearGradient
							gradientUnits="userSpaceOnUse"
							id={paint0Id}
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
							id={paint1Id}
							x1="1121.25"
							x2="1277.46"
							y1="-130.909"
							y2="1026.08"
						>
							<stop stopColor="#9E58BD" />
							<stop offset="1" stopColor="#00828E" />
						</linearGradient>
					</defs>
				</>
			) : (
				IgniteLogo.SVG
			)}
		</SVGWrapper>
	);
};

const InstructureLogo: SVGInfo = {
	color: colors.instructure,
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
	title: "Instructure",
	viewBox: "0 0 53.42 53.42",
};

const InstructureBug: FC<SVGWrapperProps> = ({
	title = InstructureLogo.title,
	viewBox = InstructureLogo.viewBox,
	color,
}) => (
	<SVGWrapper title={title} viewBox={viewBox}>
		{color ? (
			<>
				<rect
					fill="#fff"
					height="53.42"
					stroke={InstructureLogo.color}
					strokeWidth="5"
					width="53.42"
				/>
				<path
					d="M30.24,37.26h0c0-2.05,1.66-3.71,3.71-3.71s3.71,1.66,3.71,3.71-1.66,3.71-3.71,3.71-3.71-1.66-3.71-3.71"
					fill={CanvasLogo.color}
				/>
				<rect
					fill={InstructureLogo.color}
					height="28.52"
					width="6.18"
					x="19.28"
					y="12.45"
				/>
			</>
		) : (
			InstructureLogo.SVG
		)}
	</SVGWrapper>
);

export {
	CanvasBug,
	IgniteBug,
	InstructureBug,
	MasteryBug,
	StudioBug,
	ParchmentBug,
};
