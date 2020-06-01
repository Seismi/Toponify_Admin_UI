//This file is used to parameterise the tabs in use across the application.  This is to get around the issues that angular tabs cannot have data hooks
let api_version = '/api/v0.2';
module.exports = {
  tabs: {
    Canvas: 1,
    Systems: 2,
    Interfaces: 3
  },
  menu_selector: 'main-menu-topology',
  page_check: 'topology',
  wait_for: {
    GetArchiveWorkPackages: {
      api: `${api_version}/workpackages?includeArchived=true`,
      method: 'GET',
      name: 'ArchiveWorkPackages'
    },
    GetWorkPackage: {
      api: `${api_version}/workpackages/*`,
      method: 'GET',
      name: 'WorkPackage'
    },
    GetWorkPackages: {
      api: `${api_version}/workpackages`,
      method: 'GET',
      name: 'WorkPackages'
    },
    GetScopes: {
      api: `${api_version}/scopes`,
      method: 'GET',
      name: 'Scopes'
    },
    GetScope: {
      api: `${api_version}/scopes/*`,
      method: 'GET',
      name: 'Scope'
    },
    GetLayouts: {
      api: `${api_version}/layouts`,
      method: 'GET',
      name: 'Layouts'
    },
    GetLayout: {
      api: `${api_version}/layouts/*`,
      method: 'GET',
      name: 'Layout'
    },
    GetTeams: {
      api: `${api_version}/teams`,
      method: 'GET',
      name: 'Teams'
    },
    GetRadios: {
      api: `${api_version}/radios`,
      method: 'GET',
      name: 'Radios'
    },
    GetNodesScopeQuery: {
      api: `${api_version}/nodes?scopeQuery*`,
      method: 'GET',
      name: 'NodesScopeQuery'
    },
    GetNodeLinksScopeQuery: {
      api: `${api_version}/nodelinks?scopeQuery*`,
      method: 'GET',
      name: 'NodeLinksScopeQuery'
    },
    GetNodesWPQuery: {
      api: `${api_version}/nodes?workPackageQuery*`,
      method: 'GET',
      name: 'NodesWorkPackageQuery'
    },
    GetNodeLinksWPQuery: {
      api: `${api_version}/nodelinks?workPackageQuery*`,
      method: 'GET',
      name: 'NodeLinksWorkPackageQuery'
    },
    GetSelectorWorkPackage: {
      api: `${api_version}/workpackages/selector/availability*`,
      method: 'GET',
      name: 'SelectorAvailabilityQuery'
    },
    GETWorkPackageNodesScopeQuery: {
      api: `${api_version}/workpackages/*/nodes?scopeQuery=*`,
      method: 'POST',
      name: 'WorkPackageNodesScopeQuery'
    },
    GETNodesScopes: {
      api: `${api_version}/nodes/*/scopes`,
      method: 'GET',
      name: 'NodesScopes'
    },
    GETNodesWorkPackageQuery2: {
      api: `${api_version}/nodes/*?workPackageQuery[]=*`,
      method: 'GET',
      name: 'NodesWorkPackageQuery2'
    },
    GETNodesReportWorkPackageQuery: {
      api: `${api_version}/nodes/*/reports?workPackageQuery[]=*`,
      method: 'GET',
      name: 'NodesReportWorkPackageQuery'
    },
    GETWorkPackageNodeTags: {
      api: `${api_version}/workpackages/*/nodes/*/tags`,
      method: 'GET',
      name: 'WorkPackageNodeTags'
    },
    PUTWorkPackagesNodes: {
      api: `${api_version}/workpackages/*/nodes/*`,
      method: 'PUT',
      name: 'WorkPackagesNodes'
    },
    WorkPackagesNodesAttributes: {
      api: `${api_version}/workpackages/*/nodes/*/attributes/*`,
      method: 'POST',
      name: 'WorkPackagesNodesAttributes'
    },
    WorkPackageAttributes: {
      api: `${api_version}/workpackages/*/attributes`,
      method: 'POST',
      name: 'WorkPackageAttributes'
    },
    WorkPackagesNodesCustomPropertyValues: {
      api: `${api_version}/workpackages/*/nodes/*/customPropertyValues/*`,
      method: 'PUT',
      name: 'WorkPackagesNodesCustomPropertyValues'
    },
    WorkPackagesDeleteNode: {
      api: `${api_version}/workpackages/*/nodes/*/deleteRequest`,
      method: 'POST',
      name: 'WorkPackagesDeleteNode'
    },
    nodeLinksWorkPackageQuery: {
      api: `${api_version}/nodelinks/*?workPackageQuery[]=*`,
      method: 'GET',
      name: 'nodeLinksWorkPackageQuery'
    },
    workPackageNodeLinksQuery: {
      api: `${api_version}/workpackages/*/nodelinks/*/tags`,
      method: 'GET',
      name: 'WorkPackageNodeLinksQuery'
    },
    workPackagesNodeLinksDescendants: {
      api: `${api_version}/workpackages/*/nodelinks/*/descendants`,
      method: 'GET',
      name: 'workPackagesNodeLinksDescendants'
    },
    workPackagesNodeLinksDeleteRequest: {
      api: `${api_version}/workpackages/*/nodelinks/*/deleteRequest`,
      method: 'POST',
      name: 'workPackagesNodeLinksDeleteRequest'
    },
    workPackagesNodeDescendants: {
      api: `${api_version}/workpackages/*/node/*/descendants`,
      method: 'GET',
      name: 'workPackagesNodeDescendants'
    },
    workPackagesNodesDescendants: {
      api: `${api_version}/workpackages/*/nodes/*/descendants`,
      method: 'GET',
      name: 'workPackagesNodesDescendants'
    },
    WorkPackagesNodeLinks: {
      api: `${api_version}//workpackages/*/nodelinks`,
      method: 'POST',
      name: 'WorkPackagesNodeLinks'
    },
    WorkPackagesNodesGroupSet: {
      api: `${api_version}/workpackages/nodes/*/group/set/*`,
      method: 'POST',
      name: 'WorkPackagesNodesGroupSet'
    }
  }
};
