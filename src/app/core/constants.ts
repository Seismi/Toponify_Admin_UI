export abstract class Constants {
  static readonly ARCHITECTURE_TABS: string[] = ['Details', 'Attributes', 'Properties', 'RADIO', 'Work Packages'];
  static readonly REPORT_LIBRARY_TABS: string[] = ['Details', 'Attributes', 'Properties', 'RADIO', 'Work Packages'];
  static readonly ATTRIBUTE_TABS: string[] = ['Details', 'Properties', 'RADIO', 'Work Packages'];
  static readonly WORKPACKAGE_TABS: string[] = ['Details', 'Properties', 'Objectives', 'RADIO', 'Change Summary'];
  static readonly RADIO_TABS: string[] = ['Details', 'Properties'];
  static readonly RADIO_CATEGORIES: string[] = ['risk', 'assumption', 'dependency', 'issue', 'opportunity'];
  static readonly RADIO_STATUS: string[] = ['new', 'open', 'closed'];
  static readonly PROPERTY_TYPES: string[] = ['Boolean', 'Text', 'Hyperlink', 'Number', 'Date'];
  static readonly BOOLEAN_TYPES: string[] = ['true', 'false'];
}