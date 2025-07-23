export interface HealthStatus {
  status: string;
  timestamp: string;
  version: string;
}

export interface Metrics {
  status: string;
  timestamp: string;
  system: {
    uptime: string;
    memory: {
      total: string;
      used: string;
      free: string;
      usagePercent: number;
    };
    disk: {
      total: string;
      used: string;
      free: string;
      usagePercent: number;
    };
    cpu: {
      usagePercent: number;
    };
  };
}

export interface DatabaseStatus {
  status: string;
  timestamp: string;
  database: {
    connection: string;
    state: string;
    canConnect: boolean;
    pendingMigrations: string[];
    appliedMigrations: string[];
    tables_size_in_mb_total: string;
    tables_row_count: { [table: string]: number };
    tables_size_in_mb: {
      tableName: string;
      size: string;
      rowCount: number;
    }[];
  };
}
