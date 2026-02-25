import {
  ClassType,
  ClassicComponent,
  ClassicComponentClass,
  ComponentClass,
  ComponentState,
  ReactNode,
} from "react";

//#region ../../node_modules/.pnpm/@instructure+shared-types@11.6.0_react@19.2.3/node_modules/@instructure/shared-types/types/Colors.d.ts
type Primitives = {
  white: string;
  white10op75: string;
  grey11: string;
  grey12: string;
  grey14: string;
  grey24: string;
  grey30: string;
  grey45: string;
  grey57: string;
  grey70: string;
  grey82: string;
  grey100: string;
  grey100op75: string;
  grey125: string;
  blue12: string;
  blue45: string;
  blue57: string;
  blue70: string;
  blue82: string;
  green12: string;
  green45: string;
  green57: string;
  green70: string;
  green82: string;
  orange12: string;
  orange30: string;
  orange45: string;
  orange57: string;
  orange70: string;
  orange82: string;
  red12: string;
  red45: string;
  red57: string;
  red70: string;
  red82: string;
  sea12: string;
  sea30: string;
  sea45: string;
  sea70: string;
  sea110: string;
  sea35: string;
  sea40: string;
  sea50: string;
  sea57: string;
  sea90: string;
  violet12: string;
  violet30: string;
  violet45: string;
  violet70: string;
  violet110: string;
  violet35: string;
  violet40: string;
  violet50: string;
  violet57: string;
  violet90: string;
};
type AdditionalPrimitives = {
  rose12: string;
  rose30: string;
  rose45: string;
  rose70: string;
  rose110: string;
  rose35: string;
  rose40: string;
  rose50: string;
  rose57: string;
  rose90: string;
  copper12: string;
  copper30: string;
  copper45: string;
  copper70: string;
  copper110: string;
  copper35: string;
  copper40: string;
  copper50: string;
  copper57: string;
  copper90: string;
  honey12: string;
  honey30: string;
  honey45: string;
  honey70: string;
  honey110: string;
  honey35: string;
  honey40: string;
  honey50: string;
  honey57: string;
  honey90: string;
  forest12: string;
  forest30: string;
  forest45: string;
  forest70: string;
  forest110: string;
  forest35: string;
  forest40: string;
  forest50: string;
  forest57: string;
  forest90: string;
  aurora12: string;
  aurora30: string;
  aurora45: string;
  aurora70: string;
  aurora110: string;
  aurora35: string;
  aurora40: string;
  aurora50: string;
  aurora57: string;
  aurora90: string;
  sea12: string;
  sea30: string;
  sea45: string;
  sea70: string;
  sea110: string;
  sea35: string;
  sea40: string;
  sea50: string;
  sea57: string;
  sea90: string;
  sky12: string;
  sky30: string;
  sky45: string;
  sky70: string;
  sky110: string;
  sky35: string;
  sky40: string;
  sky50: string;
  sky57: string;
  sky90: string;
  ocean12: string;
  ocean30: string;
  ocean45: string;
  ocean70: string;
  ocean110: string;
  ocean35: string;
  ocean40: string;
  ocean50: string;
  ocean57: string;
  ocean90: string;
  violet12: string;
  violet30: string;
  violet45: string;
  violet70: string;
  violet110: string;
  violet35: string;
  violet40: string;
  violet50: string;
  violet57: string;
  violet90: string;
  plum12: string;
  plum30: string;
  plum45: string;
  plum70: string;
  plum110: string;
  plum35: string;
  plum40: string;
  plum50: string;
  plum57: string;
  plum90: string;
  stone12: string;
  stone30: string;
  stone45: string;
  stone70: string;
  stone110: string;
  stone35: string;
  stone40: string;
  stone50: string;
  stone57: string;
  stone90: string;
};
type Contrasts = {
  white1010: Primitives["white"];
  white1010op75: Primitives["white10op75"];
  grey1111: Primitives["grey11"];
  grey1214: Primitives["grey12"] | Primitives["grey14"];
  grey1424: Primitives["grey14"] | Primitives["grey24"];
  grey2424: Primitives["grey24"];
  grey3045: Primitives["grey30"] | Primitives["grey45"];
  grey4570: Primitives["grey45"] | Primitives["grey70"];
  grey5782: Primitives["grey57"] | Primitives["grey82"];
  grey100100: Primitives["grey100"];
  grey100100op75: Primitives["grey100op75"];
  grey125125: Primitives["grey125"];
  blue1212: Primitives["blue12"];
  blue4570: Primitives["blue45"] | Primitives["blue70"];
  blue5782: Primitives["blue57"] | Primitives["blue82"];
  green1212: Primitives["green12"];
  green4570: Primitives["green45"] | Primitives["green70"];
  green5782: Primitives["green57"] | Primitives["green82"];
  orange1212: Primitives["orange12"];
  orange3045: Primitives["orange30"] | Primitives["orange45"];
  orange4570: Primitives["orange45"] | Primitives["orange70"];
  orange5782: Primitives["orange57"] | Primitives["orange82"];
  red1212: Primitives["red12"];
  red4570: Primitives["red45"] | Primitives["red70"];
  red5782: Primitives["red57"] | Primitives["red82"];
  violet1212: Primitives["violet12"];
  violet4570: Primitives["violet45"] | Primitives["violet70"];
  violet5790: Primitives["violet57"] | Primitives["violet90"];
  sea4570: Primitives["sea45"] | Primitives["sea70"];
  sea5790: Primitives["sea57"] | Primitives["sea90"];
};
type UI = {
  surfacePagePrimary: Contrasts["white1010"];
  surfacePageSecondary: Contrasts["grey1111"];
  surfaceCardPrimary: Contrasts["white1010"];
  surfaceCardSecondary: Contrasts["grey1111"];
  surfaceDark: Contrasts["grey100100"];
  textTitle: Contrasts["grey125125"];
  textDescription: Contrasts["grey125125"];
  textBody: Contrasts["grey125125"];
  textTimestamp: Contrasts["grey5782"];
  textAuthor: Contrasts["grey5782"];
  textDatapoint: Contrasts["grey5782"];
  textLink: Contrasts["blue5782"];
  textPlaceholder: Contrasts["grey2424"];
  textSuccess: Contrasts["green5782"];
  textWarning: Contrasts["orange5782"];
  textError: Contrasts["red5782"];
  lineStroke: Contrasts["grey1424"];
  lineDivider: Contrasts["grey1214"];
  surfaceOverlayGrey: Contrasts["grey100100op75"];
  surfaceOverlayWhite: Contrasts["white1010op75"];
  surfaceAttention: Contrasts["blue4570"];
  surfaceSuccess: Contrasts["green4570"];
  surfaceWarning: Contrasts["orange4570"];
  surfaceError: Contrasts["red4570"];
  surfaceDivider: Contrasts["grey1214"];
  textSurfaceColored: Contrasts["white1010"];
  iconDefault: Contrasts["grey125125"];
  iconSuccess: Contrasts["green4570"];
  iconWarning: Contrasts["orange4570"];
  iconError: Contrasts["red4570"];
  iconSurfaceColored: Contrasts["white1010"];
  lineConnector: Contrasts["grey1424"];
};
type DataVisualization = {
  rose12Primary: AdditionalPrimitives["rose12"];
  rose30Primary: AdditionalPrimitives["rose30"];
  rose45Primary: AdditionalPrimitives["rose45"];
  rose70Primary: AdditionalPrimitives["rose70"];
  rose110Primary: AdditionalPrimitives["rose110"];
  rose35Secondary: AdditionalPrimitives["rose35"];
  rose40Secondary: AdditionalPrimitives["rose40"];
  rose50Secondary: AdditionalPrimitives["rose50"];
  rose57Secondary: AdditionalPrimitives["rose57"];
  rose90Secondary: AdditionalPrimitives["rose90"];
  copper12Primary: AdditionalPrimitives["copper12"];
  copper30Primary: AdditionalPrimitives["copper30"];
  copper45Primary: AdditionalPrimitives["copper45"];
  copper70Primary: AdditionalPrimitives["copper70"];
  copper110Primary: AdditionalPrimitives["copper110"];
  copper35Secondary: AdditionalPrimitives["copper35"];
  copper40Secondary: AdditionalPrimitives["copper40"];
  copper50Secondary: AdditionalPrimitives["copper50"];
  copper57Secondary: AdditionalPrimitives["copper57"];
  copper90Secondary: AdditionalPrimitives["copper90"];
  honey12Primary: AdditionalPrimitives["honey12"];
  honey30Primary: AdditionalPrimitives["honey30"];
  honey45Primary: AdditionalPrimitives["honey45"];
  honey70Primary: AdditionalPrimitives["honey70"];
  honey110Primary: AdditionalPrimitives["honey110"];
  honey35Secondary: AdditionalPrimitives["honey35"];
  honey40Secondary: AdditionalPrimitives["honey40"];
  honey50Secondary: AdditionalPrimitives["honey50"];
  honey57Secondary: AdditionalPrimitives["honey57"];
  honey90Secondary: AdditionalPrimitives["honey90"];
  forest12Primary: AdditionalPrimitives["forest12"];
  forest30Primary: AdditionalPrimitives["forest30"];
  forest45Primary: AdditionalPrimitives["forest45"];
  forest70Primary: AdditionalPrimitives["forest70"];
  forest110Primary: AdditionalPrimitives["forest110"];
  forest35Secondary: AdditionalPrimitives["forest35"];
  forest40Secondary: AdditionalPrimitives["forest40"];
  forest50Secondary: AdditionalPrimitives["forest50"];
  forest57Secondary: AdditionalPrimitives["forest57"];
  forest90Secondary: AdditionalPrimitives["forest90"];
  aurora12Primary: AdditionalPrimitives["aurora12"];
  aurora30Primary: AdditionalPrimitives["aurora30"];
  aurora45Primary: AdditionalPrimitives["aurora45"];
  aurora70Primary: AdditionalPrimitives["aurora70"];
  aurora110Primary: AdditionalPrimitives["aurora110"];
  aurora35Secondary: AdditionalPrimitives["aurora35"];
  aurora40Secondary: AdditionalPrimitives["aurora40"];
  aurora50Secondary: AdditionalPrimitives["aurora50"];
  aurora57Secondary: AdditionalPrimitives["aurora57"];
  aurora90Secondary: AdditionalPrimitives["aurora90"];
  sea12Primary: AdditionalPrimitives["sea12"];
  sea30Primary: AdditionalPrimitives["sea30"];
  sea45Primary: AdditionalPrimitives["sea45"];
  sea70Primary: AdditionalPrimitives["sea70"];
  sea110Primary: AdditionalPrimitives["sea110"];
  sea35Secondary: AdditionalPrimitives["sea35"];
  sea40Secondary: AdditionalPrimitives["sea40"];
  sea50Secondary: AdditionalPrimitives["sea50"];
  sea57Secondary: AdditionalPrimitives["sea57"];
  sea90Secondary: AdditionalPrimitives["sea90"];
  sky12Primary: AdditionalPrimitives["sky12"];
  sky30Primary: AdditionalPrimitives["sky30"];
  sky45Primary: AdditionalPrimitives["sky45"];
  sky70Primary: AdditionalPrimitives["sky70"];
  sky110Primary: AdditionalPrimitives["sky110"];
  sky35Secondary: AdditionalPrimitives["sky35"];
  sky40Secondary: AdditionalPrimitives["sky40"];
  sky50Secondary: AdditionalPrimitives["sky50"];
  sky57Secondary: AdditionalPrimitives["sky57"];
  sky90Secondary: AdditionalPrimitives["sky90"];
  ocean12Primary: AdditionalPrimitives["ocean12"];
  ocean30Primary: AdditionalPrimitives["ocean30"];
  ocean45Primary: AdditionalPrimitives["ocean45"];
  ocean70Primary: AdditionalPrimitives["ocean70"];
  ocean110Primary: AdditionalPrimitives["ocean110"];
  ocean35Secondary: AdditionalPrimitives["ocean35"];
  ocean40Secondary: AdditionalPrimitives["ocean40"];
  ocean50Secondary: AdditionalPrimitives["ocean50"];
  ocean57Secondary: AdditionalPrimitives["ocean57"];
  ocean90Secondary: AdditionalPrimitives["ocean90"];
  violet12Primary: AdditionalPrimitives["violet12"];
  violet30Primary: AdditionalPrimitives["violet30"];
  violet45Primary: AdditionalPrimitives["violet45"];
  violet70Primary: AdditionalPrimitives["violet70"];
  violet110Primary: AdditionalPrimitives["violet110"];
  violet35Secondary: AdditionalPrimitives["violet35"];
  violet40Secondary: AdditionalPrimitives["violet40"];
  violet50Secondary: AdditionalPrimitives["violet50"];
  violet57Secondary: AdditionalPrimitives["violet57"];
  violet90Secondary: AdditionalPrimitives["violet90"];
  plum12Primary: AdditionalPrimitives["plum12"];
  plum30Primary: AdditionalPrimitives["plum30"];
  plum45Primary: AdditionalPrimitives["plum45"];
  plum70Primary: AdditionalPrimitives["plum70"];
  plum110Primary: AdditionalPrimitives["plum110"];
  plum35Secondary: AdditionalPrimitives["plum35"];
  plum40Secondary: AdditionalPrimitives["plum40"];
  plum50Secondary: AdditionalPrimitives["plum50"];
  plum57Secondary: AdditionalPrimitives["plum57"];
  plum90Secondary: AdditionalPrimitives["plum90"];
  stone12Primary: AdditionalPrimitives["stone12"];
  stone30Primary: AdditionalPrimitives["stone30"];
  stone45Primary: AdditionalPrimitives["stone45"];
  stone70Primary: AdditionalPrimitives["stone70"];
  stone110Primary: AdditionalPrimitives["stone110"];
  stone35Secondary: AdditionalPrimitives["stone35"];
  stone40Secondary: AdditionalPrimitives["stone40"];
  stone50Secondary: AdditionalPrimitives["stone50"];
  stone57Secondary: AdditionalPrimitives["stone57"];
  stone90Secondary: AdditionalPrimitives["stone90"];
};
type Colors = {
  primitives: Primitives;
  additionalPrimitives: AdditionalPrimitives;
  contrasts: Contrasts;
  ui: UI;
  dataVisualization: DataVisualization;
};
//#endregion
//#region ../../node_modules/.pnpm/@instructure+shared-types@11.6.0_react@19.2.3/node_modules/@instructure/shared-types/types/BaseTheme.d.ts
type Border = {
  radiusSmall: string | 0;
  radiusMedium: string | 0;
  radiusLarge: string | 0;
  widthSmall: string | 0;
  widthMedium: string | 0;
  widthLarge: string | 0;
  style: string;
};
type Breakpoints = {
  xxSmall: string;
  xSmall: string;
  small: string;
  medium: string;
  tablet: string;
  large: string;
  desktop: string;
  xLarge: string;
  maxWidth: string;
};
type Forms = {
  inputHeightSmall: string;
  inputHeightMedium: string;
  inputHeightLarge: string;
};
type Media = {
  mediumMin: string;
  largeMin: string;
  xLargeMin: string;
};
type Shadows = {
  depth1: string;
  depth2: string;
  depth3: string;
  resting: string;
  above: string;
  topmost: string;
  card: string;
  cardHover: string;
};
type Spacing = {
  xxxSmall: string | 0;
  xxSmall: string | 0;
  xSmall: string | 0;
  small: string | 0;
  mediumSmall: string | 0;
  medium: string | 0;
  large: string | 0;
  xLarge: string | 0;
  xxLarge: string | 0;
  space0: string | 0;
  space2: string | 0;
  space4: string | 0;
  space8: string | 0;
  space12: string | 0;
  space16: string | 0;
  space24: string | 0;
  space36: string | 0;
  space48: string | 0;
  space60: string | 0;
  sections: string | 0;
  sectionElements: string | 0;
  trayElements: string | 0;
  modalElements: string | 0;
  moduleElements: string | 0;
  paddingCardLarge: string | 0;
  paddingCardMedium: string | 0;
  paddingCardSmall: string | 0;
  selects: string | 0;
  textareas: string | 0;
  inputFields: string | 0;
  checkboxes: string | 0;
  radios: string | 0;
  toggles: string | 0;
  buttons: string | 0;
  tags: string | 0;
  statusIndicators: string | 0;
  dataPoints: string | 0;
};
type Stacking = {
  topmost: number;
  above: number;
  below: number;
  deepest: number;
};
type Transitions = {
  duration: string | 0;
  timing: string;
};
type Typography = {
  fontFamily: string;
  fontFamilyMonospace: string;
  fontFamilyHeading?: string;
  fontSizeXSmall: string | 0;
  fontSizeSmall: string | 0;
  fontSizeMedium: string | 0;
  fontSizeLarge: string | 0;
  fontSizeXLarge: string | 0;
  fontSizeXXLarge: string | 0;
  fontWeightLight: number;
  fontWeightNormal: number;
  fontWeightBold: number;
  lineHeight: number | string;
  lineHeightFit: number | string;
  lineHeightCondensed: number | string;
  lineHeightDouble: number | string;
  letterSpacingNormal: number | 0;
  letterSpacingCondensed: string | 0;
  letterSpacingExpanded: string | 0;
  titlePageDesktop: string;
  titlePageMobile: string;
  titleSection: string;
  titleModule: string;
  titleCardLarge: string;
  titleCardRegular: string;
  titleCardMini: string;
  descriptionPage: string;
  descriptionSection: string;
  label: string;
  content: string;
  contentSmall: string;
  legend: string;
  lineHeight100: number;
  lineHeight125: number;
  lineHeight150: number;
  weightRegular: number;
  weightImportant: number;
};
type BaseThemeVariables = {
  borders: Border;
  breakpoints: Breakpoints;
  colors: Colors;
  forms: Forms;
  media: Media;
  shadows: Shadows;
  spacing: Spacing;
  stacking: Stacking;
  transitions: Transitions;
  typography: Typography;
};
type BaseTheme = {
  key: string;
  description?: string;
} & BaseThemeVariables;
//#endregion
//#region ../../node_modules/.pnpm/@instructure+shared-types@11.6.0_react@19.2.3/node_modules/@instructure/shared-types/types/ComponentThemeVariables.d.ts
interface ComponentTheme {
  [variableName: string]: string | number | undefined;
}
type NutritionFactsTheme = {
  cardBorderRadius: Border["radiusMedium"];
  cardBorderColor: string;
  cardBorderWidth: Border["widthSmall"];
  cardPadding: Spacing["space12"];
  cardExplainerContainerBottomMargin: Spacing["space8"];
  cardGap: Spacing["modalElements"];
  bodyPadding: Spacing["paddingCardLarge"];
  blockGap: Spacing["sectionElements"];
};
type DataPermissionLevelsTheme = {
  cardBorderRadius: Border["radiusMedium"];
  cardBorderColor: string;
  cardBorderWidth: Border["widthMedium"];
  cardPadding: Spacing["space12"];
  cardExplainerContainerBottomMargin: Spacing["space8"];
  cardGap: Spacing["modalElements"];
  currentFeaturePaddingSides: Spacing["space12"];
  currentFeaturePaddingTopBottom: Spacing["space8"];
  permissionTitleBottomMargin: Spacing["space8"];
  levelColor: string;
  bodyPadding: Spacing["paddingCardLarge"];
  aiTextLeftGradientColor: string;
  aiTextRightGradientColor: string;
};
type AiInformationTheme = {
  bodyPadding: Spacing["paddingCardLarge"];
  headingBottomMargin: Spacing["sectionElements"];
  featureNameBottomMargin: Spacing["moduleElements"];
  permissionLevelTextBottomMargin: Spacing["space8"];
  permissionLevelBottomMargin: Spacing["space8"];
  descriptionBottomMargin: Spacing["space8"];
  permissionLevelsModalTriggerBottomMargin: Spacing["moduleElements"];
  modelNameTextBottomMargin: Spacing["space4"];
  modelNameBottomMargin: Spacing["space4"];
  dividerMargin: Spacing["moduleElements"];
  dividerColor: string;
  levelColor: string;
};
//#endregion
//#region ../../node_modules/.pnpm/@instructure+shared-types@11.6.0_react@19.2.3/node_modules/@instructure/shared-types/types/CommonTypes.d.ts
/** Type that is renderable by `callRenderProp` */
type Renderable<P = never> =
  | ClassType<P, ClassicComponent<P, ComponentState>, ClassicComponentClass<P>>
  | ComponentClass
  | ReactNode
  | ((data: P) => ReactNode | Element)
  | (() => ReactNode | Element)
  | Element;
