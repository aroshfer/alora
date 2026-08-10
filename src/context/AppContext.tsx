import React, {
  createContext, useContext, useReducer,
  useCallback, useRef, useEffect, ReactNode,
} from "react";
import type {
  Agent, Alert, Incident, RawEvent,
  StatsMsg, TerminalOutput, AlertBucket,
} from "../types";

// ── Settings shape — mirrors server.py's DEFAULT_SETTINGS exactly ──────────
export interface Settings {
  behavioral_ai_enabled: boolean;
  alert_threshold:       number;
  critical_threshold:    number;
  high_threshold:        number;
  medium_threshold:      number;
  process_monitor:       boolean;
  network_monitor:       boolean;
  file_monitor:          boolean;
  registry_monitor:      boolean;
  dns_monitor:           boolean;
  auto_correlate:        boolean;
  incident_min_alerts:   number;
  incident_window_secs:  number;
  auto_create_incident:  boolean;
  auto_isolate:           boolean;
  isolate_threshold:      number;
  auto_kill_process:      boolean;
  kill_threshold:         number;
  auto_block_hash:        boolean;
}

const DEFAULT_SETTINGS: Settings = {
  behavioral_ai_enabled: true,
  alert_threshold:       0.60,
  critical_threshold:    0.85,
  high_threshold:        0.65,
  medium_threshold:      0.45,
  process_monitor:       true,
  network_monitor:       true,
  file_monitor:          true,
  registry_monitor:      true,
  dns_monitor:           true,
  auto_correlate:        true,
  incident_min_alerts:   3,
  incident_window_secs:  300,
  auto_create_incident:  true,
  auto_isolate:           false,
  isolate_threshold:      0.97,
  auto_kill_process:      false,
  kill_threshold:         0.99,
  auto_block_hash:        true,
};

// ── State ─────────────────────────────────────────────────────────────────
export interface AppState {
  connected:        boolean;
  wsUrl:            string;
  connecting:       boolean;
  lastPong:         string;
  agents:           Agent[];
  alerts:           Alert[];
  incidents:        Incident[];
  events:           RawEvent[];
  stats:            StatsMsg | null;
  terminalLines:    TerminalOutput[];
  alertTimeline:    AlertBucket[];
  eventRate:        number;
  eventRateHistory: number[];
  totalEvents:      number;
  connection:       { connected: boolean; wsUrl: string };
  hashRules:        any[];
  policies:         any[];
  mitre:            any[];
  settings:         Settings;
}

const INITIAL: AppState = {
  connected:        false,
  wsUrl:            "ws://localhost:8766",
  connecting:       false,
  lastPong:         "",
  agents:           [],
  alerts:           [],
  incidents:        [],
  events:           [],
  stats:            null,
  terminalLines:    [],
  alertTimeline:    [],
  eventRate:        0,
  eventRateHistory: Array(60).fill(0),
  totalEvents:      0,
  connection:       { connected: false, wsUrl: "ws://localhost:8766" },
  hashRules:        [],
  policies:         [],
  mitre:            [],
  settings:         DEFAULT_SETTINGS,
};

// ── Actions ───────────────────────────────────────────────────────────────
type Action =
  | { type: "SET_CONNECTING"; v: boolean }
  | { type: "SET_CONNECTED";  v: boolean }
  | { type: "SET_URL";        v: string }
  | { type: "INIT";           agents: Agent[]; alerts: Alert[]; incidents: Incident[]; events: RawEvent[]; hashRules: any[]; settings: Partial<Settings> }
  | { type: "SET_AGENTS";     agents: Agent[] }
  | { type: "ADD_ALERT";      alert: Alert }
  | { type: "UPDATE_ALERT";   alert: Alert }
  | { type: "ADD_INCIDENT";   incident: Incident }
  | { type: "UPDATE_INCIDENT";incident: Incident }
  | { type: "ADD_EVENT";      event: RawEvent }
  | { type: "HB";             agent_id: string; cpu: number; mem: number; disk: number }
  | { type: "STATS";          stats: StatsMsg }
  | { type: "TERMINAL";       line: TerminalOutput }
  | { type: "SET_RATE";       rate: number }
  | { type: "LAST_PONG";      t: string }
  | { type: "SET_SETTINGS";   settings: Partial<Settings> }
  | { type: "SET_HASH_RULES"; hashRules: any[] }

// ── Timeline helper ───────────────────────────────────────────────────────
function addToTimeline(tl: AlertBucket[], alert: Alert): AlertBucket[] {
  const minute = new Date().toLocaleTimeString("en-GB", {
    hour: "2-digit", minute: "2-digit",
  });
  const next = [...tl];
  const idx  = next.findIndex(b => b.minute === minute);
  if (idx >= 0) {
    next[idx] = { ...next[idx], [alert.severity]: next[idx][alert.severity] + 1 };
  } else {
    const bucket: AlertBucket = { minute, critical: 0, high: 0, medium: 0, low: 0 };
    bucket[alert.severity] = 1;
    next.push(bucket);
    if (next.length > 30) next.shift();
  }
  return next;
}

