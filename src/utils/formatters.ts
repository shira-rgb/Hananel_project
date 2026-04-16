import dayjs from "dayjs";
import "dayjs/locale/he";

dayjs.locale("he");

export const formatDate = (date: string) =>
  dayjs(date).format("DD/MM/YYYY HH:mm");

export const formatPrice = (price: number) =>
  new Intl.NumberFormat("he-IL", { style: "currency", currency: "ILS" }).format(price);

export const formatFileSize = (bytes?: number) => {
  if (!bytes) return "-";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const delayUnitLabel = (unit: string) => {
  const map: Record<string, string> = {
    hours: "שעות",
    days: "ימים",
    weeks: "שבועות",
  };
  return map[unit] ?? unit;
};

export const usageTypeLabel = (type?: string) => {
  const map: Record<string, string> = {
    product_explanation: "הסבר מוצר",
    client_example: "דוגמת לקוח",
    other: "אחר",
  };
  return type ? (map[type] ?? type) : "-";
};

export const inquiryStatusLabel = (status?: string) => {
  const map: Record<string, string> = {
    inquired: "פנו",
    scheduled: "קבעו פגישה",
    callback_requested: "ממתינים לשיחה חוזרת",
  };
  return status ? (map[status] ?? status) : "-";
};

export const inquiryStatusColor = (status?: string) => {
  const map: Record<string, string> = {
    inquired: "blue",
    scheduled: "green",
    callback_requested: "orange",
  };
  return status ? (map[status] ?? "default") : "default";
};

export const formatDateOnly = (date: string) => dayjs(date).format("DD/MM/YYYY");
