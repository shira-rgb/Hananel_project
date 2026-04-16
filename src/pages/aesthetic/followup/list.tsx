import { useTable, List, DeleteButton, EditButton } from "@refinedev/antd";
import { Table, Tag, Space, Popover, Checkbox, Button } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { AestheticFollowupMessage } from "../../../interfaces";
import { delayUnitLabel } from "../../../utils/formatters";

type ColKey = "treatment_types" | "message_text" | "delay" | "is_active";

const COLUMN_DEFS: { key: ColKey; label: string; defaultVisible: boolean }[] = [
  { key: "treatment_types", label: "מוצר מקושר",   defaultVisible: true },
  { key: "message_text",    label: "תוכן ההודעה", defaultVisible: true },
  { key: "delay",           label: "שליחה",        defaultVisible: true },
  { key: "is_active",       label: "פעיל",          defaultVisible: true },
];

export const AestheticFollowupList = () => {
  const navigate = useNavigate();
  const { tableProps } = useTable<AestheticFollowupMessage>({
    resource: "aesthetic_followup_messages",
    sorters: { initial: [{ field: "created_at", order: "desc" }] },
  });

  const [visibleCols, setVisibleCols] = useState<Set<ColKey>>(
    new Set(COLUMN_DEFS.filter((c) => c.defaultVisible).map((c) => c.key))
  );
  const toggleCol = useCallback((key: ColKey, checked: boolean) => {
    setVisibleCols((prev) => { const n = new Set(prev); checked ? n.add(key) : n.delete(key); return n; });
  }, []);
  const vis = (key: ColKey) => visibleCols.has(key);

  const colVisibilityContent = (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 160 }}>
      {COLUMN_DEFS.map((col) => (
        <Checkbox key={col.key} checked={visibleCols.has(col.key)} onChange={(e) => toggleCol(col.key, e.target.checked)}>
          {col.label}
        </Checkbox>
      ))}
    </div>
  );

  const columns = useMemo(() => [
    vis("treatment_types") && {
      key: "treatment_types", title: "מוצר מקושר", dataIndex: "treatment_types",
      render: (types: string[]) => types?.length
        ? <>{types.map((t) => <Tag key={t} color="purple" style={{ marginBottom: 2 }}>{t}</Tag>)}</>
        : <Tag>כללי</Tag>,
    },
    vis("message_text") && {
      key: "message_text", title: "תוכן ההודעה", dataIndex: "message_text",
      render: (text: string) => (
        <div style={{ maxWidth: 320, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={text}>{text}</div>
      ),
    },
    vis("delay") && {
      key: "delay", title: "שליחה", width: 220,
      render: (_: unknown, record: AestheticFollowupMessage) => {
        const before = record.timing_type === "before";
        return (
          <Tag color={before ? "orange" : "blue"}>
            {record.delay_value} {delayUnitLabel(record.delay_unit)}{" "}
            {before ? "לפני פגישה" : "אחרי טיפול"}
          </Tag>
        );
      },
    },
    vis("is_active") && {
      key: "is_active", title: "פעיל", dataIndex: "is_active", width: 80,
      render: (v: boolean) => v ? <Tag color="green">פעיל</Tag> : <Tag color="red">כבוי</Tag>,
    },
    {
      key: "actions", title: "פעולות", width: 100,
      render: (_: unknown, record: AestheticFollowupMessage) => (
        <Space>
          <EditButton hideText size="small" recordItemId={record.id} />
          <DeleteButton hideText size="small" recordItemId={record.id} />
        </Space>
      ),
    },
  ].filter(Boolean), [visibleCols]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <List
      title="הודעות פולואפ — קליניקת אסתטיקה"
      createButtonProps={{ children: "הוסף הודעה" }}
      headerButtons={({ defaultButtons }) => (
        <>
          {defaultButtons}
          <Popover content={colVisibilityContent} title="הצג עמודות" trigger="click" placement="bottomLeft">
            <Button icon={<SettingOutlined />}>עמודות</Button>
          </Popover>
        </>
      )}
    >
      <Table
        {...tableProps}
        rowKey="id"
        columns={columns as any}
        scroll={{ x: "max-content" }}
        onRow={(record: AestheticFollowupMessage) => ({
          onClick: (e) => {
            const target = e.target as HTMLElement;
            if (target.closest("button") || target.closest(".ant-btn")) return;
            navigate(`/aesthetic/followup/edit/${record.id}`);
          },
          style: { cursor: "pointer" },
        })}
      />
    </List>
  );
};