//#endregion
//#region ../../node_modules/.pnpm/@instructure+shared-types@11.6.0_react@19.2.3/node_modules/@instructure/shared-types/types/UtilityTypes.d.ts
/**
 * Generates a type which contains HTML attributes for the given element
 * excluding attributes which are defined in Props.
 * The "dir" prop is forced to the given value because InstUI accepts only
 * these.
 *
 * @example
 * class Button extends React.Component<ButtonProps & OtherHTMLAttributes<ButtonProps, React.ButtonHTMLAttributes<ButtonProps>>> {}
 */
type OtherHTMLAttributes<
  Props,
  Attributes extends React.HTMLAttributes<Props & Element> = React.AllHTMLAttributes<
    Props & Element
  >,
> = Omit<Attributes, keyof Props | "dir"> & {
  dir?: "ltr" | "rtl";
};
/**
 * These props are not the components own prop, but we have to allow them,
 * since these are passed to another component.
 */
//#endregion
//#region ../../node_modules/.pnpm/@instructure+emotion@11.6.0_@types+react@19.2.14_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/@instructure/emotion/types/EmotionTypes.d.ts
type ComponentStyle<Keys extends string = string> = Record<
  Keys,
  StyleObject | string | number | undefined
>;
/**
 * Style object returned by the generateStyle method of the components
 */
