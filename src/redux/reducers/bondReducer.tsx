import { App } from '../types';

interface BondState {
  apps: Map<number, App>,
}

const initialState: BondState = {
  apps: new Map<number, App>()
};

export function bondReducer(state = initialState, action: any) {
  switch (action.type) {
    case "SET_APPS": {
      const { apps } = action.payload;
      const appsMap = new Map<number, App>(apps.map(app => [app.app_id, app]));
      return {
        ...state,
        apps: appsMap
      };
    }
    case "SET_MAIN_APP_GLOBAL_STATE": {
      const { appId, appState } = action.payload;
      const appsMap = state.apps;

      if (!appsMap.has(appId)) return state;

      appsMap.get(appId)!.app_global_state = appState;
      return {
        ...state,
        apps: appsMap
      };
    }
    case "SET_MANAGE_APP_GLOBAL_STATE": {
      const { appId, appState } = action.payload;
      const appsMap = state.apps;

      if (!appsMap.has(appId)) return state;

      appsMap.get(appId)!.manage_app_global_state = appState;
      return {
        ...state,
        apps: appsMap
      };
    }
    default:
      return state;
  }
}