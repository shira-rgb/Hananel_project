import { useState, useMemo, useEffect } from "react";
import { useTable, EditButton, DeleteButton } from "@refinedev/antd";
import { useList } from "@refinedev/core";
import { Table, Tag, Space, Input, Segmented, Avatar, Button, Tooltip, Empty, Badge, Popover, message } from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  SearchOutlined,
  ReloadOutlined,
  PlusOutlined,
  CrownOutlined,
  FireOutlined,
  EditOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../utils/formatters";
import { supabaseClient } from "../supabaseClient";

type Kind = "leads" | "clients";
type Business = "aesthetic" | "dental";

interface ContactRow {
  id: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  normalized_phone?: string;
  phone?: string;
  email?: string;
  is_bot_active?: boolean;
  status?: string;
  stage?: string;
  source?: string;
  arrival_source?: string;
  concern?: string;
  interested_treatment?: string;
  last_treatment_type?: string;
  last_treatment_date?: string;
  number_of_visits?: number;
  client_status?: string;
  has_sent_photo?: boolean;
  notes?: string;
  followup_after_last_treatment?: boolean;
  created_at?: string;
  updated_at?: string;
}

const PALETTE = {
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
} as const;

const fullName = (r: ContactRow) =>
  r.full_name ||
  [r.first_name, r.last_name].filter(Boolean).join(" ") ||
  "ללא שם";

const initials = (r: ContactRow) => {
  const name = fullName(r);
  const parts = name.split(" ").filter(Boolean);
  return (parts[0]?.[0] || "?") + (parts[1]?.[0] || "");
};

interface Props {
  business: Business;
}

