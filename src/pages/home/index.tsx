import { useList } from "@refinedev/core";
import { Card, Row, Col, Tag, Button, DatePicker, Alert, Avatar, Space, Empty } from "antd";
import {
  PhoneOutlined,
  CalendarOutlined,
  UsergroupAddOutlined,
  CrownOutlined,
  FireOutlined,
  RiseOutlined,
  RobotOutlined,
  ArrowLeftOutlined,
  ThunderboltOutlined,
  HeartOutlined,
  AreaChartOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import dayjs, { Dayjs } from "dayjs";
import type {
  AestheticInquiry,
  DentalInquiry,
  AestheticLead,
  DentalLead,
  AestheticClient,
  DentalClient,
} from "../../interfaces";
import { formatDate } from "../../utils/formatters";

const { RangePicker } = DatePicker;

type Section = "aesthetic" | "dental";

const PALETTE: Record<
  Section,
  {
    label: string;
    emoji: string;
    primary: string;
    accent: string;
    soft: string;
    border: string;
    chip: string;
    deep: string;
  }
> = {
  aesthetic: {
    label: "קליניקת אסתטיקה",
    emoji: "✨",
    primary: "#7c2d92",
    accent: "#e0b3d8",
    soft: "#fbf6fa",
    border: "#e8d6e3",
    chip: "#ad4e9c",
    deep: "#3d1738",
  },
  dental: {
    label: "מרפאת שיניים",
    emoji: "🦷",
    primary: "#0d6e6e",
    accent: "#9ed4d4",
    soft: "#f4faf9",
    border: "#cfe6e3",
    chip: "#127a7a",
    deep: "#0a3838",
  },
};

const fullName = (r: { first_name?: string; last_name?: string; full_name?: string }) =>
  r.full_name || [r.first_name, r.last_name].filter(Boolean).join(" ") || "ללא שם";

const initials = (r: { first_name?: string; last_name?: string; full_name?: string }) => {
  const name = fullName(r);
  const parts = name.split(" ").filter(Boolean);
  return (parts[0]?.[0] || "?") + (parts[1]?.[0] || "");
};

interface BusinessPanelProps {
  section: Section;
  range: [Dayjs, Dayjs];
}

const BusinessPanel = ({ section, range }: BusinessPanelProps) => {
  const navigate = useNavigate();
  const palette = PALETTE[section];

  const inquiryFilters = useMemo(
    () => [
      { field: "inquiry_date", operator: "gte" as const, value: range[0].format("YYYY-MM-DD") },
      { field: "inquiry_date", operator: "lte" as const, value: range[1].format("YYYY-MM-DD") },
    ],
    [range]
  );

  const leadsResource = `${section}_leads`;
  const clientsResource = `${section}_clients`;
  const inquiriesResource = `${section}_inquiries`;

  const { data: leadsTotal } = useList({
    resource: leadsResource,
    pagination: { pageSize: 1 },
    meta: { select: "id" },
  });
  const { data: clientsTotal } = useList({
    resource: clientsResource,
    pagination: { pageSize: 1 },
    meta: { select: "id" },
  });
  const { data: leadsThisWeek } = useList({
    resource: leadsResource,
    pagination: { pageSize: 1 },
    filters: [
      { field: "created_at", operator: "gte", value: dayjs().subtract(6, "day").startOf("day").toISOString() },
    ],
    meta: { select: "id" },
  });
  const { data: clientsThisWeek } = useList({
    resource: clientsResource,
    pagination: { pageSize: 1 },
    filters: [
      { field: "created_at", operator: "gte", value: dayjs().subtract(6, "day").startOf("day").toISOString() },
    ],
    meta: { select: "id" },
  });
  const { data: botPaused } = useList({
    resource: leadsResource,
    pagination: { pageSize: 1 },
    filters: [{ field: "is_bot_active", operator: "eq", value: false }],
    meta: { select: "id" },
  });
  const { data: inquiriesData } = useList<AestheticInquiry | DentalInquiry>({
    resource: inquiriesResource,
    filters: inquiryFilters,
    pagination: { pageSize: 1000 },
  });
  const { data: latestLeads } = useList<AestheticLead | DentalLead>({
    resource: leadsResource,
    pagination: { pageSize: 5 },
    sorters: [{ field: "created_at", order: "desc" }],
  });

  // 7-day trend data
  const trendStart = useMemo(() => dayjs().subtract(6, "day").startOf("day"), []);
  const { data: trendLeadsData } = useList<{ id: string; created_at: string }>({
    resource: leadsResource,
    filters: [{ field: "created_at", operator: "gte", value: trendStart.toISOString() }],
    pagination: { pageSize: 1000 },
    sorters: [{ field: "created_at", order: "asc" }],
    meta: { select: "id, created_at" },
  });
  const trendByDay = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) =>
      dayjs().subtract(6 - i, "day").format("YYYY-MM-DD")
    );
    const counts: Record<string, number> = Object.fromEntries(days.map((d) => [d, 0]));
    (trendLeadsData?.data || []).forEach((r) => {
      const d = dayjs(r.created_at).format("YYYY-MM-DD");
      if (counts[d] !== undefined) counts[d] += 1;
    });
    return days.map((d) => ({ day: d, count: counts[d] }));
  }, [trendLeadsData]);

  // Treatments awaiting followup (last 7 days)
  const followupCutoff = useMemo(
    () => dayjs().subtract(6, "day").format("YYYY-MM-DD"),
    []
  );
  const { data: pendingFollowup } = useList<AestheticClient | DentalClient>({
    resource: clientsResource,
    filters: [
      { field: "last_treatment_date", operator: "gte", value: followupCutoff },
      { field: "followup_after_last_treatment", operator: "eq", value: false },
    ],
    pagination: { pageSize: 8 },
    sorters: [{ field: "last_treatment_date", order: "desc" }],
  });

  const inquiries = inquiriesData?.data || [];
  const totalInquiries = inquiriesData?.total ?? inquiries.length;
  const scheduledCount = inquiries.filter((i) => i.status === "scheduled").length;
  const callbackCount = inquiries.filter((i) => i.status === "callback_requested").length;

  const totalLeads = leadsTotal?.total ?? 0;
  const totalClients = clientsTotal?.total ?? 0;
  const newLeadsWeek = leadsThisWeek?.total ?? 0;
  const newClientsWeek = clientsThisWeek?.total ?? 0;
  const pausedBots = botPaused?.total ?? 0;
  const conversionRate =
    totalLeads + totalClients > 0
      ? Math.round((totalClients / (totalLeads + totalClients)) * 100)
      : 0;

  return (
    <Card
      style={{
        borderRadius: 20,
        overflow: "hidden",
        height: "100%",
        border: `1px solid ${palette.border}`,
      }}
      styles={{ body: { padding: 0 } }}
    >
      {/* Hero */}
      <div
        style={{
          background: `linear-gradient(135deg, ${palette.primary} 0%, ${palette.chip} 65%, ${palette.accent} 100%)`,
          padding: "24px 28px",
          color: "#fff",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -60,
            insetInlineStart: -40,
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.10)",
          }}
        />
        <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontSize: 12, opacity: 0.85, letterSpacing: 1, textTransform: "uppercase" }}>
              {palette.emoji} {palette.label}
            </div>
            <h2 style={{ margin: "6px 0 0", fontSize: 22, fontWeight: 700 }}>
              {totalLeads + totalClients} אנשי קשר
            </h2>
            <div style={{ fontSize: 12, opacity: 0.85, marginTop: 4 }}>
              {newLeadsWeek + newClientsWeek > 0
                ? `+${newLeadsWeek + newClientsWeek} ב־7 ימים אחרונים`
                : "אין פעילות חדשה השבוע"}
            </div>
          </div>
          <Button
            size="small"
            onClick={() => navigate(`/${section}/contacts`)}
            icon={<ArrowLeftOutlined />}
            style={{
              background: "rgba(255,255,255,0.2)",
              borderColor: "rgba(255,255,255,0.3)",
              color: "#fff",
              borderRadius: 10,
            }}
          >
            פתח לידים ולקוחות
          </Button>
        </div>
      </div>

      {/* KPI grid */}
      <div style={{ padding: 20 }}>
        <Row gutter={[12, 12]}>
          <Col span={12}>
            <KpiBlock
              icon={<FireOutlined />}
              label="לידים"
              value={totalLeads}
              hint={`+${newLeadsWeek} השבוע`}
              palette={palette}
            />
          </Col>
          <Col span={12}>
            <KpiBlock
              icon={<CrownOutlined />}
              label="לקוחות"
              value={totalClients}
              hint={`+${newClientsWeek} השבוע`}
              palette={palette}
            />
          </Col>
          <Col span={12}>
            <KpiBlock
              icon={<RiseOutlined />}
              label="המרה ללקוחות"
              value={`${conversionRate}%`}
              hint="ליד → לקוח"
              palette={palette}
            />
          </Col>
          <Col span={12}>
            <KpiBlock
              icon={<RobotOutlined />}
              label="בוט מושהה"
              value={pausedBots}
              hint={pausedBots ? "צריך מענה אנושי" : "כל הבוטים פעילים"}
              palette={palette}
              warn={pausedBots > 0}
            />
          </Col>
        </Row>

        {/* Inquiries strip */}
        <div
          style={{
            marginTop: 18,
            padding: "12px 16px",
            background: palette.soft,
            border: `1px solid ${palette.border}`,
            borderRadius: 14,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <Space size={16} wrap>
            <span style={{ fontSize: 12, color: palette.deep, fontWeight: 600, letterSpacing: 0.5 }}>
              <CalendarOutlined /> מעקב פניות (טווח)
            </span>
            <Tag color="default" style={{ fontWeight: 500 }}>{totalInquiries} סה"כ</Tag>
            <Tag color="green">{scheduledCount} קבעו פגישה</Tag>
            <Tag color="orange">{callbackCount} ממתינים לחזרה</Tag>
          </Space>
          <Button
            size="small"
            type="text"
            onClick={() => navigate(`/${section}/inquiries`)}
            icon={<ArrowLeftOutlined />}
            style={{ color: palette.primary }}
          >
            פתח
          </Button>
        </div>

        {/* 7-day trend */}
        <div style={{ marginTop: 18 }}>
          <div
            style={{
              fontSize: 12,
              color: palette.deep,
              fontWeight: 600,
              letterSpacing: 0.5,
              marginBottom: 10,
              display: "flex",
              alignItems: "center",
              gap: 6,
              justifyContent: "space-between",
            }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <AreaChartOutlined /> לידים חדשים — 7 ימים
            </span>
            <span style={{ fontWeight: 500, color: "#7a6b78", fontSize: 11 }}>
              סה"כ {trendByDay.reduce((s, d) => s + d.count, 0)}
            </span>
          </div>
          <TrendChart data={trendByDay} palette={palette} />
        </div>

        {/* Treatments awaiting followup */}
        <div style={{ marginTop: 18 }}>
          <div
            style={{
              fontSize: 12,
              color: palette.deep,
              fontWeight: 600,
              letterSpacing: 0.5,
              marginBottom: 10,
              display: "flex",
              alignItems: "center",
              gap: 6,
              justifyContent: "space-between",
            }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <ClockCircleOutlined /> טיפולים בשבוע האחרון — ממתינים לפולואפ
            </span>
            <Tag color="orange" style={{ fontWeight: 500 }}>
              {pendingFollowup?.total ?? 0}
            </Tag>
          </div>
          {(pendingFollowup?.data || []).length === 0 ? (
            <div
              style={{
                padding: "12px 14px",
                background: palette.soft,
                border: `1px dashed ${palette.border}`,
                borderRadius: 12,
                color: palette.deep,
                fontSize: 12,
                textAlign: "center",
              }}
            >
              ✓ כל הטיפולים האחרונים קיבלו פולואפ
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {(pendingFollowup?.data || []).map((c) => (
                <div
                  key={c.id}
                  onClick={() => navigate(`/${section}/clients/edit/${c.id}`)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 12px",
                    border: `1px solid ${palette.border}`,
                    borderRadius: 12,
                    cursor: "pointer",
                    background: "#fff",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = palette.soft;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "#fff";
                  }}
                >
                  <Avatar
                    size={32}
                    style={{
                      background: `linear-gradient(135deg, ${palette.chip}, ${palette.accent})`,
                      color: "#fff",
                      fontWeight: 600,
                      fontSize: 12,
                    }}
                  >
                    {initials(c) || "?"}
                  </Avatar>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: palette.deep,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {fullName(c)}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "#7a6b78",
                        display: "flex",
                        gap: 8,
                        alignItems: "center",
                      }}
                    >
                      {c.last_treatment_type && (
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          <HeartOutlined /> {c.last_treatment_type}
                        </span>
                      )}
                      {c.normalized_phone && (
                        <span>
                          <PhoneOutlined /> {c.normalized_phone}
                        </span>
                      )}
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      color: "#92400e",
                      background: "#fef3c7",
                      padding: "2px 8px",
                      borderRadius: 8,
                      whiteSpace: "nowrap",
                      fontWeight: 500,
                    }}
                  >
                    {c.last_treatment_date
                      ? dayjs(c.last_treatment_date).format("DD/MM")
                      : "—"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Latest leads */}
        <div style={{ marginTop: 18 }}>
          <div
            style={{
              fontSize: 12,
              color: palette.deep,
              fontWeight: 600,
              letterSpacing: 0.5,
              marginBottom: 10,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <ThunderboltOutlined /> לידים אחרונים
          </div>
          {(latestLeads?.data || []).length === 0 ? (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="אין לידים עדיין" />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {(latestLeads?.data || []).map((lead) => (
                <div
                  key={lead.id}
                  onClick={() => navigate(`/${section}/leads/edit/${lead.id}`)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 12px",
                    border: `1px solid ${palette.border}`,
                    borderRadius: 12,
                    cursor: "pointer",
                    background: "#fff",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = palette.soft;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "#fff";
                  }}
                >
                  <Avatar
                    size={32}
                    style={{
                      background: `linear-gradient(135deg, ${palette.primary}, ${palette.chip})`,
                      color: "#fff",
                      fontWeight: 600,
                      fontSize: 12,
                    }}
                  >
                    {initials(lead) || "?"}
                  </Avatar>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: palette.deep,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {fullName(lead)}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "#7a6b78",
                        display: "flex",
                        gap: 8,
                        alignItems: "center",
                      }}
                    >
                      {lead.normalized_phone && (
                        <span>
                          <PhoneOutlined /> {lead.normalized_phone}
                        </span>
                      )}
                      {lead.interested_treatment && (
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          <HeartOutlined /> {lead.interested_treatment}
                        </span>
                      )}
                    </div>
                  </div>
                  <span style={{ fontSize: 11, color: "#a89aa3", whiteSpace: "nowrap" }}>
                    {lead.created_at ? formatDate(lead.created_at) : ""}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

function KpiBlock({
  icon,
  label,
  value,
  hint,
  palette,
  warn,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  hint?: string;
  palette: typeof PALETTE.aesthetic;
  warn?: boolean;
}) {
  const accent = warn ? "#f59e0b" : palette.primary;
  return (
    <div
      style={{
        padding: "14px 16px",
        background: warn ? "#fef3c7" : palette.soft,
        border: `1px solid ${warn ? "#fcd34d" : palette.border}`,
        borderRadius: 14,
        height: "100%",
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: warn ? "#92400e" : palette.deep,
          fontWeight: 600,
          letterSpacing: 0.5,
          textTransform: "uppercase",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span style={{ color: accent }}>{icon}</span>
        {label}
      </div>
      <div
        style={{
          fontSize: 26,
          fontWeight: 700,
          color: accent,
          letterSpacing: -0.5,
          marginTop: 4,
          lineHeight: 1.1,
        }}
      >
        {typeof value === "number" ? value.toLocaleString("he-IL") : value}
      </div>
      {hint && (
        <div style={{ fontSize: 10, color: "#7a6b78", marginTop: 2 }}>
          {hint}
        </div>
      )}
    </div>
  );
}

export const HomePage = () => {
  const [range, setRange] = useState<[Dayjs, Dayjs]>([
    dayjs().startOf("day").subtract(6, "day"),
    dayjs().endOf("day"),
  ]);

  // Pending callbacks across both businesses
  const { data: aestheticPending } = useList<AestheticInquiry>({
    resource: "aesthetic_inquiries",
    filters: [{ field: "status", operator: "eq", value: "callback_requested" }],
    pagination: { pageSize: 1 },
    meta: { select: "id" },
  });
  const { data: dentalPending } = useList<DentalInquiry>({
    resource: "dental_inquiries",
    filters: [{ field: "status", operator: "eq", value: "callback_requested" }],
    pagination: { pageSize: 1 },
    meta: { select: "id" },
  });
  const totalPending = (aestheticPending?.total || 0) + (dentalPending?.total || 0);

  // Combined totals for header
  const { data: allAestheticLeads } = useList({
    resource: "aesthetic_leads",
    pagination: { pageSize: 1 },
    meta: { select: "id" },
  });
  const { data: allDentalLeads } = useList({
    resource: "dental_leads",
    pagination: { pageSize: 1 },
    meta: { select: "id" },
  });
  const { data: allAestheticClients } = useList({
    resource: "aesthetic_clients",
    pagination: { pageSize: 1 },
    meta: { select: "id" },
  });
  const { data: allDentalClients } = useList({
    resource: "dental_clients",
    pagination: { pageSize: 1 },
    meta: { select: "id" },
  });
  const grandLeads = (allAestheticLeads?.total || 0) + (allDentalLeads?.total || 0);
  const grandClients = (allAestheticClients?.total || 0) + (allDentalClients?.total || 0);

  // Today
  const todayStart = dayjs().startOf("day").toISOString();
  const { data: aestheticTodayLeads } = useList({
    resource: "aesthetic_leads",
    pagination: { pageSize: 1 },
    filters: [{ field: "created_at", operator: "gte", value: todayStart }],
    meta: { select: "id" },
  });
  const { data: dentalTodayLeads } = useList({
    resource: "dental_leads",
    pagination: { pageSize: 1 },
    filters: [{ field: "created_at", operator: "gte", value: todayStart }],
    meta: { select: "id" },
  });
  const todayLeads = (aestheticTodayLeads?.total || 0) + (dentalTodayLeads?.total || 0);

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto" }}>
      <div
        style={{
          background: "linear-gradient(135deg, #1a0e2e 0%, #3d1738 60%, #0a3838 100%)",
          color: "#fff",
          borderRadius: 24,
          padding: "32px 36px",
          marginBottom: 20,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -100,
            insetInlineStart: -60,
            width: 320,
            height: 320,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(173,78,156,0.4) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -120,
            insetInlineEnd: -80,
            width: 320,
            height: 320,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(13,110,110,0.4) 0%, transparent 70%)",
          }}
        />
        <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 24 }}>
          <div>
            <div style={{ fontSize: 12, opacity: 0.7, letterSpacing: 2, textTransform: "uppercase" }}>
              {dayjs().format("dddd, DD/MM/YYYY")}
            </div>
            <h1 style={{ margin: "6px 0 4px", fontSize: 30, fontWeight: 700, letterSpacing: -0.5 }}>
              שלום חננאל ✨🦷
            </h1>
            <div style={{ fontSize: 14, opacity: 0.85 }}>
              תמונת מצב חיה של שני העסקים
            </div>
          </div>

          <Space size={16} wrap>
            <HeroStat label="סה״כ לידים" value={grandLeads} icon={<FireOutlined />} />
            <HeroStat label="סה״כ לקוחות" value={grandClients} icon={<CrownOutlined />} />
            <HeroStat label="לידים היום" value={todayLeads} icon={<ThunderboltOutlined />} highlight={todayLeads > 0} />
          </Space>
        </div>
      </div>

      {totalPending > 0 && (
        <Alert
          type="warning"
          showIcon
          style={{ marginBottom: 16, borderRadius: 14 }}
          message={
            <span>
              יש <b>{totalPending}</b> פני{totalPending === 1 ? "ייה" : "ות"} שממתינות לשיחה חוזרת — מהיר לפתוח את העמוד הרלוונטי
            </span>
          }
          action={
            <Space>
              <Button
                size="small"
                onClick={() => (window.location.href = "/aesthetic/inquiries")}
              >
                ✨ אסתטיקה
              </Button>
              <Button
                size="small"
                onClick={() => (window.location.href = "/dental/inquiries")}
              >
                🦷 שיניים
              </Button>
            </Space>
          }
        />
      )}

      <Space style={{ marginBottom: 16 }} wrap>
        <span style={{ fontSize: 13, color: "#7a6b78", fontWeight: 500 }}>
          <UsergroupAddOutlined /> טווח מעקב פניות:
        </span>
        <RangePicker
          value={range}
          onChange={(v) => v && v[0] && v[1] && setRange([v[0], v[1]])}
          format="DD/MM/YYYY"
          allowClear={false}
          presets={[
            { label: "היום", value: [dayjs().startOf("day"), dayjs().endOf("day")] },
            { label: "7 ימים", value: [dayjs().subtract(6, "day").startOf("day"), dayjs().endOf("day")] },
            { label: "30 ימים", value: [dayjs().subtract(29, "day").startOf("day"), dayjs().endOf("day")] },
          ]}
        />
      </Space>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <BusinessPanel section="aesthetic" range={range} />
        </Col>
        <Col xs={24} lg={12}>
          <BusinessPanel section="dental" range={range} />
        </Col>
      </Row>
    </div>
  );
};

function TrendChart({
  data,
  palette,
}: {
  data: { day: string; count: number }[];
  palette: typeof PALETTE.aesthetic;
}) {
  const max = Math.max(1, ...data.map((d) => d.count));
  const today = dayjs().format("YYYY-MM-DD");
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: 8,
        height: 110,
        padding: "8px 4px",
        background: palette.soft,
        border: `1px solid ${palette.border}`,
        borderRadius: 12,
      }}
    >
      {data.map((d) => {
        const isToday = d.day === today;
        const heightPx = (d.count / max) * 70;
        return (
          <div
            key={d.day}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              height: "100%",
              justifyContent: "flex-end",
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: d.count ? palette.deep : "#a89aa3",
                height: 14,
                lineHeight: 1,
              }}
            >
              {d.count > 0 ? d.count : ""}
            </div>
            <div
              style={{
                width: "100%",
                height: `${heightPx}px`,
                minHeight: d.count ? 4 : 1,
                background: d.count
                  ? `linear-gradient(180deg, ${palette.primary}, ${palette.chip})`
                  : palette.border,
                borderRadius: 6,
                opacity: d.count ? 1 : 0.4,
                boxShadow: isToday && d.count ? `0 0 0 2px ${palette.accent}` : "none",
                transition: "all 0.2s",
              }}
              title={`${dayjs(d.day).format("dddd, DD/MM")}: ${d.count} לידים`}
            />
            <div
              style={{
                fontSize: 10,
                color: isToday ? palette.primary : "#7a6b78",
                fontWeight: isToday ? 700 : 500,
              }}
            >
              {dayjs(d.day).format("dd")}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function HeroStat({
  label,
  value,
  icon,
  highlight,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div
      style={{
        background: highlight ? "rgba(34,197,94,0.18)" : "rgba(255,255,255,0.10)",
        backdropFilter: "blur(10px)",
        padding: "14px 20px",
        borderRadius: 14,
        border: `1px solid ${highlight ? "rgba(34,197,94,0.35)" : "rgba(255,255,255,0.18)"}`,
        minWidth: 130,
      }}
    >
      <div style={{ fontSize: 11, opacity: 0.85, fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ color: highlight ? "#86efac" : "#e0b3d8" }}>{icon}</span> {label}
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, lineHeight: 1.1, marginTop: 4, letterSpacing: -0.5 }}>
        {value.toLocaleString("he-IL")}
      </div>
    </div>
  );
}
