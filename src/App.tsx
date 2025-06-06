import InstructureBug from "./assets/instructureBug.svg";
import "./App.css";

function App() {
	return (
		<>
			<div>
				<a href="https://www.instructure.com">
					<img src={InstructureBug} className="logo" alt="Instructure logo" />
				</a>
			</div>
		</>
	);
}

export default App;