// ── Reducer ───────────────────────────────────────────────────────────────
// NOTE: events/alerts are intentionally unbounded — no slice() caps.
// Investigation.tsx renders these lists via virtualization, so array size
// has no DOM/render cost. Only tradeoff is JS heap memory over very long
// sessions, which is acceptable for full-history investigation.
function reducer(s: AppState, a: Action): AppState {
  switch (a.type) {
    case "SET_CONNECTING":
      return { ...s, connecting: a.v };

    case "SET_CONNECTED":
      return {
        ...s,
        connected: a.v,
        connecting: false,
        connection: { connected: a.v, wsUrl: s.wsUrl },
      };

    case "SET_URL":
      return {
        ...s,
        wsUrl: a.v,
        connection: { connected: s.connected, wsUrl: a.v },
      };

    case "LAST_PONG":
      return { ...s, lastPong: a.t };

    case "INIT":
      return {
        ...s,
        agents:    a.agents,
        alerts:    a.alerts,
        incidents: a.incidents,
        events:    a.events,
        hashRules: a.hashRules ?? s.hashRules,
        settings:  { ...s.settings, ...a.settings },
      };

    case "SET_AGENTS":
      return { ...s, agents: a.agents };

    case "HB":
      return {
        ...s,
        agents: s.agents.map(ag =>
          ag.id === a.agent_id
            ? { ...ag, cpu: a.cpu, mem: a.mem, disk: a.disk, online: true, lastSeen: new Date().toISOString() }
            : ag
        ),
      };

    case "ADD_ALERT": {
      const alerts = [a.alert, ...s.alerts];
      const alertTimeline = addToTimeline(s.alertTimeline, a.alert);
      return { ...s, alerts, alertTimeline };
    }

    case "UPDATE_ALERT":
      return { ...s, alerts: s.alerts.map(al => al.id === a.alert.id ? a.alert : al) };

    case "ADD_INCIDENT": {
      const exists = s.incidents.some(i => i.id === a.incident.id);
      if (exists) {
        return { ...s, incidents: s.incidents.map(i => i.id === a.incident.id ? a.incident : i) };
      }
      return { ...s, incidents: [a.incident, ...s.incidents] };
    }

    case "UPDATE_INCIDENT":
      return { ...s, incidents: s.incidents.map(i => i.id === a.incident.id ? a.incident : i) };

    case "ADD_EVENT":
      return {
        ...s,
        events:      [a.event, ...s.events],
        totalEvents: s.totalEvents + 1,
      };

    case "STATS":
      return { ...s, stats: a.stats };

    case "TERMINAL":
      return { ...s, terminalLines: [a.line, ...s.terminalLines].slice(0, 500) };

    case "SET_RATE": {
      const hist = [...s.eventRateHistory.slice(1), a.rate];
      return { ...s, eventRate: a.rate, eventRateHistory: hist };
    }

    case "SET_SETTINGS":
      return { ...s, settings: { ...s.settings, ...a.settings } };

    case "SET_HASH_RULES":
      return { ...s, hashRules: a.hashRules };

    default:
      return s;
  }
}

// ── Context type ──────────────────────────────────────────────────────────
export interface Ctx extends AppState {
  state:      AppState;
  connect:              (url?: string) => void;
  disconnect:           () => void;
  sendCmd:              (agent_id: string, action: string, cmd?: string, extra?: Record<string, unknown>) => void;
  updateAlertStatus:    (id: string, status: Alert["status"]) => void;
  updateIncidentStatus: (id: string, status: Incident["status"]) => void;
  updateSettings:       (patch: Partial<Settings>) => void;
  addHashRule:          (hash: string, type?: string, addedBy?: string) => void;
}

const AppContext = createContext<Ctx>(null as any);

export const useApp = () => useContext(AppContext);

// Alias — some components import `useAppContext` instead of `useApp`.
export const useAppContext = useApp;

