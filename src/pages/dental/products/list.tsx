import { useTable, List, DeleteButton, EditButton } from "@refinedev/antd";
import { Table, Tag, Space, Button, Tooltip, Popover, Checkbox } from "antd";
import { CheckOutlined, CloseOutlined, UnorderedListOutlined, SettingOutlined } from "@ant-design/icons";
import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { DentalProduct } from "../../../interfaces";
import { formatDate, formatPrice } from "../../../utils/formatters";

type ColKey = "treatment_type" | "description" | "price" | "show_in_pricelist" | "is_active" | "updated_at";

const COLUMN_DEFS: { key: ColKey; label: string; defaultVisible: boolean }[] = [
  { key: "treatment_type",   label: "סוג טיפול", defaultVisible: true },
  { key: "description",      label: "הסבר",      defaultVisible: true },
  { key: "price",            label: "מחיר",      defaultVisible: true },
  { key: "show_in_pricelist",label: "במחירון",   defaultVisible: true },
  { key: "is_active",        label: "פעיל",      defaultVisible: true },
  { key: "updated_at",       label: "עודכן",     defaultVisible: true },
];

export const DentalProductList = () => {
  const navigate = useNavigate();
  const { tableProps } = useTable<DentalProduct>({
    resource: "dental_products",
    sorters: { initial: [{ field: "name", order: "asc" }] },
  });

  const [visibleCols, setVisibleCols] = useState<Set<ColKey>>(
    new Set(COLUMN_DEFS.filter((c) => c.defaultVisible).map((c) => c.key))
  );
  const toggleCol = useCallback((key: ColKey, checked: boolean) => {
    setVisibleCols((prev) => { const n = new Set(prev); checked ? n.add(key) : n.delete(key); return n; });
  }, []);
  const vis = (key: ColKey) => visibleCols.has(key);

  const pricelistItems = (tableProps.dataSource ?? []).filter(
    (p: DentalProduct) => p.show_in_pricelist && p.is_active
  );
  const copyPricelist = () => {
    const text = pricelistItems.map((p: DentalProduct) => `${p.name} — ${formatPrice(p.price)}`).join("\n");
    navigator.clipboard.writeText(text);
  };

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
    { key: "name", title: "מוצר", dataIndex: "name", width: 110 },
    vis("treatment_type") && { key: "treatment_type", title: "סוג טיפול", dataIndex: "treatment_type", width: 150 },
    vis("description") && {
      key: "description", title: "הסבר", dataIndex: "description", width: 260,
      render: (text: string) => text ? (
        <div style={{ maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={text}>{text}</div>
      ) : null,
    },
    vis("price") && {
      key: "price", title: "מחיר", dataIndex: "price", width: 120,
      render: (p: number) => formatPrice(p),
    },
    vis("show_in_pricelist") && {
      key: "show_in_pricelist", title: "במחירון", dataIndex: "show_in_pricelist", width: 90,
      render: (v: boolean) => v ? <Tag icon={<CheckOutlined />} color="success">כן</Tag> : <Tag icon={<CloseOutlined />} color="default">לא</Tag>,
    },
    vis("is_active") && {
      key: "is_active", title: "פעיל", dataIndex: "is_active", width: 80,
      render: (v: boolean) => v ? <Tag color="green">פעיל</Tag> : <Tag color="red">לא פעיל</Tag>,
    },
    vis("updated_at") && {
      key: "updated_at", title: "עודכן", dataIndex: "updated_at", width: 140,
      render: (d: string) => formatDate(d),
    },
    {
      key: "actions", title: "פעולות", width: 100,
      render: (_: unknown, record: DentalProduct) => (
        <Space>
          <EditButton hideText size="small" recordItemId={record.id} />
          <DeleteButton hideText size="small" recordItemId={record.id} />
        </Space>
      ),
    },
  ].filter(Boolean), [visibleCols]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <List
      title="מוצרים ומחירון — מרפאת שיניים"
      createButtonProps={{ children: "הוסף מוצר" }}
      headerButtons={({ defaultButtons }) => (
        <>
          {defaultButtons}
          <Tooltip title="העתק מחירון (מוצרים שמסומנים)">
            <Button icon={<UnorderedListOutlined />} onClick={copyPricelist}>העתק מחירון</Button>
          </Tooltip>
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
        onRow={(record: DentalProduct) => ({
          onClick: (e) => {
            const target = e.target as HTMLElement;
            if (target.closest("button") || target.closest(".ant-btn")) return;
            navigate(`/dental/products/edit/${record.id}`);
          },
          style: { cursor: "pointer" },
        })}
      />
    </List>
  );
};
