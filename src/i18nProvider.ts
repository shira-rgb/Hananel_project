import type { I18nProvider } from "@refinedev/core";

const dict: Record<string, string> = {
  // Buttons
  "buttons.save": "שמור",
  "buttons.edit": "עריכה",
  "buttons.create": "הוסף",
  "buttons.delete": "מחק",
  "buttons.show": "הצג",
  "buttons.list": "רשימה",
  "buttons.cancel": "ביטול",
  "buttons.confirm": "אישור",
  "buttons.filter": "סינון",
  "buttons.clear": "נקה",
  "buttons.refresh": "רענן",
  "buttons.notAccessTitle": "אין הרשאה",
  "buttons.logout": "התנתקות",
  "buttons.import": "ייבוא",
  "buttons.export": "ייצוא",
  "buttons.clone": "שכפל",
  "buttons.undo": "בטל",
  // Notifications
  "notifications.success": "הצלחה",
  "notifications.error": "שגיאה",
  "notifications.createSuccess": "נוצר בהצלחה",
  "notifications.editSuccess": "נשמר בהצלחה",
  "notifications.deleteSuccess": "נמחק בהצלחה",
  "notifications.undoable": "{{seconds}} שניות לביטול",
  "notifications.importProgress": "ייבוא: {{processed}} מתוך {{total}}",
  // Generic
  "warnWhenUnsavedChanges": "יש שינויים שלא נשמרו. לעזוב?",
  "table.actions": "פעולות",
  // Error pages
  "pages.error.404": "הדף לא נמצא",
  "pages.error.resourceNotFound": "המשאב לא נמצא",
  "pages.error.backHome": "חזרה לדף הראשי",
  // Login (in case Refine renders defaults)
  "pages.login.title": "התחברות",
  "pages.login.signin": "כניסה",
  "pages.login.fields.email": "אימייל",
  "pages.login.fields.password": "סיסמה",
};

const interpolate = (str: string, params?: Record<string, unknown>) => {
  if (!params) return str;
  return str.replace(/\{\{(\w+)\}\}/g, (_, k) => {
    const v = params[k];
    return v === undefined || v === null ? `{{${k}}}` : String(v);
  });
};

export const i18nProvider: I18nProvider = {
  translate: (key, options, defaultMessage) => {
    let params: Record<string, unknown> | undefined;
    let dm: string | undefined = defaultMessage;
    if (typeof options === "string") {
      dm = options;
    } else if (options && typeof options === "object" && !Array.isArray(options)) {
      params = options as Record<string, unknown>;
    }
    const raw = dict[key] ?? dm ?? key;
    return interpolate(raw, params);
  },
  changeLocale: () => Promise.resolve(),
  getLocale: () => "he",
};
