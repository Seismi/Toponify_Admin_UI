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
    Layer: 'Data Set',
    Object: 'New Physical Data Set',
    Tooltip:
      'A set of data stored in the system in a given format. A data set also implicitly includes some control master data used to validate the content of the table. For example, the monthly balance in the general ledger is a stored physical data set.'
  },
  {
    Layer: 'Data Set',
    Object: 'New Virtual Data Set',
    Tooltip:
      'A set of data calculated or transformed on the fly into a given format. It is not stored and changes as soon as its underlying components change. For example, a weekly performance view of sales calculated on the fly based on transactions is a virtual data set.'
  },
  {
    Layer: 'Data Set',
    Object: 'New Master Data Data Set',
    Tooltip:
      'A set of master data. For example, it can be used to represent a collection of valid financial codes (account codes, cost centres, company codes) maintained in the ERP and shared across multiple ledgers and sub-ledgers.'
  },
  {
    Layer: 'Data Set',
    Object: 'Master Data Link',
    Tooltip:
      'An integration transfering master data from one data or master data set to another. For example, a physical data set in an analytical system may be receiving the master data from the master data set in the master data application'
  },
  {
    Layer: 'Data Set',
    Object: 'Data Link',
    Tooltip:
      'An integration transfering data from one data set to another. For example, a data read from a physical to virtual data set.'
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
    Tooltip: 'PLACEHOLDER'
  }
];