interface StyleObject {
  [key: string]: StyleObject | string | number | undefined;
}
//#endregion
//#region ../../node_modules/.pnpm/@instructure+ui-react-utils@11.6.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/@instructure/ui-react-utils/types/DeterministicIdContext/DeterministicIdContext.d.ts
declare global {
  var __INSTUI_GLOBAL_INSTANCE_COUNTER__: Map<string, number>;
}
//#endregion
//#region ../../node_modules/.pnpm/@instructure+emotion@11.6.0_@types+react@19.2.14_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/@instructure/emotion/types/withStyle.d.ts
type WithStylePrivateProps<Style extends ComponentStyle | null = ComponentStyle> =
  Style extends null
    ? object
    : {
        styles?: Style;
        makeStyles?: (extraArgs?: Record<string, unknown>) => void;
      };
type ThemeOverrideProp<Theme extends ComponentTheme | null = ComponentTheme> = {
  themeOverride?:
    | Partial<Theme>
    | ((componentTheme: Theme, currentTheme: BaseTheme) => Partial<Theme>);
};
type WithStyleProps<
  Theme extends ComponentTheme | null = ComponentTheme,
  Style extends ComponentStyle | null = ComponentStyle,
> = Theme extends null
  ? WithStylePrivateProps<Style>
  : WithStylePrivateProps<Style> & ThemeOverrideProp<Theme>;
