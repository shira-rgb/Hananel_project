import { useEffect, useMemo, useState } from "react";
import { useList } from "@refinedev/core";
import {
  Table,
  InputNumber,
  Select,
  Button,
  Tag,
  Empty,
  Space,
  Tooltip,
  App,
  Input,
} from "antd";
import {
  ClockCircleOutlined,
  SaveOutlined,
  CheckCircleOutlined,
  GiftOutlined,
} from "@ant-design/icons";
import { supabaseClient } from "../supabaseClient";
import { delayUnitLabel } from "../utils/formatters";

const { TextArea } = Input;

type Business = "aesthetic" | "dental";
type DelayUnit = "hours" | "days" | "weeks";
type TimingType = "after" | "before";

interface ProductRow {
  id: string;
  name: string;
  treatment_type?: string;
}

interface FollowupConfig {
  id: string;
  product_id: string;
  delay_value: number;
  delay_unit: DelayUnit;
  timing_type: TimingType;
  is_active: boolean;
  message_text?: string;
}

interface RowState {
  delay_value: number;
  delay_unit: DelayUnit;
  timing_type: TimingType;
  is_active: boolean;
  dirty: boolean;
  saving: boolean;
  configId?: string;
}

const PALETTE = {
  aesthetic: {
    primary: "#7c2d92",
    chip: "#ad4e9c",
    soft: "#fbf6fa",
    border: "#e8d6e3",
    deep: "#3d1738",
    accent: "#e0b3d8",
    label: "קליניקה אסתטית",
    icon: "✨",
  },
  dental: {
    primary: "#0d6e6e",
    chip: "#127a7a",
    soft: "#f4faf9",
    border: "#cfe6e3",
    deep: "#0a3838",
    accent: "#9ed4d4",
    label: "מרפאת שיניים",
    icon: "🦷",
  },
} as const;

const DEFAULT_ROW: Omit<RowState, "configId"> = {
  delay_value: 1,
  delay_unit: "days",
  timing_type: "after",
  is_active: true,
  dirty: false,
  saving: false,
};

const DEFAULT_PLACEHOLDER_TEXT =
  "[פולואפ אוטומטי — תוכן ההודעה נוצר על־פי שם הטיפול והפרטים שבמערכת]";

