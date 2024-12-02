import type { Notification } from "./notification-interface";

interface Data {
  id: number;
  data: string; 
  hora: string;
  localizacao: string;
  type: string;
  user_name: string;
}
export interface NotificationTable {
  title: string;
  headers: {
    label: string;
    property: keyof Notification;
    width?: number;
    renderer?: (value: Notification[keyof Notification]) => string;
  }[];
  datas: Notification[];
}