/**
 * ---
 * category: utilities/themes
 * ---
 *
 * A decorator or higher order component that makes a component themeable.
 *
 * It adds a `makeStyles` function and the generated `styles` object to the decorated Component's props. If it has an own theme, it also adds the `themeOverride` prop to the component.
 *
 * As a HOC:
 *
 * ```js-code
 * import { withStyle } from '@instructure/emotion'
 * import generateStyle from './styles'
 * import generateComponentTheme from './theme'
 *
 * export default withStyle(generateStyle, generateComponentTheme)(ExampleComponent)
 * ```
 *
 * Themeable components inject their themed styles into the document
 * when they are mounted.
 *
 * ### Applying themes
 *
 * A themeable component’s theme can be configured via wrapping it in an
 * [InstUISettingsProvider](InstUISettingsProvider) component, and/or set
 * explicitly via its `themeOverride` prop.
 *
 * InstUISettingsProvider provides a theme object (e.g. the [canvas theme](/#canvas)).
 * These variables are mapped to the component's own variables in `theme.js` (see [theming](theming-basics) for more info).
 *
 * With the `themeOverride` prop you can directly set/override the component theme variables declared in theme.js. It accepts an object or a function. The function has the component's theme and the currently active main theme as its parameter.
 *
 * See more about the overrides on the [Using theme overrides](/#using-theme-overrides) docs page.
 *
 * ```js-code
 * // ExampleComponent/theme.js
 * const generateComponentTheme = (theme) => {
 *   const { colors } = theme
 *
 *   const componentVariables = {
 *     background: colors?.backgroundMedium,
 *     color: colors?.textDarkest,
 *
 *     hoverColor: colors?.textLightest,
 *     hoverBackground: colors?.backgroundDarkest
 *   }
 *
 *   return componentVariables
 * }
 * export default generateComponentTheme
 * ```
 *
 * ```jsx-code
 * {// global theme override}
 * <InstUISettingsProvider theme={{
 *   colors: { backgroundMedium: '#888' }
 * }}>
 *  {// component theme override}
 *   <ExampleComponent themeOverride={{ hoverColor: '#eee' }} />
 *
 *  {// component theme override with function}
 *   <ExampleComponent themeOverride={(componentTheme, currentTheme) => ({
 *     hoverBackground: componentTheme.background,
 *     activeBackground: currentTheme.colors.backgroundBrand
 *   })} />
 * </InstUISettingsProvider>
 * ```
 *
 * @module withStyle
 *
 * @param {function} generateStyle - The function that returns the component's style object
 * @param {function} generateComponentTheme - The function that returns the component's theme variables object
 * @returns {ReactElement} The decorated WithStyle Component
 */
