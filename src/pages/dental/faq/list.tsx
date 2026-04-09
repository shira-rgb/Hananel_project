import { useTable, List, DeleteButton, EditButton } from "@refinedev/antd";
import { Table, Tag, Space, Popover, Checkbox, Button } from "antd";
import { CheckOutlined, CloseOutlined, SettingOutlined } from "@ant-design/icons";
import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { DentalFAQ } from "../../../interfaces";

type ColKey = "category" | "answer" | "is_active";

const COLUMN_DEFS: { key: ColKey; label: string; defaultVisible: boolean }[] = [
  { key: "category",  label: "קטגוריה", defaultVisible: true },
  { key: "answer",    label: "תשובה",   defaultVisible: true },
  { key: "is_active", label: "פעיל",    defaultVisible: true },
];

export const DentalFAQList = () => {
  const navigate = useNavigate();
  const { tableProps } = useTable<DentalFAQ>({
    resource: "dental_faq",
    sorters: { initial: [{ field: "category", order: "asc" }] },
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
    vis("category") && { key: "category", title: "קטגוריה", dataIndex: "category", width: 150 },
    { key: "question", title: "שאלה", dataIndex: "question" },
    vis("answer") && {
      key: "answer", title: "תשובה", dataIndex: "answer",
      render: (text: string) => (
        <div style={{ maxWidth: 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={text}>{text}</div>
      ),
    },
    vis("is_active") && {
      key: "is_active", title: "פעיל", dataIndex: "is_active", width: 80,
      render: (v: boolean) =>
        v ? <Tag icon={<CheckOutlined />} color="success">כן</Tag>
          : <Tag icon={<CloseOutlined />} color="default">לא</Tag>,
    },
    {
      key: "actions", title: "פעולות", width: 100,
      render: (_: unknown, record: DentalFAQ) => (
        <Space>
          <EditButton hideText size="small" recordItemId={record.id} />
          <DeleteButton hideText size="small" recordItemId={record.id} />
        </Space>
      ),
    },
  ].filter(Boolean), [visibleCols]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <List
      title="שאלות ותשובות — מרפאת שיניים"
      createButtonProps={{ children: "הוסף שאלה" }}
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
        onRow={(record: DentalFAQ) => ({
          onClick: (e) => {
            const target = e.target as HTMLElement;
            if (target.closest("button") || target.closest(".ant-btn")) return;
            navigate(`/dental/faq/edit/${record.id}`);
          },
          style: { cursor: "pointer" },
        })}
      />
    </List>
  );
};
