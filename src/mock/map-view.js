export const MapViewData = {
    "data": [
        {
            "id": "d71e4e65-8d9b-4d18-87d2-3b0a3badb3a5",
            "sourceModel": {
                "id": "77eacb31-d0f0-422b-993b-8f00667f04aa",
                "name": "Medium Term Planning",
                "category": "model",
                "description": "A description...",
                "tags": "MTP, EPM",
                "owner": "EPM Team",
                "location": [
                    {
                        "view": "Default",
                        "locationCoordinates": "490.50000000000017 -81.99999999999997"
                    }
                ],
                "customProperties": [],
                "dimensions": [
                    {
                        "id": "a99bff4a-a8b8-4e37-a47f-26200a388e6d",
                        "name": "MTP Account"
                    },
                    {
                        "id": "562770c4-af2f-423f-9e30-a200beec5b56",
                        "name": "MTP Geography"
                    },
                    {
                        "id": "76f5a558-8923-45bf-8d02-847c9e4932aa",
                        "name": "Reporting Periods"
                    }
                ]
            },
            "targetModel": {
                "id": "a3d4cae9-c70f-43ff-9dab-a3219e811213",
                "name": "GFRS",
                "category": "model",
                "description": "HFM application used for corporate financial reporting.",
                "tags": "HFM, Reporting",
                "owner": "EPM Team",
                "location": [
                    {
                        "view": "Default",
                        "locationCoordinates": "75 -171"
                    }
                ],
                "customProperties": [],
                "dimensions": [
                    {
                        "id": "ff288919-39e2-49ff-a0db-93ec4b42b2ca",
                        "name": "GFRS Account"
                    },
                    {
                        "id": "e49e731b-c766-4979-9109-0e2409fe8abb",
                        "name": "GFRS Custom1"
                    },
                    {
                        "id": "972120c9-1fbc-420a-9cc9-cd6abdec19e0",
                        "name": "GFRS Custom2"
                    },
                    {
                        "id": "0a2ae845-067f-4432-8326-44db4e673856",
                        "name": "GFRS Custom3"
                    },
                    {
                        "id": "6df0a3e4-3ded-4702-bc2f-721949fec992",
                        "name": "GFRS Custom4"
                    },
                    {
                        "id": "78b73eb9-3d75-4029-9ced-5b603a0b760e",
                        "name": "GFRS Scenario"
                    },
                    {
                        "id": "0b475721-1f58-417f-b308-3c980f93e1b3",
                        "name": "GFRS Entity"
                    },
                    {
                        "id": "b4016467-5d66-47aa-bfea-17798cba343a",
                        "name": "GFRS ICP"
                    },
                    {
                        "id": "76f5a558-8923-45bf-8d02-847c9e4932aa",
                        "name": "Reporting Periods"
                    }
                ]
            },
            "dimensions": [
                {
                    "id": "a3d4cae9-c70f-43ff-9dab-a3219e811213_ff288919-39e2-49ff-a0db-93ec4b42b2ca",
                    "name": "GFRS Account",
                    "group": "a3d4cae9-c70f-43ff-9dab-a3219e811213",
                    "category": "dimension",
                    "description": "HFM GFRS Account dimension - based on the EPM Account standard.",
                    "tags": "Accounts, Consolidation",
                    "owner": "EPM team",
                    "location": [
                        {
                            "view": "Default",
                            "locationCoordinates": "474.50273833303646 628.8324359515418"
                        }
                    ],
                    "customProperties": [],
                    "elements": []
                },
                {
                    "id": "a3d4cae9-c70f-43ff-9dab-a3219e811213_e49e731b-c766-4979-9109-0e2409fe8abb",
                    "name": "GFRS Custom1",
                    "group": "a3d4cae9-c70f-43ff-9dab-a3219e811213",
                    "category": "dimension",
                    "description": "HFM GFRS Custom 1 - used for additional account analysis in consolidation.",
                    "tags": "Consolidation, Account",
                    "owner": "EPM team",
                    "location": [
                        {
                            "view": "Default",
                            "locationCoordinates": "-9.624584749717648 -59.12244917683722"
                        }
                    ],
                    "customProperties": [],
                    "elements": []
                },
                {
                    "id": "a3d4cae9-c70f-43ff-9dab-a3219e811213_972120c9-1fbc-420a-9cc9-cd6abdec19e0",
                    "name": "GFRS Custom2",
                    "group": "a3d4cae9-c70f-43ff-9dab-a3219e811213",
                    "category": "dimension",
                    "description": "HFM GFRS Custom 2 dimension - used for organisational reporting.",
                    "tags": "Consolidation, Organisation",
                    "owner": "EPM team",
                    "location": [
                        {
                            "view": "Default",
                            "locationCoordinates": "-8.999999999999993 214"
                        }
                    ],
                    "customProperties": [],
                    "elements": []
                },
                {
                    "id": "a3d4cae9-c70f-43ff-9dab-a3219e811213_0a2ae845-067f-4432-8326-44db4e673856",
                    "name": "GFRS Custom3",
                    "group": "a3d4cae9-c70f-43ff-9dab-a3219e811213",
                    "category": "dimension",
                    "description": "HFM GFRS Custom 3 dimension - used for additional organisational reporting.",
                    "tags": "Consolidation, Organisation",
                    "owner": "EPM team",
                    "location": [
                        {
                            "view": "Default",
                            "locationCoordinates": "562.6149604882704 489.4162179757707"
                        }
                    ],
                    "customProperties": [],
                    "elements": []
                },
                {
                    "id": "a3d4cae9-c70f-43ff-9dab-a3219e811213_6df0a3e4-3ded-4702-bc2f-721949fec992",
                    "name": "GFRS Custom4",
                    "group": "a3d4cae9-c70f-43ff-9dab-a3219e811213",
                    "category": "dimension",
                    "description": "Custom 4 - used for other reporting like data source.",
                    "tags": "Consolidation",
                    "owner": "EPM team",
                    "location": [
                        {
                            "view": "Default",
                            "locationCoordinates": "397.70318136860726 338.60876082546685"
                        }
                    ],
                    "customProperties": [],
                    "elements": []
                },
                {
                    "id": "a3d4cae9-c70f-43ff-9dab-a3219e811213_78b73eb9-3d75-4029-9ced-5b603a0b760e",
                    "name": "GFRS Scenario",
                    "group": "a3d4cae9-c70f-43ff-9dab-a3219e811213",
                    "category": "dimension",
                    "description": "HFM scenario dimension",
                    "tags": "Consolidation, Scenario",
                    "owner": "EPM team",
                    "location": [
                        {
                            "view": "Default",
                            "locationCoordinates": "166 178"
                        }
                    ],
                    "customProperties": [],
                    "elements": []
                },
                {
                    "id": "a3d4cae9-c70f-43ff-9dab-a3219e811213_0b475721-1f58-417f-b308-3c980f93e1b3",
                    "name": "GFRS Entity",
                    "group": "a3d4cae9-c70f-43ff-9dab-a3219e811213",
                    "category": "dimension",
                    "description": "Legal entity",
                    "tags": "Consolidation, Entity",
                    "owner": "EPM team",
                    "location": [
                        {
                            "view": "Default",
                            "locationCoordinates": "-40.07951699491568 -40.86568652938246"
                        }
                    ],
                    "customProperties": [],
                    "elements": []
                },
                {
                    "id": "a3d4cae9-c70f-43ff-9dab-a3219e811213_b4016467-5d66-47aa-bfea-17798cba343a",
                    "name": "GFRS ICP",
                    "group": "a3d4cae9-c70f-43ff-9dab-a3219e811213",
                    "category": "dimension",
                    "description": "HFM intercompany - based on a subset of Entities",
                    "tags": "Consolidation, Entity, ICP",
                    "owner": "EPM team",
                    "location": [
                        {
                            "view": "Default",
                            "locationCoordinates": "192 32"
                        }
                    ],
                    "customProperties": [],
                    "elements": []
                },
                {
                    "id": "a3d4cae9-c70f-43ff-9dab-a3219e811213_76f5a558-8923-45bf-8d02-847c9e4932aa",
                    "name": "Reporting Periods",
                    "group": "a3d4cae9-c70f-43ff-9dab-a3219e811213",
                    "category": "dimension",
                    "description": "12 Month reporting calendar",
                    "tags": null,
                    "owner": null,
                    "location": [],
                    "customProperties": [],
                    "elements": []
                },
                {
                    "id": "77eacb31-d0f0-422b-993b-8f00667f04aa_a99bff4a-a8b8-4e37-a47f-26200a388e6d",
                    "name": "MTP Account",
                    "group": "77eacb31-d0f0-422b-993b-8f00667f04aa",
                    "category": "dimension",
                    "description": "Medium Term Planning account structure - based on the standard EPM Account structure.",
                    "tags": "Medium Term Planning, Accounts",
                    "owner": "EPM team",
                    "location": [
                        {
                            "view": "Default",
                            "locationCoordinates": "1 1"
                        }
                    ],
                    "customProperties": [],
                    "elements": []
                },
                {
                    "id": "77eacb31-d0f0-422b-993b-8f00667f04aa_562770c4-af2f-423f-9e30-a200beec5b56",
                    "name": "MTP Geography",
                    "group": "77eacb31-d0f0-422b-993b-8f00667f04aa",
                    "category": "dimension",
                    "description": "Geographical view of the business",
                    "tags": null,
                    "owner": null,
                    "location": [
                        {
                            "view": "Default",
                            "locationCoordinates": "1 1"
                        }
                    ],
                    "customProperties": [],
                    "elements": []
                },
                {
                    "id": "77eacb31-d0f0-422b-993b-8f00667f04aa_76f5a558-8923-45bf-8d02-847c9e4932aa",
                    "name": "Reporting Periods",
                    "group": "77eacb31-d0f0-422b-993b-8f00667f04aa",
                    "category": "dimension",
                    "description": "12 Month reporting calendar",
                    "tags": null,
                    "owner": null,
                    "location": [
                        {
                            "view": "Default",
                            "locationCoordinates": "1 1"
                        }
                    ],
                    "customProperties": [],
                    "elements": []
                }
            ],
            "dimlinks": [
                {
                    "id": "76f5a558-8923-45bf-8d02-847c9e4932aa",
                    "name": "same dimension",
                    "description": "same dimension",
                    "category": "masterdata",
                    "sourceDimension": "77eacb31-d0f0-422b-993b-8f00667f04aa_76f5a558-8923-45bf-8d02-847c9e4932aa",
                    "targetDimension": "a3d4cae9-c70f-43ff-9dab-a3219e811213_76f5a558-8923-45bf-8d02-847c9e4932aa",
                    "sourceCardinality": 1,
                    "targetCardinality": 1,
                    "route": null,
                    "customProperties": []
                },
                {
                    "id": "dc77f5ba-d5f1-4f25-a81e-01ebd7c59359",
                    "name": "HFM Custom1 to MTP Geography",
                    "description": "Links HFM Custom1 combined with HFM Entity to MTP Geography",
                    "category": "masterdata",
                    "sourceDimension": "a3d4cae9-c70f-43ff-9dab-a3219e811213_e49e731b-c766-4979-9109-0e2409fe8abb",
                    "targetDimension": "77eacb31-d0f0-422b-993b-8f00667f04aa_562770c4-af2f-423f-9e30-a200beec5b56",
                    "sourceCardinality": 1,
                    "targetCardinality": 1,
                    "route": [
                        {
                            "view": "Default",
                            "points": [
                                1,
                                2
                            ]
                        }
                    ],
                    "customProperties": [],
                    "excludeFromModelLinks": []
                },
                {
                    "id": "ae921f6d-0b36-4cc6-833a-225344a4a99d",
                    "name": "HFM Entity to MTP Geography",
                    "description": "Links HFM andm MTP Geography dimensions",
                    "category": "masterdata",
                    "sourceDimension": "a3d4cae9-c70f-43ff-9dab-a3219e811213_0b475721-1f58-417f-b308-3c980f93e1b3",
                    "targetDimension": "77eacb31-d0f0-422b-993b-8f00667f04aa_562770c4-af2f-423f-9e30-a200beec5b56",
                    "sourceCardinality": 1,
                    "targetCardinality": 1,
                    "route": [
                        {
                            "view": "Default",
                            "points": [
                                1,
                                2
                            ]
                        }
                    ],
                    "customProperties": [],
                    "excludeFromModelLinks": []
                },
                {
                    "id": "5836f2f2-a2f3-460d-a742-31a5a78c8f8f",
                    "name": "HFM Account to MTP Account",
                    "description": "Links HFM andm MTP account dimensions",
                    "category": "masterdata",
                    "sourceDimension": "77eacb31-d0f0-422b-993b-8f00667f04aa_a99bff4a-a8b8-4e37-a47f-26200a388e6d",
                    "targetDimension": "a3d4cae9-c70f-43ff-9dab-a3219e811213_ff288919-39e2-49ff-a0db-93ec4b42b2ca",
                    "sourceCardinality": 1,
                    "targetCardinality": 1,
                    "route": [
                        {
                            "view": "Default",
                            "points": [
                                1,
                                2
                            ]
                        }
                    ],
                    "customProperties": [],
                    "excludeFromModelLinks": []
                }
            ],
            "dataFilters": [
                {
                    "columns": null,
                    "slices": null
                }
            ]
        }
    ]
}