//#endregion
//#region ../../node_modules/.pnpm/@instructure+ui-instructure@11.6.0_@types+react@19.2.14_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/@instructure/ui-instructure/types/NutritionFacts/props.d.ts
type BlockType = {
  blockTitle: string;
  segmentData: {
    segmentTitle: string;
    description: string;
    value: string;
    valueDescription?: string;
  }[];
};
type NutritionFactsOwnProps = {
  /**
   * i18n text for the label of the modal
   */
  modalLabel: string;
  /**
   * i18n text for the Nutrition Facts title
   */
  title: string;
  /**
   * i18n text for the feature name that the Nutrition Facts describes
   */
  featureName: string;
  /**
   * i18n text for the "model and data" heading of the Nutrition Facts
   */
  data: BlockType[];
  /**
   * i18n text for the close button
   */
  closeButtonText: string;
  /**
   * i18n text for the close iconButton
   */
  closeIconButtonScreenReaderLabel: string;
  /**
   * i18n text for the trigger
   */
  triggerText: string;
  /**
   * sets the modal size to 'fullscreen'. Used for small viewports
   */
  fullscreen?: boolean;
};
type NutritionFactsProps = NutritionFactsOwnProps &
  WithStyleProps<NutritionFactsTheme, NutritionFactsStyle> &
  OtherHTMLAttributes<NutritionFactsOwnProps>;