export function ContactsPage({ business }: Props) {
  const palette = PALETTE[business];
  const navigate = useNavigate();
  const [kind, setKind] = useState<Kind>("leads");
  const [search, setSearch] = useState("");

  const resource = `${business}_${kind}`; // aesthetic_leads / aesthetic_clients / etc.

  // Sibling counts (no liveMode — refine-supabase uses one channel name "any"
  // and crashes if more than one hook subscribes simultaneously).
  const { data: leadsData, refetch: refetchLeadsCount } = useList<ContactRow>({
    resource: `${business}_leads`,
    pagination: { pageSize: 1 },
    liveMode: "off",
  });
  const { data: clientsData, refetch: refetchClientsCount } = useList<ContactRow>({
    resource: `${business}_clients`,
    pagination: { pageSize: 1 },
    liveMode: "off",
  });

  const { tableProps, tableQueryResult } = useTable<ContactRow>({
    resource,
    sorters: { initial: [{ field: "created_at", order: "desc" }] },
    pagination: { pageSize: 25 },
    liveMode: "auto",
    onLiveEvent: () => {
      refetchLeadsCount();
      refetchClientsCount();
    },
    syncWithLocation: false,
  });

  const leadsCount = leadsData?.total ?? 0;
  const clientsCount = clientsData?.total ?? 0;

  // Derived: filter by search (in-memory over current page; for richer search, swap to server filter)
  const filtered = useMemo(() => {
    const list = (tableProps.dataSource as ContactRow[]) || [];
    if (!search.trim()) return list;
    const q = search.trim().toLowerCase();
    return list.filter((r) => {
      const haystack = [
        fullName(r),
        r.normalized_phone,
        r.phone,
        r.email,
        r.concern,
        r.interested_treatment,
        r.last_treatment_type,
        r.source,
        r.arrival_source,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [tableProps.dataSource, search]);

  const newThisWeek = useMemo(() => {
    const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const list = (tableProps.dataSource as ContactRow[]) || [];
    return list.filter((r) => r.created_at && new Date(r.created_at).getTime() >= cutoff).length;
  }, [tableProps.dataSource]);

  const sharedColumns = [
    {
      key: "person",
      title: "שם",
      width: 240,
      render: (_: unknown, r: ContactRow) => (
        <Space size={12} align="center">
          <Avatar
            size={42}
            style={{
              background: `linear-gradient(135deg, ${palette.primary}, ${palette.chip})`,
              color: "#fff",
              fontWeight: 600,
              letterSpacing: 0.5,
            }}
          >
            {initials(r) || <UserOutlined />}
          </Avatar>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontWeight: 600, fontSize: 14, color: palette.deep }}>{fullName(r)}</span>
            <span style={{ fontSize: 12, color: "#7a6b78", display: "flex", alignItems: "center", gap: 4 }}>
              <PhoneOutlined style={{ fontSize: 11 }} />
              {r.normalized_phone || r.phone || "—"}
            </span>
          </div>
        </Space>
      ),
    },
  ];

  const leadColumns = [
    ...sharedColumns,
    {
      key: "email",
      title: "מייל",
      width: 200,
      render: (_: unknown, r: ContactRow) =>
        r.email ? (
          <a href={`mailto:${r.email}`} style={{ color: palette.primary, fontSize: 12 }}>{r.email}</a>
        ) : (
          <span style={{ color: "#a89aa3" }}>—</span>
        ),
    },
    {
      key: "interested_treatment",
      title: "מתעניין/ת בטיפול",
      width: 180,
      render: (_: unknown, r: ContactRow) => {
        const text = r.interested_treatment || r.concern;
        return text ? (
          <span style={{ fontSize: 13, color: "#3a2e36" }}>{text}</span>
        ) : (
          <span style={{ color: "#a89aa3" }}>—</span>
        );
      },
    },
    {
      key: "notes",
      title: "הערות",
      width: 240,
      render: (_: unknown, r: ContactRow) => (
        <NotesCell
          value={r.notes}
          id={r.id}
          resource={resource}
          palette={palette}
          onSaved={() => tableQueryResult.refetch()}
        />
      ),
    },
    {
      key: "updated_at",
      title: "הודעה אחרונה",
      width: 140,
      render: (_: unknown, r: ContactRow) => (
        <span style={{ fontSize: 12, color: "#7a6b78" }}>
          {r.updated_at ? formatDate(r.updated_at) : r.created_at ? formatDate(r.created_at) : "—"}
        </span>
      ),
    },
    {
      key: "source",
      title: "מקור",
      width: 160,
      render: (_: unknown, r: ContactRow) => {
        const raw = (r.source || r.arrival_source || "").trim();
        if (!raw) return <span style={{ color: "#a89aa3" }}>—</span>;
        const short = raw.length > 28 ? raw.slice(0, 28) + "…" : raw;
        return (
          <Tooltip title={raw.length > 28 ? raw : undefined} styles={{ root: { maxWidth: 420 } }}>
            <Tag bordered={false} style={{ background: palette.soft, color: palette.deep, whiteSpace: "normal", lineHeight: 1.4 }}>
              {short}
            </Tag>
          </Tooltip>
        );
      },
    },
    {
      key: "stage",
      title: "שלב",
      width: 140,
      render: (_: unknown, r: ContactRow) => {
        const stage = (r.stage || "").trim();
        if (!stage) return <span style={{ color: "#a89aa3" }}>—</span>;
        return (
          <Tag
            style={{
              border: `1px solid ${palette.primary}40`,
              color: palette.primary,
              background: `${palette.primary}0d`,
              borderRadius: 999,
              padding: "2px 10px",
              fontWeight: 500,
            }}
          >
            {stage}
          </Tag>
        );
      },
    },
    {
      key: "actions",
      title: "",
      width: 80,
      render: (_: unknown, r: ContactRow) => (
        <Space size={4}>
          <EditButton hideText size="small" recordItemId={r.id} resource={resource} />
          <DeleteButton
            hideText
            size="small"
            recordItemId={r.id}
            resource={resource}
            confirmTitle="למחוק את הרשומה?"
            confirmOkText="מחק"
            confirmCancelText="בטל"
            successNotification={() => ({ message: "נמחק בהצלחה", type: "success" })}
            errorNotification={(err) => ({ message: "מחיקה נכשלה: " + ((err as { message?: string })?.message || ""), type: "error" })}
          />
        </Space>
      ),
    },
  ];

  const clientColumns = [
    ...sharedColumns,
    {
      key: "last_treatment_date",
      title: "טיפול אחרון",
      width: 160,
      render: (_: unknown, r: ContactRow) => (
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {r.last_treatment_date ? (
            <span style={{ fontSize: 13, color: palette.deep, fontWeight: 500 }}>{formatDate(r.last_treatment_date)}</span>
          ) : (
            <span style={{ color: "#a89aa3" }}>—</span>
          )}
          {r.last_treatment_type && (
            <span style={{ fontSize: 11, color: "#a89aa3" }}>{r.last_treatment_type}</span>
          )}
        </div>
      ),
    },
    {
      key: "number_of_visits",
      title: "ביקורים",
      width: 100,
      render: (_: unknown, r: ContactRow) =>
        r.number_of_visits != null ? (
          <Badge
            count={r.number_of_visits}
            style={{ background: palette.primary, fontWeight: 600 }}
            overflowCount={999}
            showZero
          />
        ) : (
          <span style={{ color: "#a89aa3" }}>—</span>
        ),
    },
    {
      key: "notes",
      title: "הערות",
      width: 240,
      render: (_: unknown, r: ContactRow) => (
        <NotesCell
          value={r.notes}
          id={r.id}
          resource={resource}
          palette={palette}
          onSaved={() => tableQueryResult.refetch()}
        />
      ),
    },
    {
      key: "email",
      title: "מייל",
      width: 200,
      render: (_: unknown, r: ContactRow) =>
        r.email ? (
          <a href={`mailto:${r.email}`} style={{ color: palette.primary, fontSize: 13 }}>{r.email}</a>
        ) : (
          <span style={{ color: "#a89aa3" }}>—</span>
        ),
    },
    {
      key: "followup_after_last_treatment",
      title: "פולואפ אחרי טיפול",
      width: 150,
      render: (_: unknown, r: ContactRow) => {
        const done = !!r.followup_after_last_treatment;
        return (
          <Tooltip title={done ? "פולואפ נשלח אוטומטית" : "טרם נשלח פולואפ"}>
            <Tag
              style={{
                border: `1px solid ${done ? "#16a34a" : "#cbd5e1"}`,
                color: done ? "#16a34a" : "#64748b",
                background: done ? "#dcfce7" : "#f8fafc",
                borderRadius: 999,
                padding: "2px 12px",
                fontWeight: 500,
                cursor: "default",
              }}
            >
              {done ? "✓ נשלח" : "טרם"}
            </Tag>
          </Tooltip>
        );
      },
    },
    {
      key: "actions",
      title: "",
      width: 80,
      render: (_: unknown, r: ContactRow) => (
        <Space size={4}>
          <EditButton hideText size="small" recordItemId={r.id} resource={resource} />
          <DeleteButton
            hideText
            size="small"
            recordItemId={r.id}
            resource={resource}
            confirmTitle="למחוק את הרשומה?"
            confirmOkText="מחק"
            confirmCancelText="בטל"
            successNotification={() => ({ message: "נמחק בהצלחה", type: "success" })}
            errorNotification={(err) => ({ message: "מחיקה נכשלה: " + ((err as { message?: string })?.message || ""), type: "error" })}
          />
        </Space>
      ),
    },
  ];

  const columns = kind === "leads" ? leadColumns : clientColumns;
  const isLoading = tableQueryResult.isLoading;

  return (
    <div style={{ padding: "8px 8px 32px", maxWidth: 1640, margin: "0 auto" }}>
      {/* Hero / KPI strip */}
      <div
        style={{
          background: `linear-gradient(255deg, ${palette.deep} 0%, ${palette.primary} 35%, ${palette.chip} 75%, ${palette.accent} 100%)`,
          borderRadius: 24,
          padding: "32px 36px",
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
            filter: "blur(2px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -100,
            insetInlineEnd: -40,
            width: 220,
            height: 220,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
          }}
        />

        <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 24 }}>
          <div>
            <div style={{ fontSize: 13, opacity: 0.95, letterSpacing: 1, textTransform: "uppercase", textShadow: "0 1px 2px rgba(0,0,0,0.25)" }}>
              {palette.icon} {palette.label}
            </div>
            <h1 style={{ margin: "8px 0 4px", fontSize: 30, fontWeight: 700, letterSpacing: -0.5, textShadow: "0 2px 6px rgba(0,0,0,0.28)" }}>
              ניהול לידים ולקוחות
            </h1>
            <div style={{ fontSize: 14, opacity: 0.95, textShadow: "0 1px 3px rgba(0,0,0,0.22)" }}>
              סנכרון חי מ־Supabase. כל ליד חדש ולקוחה חוזרת מופיעים פה ברגע שהם נכנסים למערכת.
            </div>
          </div>

          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            <KpiBlock label="לידים" value={leadsCount} icon={<FireOutlined />} />
            <KpiBlock label="לקוחות" value={clientsCount} icon={<CrownOutlined />} />
            <KpiBlock label="חדשים השבוע" value={newThisWeek} icon={<PlusOutlined />} muted />
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div
        style={{
          marginTop: 24,
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Segmented
          size="large"
          value={kind}
          onChange={(v) => setKind(v as Kind)}
          options={[
            {
              label: (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "0 4px" }}>
                  <FireOutlined /> לידים <span style={{ opacity: 0.6, fontSize: 12 }}>{leadsCount}</span>
                </span>
              ),
              value: "leads",
            },
            {
              label: (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "0 4px" }}>
                  <CrownOutlined /> לקוחות <span style={{ opacity: 0.6, fontSize: 12 }}>{clientsCount}</span>
                </span>
              ),
              value: "clients",
            },
          ]}
          style={{ background: palette.soft, padding: 4, borderRadius: 14, border: `1px solid ${palette.border}` }}
        />

        <Space size={8}>
          <Input
            allowClear
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="חיפוש לפי שם, טלפון, מתעניין/ת ב..."
            prefix={<SearchOutlined style={{ color: palette.primary }} />}
            style={{ width: 320, borderRadius: 12, borderColor: palette.border, background: "#fff" }}
          />
          <Tooltip title="רענון">
            <Button
              icon={<ReloadOutlined />}
              onClick={() => tableQueryResult.refetch()}
              loading={isLoading}
              style={{ borderRadius: 12, borderColor: palette.border, color: palette.primary }}
            />
          </Tooltip>
          {kind === "clients" && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate(`/${business}/clients/create`)}
              style={{
                borderRadius: 12,
                background: palette.primary,
                borderColor: palette.primary,
                fontWeight: 600,
                boxShadow: `0 6px 18px -8px ${palette.primary}`,
              }}
            >
              הוסף לקוח
            </Button>
          )}
        </Space>
      </div>

      {/* Table card */}
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
          {...tableProps}
          dataSource={filtered}
          rowKey="id"
          columns={columns as any}
          scroll={{ x: "max-content" }}
          pagination={{
            ...tableProps.pagination,
            position: ["bottomCenter"],
            showSizeChanger: true,
            pageSizeOptions: [10, 25, 50, 100],
          }}
          locale={{
            emptyText: (
              <div style={{ padding: 48 }}>
                <Empty
                  description={kind === "leads" ? "אין לידים עדיין — חכי לפנייה הבאה" : "אין לקוחות עדיין"}
                />
              </div>
            ),
          }}
          onRow={(record: ContactRow) => ({
            onClick: (e) => {
              if (kind !== "clients") return;
              const target = e.target as HTMLElement;
              if (target.closest("button") || target.closest(".ant-btn") || target.closest(".ant-switch")) return;
              navigate(`/${business}/clients/edit/${record.id}`);
            },
            style: { cursor: kind === "clients" ? "pointer" : "default" },
          })}
        />
      </div>
    </div>
  );
}

