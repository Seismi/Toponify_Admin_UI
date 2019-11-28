export abstract class Constants {
  static readonly RADIO_CATEGORIES: string[] = ['risk', 'assumption', 'dependency', 'issue', 'opportunity'];
  static readonly RADIO_STATUS: string[] = ['new', 'open', 'closed'];
  static readonly PROPERTY_TYPES: string[] = ['Boolean', 'Text', 'Hyperlink', 'Number', 'Date'];
  static readonly BOOLEAN_TYPES: string[] = ['true', 'false'];
  static readonly RADIO_TABLE_COLUMNS: string[] = ['refNo', 'name', 'status', 'navigate'];
}