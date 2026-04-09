import { useTable, List, DeleteButton, EditButton } from "@refinedev/antd";
import { Table, Tag, Space, Image, Tooltip, Popover, Checkbox, Button } from "antd";
import { PlayCircleOutlined, PictureOutlined, SettingOutlined } from "@ant-design/icons";
import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { DentalMedia } from "../../../interfaces";
import { formatDate, usageTypeLabel } from "../../../utils/formatters";

type ColKey = "file_name" | "file_type" | "usage_type" | "description" | "created_at";

const COLUMN_DEFS: { key: ColKey; label: string; defaultVisible: boolean }[] = [
  { key: "file_name",   label: "שם קובץ", defaultVisible: true },
  { key: "file_type",   label: "סוג",     defaultVisible: true },
  { key: "usage_type",  label: "שימוש",   defaultVisible: true },
  { key: "description", label: "הסבר",    defaultVisible: true },
  { key: "created_at",  label: "תאריך",   defaultVisible: true },
];

export const DentalMediaList = () => {
  const navigate = useNavigate();
  const { tableProps } = useTable<DentalMedia>({
    resource: "dental_media",
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
    {
      key: "preview", title: "תצוגה מקדימה", dataIndex: "file_url", width: 100,
      render: (url: string, record: DentalMedia) =>
        record.file_type === "image" ? (
          <Image src={url} width={60} height={60} style={{ objectFit: "cover", borderRadius: 8 }} />
        ) : (
          <Tooltip title="סרטון">
            <div style={{ width: 60, height: 60, borderRadius: 8, background: "#2D4A5C", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <PlayCircleOutlined style={{ fontSize: 24, color: "#fff" }} />
            </div>
          </Tooltip>
        ),
    },
    vis("file_name") && { key: "file_name", title: "שם קובץ", dataIndex: "file_name" },
    vis("file_type") && {
      key: "file_type", title: "סוג", dataIndex: "file_type", width: 90,
      render: (type: string) =>
        type === "image"
          ? <Tag icon={<PictureOutlined />} color="blue">תמונה</Tag>
          : <Tag icon={<PlayCircleOutlined />} color="cyan">סרטון</Tag>,
    },
    vis("usage_type") && {
      key: "usage_type", title: "שימוש", dataIndex: "usage_type",
      render: (t: string) => usageTypeLabel(t),
    },
    vis("description") && { key: "description", title: "הסבר", dataIndex: "description" },
    vis("created_at") && {
      key: "created_at", title: "תאריך", dataIndex: "created_at", width: 140,
      render: (d: string) => formatDate(d),
    },
    {
      key: "actions", title: "פעולות", width: 100,
      render: (_: unknown, record: DentalMedia) => (
        <Space>
          <EditButton hideText size="small" recordItemId={record.id} />
          <DeleteButton hideText size="small" recordItemId={record.id} />
        </Space>
      ),
    },
  ].filter(Boolean), [visibleCols]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <List
      title="מדיה — מרפאת שיניים"
      createButtonProps={{ children: "העלה קובץ" }}
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
        onRow={(record: DentalMedia) => ({
          onClick: (e) => {
            const target = e.target as HTMLElement;
            if (target.closest("button") || target.closest(".ant-btn") || target.closest(".ant-image")) return;
            navigate(`/dental/media/edit/${record.id}`);
          },
          style: { cursor: "pointer" },
        })}
      />
    </List>
  );
};
