import { ProgressCircle, Text } from "@instructure/ui";

type SignupProgressProps = {
	status?: number | string;
};

const SignupProgress = ({ status }: SignupProgressProps) => {
	const currentPercent = Number(status) || 0;

	return (
		<ProgressCircle
			formatScreenReaderValue={({ valueNow }) => `${valueNow} percent`}
			id="formProgress"
			renderValue={({ valueNow }) => (
				<span>
					<Text color="primary" size="small">
						{typeof valueNow === "number" ? valueNow : ""}
					</Text>
					<Text color="secondary" size="x-small">
						%
					</Text>
				</span>
			)}
			screenReaderLabel="Percent complete"
			shouldAnimateOnMount={true}
			size="small"
			valueMax={100}
			valueNow={currentPercent}
		/>
	);
};

export default SignupProgress;
