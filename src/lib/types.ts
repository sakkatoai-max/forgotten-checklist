export interface CheckItem {
  id: string;
  label: string;
}

export interface Child {
  id: string;
  name: string;
  items: CheckItem[];
  themeColor?: string; // Optional: for future use or distinct UI
}

export interface DailyLog {
  [date: string]: {
    checkedItemIds: string[];
  };
}

export interface StorageData {
  children: Child[];
  activeChildId: string | null;
  daily: {
    [childId: string]: DailyLog;
  };
  version: number;
}