type NutritionFactsStyle = ComponentStyle<
  "segmentCard" | "segmentCardExplainerContainer" | "segmentContainer" | "blockContainer" | "body"
> & {
  maxWidth?: string;
};
//#endregion
//#region ../../node_modules/.pnpm/@instructure+ui-instructure@11.6.0_@types+react@19.2.14_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/@instructure/ui-instructure/types/DataPermissionLevels/props.d.ts
type DataPermissionLevelsOwnProps = {
  /**
   * i18n text for the label of the modal
   */
  modalLabel: string;
  /**
   * i18n text for the dataPermissionLevels title
   */
  title: string;
  /**
   * i18n text for the "model and data" heading of the dataPermissionLevels
   */
  data: {
    level: string;
    title: string;
    description: string;
    highlighted?: boolean;
  }[];
  /**
   * i18n text for the close button
   */
  closeButtonText: string;
  /**
   * i18n text for the close iconButton
   */
  closeIconButtonScreenReaderLabel: string;
  /**
   * i18n text for the "current feature" text
   */
  currentFeatureText: string;
  /**
   * i18n text for the current feature
   */
  currentFeature: string;
  /**
   * i18n text for the trigger
   */
  triggerText: string;
  /**
   * sets the modal size to 'fullscreen'. Used for small viewports
   */
  fullscreen?: boolean;
};
type DataPermissionLevelsProps = DataPermissionLevelsOwnProps &
  WithStyleProps<DataPermissionLevelsTheme, DataPermissionLevelsStyle> &
  OtherHTMLAttributes<DataPermissionLevelsOwnProps>;