export function FollowupSettings({ business }: { business: Business }) {
  const { message, modal } = App.useApp();
  const palette = PALETTE[business];
  const productsResource = `${business}_products`;
  const followupResource = `${business}_followup_messages`;
  const businessInfoResource = `${business}_business_info`;

  const [incentive, setIncentive] = useState<string>("");
  const [incentiveDirty, setIncentiveDirty] = useState(false);
  const [incentiveSaving, setIncentiveSaving] = useState(false);
  const [incentiveLoading, setIncentiveLoading] = useState(true);
  const [businessInfoId, setBusinessInfoId] = useState<string | null>(null);

  const loadIncentive = async () => {
    setIncentiveLoading(true);
    try {
      const { data, error } = await supabaseClient
        .from(businessInfoResource)
        .select("id, followup_incentive")
        .limit(1);
      if (error) throw error;
      const row = data?.[0];
      if (row) {
        setBusinessInfoId(row.id);
        setIncentive(row.followup_incentive || "");
      }
    } catch (e) {
      const err = e as { message?: string };
      // Likely the column doesn't exist yet — silently keep empty.
      console.warn("incentive load failed:", err?.message);
    } finally {
      setIncentiveLoading(false);
      setIncentiveDirty(false);
    }
  };

  useEffect(() => {
    loadIncentive();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessInfoResource]);

  const saveIncentive = async () => {
    setIncentiveSaving(true);
    try {
      let rowId = businessInfoId;
      let savedValue: string | null = null;
      if (!rowId) {
        const { data, error } = await supabaseClient
          .from(businessInfoResource)
          .insert({ followup_incentive: incentive })
          .select("id, followup_incentive")
          .single();
        if (error) throw error;
        rowId = data?.id || null;
        savedValue = data?.followup_incentive ?? null;
        setBusinessInfoId(rowId);
      } else {
        const { data, error } = await supabaseClient
          .from(businessInfoResource)
          .update({ followup_incentive: incentive })
          .eq("id", rowId)
          .select("id, followup_incentive")
          .single();
        if (error) throw error;
        savedValue = data?.followup_incentive ?? null;
      }
      setIncentiveDirty(false);
      modal.success({
        title: "ההטבה נשמרה בהצלחה",
        content: (
          <div style={{ marginTop: 8 }}>
            <div style={{ marginBottom: 8, color: "#555" }}>
              ההטבה נשמרה במסד הנתונים והסוכן יושך אותה דינמית בהודעות הפולואפ.
            </div>
            <div
              style={{
                background: "#f6f3fb",
                border: "1px solid #e6dff2",
                borderRadius: 8,
                padding: "10px 12px",
                fontSize: 13,
                color: "#3d2a52",
                whiteSpace: "pre-wrap",
              }}
            >
              {savedValue || "(ריק)"}
            </div>
          </div>
        ),
        okText: "סגור",
        centered: true,
      });
    } catch (e) {
      const err = e as { message?: string };
      modal.error({
        title: "שמירה נכשלה",
        content:
          err?.message ||
          "ייתכן שהעמודה followup_incentive לא קיימת ב-DB או שאין הרשאה לכתיבה.",
        okText: "סגור",
        centered: true,
      });
    } finally {
      setIncentiveSaving(false);
    }
  };

  const { data: productsData, isLoading: loadingProducts } = useList<ProductRow>({
    resource: productsResource,
    filters: [{ field: "is_active", operator: "eq", value: true }],
    pagination: { pageSize: 500 },
    sorters: [{ field: "name", order: "asc" }],
    meta: { select: "id, name, treatment_type" },
  });

  const {
    data: configsData,
    isLoading: loadingConfigs,
    refetch: refetchConfigs,
  } = useList<FollowupConfig>({
    resource: followupResource,
    pagination: { pageSize: 500 },
    meta: { select: "id, product_id, delay_value, delay_unit, timing_type, is_active" },
  });

  // Map product_id -> config (skip null product_ids = legacy rows)
  const configByProduct = useMemo(() => {
    const m: Record<string, FollowupConfig> = {};
    (configsData?.data || []).forEach((c) => {
      if (!c.product_id) return;
      if (!m[c.product_id]) m[c.product_id] = c;
    });
    return m;
  }, [configsData]);

  const products = productsData?.data || [];

  const [rowState, setRowState] = useState<Record<string, RowState>>({});

  // Initialize row state from configs when products + configs load
  useEffect(() => {
    const next: Record<string, RowState> = {};
    products.forEach((p) => {
      const cfg = configByProduct[p.id];
      next[p.id] = cfg
        ? {
            delay_value: cfg.delay_value,
            delay_unit: cfg.delay_unit,
            timing_type: cfg.timing_type,
            is_active: cfg.is_active,
            configId: cfg.id,
            dirty: false,
            saving: false,
          }
        : { ...DEFAULT_ROW };
    });
    setRowState(next);
  }, [products.length, configsData?.data?.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateRow = (productId: string, patch: Partial<RowState>) => {
    setRowState((prev) => ({
      ...prev,
      [productId]: { ...(prev[productId] || DEFAULT_ROW), ...patch, dirty: true },
    }));
  };

  const saveRow = async (productId: string) => {
    const r = rowState[productId];
    if (!r || !r.dirty) return;
    setRowState((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], saving: true },
    }));
    try {
      if (r.configId) {
        const { error } = await supabaseClient
          .from(followupResource)
          .update({
            delay_value: r.delay_value,
            delay_unit: r.delay_unit,
            timing_type: "after",
            is_active: true,
          })
          .eq("id", r.configId);
        if (error) throw error;
      } else {
        const { data, error } = await supabaseClient
          .from(followupResource)
          .insert({
            product_id: productId,
            message_text: DEFAULT_PLACEHOLDER_TEXT,
            delay_value: r.delay_value,
            delay_unit: r.delay_unit,
            timing_type: "after",
            is_active: true,
          })
          .select("id")
          .single();
        if (error) throw error;
        setRowState((prev) => ({
          ...prev,
          [productId]: { ...prev[productId], configId: data?.id, saving: false, dirty: false },
        }));
        message.success("הוגדר פולואפ לטיפול");
        refetchConfigs();
        return;
      }
      setRowState((prev) => ({
        ...prev,
        [productId]: { ...prev[productId], saving: false, dirty: false },
      }));
      message.success("נשמר בהצלחה");
      refetchConfigs();
    } catch (e) {
      const err = e as { message?: string };
      message.error("שמירה נכשלה: " + (err?.message || ""));
      setRowState((prev) => ({
        ...prev,
        [productId]: { ...prev[productId], saving: false },
      }));
    }
  };

  const configuredCount = Object.values(rowState).filter((r) => r.configId).length;

  const columns = [
    {
      key: "product",
      title: "טיפול / מוצר",
      render: (_: unknown, p: ProductRow) => (
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span style={{ fontWeight: 600, color: palette.deep, fontSize: 14 }}>{p.name}</span>
          {p.treatment_type && (
            <Tag
              bordered={false}
              style={{
                background: palette.soft,
                color: palette.deep,
                fontSize: 11,
                width: "fit-content",
              }}
            >
              {p.treatment_type}
            </Tag>
          )}
        </div>
      ),
    },
    {
      key: "delay_value",
      title: "כעבור",
      width: 130,
      render: (_: unknown, p: ProductRow) => {
        const r = rowState[p.id] || DEFAULT_ROW;
        return (
          <InputNumber
            min={1}
            max={999}
            value={r.delay_value}
            onChange={(v) => updateRow(p.id, { delay_value: Number(v) || 1 })}
            style={{ width: "100%", borderRadius: 8 }}
          />
        );
      },
    },
    {
      key: "delay_unit",
      title: "יחידה",
      width: 130,
      render: (_: unknown, p: ProductRow) => {
        const r = rowState[p.id] || DEFAULT_ROW;
        return (
          <Select
            value={r.delay_unit}
            onChange={(v) => updateRow(p.id, { delay_unit: v as DelayUnit })}
            style={{ width: "100%" }}
            options={[
              { label: "שעות", value: "hours" },
              { label: "ימים", value: "days" },
              { label: "שבועות", value: "weeks" },
            ]}
          />
        );
      },
    },
    {
      key: "preview",
      title: "תצוגה",
      width: 200,
      render: (_: unknown, p: ProductRow) => {
        const r = rowState[p.id] || DEFAULT_ROW;
        return (
          <Tag
            icon={<ClockCircleOutlined />}
            style={{
              border: `1px solid ${palette.primary}40`,
              background: `${palette.primary}0d`,
              color: palette.primary,
              borderRadius: 999,
              padding: "4px 12px",
              fontWeight: 500,
            }}
          >
            {r.delay_value} {delayUnitLabel(r.delay_unit)} אחרי טיפול
          </Tag>
        );
      },
    },
    {
      key: "save",
      title: "",
      width: 110,
      render: (_: unknown, p: ProductRow) => {
        const r = rowState[p.id] || DEFAULT_ROW;
        return (
          <Tooltip
            title={
              !r.dirty && r.configId
                ? "אין שינויים"
                : !r.dirty
                  ? "הגדר פולואפ"
                  : "שמור שינויים"
            }
          >
            <Button
              size="small"
              type={r.dirty ? "primary" : "default"}
              icon={r.configId && !r.dirty ? <CheckCircleOutlined /> : <SaveOutlined />}
              loading={r.saving}
              disabled={!r.dirty && !!r.configId}
              onClick={() => saveRow(p.id)}
              style={
                r.dirty
                  ? { background: palette.primary, borderColor: palette.primary }
                  : r.configId
                    ? { color: "#16a34a", borderColor: "#bbf7d0" }
                    : undefined
              }
            >
              {r.configId && !r.dirty ? "מוגדר" : "שמור"}
            </Button>
          </Tooltip>
        );
      },
    },
  ];

  return (
    <div style={{ padding: "8px 8px 32px", maxWidth: 980, margin: "0 auto" }}>
      {/* Hero */}
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
        <div
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: 24,
          }}
        >
          <div>
            <div style={{ fontSize: 12, opacity: 0.85, letterSpacing: 1, textTransform: "uppercase" }}>
              {palette.icon} {palette.label}
            </div>
            <h1 style={{ margin: "8px 0 4px", fontSize: 28, fontWeight: 700, letterSpacing: -0.5 }}>
              הגדרות פולואפ
            </h1>
            <div style={{ fontSize: 13, opacity: 0.85, maxWidth: 560 }}>
              לכל טיפול מהקטלוג — הגדרי מתי לשלוח פולואפ. ההודעה עצמה נוצרת אוטומטית
              על־פי הטיפול ושאר נתוני הלקוח/ה במערכת.
            </div>
          </div>
          <Space size={12} wrap>
            <HeroPill label="סה״כ טיפולים" value={products.length} />
            <HeroPill label="מוגדרו פולואפ" value={configuredCount} highlight />
          </Space>
        </div>
      </div>

      {/* Incentive panel */}
      <div
        style={{
          marginTop: 16,
          background: "#fff",
          borderRadius: 20,
          padding: "20px 24px",
          border: `1px solid ${palette.border}`,
          boxShadow: "0 1px 0 rgba(0,0,0,0.02), 0 8px 28px -16px rgba(60,40,90,0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 6,
          }}
        >
          <span
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              background: `${palette.primary}14`,
              color: palette.primary,
              fontSize: 16,
            }}
          >
            <GiftOutlined />
          </span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, color: palette.deep, fontSize: 15 }}>
              הטבת ממליץ
            </div>
          </div>
        </div>
        <TextArea
          value={incentive}
          onChange={(e) => {
            setIncentive(e.target.value);
            setIncentiveDirty(true);
          }}
          placeholder="לדוגמה: 10% הנחה על הטיפול הבא בהזמנה השבוע..."
          rows={3}
          maxLength={500}
          disabled={incentiveLoading}
          style={{ borderRadius: 10 }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 12,
            gap: 12,
          }}
        >
          <span style={{ fontSize: 12, color: "#8a8294" }}>
            {incentive.length} / 500
          </span>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            loading={incentiveSaving}
            disabled={!incentiveDirty || incentiveLoading}
            onClick={saveIncentive}
            style={{
              background: palette.primary,
              borderColor: palette.primary,
              color: "#fff",
            }}
          >
            <span style={{ color: "#fff" }}>שמור הטבה</span>
          </Button>
        </div>
      </div>

      {/* Table */}
      <div
        style={{
          marginTop: 16,
          background: "#fff",
          borderRadius: 20,
          padding: 8,
          border: `1px solid ${palette.border}`,
          boxShadow: "0 1px 0 rgba(0,0,0,0.02), 0 8px 28px -16px rgba(60,40,90,0.1)",
        }}
      >
        <Table
          loading={loadingProducts || loadingConfigs}
          dataSource={products}
          rowKey="id"
          columns={columns as never}
          pagination={false}
          scroll={{ x: "max-content" }}
          locale={{
            emptyText: (
              <div style={{ padding: 48 }}>
                <Empty description="אין טיפולים פעילים בקטלוג. הוסיפי תחילה דרך עמוד מוצרים ומחירון." />
              </div>
            ),
          }}
        />
      </div>
    </div>
  );
}

function HeroPill({
  label,
  value,
  highlight,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div
      style={{
        background: highlight ? "rgba(34,197,94,0.20)" : "rgba(255,255,255,0.18)",
        backdropFilter: "blur(10px)",
        padding: "12px 18px",
        borderRadius: 14,
        border: `1px solid ${highlight ? "rgba(34,197,94,0.35)" : "rgba(255,255,255,0.18)"}`,
        minWidth: 110,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <div style={{ fontSize: 11, opacity: 0.85, fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1, letterSpacing: -0.5 }}>
        {value.toLocaleString("he-IL")}
      </div>
    </div>
  );
}
