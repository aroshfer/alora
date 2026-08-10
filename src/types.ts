// ── Agent ─────────────────────────────────────────────────────────────────
export interface Agent {
  id:          string;
  hostname:    string;
  os:          string;
  os_version?: string;
  arch?:       string;
  ip:          string;
  online:      boolean;
  lastSeen:    string;
  cpu:         number;
  mem:         number;
  disk?:       number;
  version:     string;
  tags?:       string[];
  enrolledAt?: string;
}

// ── Alert ─────────────────────────────────────────────────────────────────
export type AlertSeverity = "critical" | "high" | "medium" | "low";
export type AlertStatus   = "new" | "investigating" | "resolved" | "false_positive";

export interface Alert {
  id:            string;
  title:         string;
  name?:         string;
  severity:      AlertSeverity;
  host?:         string;
  agent_id?:     string;
  process?:      string;
  exe?:          string;
  cmdline?:      string;
  technique?:    string;
  tacticId?:     string;
  score?:        number;
  time:          string;
  pid?:          number;
  remote_ip?:    string;
  remote_port?:  number;
  file_path?:    string;
  file_hash?:    string;
  reg_key?:      string;
  user?:         string;
  parent?:       string;
  status:        AlertStatus;
  event_type?:   string;
}

// ── Incident ──────────────────────────────────────────────────────────────
export type IncidentStatus = "open" | "investigating" | "contained" | "resolved";

export interface Incident {
  id:           string;
  title:        string;
  severity:     AlertSeverity;
  status:       IncidentStatus;
  host?:        string;
  agent_id?:    string;
  alerts?:      number;
  createdAt:    string;
  updatedAt:    string;
  description?: string;
  techniques?:  string[];
  tactics?:     string[];
}

// ── Raw telemetry event (from agent → server → dashboard) ──────────────────
export interface RawEvent {
  type:          string;
  hostname:      string;
  agent_id?:     string;
  server_ts?:    string;
  timestamp?:    string;
  pid?:          number;
  process?:      string;
  cmdline?:      string;
  exe?:          string;
  parent?:       string;
  ppid?:         number;
  user?:         string;
  cpu_percent?:  number;
  mem_percent?:  number;
  file_hash?:    string;
  file_path?:    string;
  file_name?:    string;
  executable?:   boolean;
  file_size?:    number;
  registry_key?: string;
  local_ip?:     string;
  local_port?:   number;
  remote_ip?:    string;
  remote_port?:  number;
  protocol?:     string;
  description?:  string;
  score?:        number;
}

// ── Server stats broadcast ──────────────────────────────────────────────────
export interface StatsMsg {
  type:       "stats";
  time:       string;
  agents:     number;
  alerts:     number;
  critical:   number;
  incidents:  number;
  events:     number;
}

// ── Live terminal output ────────────────────────────────────────────────────
export interface TerminalOutput {
  agent_id:  string;
  hostname?: string;
  output:    string;
  cmd?:      string;
  time:      string;
}

// ── Alert timeline bucket (per-minute severity counts) ──────────────────────
export interface AlertBucket {
  minute:   string;
  critical: number;
  high:     number;
  medium:   number;
  low:      number;
}