// tslint:disable:max-line-length
export const NodeToolTips = [
  {
    Layer: 'System',
    Object: 'New Transactional System',
    Tooltip: 'A system that records company daily transactions. For example the ERP or the General Ledger.'
  },
  {
    Layer: 'System',
    Object: 'New Analytical System',
    Tooltip: 'A system that stores data on business metrics for analysis purposes. For example an EPM application.'
  },
  {
    Layer: 'System',
    Object: 'New File System',
    Tooltip:
      'A file system is a collection of files. For example a location on a shared drive used to store exchange rate forecasts.'
  },
  {
    Layer: 'System',
    Object: 'New Reporting System',
    Tooltip: 'A system used to gather data and generate reports. For example a business intelligence application.'
  },
  {
    Layer: 'System',
    Object: 'New Master Data System',
    Tooltip:
      'A system used to store and govern master data. For example the financial master data management application.'
  },
  {
    Layer: 'System',
    Object: 'Master Data Link',
    Tooltip:
      'An integration sharing master data across systems. For example, to show the financial master data management application is integrated to the EPM application to publish the valid structures and codes.'
  },
  {
    Layer: 'System',
    Object: 'Data Link',
    Tooltip:
      'An integration sharing data across systems. For example, to show data from the ERP is published to the EPM application.'
  },
  {
    Layer: 'Data',
    Object: 'New Data Structure',
    Tooltip:
      'Add a new data structure - these represent a table or location in which data is stored in a set structure. You can then add data sets to the structure to describe the data contained within it.'
  },
  {
    Layer: 'Data',
    Object: 'Master Data Link',
    Tooltip:
      'Add a new master data link - these represent a transfer of master data (definitions or mappings).'
  },
  {
    Layer: 'Data',
    Object: 'Data Link',
    Tooltip:
      'Add a new data link - these represent a transfer of data between two data structures or describe which data set(s) are being transferred.'
  },
  {
    Layer: 'Dimension',
    Object: 'New Dimension',
    Tooltip: 'One key aspect of the company data. For example "Product" and "Stores".'
  },
  {
    Layer: 'Dimension',
    Object: 'Master Data Link',
    Tooltip:
      'A dependency between dimensions. This can either show a mapping or a constraint. For example, "Product" can be linked to "Stores" to indicate a constraint - not all stores sell all products.'
  },
  {
    Layer: 'Reporting Concept',
    Object: 'New List Reporting Concept',
    Tooltip: 'A list of codes with no specific structure. For example "Stores".'
  },
  {
    Layer: 'Reporting Concept',
    Object: 'New Structural Reporting Concept',
    Tooltip: 'A reporting structure. For example "Geography"'
  },
  {
    Layer: 'Reporting Concept',
    Object: 'New Key Reporting Concept',
    Tooltip: 'A key point to be reported for the business. For example "Total UK"'
  },
  {
    Layer: 'Reporting Concept',
    Object: 'Master Data Link',
    Tooltip:
      'A relation between reporting concepts. For example, "Stores" are linked to "Geography" to indicate they are sorted by geography. "Total UK" is linked to "Geography" to indicate it is calculated through this structure.'
  },
  {
    Layer: 'Any',
    Object: 'Transformation',
    Tooltip: 'Add a transformation to document changes in data between a source and a target. Transformations can have multiple sources or targets.'
  },
  {
    Layer: 'System',
    Object: 'Manual Processing',
    Tooltip: 'A set of operations done by users to process or analyse the data.'
  },
  {
    Layer: 'System',
    Object: 'Desktop Application',
    Tooltip: 'An application running on a desktop of one or multiple users (for example Excel).'
  },
  {
    Layer: 'System',
    Object: 'Data Set',
    Tooltip: 'Data Set - A collection of data, that can be stored in tabular or other forms.'
  }
];
