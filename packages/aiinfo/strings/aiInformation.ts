// Oxc-ignore-all assist/source/useSortedKeys: Required order for Strings
import { type AiInformationStrings } from "../types";
import { strings as nutritionFactsStrings } from "./nutritionFacts";
import { strings as permissionLevelsStrings } from "./permissionLevels";

const strings: { [lang: string]: Omit<AiInformationStrings, "trigger"> } = {
  en_US: {
    data: {
      modelNameText: nutritionFactsStrings.en.data[0].segmentData[0].segmentTitle,
      nutritionFactsModalTriggerText: nutritionFactsStrings.en.title,
      permissionLevelText: "Permission Level:",
      permissionLevelsModalTriggerText: permissionLevelsStrings.en.title,
    },
    dataPermissionLevelsCloseButtonText: permissionLevelsStrings.en.closeButtonText,
    dataPermissionLevelsCloseIconButtonScreenReaderLabel:
      permissionLevelsStrings.en.closeIconButtonScreenReaderLabel,
    dataPermissionLevelsCurrentFeatureText: "Current Feature:",
    dataPermissionLevelsModalLabel: permissionLevelsStrings.en.modalLabel,
    dataPermissionLevelsTitle: permissionLevelsStrings.en.title,
    nutritionFactsCloseButtonText: nutritionFactsStrings.en.closeButtonText,
    nutritionFactsCloseIconButtonScreenReaderLabel:
      nutritionFactsStrings.en.closeIconButtonScreenReaderLabel,
    nutritionFactsModalLabel: nutritionFactsStrings.en.modalLabel,
    nutritionFactsTitle: nutritionFactsStrings.en.title,
    title: "Features",
  },
  ar_SA: {},
  ca_ES: {},
  cy_GB: {},
  da_DK: {},
  de_DE: {},
  el_GR: {},
  en_AU: {},
  en_CA: {},
  en_GB: {},
  es_ES: {},
  fa_IR: {},
  fi_FI: {},
  fr_CA: {},
  fr_RF: {},
  ga_IE: {},
  he_IL: {},
  hi_IN: {},
  ht_HT: {},
  hu_HU: {},
  hy_AM: {},
  id_ID: {},
  is_IS: {},
  ja_JP: {},
  ko_KR: {},
  mi_NZ: {},
  ms_MY: {},
  nb_NO: {},
  nl_NL: {},
  nn_NO: {},
  pl_PL: {},
  pt_BR: {},
  pt_PT: {},
  ru_RU: {},
  sl_SI: {},
  sv_SE: {},
  th_TH: {},
  tr_TR: {},
  vi_VN: {},
  zh_CN: {},
  zh_HK: {},
};

export { strings };
