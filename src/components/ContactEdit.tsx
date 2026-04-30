import { useEffect, useMemo, useState } from "react";
import { useOne, useUpdate, useDelete, useNavigation } from "@refinedev/core";
import {
  Tabs,
  Form,
  Input,
  Select,
  Switch,
  Button,
  Skeleton,
  Space,
  Popconfirm,
  Avatar,
  Tag,
  message,
  InputNumber,
} from "antd";
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  SaveOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  IdcardOutlined,
  HomeOutlined,
  HeartOutlined,
  AimOutlined,
  DollarOutlined,
  BellOutlined,
  FileTextOutlined,
  SettingOutlined,
  CrownOutlined,
  FireOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { formatDate } from "../utils/formatters";

type Business = "aesthetic" | "dental";
type Kind = "leads" | "clients";

interface FieldDef {
  key: string;
  label: string;
  type?:
    | "text"
    | "email"
    | "tel"
    | "textarea"
    | "number"
    | "select"
    | "date"
    | "datetime"
    | "boolean"
    | "url";
  options?: string[];
  readonly?: boolean;
  rows?: number;
  span?: number;
}

interface SectionDef {
  key: string;
  title: string;
  icon: React.ReactNode;
  fields: FieldDef[];
}

const LEAD_SECTIONS: SectionDef[] = [
  {
    key: "general",
    title: "כללי",
    icon: <UserOutlined />,
    fields: [
      { key: "first_name", label: "שם פרטי", type: "text" },
      { key: "last_name", label: "שם משפחה", type: "text" },
      { key: "normalized_phone", label: "טלפון", type: "tel" },
      { key: "email", label: "מייל", type: "email" },
      {
        key: "gender",
        label: "מגדר",
        type: "select",
        options: ["זכר", "נקבה", "אחר"],
      },
      { key: "birthdate", label: "תאריך לידה", type: "date", readonly: true },
      { key: "is_bot_active", label: "סוכן AI פעיל", type: "boolean" },
    ],
  },
  {
    key: "status",
    title: "סטטוס וטיפול",
    icon: <AimOutlined />,
    fields: [
      {
        key: "status",
        label: "סטטוס",
        type: "select",
        options: [
          "new",
          "contacted",
          "interested",
          "consultation_booked",
          "converted",
          "escalated_to_human",
          "lost",
          "not_interested",
        ],
      },
      { key: "lead_status_he", label: "סטטוס בעברית", type: "text" },
      { key: "stage", label: "שלב", type: "text" },
      {
        key: "concern",
        label: "פנייה ראשונית",
        type: "textarea",
        rows: 3,
        span: 2,
      },
      {
        key: "interested_treatment",
        label: "מתעניין/ת בטיפול",
        type: "text",
        span: 2,
      },
      {
        key: "has_sent_photo",
        label: "שלח תמונה",
        type: "boolean",
        readonly: true,
      },
      { key: "photo_url", label: "קישור תמונה", type: "url", readonly: true },
    ],
  },
  {
    key: "marketing",
    title: "מקור ושיווק",
    icon: <FireOutlined />,
    fields: [
      { key: "source", label: "מקור", type: "textarea", rows: 2, span: 2 },
      { key: "arrival_source", label: "מקור הגעה", type: "text" },
      { key: "campaign", label: "קמפיין", type: "text" },
      { key: "ads_set", label: "קבוצת מודעות", type: "text" },
      { key: "ad_name", label: "שם מודעה", type: "text" },
    ],
  },
  {
    key: "crm",
    title: "CRM",
    icon: <CrownOutlined />,
    fields: [
      { key: "pipeline", label: "Pipeline", type: "text" },
      { key: "assigned", label: "מוקצה ל", type: "text" },
      { key: "lead_value", label: "ערך הליד", type: "number" },
      { key: "engagement_score", label: "ציון מעורבות", type: "number" },
      { key: "opportunity_name", label: "שם הזדמנות", type: "text" },
      { key: "lost_reason", label: "סיבת אובדן", type: "text" },
      { key: "crm_status", label: "סטטוס CRM", type: "text" },
      { key: "tags", label: "תיוגים", type: "text", span: 2 },
    ],
  },
  {
    key: "notes",
    title: "הערות",
    icon: <FileTextOutlined />,
    fields: [
      { key: "notes", label: "הערות", type: "textarea", rows: 8, span: 2 },
    ],
  },
  {
    key: "system",
    title: "מערכת",
    icon: <SettingOutlined />,
    fields: [
      { key: "id", label: "מזהה", type: "text", readonly: true },
      { key: "created_at", label: "נוצר ב", type: "datetime", readonly: true },
      {
        key: "updated_at",
        label: "עודכן לאחרונה",
        type: "datetime",
        readonly: true,
      },
      {
        key: "last_reminder_sent",
        label: "תזכורת אחרונה נשלחה",
        type: "datetime",
        readonly: true,
      },
      {
        key: "registration_date",
        label: "תאריך הרשמה",
        type: "date",
        readonly: true,
      },
      {
        key: "crm_created_on",
        label: "נוצר ב־CRM",
        type: "datetime",
        readonly: true,
      },
      {
        key: "crm_updated_on",
        label: "עודכן ב־CRM",
        type: "datetime",
        readonly: true,
      },
      {
        key: "days_since_last_stage_change",
        label: "ימים מאז שינוי שלב",
        type: "text",
        readonly: true,
      },
      {
        key: "days_since_last_status_change",
        label: "ימים מאז שינוי סטטוס",
        type: "text",
        readonly: true,
      },
      {
        key: "days_since_last_updated",
        label: "ימים מאז עדכון",
        type: "text",
        readonly: true,
      },
      {
        key: "chatwoot_contact_id",
        label: "Chatwoot Contact",
        type: "number",
        readonly: true,
      },
      {
        key: "chatwoot_conversation_id",
        label: "Chatwoot Conversation",
        type: "number",
        readonly: true,
      },
      { key: "contact_id", label: "Contact ID", type: "text", readonly: true },
      {
        key: "opportunity_id",
        label: "Opportunity ID",
        type: "text",
        readonly: true,
      },
      {
        key: "pipeline_id",
        label: "Pipeline ID",
        type: "text",
        readonly: true,
      },
      {
        key: "pipeline_stage_id",
        label: "Pipeline Stage ID",
        type: "text",
        readonly: true,
      },
    ],
  },
];

