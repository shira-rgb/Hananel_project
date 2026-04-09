import { useTable, List, DeleteButton, EditButton } from "@refinedev/antd";
import { Table, Space, Popover, Checkbox, Button } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { AestheticBusinessInfo } from "../../../interfaces";

type ColKey = "display_order" | "content";

const COLUMN_DEFS: { key: ColKey; label: string; defaultVisible: boolean }[] = [
  { key: "display_order", label: "סדר",  defaultVisible: true },
  { key: "content",       label: "תוכן", defaultVisible: true },
];

export const AestheticBusinessList = () => {
  const navigate = useNavigate();
  const { tableProps } = useTable<AestheticBusinessInfo>({
    resource: "aesthetic_business_info",
    sorters: { initial: [{ field: "display_order", order: "asc" }] },
  });

  const [visibleCols, setVisibleCols] = useState<Set<ColKey>>(
    new Set(COLUMN_DEFS.filter((c) => c.defaultVisible).map((c) => c.key))
  );
  const toggleCol = useCallback((key: ColKey, checked: boolean) => {
    setVisibleCols((prev) => { const n = new Set(prev); checked ? n.add(key) : n.delete(key); return n; });
  }, []);
  const vis = (key: ColKey) => visibleCols.has(key);

  const colVisibilityContent = (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 130 }}>
      {COLUMN_DEFS.map((col) => (
        <Checkbox key={col.key} checked={visibleCols.has(col.key)} onChange={(e) => toggleCol(col.key, e.target.checked)}>
          {col.label}
        </Checkbox>
      ))}
    </div>
  );

  const columns = useMemo(() => [
    vis("display_order") && { key: "display_order", title: "סדר", dataIndex: "display_order", width: 70 },
    { key: "section_title", title: "כותרת", dataIndex: "section_title" },
    vis("content") && {
      key: "content", title: "תוכן", dataIndex: "content",
      render: (text: string) => (
        <div style={{ maxWidth: 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={text}>{text}</div>
      ),
    },
    {
      key: "actions", title: "פעולות", width: 100,
      render: (_: unknown, record: AestheticBusinessInfo) => (
        <Space>
          <EditButton hideText size="small" recordItemId={record.id} />
          <DeleteButton hideText size="small" recordItemId={record.id} />
        </Space>
      ),
    },
  ].filter(Boolean), [visibleCols]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <List
      title="מידע על העסק — קליניקת אסתטיקה"
      createButtonProps={{ children: "הוסף סעיף" }}
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
        onRow={(record: AestheticBusinessInfo) => ({
          onClick: (e) => {
            const target = e.target as HTMLElement;
            if (target.closest("button") || target.closest(".ant-btn")) return;
            navigate(`/aesthetic/business/edit/${record.id}`);
          },
          style: { cursor: "pointer" },
        })}
      />
    </List>
  );
};
