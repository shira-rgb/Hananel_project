import { useTable, List, DeleteButton, EditButton } from "@refinedev/antd";
import { Table, Tag, Space, Button, Tooltip, Popover, Checkbox } from "antd";
import { CheckOutlined, CloseOutlined, UnorderedListOutlined, SettingOutlined } from "@ant-design/icons";
import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { AestheticProduct } from "../../../interfaces";
import { formatDate, formatPrice } from "../../../utils/formatters";

type ColKey =
  | "treatment_type" | "body_area" | "product_description" | "indications"
  | "price" | "treatment_duration" | "results_timeline" | "effect_duration"
  | "recovery_time" | "show_in_pricelist" | "is_active" | "updated_at" | "description";

const COLUMN_DEFS: { key: ColKey; label: string; defaultVisible: boolean }[] = [
  { key: "treatment_type",       label: "סוג טיפול",           defaultVisible: true  },
  { key: "body_area",            label: "אזור בגוף",            defaultVisible: true  },
  { key: "product_description",  label: "הסבר על המוצר",        defaultVisible: true  },
  { key: "indications",          label: "מתי פונים לטיפול",     defaultVisible: false },
  { key: "price",                label: "מחיר",                 defaultVisible: true  },
  { key: "treatment_duration",   label: "זמן טיפול",            defaultVisible: false },
  { key: "results_timeline",     label: "זמן לתוצאות",          defaultVisible: false },
  { key: "effect_duration",      label: "משך השפעה",            defaultVisible: false },
  { key: "recovery_time",        label: "זמן החלמה",            defaultVisible: false },
  { key: "show_in_pricelist",    label: "במחירון",              defaultVisible: true  },
  { key: "is_active",            label: "פעיל",                 defaultVisible: true  },
  { key: "updated_at",           label: "עודכן",                defaultVisible: true  },
  { key: "description",          label: "הסבר (כללי)",          defaultVisible: false },
];

const Truncated = ({ text, maxWidth = 200 }: { text?: string; maxWidth?: number }) =>
  text ? (
    <div style={{ maxWidth, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={text}>
      {text}
    </div>
  ) : null;

export const AestheticProductList = () => {
  const navigate = useNavigate();

  const { tableProps } = useTable<AestheticProduct>({
    resource: "aesthetic_products",
    sorters: { initial: [{ field: "name", order: "asc" }] },
  });

  const [visibleCols, setVisibleCols] = useState<Set<ColKey>>(
    new Set(COLUMN_DEFS.filter((c) => c.defaultVisible).map((c) => c.key))
  );

  const toggleCol = useCallback((key: ColKey, checked: boolean) => {
    setVisibleCols((prev) => {
      const next = new Set(prev);
      checked ? next.add(key) : next.delete(key);
      return next;
    });
  }, []);

  const vis = (key: ColKey) => visibleCols.has(key);

  const pricelistItems = (tableProps.dataSource ?? []).filter(
    (p: AestheticProduct) => p.show_in_pricelist && p.is_active
  );

  const copyPricelist = () => {
    const text = pricelistItems
      .map((p: AestheticProduct) => `${p.name} — ${formatPrice(p.price)}`)
      .join("\n");
    navigator.clipboard.writeText(text);
  };

  const colVisibilityContent = (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 180 }}>
      {COLUMN_DEFS.map((col) => (
        <Checkbox
          key={col.key}
          checked={visibleCols.has(col.key)}
          onChange={(e) => toggleCol(col.key, e.target.checked)}
        >
          {col.label}
        </Checkbox>
      ))}
    </div>
  );

  const columns = useMemo(() => [
    { key: "name", title: "מוצר", dataIndex: "name", width: 110 },
    vis("treatment_type") && { key: "treatment_type", title: "סוג טיפול", dataIndex: "treatment_type", width: 150 },
    vis("body_area") && { key: "body_area", title: "אזור בגוף", dataIndex: "body_area", width: 130 },
    vis("product_description") && {
      key: "product_description", title: "הסבר על המוצר", dataIndex: "product_description", width: 220,
      render: (text: string) => <Truncated text={text} maxWidth={220} />,
    },
    vis("indications") && {
      key: "indications", title: "מתי פונים לטיפול", dataIndex: "indications", width: 200,
      render: (text: string) => <Truncated text={text} maxWidth={200} />,
    },
    vis("price") && {
      key: "price", title: "מחיר", dataIndex: "price", width: 120,
      render: (p: number) => formatPrice(p),
    },
    vis("treatment_duration") && { key: "treatment_duration", title: "זמן טיפול", dataIndex: "treatment_duration", width: 120 },
    vis("results_timeline") && { key: "results_timeline", title: "זמן לתוצאות", dataIndex: "results_timeline", width: 140 },
    vis("effect_duration") && { key: "effect_duration", title: "משך השפעה", dataIndex: "effect_duration", width: 120 },
    vis("recovery_time") && { key: "recovery_time", title: "זמן החלמה", dataIndex: "recovery_time", width: 120 },
    vis("show_in_pricelist") && {
      key: "show_in_pricelist", title: "במחירון", dataIndex: "show_in_pricelist", width: 90,
      render: (v: boolean) =>
        v ? <Tag icon={<CheckOutlined />} color="success">כן</Tag>
          : <Tag icon={<CloseOutlined />} color="default">לא</Tag>,
    },
    vis("is_active") && {
      key: "is_active", title: "פעיל", dataIndex: "is_active", width: 80,
      render: (v: boolean) => v ? <Tag color="green">פעיל</Tag> : <Tag color="red">לא פעיל</Tag>,
    },
    vis("updated_at") && {
      key: "updated_at", title: "עודכן", dataIndex: "updated_at", width: 140,
      render: (d: string) => formatDate(d),
    },
    vis("description") && {
      key: "description", title: "הסבר (כללי)", dataIndex: "description", width: 260,
      render: (text: string) => <Truncated text={text} maxWidth={260} />,
    },
    {
      key: "actions", title: "פעולות", width: 80,
      render: (_: unknown, record: AestheticProduct) => (
        <Space>
          <EditButton hideText size="small" recordItemId={record.id} />
          <DeleteButton hideText size="small" recordItemId={record.id} />
        </Space>
      ),
    },
  ].filter(Boolean), [visibleCols]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <List
      title="מוצרים ומחירון — קליניקת אסתטיקה"
      createButtonProps={{ children: "הוסף מוצר" }}
      headerButtons={({ defaultButtons }) => (
        <>
          {defaultButtons}
          <Tooltip title="העתק מחירון (מוצרים שמסומנים)">
            <Button icon={<UnorderedListOutlined />} onClick={copyPricelist}>
              העתק מחירון
            </Button>
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
        onRow={(record: AestheticProduct) => ({
          onClick: (e) => {
            const target = e.target as HTMLElement;
            if (target.closest("button") || target.closest(".ant-btn")) return;
            navigate(`/aesthetic/products/edit/${record.id}`);
          },
          style: { cursor: "pointer" },
        })}
      />
    </List>
  );
};