const CLIENT_SECTIONS: SectionDef[] = [
  {
    key: "general",
    title: "כללי",
    icon: <UserOutlined />,
    fields: [
      { key: "first_name", label: "שם פרטי", type: "text" },
      { key: "last_name", label: "שם משפחה", type: "text" },
      { key: "normalized_phone", label: "טלפון נייד", type: "tel" },
      { key: "telephone", label: "טלפון נוסף", type: "tel" },
      { key: "home_number", label: "טלפון בית", type: "tel" },
      { key: "email", label: "מייל", type: "email" },
      {
        key: "gender",
        label: "מגדר",
        type: "select",
        options: ["זכר", "נקבה", "אחר"],
      },
      { key: "birthdate", label: "תאריך לידה", type: "date", readonly: true },
      { key: "is_bot_active", label: "סוכן AI פעיל", type: "boolean" },
    ],
  },
  {
    key: "address",
    title: "כתובת",
    icon: <HomeOutlined />,
    fields: [
      { key: "city", label: "עיר", type: "text" },
      { key: "address", label: "כתובת", type: "text" },
      { key: "country", label: "מדינה", type: "text" },
      { key: "zipcode", label: "מיקוד", type: "text" },
      { key: "mailbox", label: "תיבת דואר", type: "text" },
    ],
  },
  {
    key: "treatments",
    title: "טיפולים",
    icon: <HeartOutlined />,
    fields: [
      { key: "last_treatment_type", label: "טיפול אחרון", type: "text" },
      {
        key: "last_treatment_date",
        label: "תאריך טיפול אחרון",
        type: "date",
        readonly: true,
      },
      { key: "number_of_visits", label: "מס' ביקורים", type: "number" },
      { key: "client_status", label: "סטטוס לקוח", type: "text" },
      { key: "external_status", label: "סטטוס חיצוני", type: "text" },
      {
        key: "concern",
        label: "פנייה ראשונית",
        type: "textarea",
        rows: 3,
        span: 2,
      },
      {
        key: "interested_treatment",
        label: "מתעניין/ת בטיפול",
        type: "text",
        span: 2,
      },
      { key: "interested", label: "תחום עניין", type: "text" },
      {
        key: "followup_after_last_treatment",
        label: "פולואפ בוצע אוטומטית",
        type: "boolean",
        readonly: true,
      },
      {
        key: "has_sent_photo",
        label: "שלח תמונה",
        type: "boolean",
        readonly: true,
      },
      { key: "photo_url", label: "קישור תמונה", type: "url", readonly: true },
    ],
  },
  {
    key: "marketing",
    title: "מקור ושיווק",
    icon: <FireOutlined />,
    fields: [
      { key: "source", label: "מקור", type: "textarea", rows: 2, span: 2 },
      { key: "arrival_source", label: "מקור הגעה", type: "text" },
      { key: "campaign", label: "קמפיין", type: "text" },
      { key: "ads_set", label: "קבוצת מודעות", type: "text" },
      { key: "ad_name", label: "שם מודעה", type: "text" },
      { key: "self_order", label: "Self Order", type: "text" },
    ],
  },
  {
    key: "finance",
    title: "כספים",
    icon: <DollarOutlined />,
    fields: [
      {
        key: "current_year_income",
        label: "הכנסה שנה נוכחית",
        type: "number",
        readonly: true,
      },
      { key: "oncredit", label: "באשראי", type: "number" },
      { key: "tax_withholding", label: "ניכוי מס", type: "text" },
    ],
  },
  {
    key: "notifications",
    title: "התראות",
    icon: <BellOutlined />,
    fields: [
      { key: "send_notifications", label: "שלח התראות", type: "number" },
      { key: "send_reminder", label: "שלח תזכורת", type: "number" },
      { key: "reminder_send_type", label: "סוג תזכורת", type: "number" },
      { key: "send_documents", label: "שלח מסמכים", type: "number" },
      {
        key: "request_order_confirmation",
        label: "אישור הזמנה",
        type: "number",
      },
      { key: "group_notifications", label: "התראות קבוצתיות", type: "number" },
      {
        key: "birthday_sent_date",
        label: "תאריך שליחת ברכת יום הולדת",
        type: "date",
        readonly: true,
      },
    ],
  },
  {
    key: "notes",
    title: "הערות",
    icon: <FileTextOutlined />,
    fields: [
      { key: "notes", label: "הערות", type: "textarea", rows: 8, span: 2 },
    ],
  },
  {
    key: "system",
    title: "מערכת",
    icon: <SettingOutlined />,
    fields: [
      { key: "id", label: "מזהה", type: "text", readonly: true },
      { key: "is_lead", label: "מקור: ליד", type: "number", readonly: true },
      {
        key: "registration_date",
        label: "תאריך הרשמה",
        type: "date",
        readonly: true,
      },
      { key: "created_at", label: "נוצר ב", type: "datetime", readonly: true },
      {
        key: "updated_at",
        label: "עודכן לאחרונה",
        type: "datetime",
        readonly: true,
      },
      { key: "dealer_id", label: "Dealer ID", type: "text", readonly: true },
      { key: "resource", label: "Resource", type: "text", readonly: true },
      { key: "fax", label: "פקס", type: "text" },
      {
        key: "chatwoot_contact_id",
        label: "Chatwoot Contact",
        type: "number",
        readonly: true,
      },
      {
        key: "chatwoot_conversation_id",
        label: "Chatwoot Conversation",
        type: "number",
        readonly: true,
      },
    ],
  },
];