// ── Provider ──────────────────────────────────────────────────────────────
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL);
  const wsRef       = useRef<WebSocket | null>(null);
  const retryRef    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const evtCountRef = useRef(0);
  const rateTickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    rateTickRef.current = setInterval(() => {
      dispatch({ type: "SET_RATE", rate: evtCountRef.current });
      evtCountRef.current = 0;
    }, 1000);
    return () => {
      if (rateTickRef.current) clearInterval(rateTickRef.current);
    };
  }, []);

  const handleMessage = useCallback((raw: string) => {
    let msg: any;
    try { msg = JSON.parse(raw); } catch { return; }

    switch (msg.type) {
      case "init":
        dispatch({
          type:      "INIT",
          agents:    msg.agents    ?? [],
          alerts:    msg.alerts    ?? [],
          incidents: msg.incidents ?? [],
          events:    msg.events    ?? [],
          hashRules: msg.hashRules ?? [],
          settings:  msg.settings  ?? {},
        });
        break;

      case "agents":
        dispatch({ type: "SET_AGENTS", agents: msg.agents ?? [] });
        break;

      case "alert":
        dispatch({ type: "ADD_ALERT", alert: msg.alert });
        break;

      case "alert_update":
        dispatch({ type: "UPDATE_ALERT", alert: msg.alert });
        break;

      case "incident":
        dispatch({ type: "ADD_INCIDENT", incident: msg.incident });
        break;

      case "incident_update":
        dispatch({ type: "UPDATE_INCIDENT", incident: msg.incident });
        break;

      case "event":
        dispatch({ type: "ADD_EVENT", event: msg.event });
        evtCountRef.current++;
        break;

      case "heartbeat":
        dispatch({
          type:     "HB",
          agent_id: msg.agent_id,
          cpu:      msg.cpu,
          mem:      msg.mem,
          disk:     msg.disk,
        });
        break;

      case "stats":
        dispatch({ type: "STATS", stats: msg });
        break;

      case "terminal_output":
        dispatch({ type: "TERMINAL", line: msg });
        break;

      case "settings":
        dispatch({ type: "SET_SETTINGS", settings: msg.settings ?? {} });
        break;

      case "hash_rules":
        dispatch({ type: "SET_HASH_RULES", hashRules: msg.hashRules ?? [] });
        break;

      case "pong":
        dispatch({ type: "LAST_PONG", t: msg.time ?? new Date().toISOString() });
        break;
    }
  }, []);

  const connect = useCallback((url?: string) => {
    const target = url ?? state.wsUrl;
    if (retryRef.current) clearTimeout(retryRef.current);
    if (wsRef.current) { wsRef.current.onclose = null; wsRef.current.close(); }

    dispatch({ type: "SET_CONNECTING", v: true });
    dispatch({ type: "SET_URL", v: target });

    const ws = new WebSocket(target);
    wsRef.current = ws;

    ws.onopen = () => {
      dispatch({ type: "SET_CONNECTED", v: true });
      const pingId = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: "ping" }));
        } else {
          clearInterval(pingId);
        }
      }, 30_000);
      (ws as any)._pingId = pingId;
    };

    ws.onmessage = e => handleMessage(e.data);

    ws.onclose = () => {
      clearInterval((ws as any)._pingId);
      dispatch({ type: "SET_CONNECTED", v: false });
      retryRef.current = setTimeout(() => connect(target), 5000);
    };

    ws.onerror = () => {
      dispatch({ type: "SET_CONNECTING", v: false });
    };
  }, [state.wsUrl, handleMessage]);

  const disconnect = useCallback(() => {
    if (retryRef.current) clearTimeout(retryRef.current);
    if (wsRef.current) {
      clearInterval((wsRef.current as any)._pingId);
      wsRef.current.onclose = null;
      wsRef.current.close();
      wsRef.current = null;
    }
    dispatch({ type: "SET_CONNECTED", v: false });
  }, []);

  const sendCmd = useCallback(
    (agent_id: string, action: string, cmd = "", extra: Record<string, unknown> = {}) => {
      wsRef.current?.send(JSON.stringify({ type: "command", agent_id, action, cmd, ...extra }));
    },
    []
  );

  const updateAlertStatus = useCallback(
    (id: string, status: Alert["status"]) => {
      wsRef.current?.send(JSON.stringify({ type: "update_alert", alert_id: id, status }));
      const alert = state.alerts.find(a => a.id === id);
      if (alert) dispatch({ type: "UPDATE_ALERT", alert: { ...alert, status } });
    },
    [state.alerts]
  );

  const updateIncidentStatus = useCallback(
    (id: string, status: Incident["status"]) => {
      wsRef.current?.send(JSON.stringify({ type: "update_incident", incident_id: id, status }));
      const inc = state.incidents.find(i => i.id === id);
      if (inc) dispatch({ type: "UPDATE_INCIDENT", incident: { ...inc, status } });
    },
    [state.incidents]
  );

  // Optimistic local update + push to server.py — every Settings page
  // control should call this. server.py applies the patch immediately
  // and echoes it back via {"type":"settings"} to all dashboards.
  const updateSettings = useCallback(
    (patch: Partial<Settings>) => {
      dispatch({ type: "SET_SETTINGS", settings: patch });
      wsRef.current?.send(JSON.stringify({ type: "update_settings", settings: patch }));
    },
    []
  );

  const addHashRule = useCallback(
    (hash: string, type = "block", addedBy = "Analyst") => {
      wsRef.current?.send(JSON.stringify({ type: "add_hash_rule", hash, rule_type: type, addedBy }));
    },
    []
  );

  const ctxValue: Ctx = {
    ...state,
    state,
    connect,
    disconnect,
    sendCmd,
    updateAlertStatus,
    updateIncidentStatus,
    updateSettings,
    addHashRule,
  };

  return (
    <AppContext.Provider value={ctxValue}>
      {children}
    </AppContext.Provider>
  );
}