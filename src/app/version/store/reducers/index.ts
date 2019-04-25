import { createFeatureSelector, createSelector, ActionReducerMap } from '@ngrx/store';
import * as fromVersion from './version.reducer';
import * as fromSystem from './system.reducer';
import * as fromSystemLink from './system-links.reducer';
import * as fromModel from './model-version.reducer';
import * as fromModelLinks from './model-links.reducer';
import * as fromDimensions from './dimension.reducer';
import * as fromDimensionLinks from './dimension-links.reducer';
import * as fromElement from './element.reducer';
import * as fromElementLinks from './element-links.reducer';
import * as fromMapView from './mapview-reducer';
import * as fromView from './view.reducer';
import * as fromRoot from '@app/core/store/';
import * as fromAttributes from './attribute.reducer';
export interface VersionState {
  versions: fromVersion.State;
  systems: fromSystem.State;
  systemLinks: fromSystemLink.State;
  models: fromModel.State;
  modelLinks: fromModelLinks.State;
  dimensions: fromDimensions.State;
  dimensionLinks: fromDimensionLinks.State;
  elements: fromElement.State;
  elementLinks: fromElementLinks.State;
  mapViews: fromMapView.State;
  view: fromView.State;
  attributes: fromAttributes.State;
}

export interface State extends fromRoot.State {
  versionFeature: VersionState;
}

export const reducers: ActionReducerMap<VersionState> = {
  versions: fromVersion.reducer,
  systems: fromSystem.reducer,
  systemLinks: fromSystemLink.reducer,
  models: fromModel.reducer,
  modelLinks: fromModelLinks.reducer,
  dimensions: fromDimensions.reducer,
  dimensionLinks: fromDimensionLinks.reducer,
  elements: fromElement.reducer,
  elementLinks: fromElementLinks.reducer,
  mapViews: fromMapView.reducer,
  view: fromView.reducer,
  attributes: fromAttributes.reducer
};


export const getVersionState = createFeatureSelector<State, VersionState>('versionFeature');

export const getVersionEntitiesState = createSelector(
  getVersionState,
  state => {
    return state.versions;
  }
);

export const getAttributeEntitiesState = createSelector(
  getVersionState,
  state => {
    return state.attributes;
  }
);

export const getVersions = createSelector(
  getVersionEntitiesState,
  fromVersion.getVersions
);

export const getSystemLinkEntitiesState = createSelector(
  getVersionState,
  state => state.systemLinks
);

export const getSystemEntitiesState = createSelector(
  getVersionState,
  state => state.systems
);

export const getModelEntitiesState = createSelector(
  getVersionState,
  state => state.models
);

export const getModelLinksEntitiesState = createSelector(
  getVersionState,
  state => state.modelLinks
);

export const getDimensionEntitiesState = createSelector(
  getVersionState,
  state => state.dimensions
);

export const getDimensionLinkEntitiesState = createSelector(
  getVersionState,
  state => state.dimensionLinks
);

export const getElementEntitiesState = createSelector(
  getVersionState,
  state => state.elements
);

export const getElementLinkEntitiesState = createSelector(
  getVersionState,
  state => state.elementLinks
);

export const getMapViewEntitiesState = createSelector(
  getVersionState,
  state => state.mapViews
);

export const getViewState = createSelector(
  getVersionState,
  state => state.view
);

export const getZoomLevel = createSelector(
  getViewState,
  state => state.zoomLevel
);

export const getViewLevel = createSelector(
  getViewState,
  state => state.viewLevel
);

export const getLoading = createSelector(
  getVersionEntitiesState,
  state => state.loading
);

export const getMapViewId = createSelector(
  getMapViewEntitiesState,
  state => state.mapViewId
);


export const getAttributes = createSelector(
  getVersionState,
  state => state.attributes
);

export const getVersionById = (versionId: string) => {
  return createSelector(
    getVersionEntitiesState,
    state => {
      return state.versions.filter(version => version.id === versionId);
    }
  );
}

export const getAttributeById = (attributeId: string) => {
  return createSelector(
    getAttributeEntitiesState,
    state => {
      return state.attributes.filter(attribute => attribute.id === attributeId);
    }
  );
}

export const getVersionPageError = createSelector(
  getVersionEntitiesState,
  fromVersion.getError
);


export const getSystemLinks = createSelector(
  getSystemLinkEntitiesState,
  state => {
    if (state && state.loading) {
      return;
    }
    if (state && state.systemLinks) {
      const mappedSystemLinks = state.systemLinks.map(systemLink => {
        const viewRoute = systemLink.route.find(route => {
          return route.view === 'Default';
        });
        return {
          ...systemLink,
          route: viewRoute ? viewRoute.points : [],
          // Set property to indicate whether node has a location defined
          routeMissing: !viewRoute
        };
      });
      return mappedSystemLinks;
    }
    return;
  }
);