interface Palette {
  primary: string;
  accent: string;
  soft: string;
  border: string;
  chip: string;
  deep: string;
  label: string;
  icon: string;
}

const PALETTE: Record<Business, Palette> = {
  aesthetic: {
    primary: "#7c2d92",
    accent: "#e0b3d8",
    soft: "#fbf6fa",
    border: "#e8d6e3",
    chip: "#ad4e9c",
    deep: "#3d1738",
    label: "קליניקה אסתטית",
    icon: "✨",
  },
  dental: {
    primary: "#0d6e6e",
    accent: "#9ed4d4",
    soft: "#f4faf9",
    border: "#cfe6e3",
    chip: "#127a7a",
    deep: "#0a3838",
    label: "מרפאת שיניים",
    icon: "🦷",
  },
};

const fullName = (r: Record<string, unknown>) =>
  (r.full_name as string) ||
  [r.first_name, r.last_name].filter(Boolean).join(" ") ||
  "ללא שם";

const initials = (r: Record<string, unknown>) => {
  const name = fullName(r);
  const parts = name.split(" ").filter(Boolean);
  return (parts[0]?.[0] || "?") + (parts[1]?.[0] || "");
};

function FieldRenderer({
  field,
  palette,
}: {
  field: FieldDef;
  palette: Palette;
}) {
  const common = {
    style: { borderRadius: 10, borderColor: palette.border },
  };

  if (field.readonly) {
    return (
      <Form.Item
        name={field.key}
        label={field.label}
        style={{ marginBottom: 12 }}
      >
        <ReadonlyDisplay type={field.type} palette={palette} />
      </Form.Item>
    );
  }

  switch (field.type) {
    case "textarea":
      return (
        <Form.Item
          name={field.key}
          label={field.label}
          style={{ marginBottom: 12 }}
        >
          <Input.TextArea rows={field.rows || 3} {...common} />
        </Form.Item>
      );
    case "number":
      return (
        <Form.Item
          name={field.key}
          label={field.label}
          style={{ marginBottom: 12 }}
        >
          <InputNumber style={{ width: "100%", ...common.style }} />
        </Form.Item>
      );
    case "select":
      return (
        <Form.Item
          name={field.key}
          label={field.label}
          style={{ marginBottom: 12 }}
        >
          <Select
            allowClear
            options={(field.options || []).map((o) => ({ label: o, value: o }))}
            style={{ width: "100%" }}
          />
        </Form.Item>
      );
    case "boolean":
      return (
        <Form.Item
          name={field.key}
          label={field.label}
          valuePropName="checked"
          style={{ marginBottom: 12 }}
        >
          <Switch />
        </Form.Item>
      );
    case "email":
      return (
        <Form.Item
          name={field.key}
          label={field.label}
          style={{ marginBottom: 12 }}
        >
          <Input
            type="email"
            prefix={<MailOutlined style={{ color: palette.primary }} />}
            {...common}
          />
        </Form.Item>
      );
    case "tel":
      return (
        <Form.Item
          name={field.key}
          label={field.label}
          style={{ marginBottom: 12 }}
        >
          <Input
            prefix={<PhoneOutlined style={{ color: palette.primary }} />}
            {...common}
          />
        </Form.Item>
      );
    case "url":
      return (
        <Form.Item
          name={field.key}
          label={field.label}
          style={{ marginBottom: 12 }}
        >
          <Input {...common} />
        </Form.Item>
      );
    default:
      return (
        <Form.Item
          name={field.key}
          label={field.label}
          style={{ marginBottom: 12 }}
        >
          <Input {...common} />
        </Form.Item>
      );
  }
}

