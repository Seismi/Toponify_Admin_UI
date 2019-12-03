export default {
  data: [
    {
      id: '3a0e370a-4a68-4428-9fc1-1f852d174305',
      name: 'Account Type',
      category: 'attribute',
      description: '',
      tags: 'SAP',
      scope: 'global',
      owner: 'SAP Team',
      customProperties: [],
      related: []
    },
    {
      id: '3efe8a11-8b5a-4f8b-bd49-236fe710cfa7',
      name: 'Address',
      category: 'attribute',
      description: 'Legal address of an Entity',
      tags: 'Documentation',
      scope: 'global',
      owner: 'EPM Team',
      customProperties: [],
      related: []
    },
    {
      id: '2e6f16c1-3738-4b25-a234-53e52bb52bc4',
      name: 'EPM Account Type',
      category: 'attribute',
      description: 'Standard account type definition that is then translated to application specific nomenclature.',
      tags: null,
      scope: 'global',
      owner: null,
      customProperties: [],
      related: []
    },
    {
      id: '7ceb83d6-7d69-4e2e-8452-f32f043768de',
      name: 'HFM Account Type',
      category: 'attribute',
      description: 'EPM account type translated to HFM nomenclature',
      tags: 'HFM',
      scope: 'global',
      owner: 'EPM Team',
      customProperties: [],
      related: [
        {
          id: '2e6f16c1-3738-4b25-a234-53e52bb52bc4',
          category: 'attribute',
          name: 'EPM Account Type',
          description: 'Standard account type definition that is then translated to application specific nomenclature.',
          tags: null,
          related: []
        }
      ]
    },
    {
      id: '6fbd9dae-f2a1-4f36-b58b-5866feebf37f',
      name: 'SAP and HFM Account Type Aligned',
      category: 'rule',
      description: 'Rule that validates that SAP and HFM Account types are aligned.',
      tags: '',
      scope: 'global',
      owner: 'SAP Team',
      customProperties: [],
      related: [
        {
          id: '7ceb83d6-7d69-4e2e-8452-f32f043768de',
          category: 'attribute',
          name: 'HFM Account Type',
          description: 'EPM account type translated to HFM nomenclature',
          tags: 'HFM',
          related: [
            {
              id: '2e6f16c1-3738-4b25-a234-53e52bb52bc4',
              category: 'attribute',
              name: 'EPM Account Type',
              description:
                'Standard account type definition that is then translated to application specific nomenclature.',
              tags: null,
              related: []
            }
          ]
        },
        {
          id: '3a0e370a-4a68-4428-9fc1-1f852d174305',
          category: 'attribute',
          name: 'Account Type',
          description: '',
          tags: 'SAP',
          related: []
        }
      ]
    },
    {
      id: '4c7f11ae-45ac-43f2-97f0-5a2a79d4ecdf',
      name: 'Signage (HFM)',
      category: 'attribute',
      description: 'Indicates if debit are positive or negative values.',
      tags: null,
      scope: 'global',
      owner: null,
      customProperties: [],
      related: [
        {
          id: '7ceb83d6-7d69-4e2e-8452-f32f043768de',
          category: 'attribute',
          name: 'HFM Account Type',
          description: 'EPM account type translated to HFM nomenclature',
          tags: 'HFM',
          related: [
            {
              id: '2e6f16c1-3738-4b25-a234-53e52bb52bc4',
              category: 'attribute',
              name: 'EPM Account Type',
              description:
                'Standard account type definition that is then translated to application specific nomenclature.',
              tags: null,
              related: []
            }
          ]
        },
        {
          id: '4c7f11ae-45fc-43f2-97f0-5a2a79ddecdf',
          category: 'attribute',
          name: 'Local legislation',
          description: 'Stores local legislation on signage',
          tags: 'Legal',
          related: []
        }
      ]
    }
  ],
  links: {
    first: 'http://3.8.213.117:4001/api/v0.1?page=0&size=100',
    previous: '',
    next: '',
    last: 'http://3.8.213.117:4001/api/v0.1?page=0&size=100'
  },
  page: {
    size: 100,
    totalObjects: 34,
    totalPages: 1,
    number: 0
  }
};
