import {
  call,
  put,
  takeLatest,
} from 'redux-saga/effects';
import {
  ROUTE_AGENT,
  ROUTE_EXPORT,
  ROUTE_IMPORT,
} from '../../../common/constants';
import { toAPIPath } from '../../utils/locationResolver';
import {
  exportAgentError,
  exportAgentSuccess,
  importAgentError,
  importAgentSuccess,
  loadAgentsError,
  loadAgentsSuccess,
} from '../App/actions';
import {
  EXPORT_AGENT,
  IMPORT_AGENT,
  LOAD_AGENTS,
} from '../App/constants';

export function* getAgents(payload) {
  const { api } = payload;

  try {
    const response = yield call(api.get, toAPIPath([ROUTE_AGENT]));
    yield put(loadAgentsSuccess(response.data));
  }
  catch (err) {
    yield put(loadAgentsError(err));
  }
}

export function* getAgentExport(payload) {
  const { api, id } = payload;

  try {
    if (id !== 0) {
      const response = yield call(api.get, toAPIPath([ROUTE_AGENT, id, ROUTE_EXPORT]));
      yield put(exportAgentSuccess(response));
    }
    else {
      yield put(exportAgentSuccess(null));
    }
  }
  catch (err) {
    yield put(exportAgentError(err));
  }
}

export function* postAgentImport(payload) {
  const { api, agent } = payload;
  try {
    const response = yield call(api.post, toAPIPath([ROUTE_AGENT, ROUTE_IMPORT]), agent);
    yield put(importAgentSuccess(response.obj));
    yield call(getAgents, { api });
  }
  catch (err) {
    yield put(importAgentError(err));
  }
}

export default function* loadAgents() {
  yield takeLatest(LOAD_AGENTS, getAgents);
  yield takeLatest(EXPORT_AGENT, getAgentExport);
  yield takeLatest(IMPORT_AGENT, postAgentImport);
}