function ReadonlyDisplay({
  value,
  type,
  palette,
}: {
  value?: unknown;
  type?: FieldDef["type"];
  palette: Palette;
}) {
  if (value === null || value === undefined || value === "") {
    return (
      <div
        style={{
          padding: "6px 11px",
          minHeight: 32,
          background: "#f8fafc",
          border: "1px dashed #e2e8f0",
          borderRadius: 10,
          color: "#94a3b8",
          fontSize: 13,
        }}
      >
        —
      </div>
    );
  }
  let display: React.ReactNode = String(value);
  if (type === "datetime") display = formatDate(String(value));
  else if (type === "date") display = dayjs(String(value)).format("DD/MM/YYYY");
  else if (type === "boolean")
    display = (
      <Tag
        style={{
          border: `1px solid ${value ? "#16a34a" : "#cbd5e1"}`,
          color: value ? "#16a34a" : "#64748b",
          background: value ? "#dcfce7" : "#f8fafc",
          borderRadius: 999,
        }}
      >
        {value ? "כן" : "לא"}
      </Tag>
    );
  else if (type === "url" && typeof value === "string")
    display = (
      <a
        href={value}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: palette.primary }}
      >
        {value.length > 50 ? value.slice(0, 50) + "…" : value}
      </a>
    );

  return (
    <div
      style={{
        padding: "6px 11px",
        minHeight: 32,
        background: palette.soft,
        border: `1px solid ${palette.border}`,
        borderRadius: 10,
        color: palette.deep,
        fontSize: 13,
        wordBreak: "break-word",
      }}
    >
      {display}
    </div>
  );
}