type DataPermissionLevelsStyle = ComponentStyle<
  | "dataPermissionLevels"
  | "body"
  | "card"
  | "level"
  | "highlightedCard"
  | "currentFeature"
  | "contentContainer"
  | "permissionTitle"
> & {
  maxWidth?: string;
};
//#endregion
//#region ../../node_modules/.pnpm/@instructure+ui-instructure@11.6.0_@types+react@19.2.14_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/@instructure/ui-instructure/types/AiInformation/props.d.ts
type AiInformationOwnProps = {
  /**
   * i18n text for the title of popover
   */
  title: string;
  /**
   * the data structure of the Features on the popover
   */
  data: {
    featureName: string;
    privacyNoticeText: string;
    privacyNoticeUrl: string;
    permissionLevelText: string;
    permissionLevel: string;
    description: string;
    permissionLevelsModalTriggerText: string;
    modelNameText: string;
    modelName: string;
    nutritionFactsModalTriggerText: string;
  }[];
  /**
   *  sets the modal size to 'fullscreen' for NutritionFacts and DataPermissionLevels. Used for small viewports
   */
  fullscreenModals?: boolean;
  /**
   * The element that triggers the popover
   */
  trigger: Renderable;
  /**
   * i18n text for the label of the dataPermissionLevels modal
   */
  dataPermissionLevelsModalLabel: DataPermissionLevelsProps["modalLabel"];
  /**
   * i18n text for the dataPermissionLevels title
   */
  dataPermissionLevelsTitle: DataPermissionLevelsProps["title"];
  /**
   * i18n text for the "model and data" heading of the dataPermissionLevels
   */
  dataPermissionLevelsData: DataPermissionLevelsProps["data"];
  /**
   * i18n text for the dataPermissionLevels close button
   */
  dataPermissionLevelsCloseButtonText: DataPermissionLevelsProps["closeButtonText"];
  /**
   * i18n text for the dataPermissionLevels close iconButton
   */
  dataPermissionLevelsCloseIconButtonScreenReaderLabel: DataPermissionLevelsProps["closeIconButtonScreenReaderLabel"];
  /**
   * i18n text for the dataPermissionLevels "current feature" text
   */
  dataPermissionLevelsCurrentFeatureText: DataPermissionLevelsProps["currentFeatureText"];
  /**
   * i18n text for the dataPermissionLevels current feature
   */
  dataPermissionLevelsCurrentFeature: DataPermissionLevelsProps["currentFeature"];
  /**
   * i18n text for the NutritionFacts label of the modal
   */
  nutritionFactsModalLabel: NutritionFactsProps["modalLabel"];
  /**
   * i18n text for the NutritionFacts title
   */
  nutritionFactsTitle: NutritionFactsProps["title"];
  /**
   * i18n text for the feature name that the NutritionFacts describes
   */
  nutritionFactsFeatureName: NutritionFactsProps["featureName"];
  /**
   * i18n text for the "model and data" heading of the NutritionFacts
   */
  nutritionFactsData: NutritionFactsProps["data"];
  /**
   * i18n text for the NutritionFacts close button
   */
  nutritionFactsCloseButtonText: NutritionFactsProps["closeButtonText"];
  /**
   * i18n text for the NutritionFacts close iconButton
   */
  nutritionFactsCloseIconButtonScreenReaderLabel: NutritionFactsProps["closeIconButtonScreenReaderLabel"];
};
type AiInformationProps = AiInformationOwnProps &
  WithStyleProps<AiInformationTheme, AiInformationStyle> &
  OtherHTMLAttributes<AiInformationOwnProps>;
