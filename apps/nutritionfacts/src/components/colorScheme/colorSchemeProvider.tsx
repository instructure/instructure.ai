import { InstUISettingsProvider, dark, light } from "@instructure/ui/latest";
import { createContext, useContext, type FC, type ReactNode } from "react";
import { useColorScheme, type UseColorSchemeResult } from "./useColorScheme";
import { type ColorScheme } from "./colorScheme";

const ColorSchemeContext = createContext<UseColorSchemeResult | undefined>(undefined);

const ColorSchemeProvider: FC<{ children: ReactNode; forced?: ColorScheme }> = ({
	children,
	forced,
}) => {
	const value = useColorScheme({ forced });

	return (
		<ColorSchemeContext.Provider value={value}>
			<InstUISettingsProvider theme={value.resolved === "dark" ? dark : light}>
				{children}
			</InstUISettingsProvider>
		</ColorSchemeContext.Provider>
	);
};

const useColorSchemeContext = (): UseColorSchemeResult => {
	const context = useContext(ColorSchemeContext);
	if (!context) {
		throw new Error("useColorSchemeContext must be used within a ColorSchemeProvider");
	}
	return context;
};

export { ColorSchemeProvider, useColorSchemeContext };