export const getSystem = createSelector(
  getSystemEntitiesState,
  state => {
    if (state && state.loading) {
      return;
    }
    if (state && state.systems) {
      const mapppedSystem = state.systems.map(system => {
        const ViewLoc = system.location.find(loc => {
          return loc.view === 'Default';
        });
        return {
          ...system,
          location: ViewLoc ? ViewLoc.locationCoordinates : null,
          // Set property to indicate whether node has a location defined
          locationMissing: !ViewLoc
        };
      });

      return mapppedSystem;
    }
    return;
  }
);

export const getModels = createSelector(
  getModelEntitiesState,
  state => {
    if (state && state.loading) {
      return;
    }
    if (state && state.models) {
      const mapppedModels = state.models.map(model => {
        const ViewLoc = model.location.find(loc => {
          return loc.view === 'Default';
        });
        return {
          ...model,
          location: ViewLoc ? ViewLoc.locationCoordinates : null,
          // Set property to indicate whether node has a location defined
          locationMissing: !ViewLoc
        };
      });
      console.log(mapppedModels);
      return mapppedModels;
    }

    return;
  }
);

export const getModelLinks = createSelector(
  getModelLinksEntitiesState,
  state => {
    if (state && state.loading) {
      return;
    }
    if (state && state.modelLinks) {
      const mapppedModelLinks = state.modelLinks.map(modelLink => {
        const viewRoute = modelLink.route.find(loc => {
          return loc.view === 'Default';
        });
        return {
          ...modelLink,
          route: viewRoute ? viewRoute.points : [],
          // Set property to indicate whether link has a route defined
          routeMissing: !viewRoute
        };
      });

      return mapppedModelLinks;
    }
    return;
  }
);

export const getDimensions = createSelector(
  getDimensionEntitiesState,
  state => {
    if (state && state.loading) {
      return;
    }
    if (state && state.dimensions) {
      const mapppedDimensions = state.dimensions.map(dimension => {
        const ViewLoc = dimension.location.find(loc => {
          return loc.view === 'Default';
        });
        return {
          ...dimension,
          location: ViewLoc ? ViewLoc.locationCoordinates : null,
          // Set property to indicate whether link has a route defined
          locationMissing: !ViewLoc
        };
      });

      return mapppedDimensions;
    }

    return;
  }
);

export const getDimensionLinks = createSelector(
  getDimensionLinkEntitiesState,
  state => {
    if (state && state.loading) {
      return;
    }
    if (state && state.dimensionLinks) {
      const mapppedDimensionLinks = state.dimensionLinks.map(dimensionLink => {
        const viewRoute = dimensionLink.route.find(loc => {
          return loc.view === 'Default';
        });
        return {
          ...dimensionLink,
          route: viewRoute ? viewRoute.points : [],
          // Set property to indicate whether link has a route defined
          routeMissing: !viewRoute
        };
      });

      return mapppedDimensionLinks;
    }
    return;
  }
);

export const getElements = createSelector(
  getElementEntitiesState,
  state => {
    if (state && state.loading) {
      return;
    }
    if (state && state.elements) {
      const mapppedElements = state.elements.map(element => {
        const ViewLoc = element.location.find(loc => {
          return loc.view === 'Default';
        });
        return {
          ...element,
          location: ViewLoc ? ViewLoc.locationCoordinates : null,
          // Set property to indicate whether node has a location defined
          locationMissing: !ViewLoc
        };
      });
      console.log(mapppedElements);
      return mapppedElements;
    }

    return;
  }
);

export const getElementLinks = createSelector(
  getElementLinkEntitiesState,
  state => {
    if (state && state.loading) {
      return;
    }
    if (state && state.elementLinks) {
      const mapppedElementLinks = state.elementLinks.map(elementLink => {
        const viewRoute = elementLink.route.find(loc => {
          return loc.view === 'Default';
        });
        return {
          ...elementLink,
          route: viewRoute ? viewRoute.points : [],
          // Set property to indicate whether link has a route defined
          routeMissing: !viewRoute
        };
      });

      return mapppedElementLinks;
    }
    return;
  }
);

export const getMapViewNodes = createSelector(
  getMapViewEntitiesState,
  state => {
    if (state && state.mapViews) {
      if (state && state.loading) {
        return;
      }
      const mapView = state.mapViewId && state.mapViews.find(item => item.id  === state.mapViewId);
      if (mapView) {
        return (mapView as any).dimensions.map(dimension => {
          const ViewLoc = dimension.location.find(loc => {
            return loc.view === 'Default';
          });
          return {
            ...dimension,
            location: null,
            // Set property to indicate whether link has a route defined
            locationMissing: true
          };
        });
      }
      return [];
    }
    return;
  }
);

export const getMapViewLinks = createSelector(
  getMapViewEntitiesState,
  state => {
    if (state && state.loading) {
      return;
    }
    if (state && state.mapViews) {

      const mapView = state.mapViewId && state.mapViews.find(item => item.id  === state.mapViewId);
      if (mapView) {
        return (mapView as any).dimlinks.map(dimensionLink => {
          const viewRoute = dimensionLink.route.find(loc => {
            return loc.view === 'Default';
          });
          return {
            ...dimensionLink,
            route: [],
            // Set property to indicate whether link has a route defined
            routeMissing: true
          };
        });
      }
      return [];
    }
    return;
  }
);
