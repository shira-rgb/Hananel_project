import { useTable, List, DeleteButton, EditButton } from "@refinedev/antd";
import { useList } from "@refinedev/core";
import { Table, Tag, Space, DatePicker, Card, Row, Col, Statistic, Collapse } from "antd";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import dayjs, { Dayjs } from "dayjs";
import type { DentalInquiry } from "../../../interfaces";
import {
  inquiryStatusColor,
  inquiryStatusLabel,
  formatDateOnly,
} from "../../../utils/formatters";

const { RangePicker } = DatePicker;

export const DentalInquiryList = () => {
  const navigate = useNavigate();

  const [range, setRange] = useState<[Dayjs, Dayjs]>([
    dayjs().startOf("day").subtract(7, "day"),
    dayjs().endOf("day"),
  ]);

  const dateFilters = useMemo(
    () => [
      { field: "inquiry_date", operator: "gte" as const, value: range[0].format("YYYY-MM-DD") },
      { field: "inquiry_date", operator: "lte" as const, value: range[1].format("YYYY-MM-DD") },
    ],
    [range]
  );

  const { tableProps } = useTable<DentalInquiry>({
    resource: "dental_inquiries",
    sorters: { initial: [{ field: "inquiry_date", order: "desc" }] },
    filters: { permanent: dateFilters },
  });

  const { data: statsData } = useList<DentalInquiry>({
    resource: "dental_inquiries",
    filters: dateFilters,
    pagination: { pageSize: 1000 },
  });
  const rows = statsData?.data || [];
  const total = rows.length;
  const inquired = rows.filter((r) => r.status === "inquired").length;
  const scheduled = rows.filter((r) => r.status === "scheduled").length;
  const callback = rows.filter((r) => r.status === "callback_requested").length;

  // Source breakdown
  const sourceCounts: Record<string, number> = {};
  rows.forEach((r) => {
    const s = (r.source || "").trim() || "לא צויין";
    sourceCounts[s] = (sourceCounts[s] || 0) + 1;
  });
  const sortedSources = Object.entries(sourceCounts).sort((a, b) => b[1] - a[1]);

  return (
    <List
      title="מעקב פניות — מרפאת שיניים"
      createButtonProps={{ children: "רישום פנייה חדשה" }}
    >
      <div style={{ marginBottom: 16 }}>
        <Space wrap>
          <span>טווח תאריכים:</span>
          <RangePicker
            value={range}
            onChange={(v) => v && v[0] && v[1] && setRange([v[0], v[1]])}
            format="DD/MM/YYYY"
            allowClear={false}
          />
        </Space>
      </div>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic title="סה״כ פניות" value={total} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic title="פנו" value={inquired} valueStyle={{ color: "#1677ff" }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic title="קבעו פגישה" value={scheduled} valueStyle={{ color: "#52c41a" }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic title="ממתינים לשיחה חוזרת" value={callback} valueStyle={{ color: "#fa8c16" }} />
          </Card>
        </Col>
      </Row>

      <Collapse
        style={{ marginBottom: 16 }}
        items={[
          {
            key: "sources",
            label: `הצג פילוח לפי מקור (${sortedSources.length} מקורות)`,
            children:
              sortedSources.length === 0 ? (
                <span style={{ color: "#999" }}>אין נתונים בטווח הזה</span>
              ) : (
                <Space size={[8, 8]} wrap>
                  {sortedSources.map(([src, count]) => {
                    const pct = total ? Math.round((count / total) * 100) : 0;
                    return (
                      <Tag key={src} color="cyan" style={{ fontSize: 14, padding: "4px 10px" }}>
                        {src}: <b>{count}</b> ({pct}%)
                      </Tag>
                    );
                  })}
                </Space>
              ),
          },
        ]}
      />

      <Table
        {...tableProps}
        rowKey="id"
        scroll={{ x: "max-content" }}
        onRow={(record: DentalInquiry) => ({
          onClick: (e) => {
            const target = e.target as HTMLElement;
            if (target.closest("button") || target.closest(".ant-btn")) return;
            navigate(`/dental/inquiries/edit/${record.id}`);
          },
          style: { cursor: "pointer" },
        })}
        columns={[
          {
            title: "תאריך",
            dataIndex: "inquiry_date",
            width: 120,
            render: (v: string) => (v ? formatDateOnly(v) : "-"),
          },
          { title: "שם", dataIndex: "full_name", render: (v?: string) => v || "-" },
          { title: "טלפון", dataIndex: "phone", render: (v?: string) => v || "-" },
          { title: "מקור", dataIndex: "source", render: (v?: string) => v || "-" },
          {
            title: "סטטוס",
            dataIndex: "status",
            width: 140,
            render: (v: string) => <Tag color={inquiryStatusColor(v)}>{inquiryStatusLabel(v)}</Tag>,
          },
          {
            title: "הערות",
            dataIndex: "notes",
            render: (v?: string) => (
              <div
                style={{ maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                title={v}
              >
                {v || "-"}
              </div>
            ),
          },
          {
            title: "פעולות",
            width: 100,
            render: (_: unknown, record: DentalInquiry) => (
              <Space>
                <EditButton hideText size="small" recordItemId={record.id} />
                <DeleteButton hideText size="small" recordItemId={record.id} />
              </Space>
            ),
          },
        ]}
      />
    </List>
  );
};