type AiInformationStyle = ComponentStyle<
  | "aiInformation"
  | "header"
  | "privacyNotice"
  | "featureName"
  | "permissionLevelText"
  | "permissionLevel"
  | "description"
  | "permissionLevelsModalTriggerText"
  | "modelNameText"
  | "modelName"
  | "divider"
> & {
  maxWidth?: string;
};
//#endregion
//#region node/types.d.ts
interface AiInfoFeatureProps {
  nutritionFacts: NutritionFactsProps;
  dataPermissionLevels: DataPermissionLevelsProps;
  aiInformation: AiInformationProps;
  uid: string;
  revision: string;
  group: string;
  name: string;
  description: string;
  linkText?: string;
  linkUrl?: string;
}
type AiInfoProps = Record<string, AiInfoFeatureProps>;
type AiInfoNutritionFactsProps = Record<string, NutritionFactsProps>;
type AiInfoDataPermissionLevelsProps = Record<string, DataPermissionLevelsProps>;
type AiInfoAiInformationProps = Record<string, AiInformationProps>;
//#endregion
//#region node/components/aiexperiences/index.d.ts
declare const aiexperiences: AiInfoFeatureProps;
//#endregion
//#region node/components/askyourdata/index.d.ts
declare const askyourdata: AiInfoFeatureProps;
//#endregion
//#region node/components/assessmentauthoringassistance/index.d.ts
declare const assessmentauthoringassistance: AiInfoFeatureProps;
//#endregion
//#region node/components/canvasa11ycheckeralttextgenerator/index.d.ts
declare const canvasa11ycheckeralttextgenerator: AiInfoFeatureProps;
//#endregion
//#region node/components/canvasa11ycheckertablecaptions/index.d.ts
declare const canvasa11ycheckertablecaptions: AiInfoFeatureProps;
//#endregion
//#region node/components/canvascoursetranslation/index.d.ts
declare const canvascoursetranslation: AiInfoFeatureProps;
//#endregion
//#region node/components/canvasdiscussionsummaries/index.d.ts
declare const canvasdiscussionsummaries: AiInfoFeatureProps;
//#endregion
//#region node/components/canvasgradingassistance/index.d.ts
declare const canvasgradingassistance: AiInfoFeatureProps;
//#endregion
//#region node/components/canvasinboxtranslation/index.d.ts
declare const canvasinboxtranslation: AiInfoFeatureProps;
//#endregion
//#region node/components/careerassistant/index.d.ts
declare const careerassistant: AiInfoFeatureProps;
//#endregion
//#region node/components/conversionalignment/index.d.ts
declare const conversionalignment: AiInfoFeatureProps;
//#endregion
//#region node/components/discussioninsights/index.d.ts
declare const discussioninsights: AiInfoFeatureProps;
//#endregion
//#region node/components/igniteagent/index.d.ts
declare const igniteagent: AiInfoFeatureProps;
//#endregion
//#region node/components/itemauthoringassistance/index.d.ts
declare const itemauthoringassistance: AiInfoFeatureProps;
//#endregion
//#region node/components/portfolios/index.d.ts
declare const portfolios: AiInfoFeatureProps;
//#endregion
//#region node/components/quickreassess/index.d.ts
declare const quickreassess: AiInfoFeatureProps;
//#endregion
//#region node/components/rubricgenerator/index.d.ts
declare const rubricgenerator: AiInfoFeatureProps;
//#endregion
//#region node/components/smartsearch/index.d.ts
declare const smartsearch: AiInfoFeatureProps;
//#endregion
//#region node/index.d.ts
declare const AiInfo: AiInfoProps;
declare const nutritionFacts: AiInfoNutritionFactsProps;
declare const dataPermissionLevels: AiInfoDataPermissionLevelsProps;
declare const aiInformation: AiInfoAiInformationProps;
//#endregion
export {
  AiInfo,
  AiInfo as default,
  type AiInfoAiInformationProps,
  type AiInfoDataPermissionLevelsProps,
  type AiInfoFeatureProps,
  type AiInfoNutritionFactsProps,
  type AiInfoProps,
  aiInformation,
  aiexperiences,
  askyourdata,
  assessmentauthoringassistance,
  canvasa11ycheckeralttextgenerator,
  canvasa11ycheckertablecaptions,
  canvascoursetranslation,
  canvasdiscussionsummaries,
  canvasgradingassistance,
  canvasinboxtranslation,
  careerassistant,
  conversionalignment,
  dataPermissionLevels,
  discussioninsights,
  igniteagent,
  itemauthoringassistance,
  nutritionFacts,
  portfolios,
  quickreassess,
  rubricgenerator,
  smartsearch,
};
