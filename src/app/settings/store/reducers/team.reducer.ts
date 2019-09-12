import { TeamDetails, Page, Links, TeamEntity } from '../models/team.model';
import { TeamActionTypes, TeamActionsUnion } from '../actions/team.actions';
import { HttpErrorResponse } from '@angular/common/http';

export interface State {
  loading: boolean;
  entities: TeamEntity[];
  selected: TeamDetails;
  page: Page;
  links: Links;
  error?: HttpErrorResponse | { message: string };
}

export const initialState: State = {
  loading: false,
  entities: null,
  selected: null,
  page: null,
  links: null,
  error: null
};

export function reducer(state = initialState, action: TeamActionsUnion): State {
  switch (action.type) {

    case TeamActionTypes.LoadTeams: {
      return {
        ...initialState,
        loading: true
      };
    }

    case TeamActionTypes.LoadTeamsSuccess: {
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        links: action.payload.links,
        page: action.payload.page,
      };
    }

    case TeamActionTypes.LoadTeamsFailure: {
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    }

    case TeamActionTypes.LoadTeamSuccess: {
      return {
        ...state,
        loading: false,
        selected: action.payload.data
      };
    }

    case TeamActionTypes.AddTeam:
    case TeamActionTypes.LoadTeam:
    case TeamActionTypes.UpdateTeam:
    case TeamActionTypes.DeleteTeam:
    case TeamActionTypes.AddMember:
    case TeamActionTypes.DeleteMember: {
      return {
        ...state,
        loading: true
      };
    }

    case TeamActionTypes.AddTeamSuccess: {
      const addedEntity = action.payload.data;
      return {
        ...state,
        entities: [...state.entities, addedEntity],
        loading: false
      };
    }

    case TeamActionTypes.AddMemberSuccess: {
      return {
        ...state,
        selected: action.payload,
        loading: false
      };
    }

    case TeamActionTypes.UpdateTeamSuccess: {
      const updatedEntity = action.payload.data;
      return {
        ...state,
        entities: state.entities.map(entity => {
          if (entity.id === updatedEntity.id) {
            return updatedEntity;
          }
          return entity;
        }),
        loading: false
      };
    }

    case TeamActionTypes.UpdateTeamFailure:
    case TeamActionTypes.DeleteTeamFailure:
    case TeamActionTypes.AddTeamFailure:
    case TeamActionTypes.LoadTeamFailure:
    case TeamActionTypes.AddMemberFailure:
    case TeamActionTypes.DeleteMemberFailure: {
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    }


    case TeamActionTypes.DeleteTeamSuccess: {
      return {
        ...state,
        entities: state.entities.filter(entity => entity.id !== action.payload),
        loading: false
      };
    }

    case TeamActionTypes.DeleteMemberSuccess: {
      return {
        ...state,
        selected: action.payload,
        loading: false
      };
    }

    default: {
      return state;
    }
  }
}
