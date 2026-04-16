import { useList } from "@refinedev/core";
import {
  Card,
  Row,
  Col,
  Statistic,
  Space,
  Tag,
  Button,
  DatePicker,
  Alert,
  Divider,
} from "antd";
import {
  PlusOutlined,
  RightOutlined,
  PhoneOutlined,
  CalendarOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import dayjs, { Dayjs } from "dayjs";
import type {
  AestheticInquiry,
  DentalInquiry,
  AestheticProduct,
  DentalProduct,
  AestheticFollowupMessage,
  DentalFollowupMessage,
} from "../../interfaces";

const { RangePicker } = DatePicker;

type Section = "aesthetic" | "dental";

const BUSINESS_META: Record<
  Section,
  {
    label: string;
    emoji: string;
    accent: string;
    inquiriesResource: string;
    productsResource: string;
    followupResource: string;
    path: string;
  }
> = {
  aesthetic: {
    label: "קליניקת אסתטיקה",
    emoji: "✨",
    accent: "#7C3AED",
    inquiriesResource: "aesthetic_inquiries",
    productsResource: "aesthetic_products",
    followupResource: "aesthetic_followup_messages",
    path: "aesthetic",
  },
  dental: {
    label: "מרפאת שיניים",
    emoji: "🦷",
    accent: "#06B6D4",
    inquiriesResource: "dental_inquiries",
    productsResource: "dental_products",
    followupResource: "dental_followup_messages",
    path: "dental",
  },
};

const BusinessSummary = ({
  section,
  range,
}: {
  section: Section;
  range: [Dayjs, Dayjs];
}) => {
  const navigate = useNavigate();
  const meta = BUSINESS_META[section];

  const dateFilters = useMemo(
    () => [
      { field: "inquiry_date", operator: "gte" as const, value: range[0].format("YYYY-MM-DD") },
      { field: "inquiry_date", operator: "lte" as const, value: range[1].format("YYYY-MM-DD") },
    ],
    [range]
  );

  const { data: inquiriesData } = useList<AestheticInquiry | DentalInquiry>({
    resource: meta.inquiriesResource,
    filters: dateFilters,
    pagination: { pageSize: 1000 },
  });

  const { data: productsData } = useList<AestheticProduct | DentalProduct>({
    resource: meta.productsResource,
    filters: [{ field: "is_active", operator: "eq", value: true }],
    pagination: { pageSize: 1 },
    meta: { select: "id" },
  });

  const { data: followupData } = useList<AestheticFollowupMessage | DentalFollowupMessage>({
    resource: meta.followupResource,
    filters: [{ field: "is_active", operator: "eq", value: true }],
    pagination: { pageSize: 1 },
    meta: { select: "id" },
  });

  const inquiries = inquiriesData?.data || [];
  const total = inquiriesData?.total ?? inquiries.length;
  const scheduled = inquiries.filter((i) => i.status === "scheduled").length;
  const callback = inquiries.filter((i) => i.status === "callback_requested").length;
  const today = dayjs().format("YYYY-MM-DD");
  const todayCount = inquiries.filter((i) => i.inquiry_date === today).length;

  const productsCount = productsData?.total ?? 0;
  const followupCount = followupData?.total ?? 0;

  return (
    <Card
      style={{ borderTop: `3px solid ${meta.accent}`, height: "100%" }}
      title={
        <Space>
          <span style={{ fontSize: 22 }}>{meta.emoji}</span>
          <span style={{ fontWeight: 700 }}>{meta.label}</span>
        </Space>
      }
      extra={
        <Button
          type="link"
          size="small"
          onClick={() => navigate(`/${meta.path}/inquiries`)}
          icon={<RightOutlined rotate={180} />}
        >
          פתח מעקב פניות
        </Button>
      }
    >
      <Row gutter={[12, 12]}>
        <Col xs={12}>
          <Statistic
            title="פניות בטווח"
            value={total}
            prefix={<UsergroupAddOutlined />}
            valueStyle={{ color: meta.accent }}
          />
        </Col>
        <Col xs={12}>
          <Statistic
            title="פניות היום"
            value={todayCount}
            valueStyle={{ color: todayCount > 0 ? "#52c41a" : "#999" }}
          />
        </Col>
        <Col xs={12}>
          <Statistic
            title="קבעו פגישה"
            value={scheduled}
            prefix={<CalendarOutlined />}
            valueStyle={{ color: "#52c41a" }}
          />
        </Col>
        <Col xs={12}>
          <Statistic
            title="ממתינים לשיחה חוזרת"
            value={callback}
            prefix={<PhoneOutlined />}
            valueStyle={{ color: callback > 0 ? "#fa8c16" : "#999" }}
          />
        </Col>
      </Row>

      <Divider style={{ margin: "16px 0" }} />

      <Space wrap>
        <Tag color="purple">{productsCount} מוצרים פעילים</Tag>
        <Tag color="blue">{followupCount} הודעות פולואפ פעילות</Tag>
      </Space>

      <Divider style={{ margin: "16px 0" }} />

      <Space wrap>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate(`/${meta.path}/inquiries/create`)}
        >
          רישום פנייה
        </Button>
        <Button onClick={() => navigate(`/${meta.path}/products`)}>מוצרים ומחירון</Button>
        <Button onClick={() => navigate(`/${meta.path}/followup`)}>הודעות פולואפ</Button>
      </Space>
    </Card>
  );
};

export const HomePage = () => {
  const [range, setRange] = useState<[Dayjs, Dayjs]>([
    dayjs().startOf("day").subtract(6, "day"),
    dayjs().endOf("day"),
  ]);

  // Pending callbacks across both businesses (today's snapshot)
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

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700 }}>סקירה כללית</h1>
        <p style={{ margin: "4px 0 0", color: "#7C6B8B", fontSize: 14 }}>
          תמונת מצב של שני העסקים — {dayjs().format("dddd, DD/MM/YYYY")}
        </p>
      </div>

      {totalPending > 0 && (
        <Alert
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
          message={
            <>
              יש <b>{totalPending}</b> פנ{totalPending === 1 ? "ייה" : "יות"} שממתינות לשיחה חוזרת
            </>
          }
        />
      )}

      <Space style={{ marginBottom: 16 }} wrap>
        <span>טווח התצוגה:</span>
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
          <BusinessSummary section="aesthetic" range={range} />
        </Col>
        <Col xs={24} lg={12}>
          <BusinessSummary section="dental" range={range} />
        </Col>
      </Row>
    </div>
  );
};