export function ContactEdit({
  business,
  kind,
  id,
}: {
  business: Business;
  kind: Kind;
  id: string;
}) {
  const palette = PALETTE[business];
  const resource = `${business}_${kind}`;
  const sections = kind === "leads" ? LEAD_SECTIONS : CLIENT_SECTIONS;
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState(sections[0].key);

  const { data, isLoading } = useOne({ resource, id });
  const { mutate: update, isLoading: saving } = useUpdate();
  const { mutate: del, isLoading: deleting } = useDelete();
  const { list, push } = useNavigation();

  const record = (data?.data || {}) as Record<string, unknown>;

  // Cache existing values to detect "no change"
  const initialValues = useMemo(() => {
    const out: Record<string, unknown> = {};
    sections.forEach((s) =>
      s.fields.forEach((f) => {
        out[f.key] = record[f.key] ?? null;
      })
    );
    return out;
  }, [record, sections]);

  useEffect(() => {
    if (data?.data) form.setFieldsValue(initialValues);
  }, [data?.data, form, initialValues]);

  if (isLoading) {
    return (
      <div style={{ padding: 24 }}>
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );
  }

  const editableFieldKeys = new Set<string>();
  sections.forEach((s) =>
    s.fields.forEach((f) => {
      if (!f.readonly) editableFieldKeys.add(f.key);
    })
  );

  const onSave = async () => {
    try {
      const values = await form.validateFields();
      const payload: Record<string, unknown> = {};
      Object.entries(values).forEach(([k, v]) => {
        if (!editableFieldKeys.has(k)) return;
        // Empty string → null
        payload[k] = v === "" ? null : v;
      });
      update(
        { resource, id, values: payload, successNotification: false },
        {
          onSuccess: () => {
            message.success("נשמר בהצלחה");
          },
          onError: (e: { message?: string }) =>
            message.error("שמירה נכשלה: " + (e?.message || "")),
        }
      );
    } catch {
      message.warning("יש שדות לא תקינים");
    }
  };

  const onDelete = () => {
    del(
      { resource, id, successNotification: false },
      {
        onSuccess: () => {
          message.success("נמחק");
          // Navigate back to contacts page
          push(`/${business}/contacts`);
        },
        onError: (e: { message?: string }) =>
          message.error("מחיקה נכשלה: " + (e?.message || "")),
      }
    );
  };

  const kindLabel = kind === "leads" ? "ליד" : "לקוח/ה";
  const kindIcon = kind === "leads" ? <FireOutlined /> : <CrownOutlined />;

  return (
    <div style={{ padding: "8px 8px 32px" }}>
      {/* Header card */}
      <div
        style={{
          background: `linear-gradient(135deg, ${palette.primary} 0%, ${palette.chip} 65%, ${palette.accent} 100%)`,
          borderRadius: 24,
          padding: "28px 32px",
          color: "#fff",
          position: "relative",
          overflow: "hidden",
          boxShadow: `0 18px 50px -20px ${palette.primary}80`,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -80,
            insetInlineStart: -60,
            width: 280,
            height: 280,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.10)",
          }}
        />
        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
          <Avatar
            size={72}
            style={{
              background: "rgba(255,255,255,0.2)",
              color: "#fff",
              fontWeight: 700,
              fontSize: 28,
              border: "2px solid rgba(255,255,255,0.4)",
            }}
          >
            {initials(record) || <UserOutlined />}
          </Avatar>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontSize: 12, opacity: 0.85, letterSpacing: 1, textTransform: "uppercase" }}>
              {palette.icon} {palette.label} · {kindIcon} {kindLabel}
            </div>
            <h1 style={{ margin: "6px 0 4px", fontSize: 26, fontWeight: 700, letterSpacing: -0.5 }}>
              {fullName(record)}
            </h1>
            <Space size={16} wrap style={{ fontSize: 13, opacity: 0.92 }}>
              {record.normalized_phone ? (
                <span>
                  <PhoneOutlined /> {String(record.normalized_phone)}
                </span>
              ) : null}
              {record.email ? (
                <span>
                  <MailOutlined /> {String(record.email)}
                </span>
              ) : null}
              {record.created_at ? (
                <span>
                  <IdcardOutlined /> נוצר {formatDate(String(record.created_at))}
                </span>
              ) : null}
            </Space>
          </div>
          <Space size={8} wrap>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => list(resource)}
              style={{
                background: "rgba(255,255,255,0.15)",
                borderColor: "rgba(255,255,255,0.3)",
                color: "#fff",
                borderRadius: 12,
              }}
            >
              חזרה
            </Button>
            <Popconfirm
              title="למחוק את הרשומה?"
              description="פעולה זו אינה הפיכה. הרשומה תוסר מ־Supabase."
              onConfirm={onDelete}
              okText="מחק"
              cancelText="בטל"
              okButtonProps={{ danger: true, loading: deleting }}
            >
              <Button
                danger
                icon={<DeleteOutlined />}
                style={{ borderRadius: 12 }}
              >
                מחק
              </Button>
            </Popconfirm>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              loading={saving}
              onClick={onSave}
              style={{
                background: "#fff",
                color: palette.primary,
                borderColor: "#fff",
                borderRadius: 12,
                fontWeight: 600,
              }}
            >
              שמור שינויים
            </Button>
          </Space>
        </div>
      </div>

      {/* Card body with tabs */}
      <div
        style={{
          marginTop: 20,
          background: "#fff",
          borderRadius: 20,
          padding: 8,
          border: `1px solid ${palette.border}`,
          boxShadow: "0 1px 0 rgba(0,0,0,0.02), 0 8px 28px -16px rgba(60,40,90,0.1)",
        }}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={initialValues}
          requiredMark={false}
        >
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            tabPosition="top"
            tabBarStyle={{ paddingInlineStart: 16, marginBottom: 12 }}
            items={sections.map((sec) => ({
              key: sec.key,
              label: (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  {sec.icon}
                  {sec.title}
                </span>
              ),
              children: (
                <div
                  style={{
                    padding: "8px 16px 24px",
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    gap: "0 24px",
                  }}
                >
                  {sec.fields.map((f) => (
                    <div
                      key={f.key}
                      style={{ gridColumn: f.span === 2 ? "span 2" : undefined }}
                    >
                      {f.readonly ? (
                        <Form.Item
                          label={f.label}
                          style={{ marginBottom: 12 }}
                        >
                          <ReadonlyDisplay
                            value={record[f.key]}
                            type={f.type}
                            palette={palette}
                          />
                        </Form.Item>
                      ) : (
                        <FieldRenderer field={f} palette={palette} />
                      )}
                    </div>
                  ))}
                </div>
              ),
            }))}
          />
        </Form>
      </div>
    </div>
  );
}
