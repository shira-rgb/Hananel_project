import { useTable, List, DeleteButton, EditButton } from "@refinedev/antd";
import { Table, Space, Popover, Checkbox, Button } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { DentalClient } from "../../../interfaces";
import { formatDate } from "../../../utils/formatters";

type ColKey = "phone" | "email" | "notes" | "created_at";

const COLUMN_DEFS: { key: ColKey; label: string; defaultVisible: boolean }[] = [
  { key: "phone",      label: "טלפון",  defaultVisible: true },
  { key: "email",      label: "אימייל", defaultVisible: true },
  { key: "notes",      label: "הערות",  defaultVisible: true },
  { key: "created_at", label: "נוסף",   defaultVisible: true },
];

export const DentalClientList = () => {
  const navigate = useNavigate();
  const { tableProps } = useTable<DentalClient>({
    resource: "dental_clients",
    sorters: { initial: [{ field: "full_name", order: "asc" }] },
  });

  const [visibleCols, setVisibleCols] = useState<Set<ColKey>>(
    new Set(COLUMN_DEFS.filter((c) => c.defaultVisible).map((c) => c.key))
  );
  const toggleCol = useCallback((key: ColKey, checked: boolean) => {
    setVisibleCols((prev) => { const n = new Set(prev); checked ? n.add(key) : n.delete(key); return n; });
  }, []);
  const vis = (key: ColKey) => visibleCols.has(key);

  const colVisibilityContent = (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 140 }}>
      {COLUMN_DEFS.map((col) => (
        <Checkbox key={col.key} checked={visibleCols.has(col.key)} onChange={(e) => toggleCol(col.key, e.target.checked)}>
          {col.label}
        </Checkbox>
      ))}
    </div>
  );

  const columns = useMemo(() => [
    { key: "full_name", title: "שם מלא", dataIndex: "full_name" },
    vis("phone") && { key: "phone", title: "טלפון", dataIndex: "phone", render: (v: string) => v || "-" },
    vis("email") && { key: "email", title: "אימייל", dataIndex: "email", render: (v: string) => v || "-" },
    vis("notes") && {
      key: "notes", title: "הערות", dataIndex: "notes",
      render: (v: string) => v ? (
        <div style={{ maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={v}>{v}</div>
      ) : "-",
    },
    vis("created_at") && {
      key: "created_at", title: "נוסף", dataIndex: "created_at", width: 140,
      render: (d: string) => formatDate(d),
    },
    {
      key: "actions", title: "פעולות", width: 100,
      render: (_: unknown, record: DentalClient) => (
        <Space>
          <EditButton hideText size="small" recordItemId={record.id} />
          <DeleteButton hideText size="small" recordItemId={record.id} />
        </Space>
      ),
    },
  ].filter(Boolean), [visibleCols]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <List
      title="לקוחות — מרפאת שיניים"
      createButtonProps={{ children: "הוסף לקוח" }}
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
        onRow={(record: DentalClient) => ({
          onClick: (e) => {
            const target = e.target as HTMLElement;
            if (target.closest("button") || target.closest(".ant-btn")) return;
            navigate(`/dental/clients/edit/${record.id}`);
          },
          style: { cursor: "pointer" },
        })}
      />
    </List>
  );
};