function NotesCell({
  value,
  id,
  resource,
  palette,
  onSaved,
}: {
  value?: string;
  id: string;
  resource: string;
  palette: { primary: string; soft: string; border: string; deep: string };
  onSaved: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(value || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setText(value || "");
  }, [value]);

  const save = async () => {
    setSaving(true);
    const { error } = await supabaseClient.from(resource).update({ notes: text || null }).eq("id", id);
    setSaving(false);
    if (error) {
      message.error("שמירה נכשלה: " + error.message);
      return;
    }
    message.success("הערה נשמרה");
    setOpen(false);
    onSaved();
  };

  const trimmed = (value || "").trim();
  const preview = trimmed ? (trimmed.length > 70 ? trimmed.slice(0, 70) + "…" : trimmed) : "";

  return (
    <Popover
      open={open}
      onOpenChange={(o) => {
        if (o) setText(value || "");
        setOpen(o);
      }}
      trigger="click"
      placement="topLeft"
      destroyTooltipOnHide
      title={
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: palette.deep }}>
          <FileTextOutlined /> הערות
        </span>
      }
      content={
        <div style={{ width: 380 }}>
          <Input.TextArea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={7}
            autoFocus
            placeholder="לדוגמה: רופא אחד אומר X, רופא אחר אומר Y. צריך לבדוק..."
            style={{ borderRadius: 10, borderColor: palette.border, fontSize: 13 }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, gap: 8 }}>
            <span style={{ fontSize: 11, color: "#7a6b78" }}>{text.length} תווים</span>
            <Space size={6}>
              <Button size="small" onClick={() => setOpen(false)}>
                בטל
              </Button>
              <Button
                size="small"
                type="primary"
                loading={saving}
                onClick={save}
                style={{ background: palette.primary, borderColor: palette.primary }}
              >
                שמור
              </Button>
            </Space>
          </div>
        </div>
      }
    >
      <div
        style={{
          cursor: "pointer",
          display: "flex",
          alignItems: "flex-start",
          gap: 6,
          maxWidth: 220,
          padding: "4px 8px",
          borderRadius: 8,
          border: `1px dashed ${trimmed ? palette.border : "#e8e0e6"}`,
          background: trimmed ? palette.soft : "transparent",
          minHeight: 32,
          transition: "all 0.15s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.borderStyle = "solid")}
        onMouseLeave={(e) => (e.currentTarget.style.borderStyle = "dashed")}
      >
        <span
          style={{
            flex: 1,
            fontSize: 12,
            color: trimmed ? palette.deep : "#a89aa3",
            whiteSpace: "pre-wrap",
            lineHeight: 1.45,
            wordBreak: "break-word",
          }}
        >
          {preview || "הוסף הערה"}
        </span>
        <EditOutlined style={{ fontSize: 11, color: palette.primary, marginTop: 3, opacity: 0.7 }} />
      </div>
    </Popover>
  );
}

function KpiBlock({
  label,
  value,
  icon,
  muted,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  muted?: boolean;
}) {
  return (
    <div
      style={{
        background: muted ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.18)",
        backdropFilter: "blur(10px)",
        padding: "14px 22px",
        borderRadius: 16,
        border: "1px solid rgba(255,255,255,0.18)",
        minWidth: 140,
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, opacity: 0.85, fontWeight: 500 }}>
        {icon} {label}
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, lineHeight: 1, letterSpacing: -0.5 }}>{value.toLocaleString("he-IL")}</div>
    </div>
  );
}
