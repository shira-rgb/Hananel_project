import { useTable, List, DeleteButton, EditButton } from "@refinedev/antd";
import { Table, Tag, Space, Button, Tooltip } from "antd";
import { CheckOutlined, CloseOutlined, UnorderedListOutlined } from "@ant-design/icons";
import type { AestheticProduct } from "../../../interfaces";
import { formatDate, formatPrice } from "../../../utils/formatters";

export const AestheticProductList = () => {
  const { tableProps } = useTable<AestheticProduct>({
    resource: "aesthetic_products",
    sorters: { initial: [{ field: "name", order: "asc" }] },
  });

  const pricelistItems = (tableProps.dataSource ?? []).filter(
    (p: AestheticProduct) => p.show_in_pricelist && p.is_active
  );

  const copyPricelist = () => {
    const text = pricelistItems
      .map((p: AestheticProduct) => `${p.name} — ${formatPrice(p.price)}`)
      .join("\n");
    navigator.clipboard.writeText(text);
  };

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
        </>
      )}
    >
      <Table {...tableProps} rowKey="id">
        <Table.Column title="שם מוצר" dataIndex="name" />
        <Table.Column title="הסבר" dataIndex="description" ellipsis />
        <Table.Column
          title="מחיר"
          dataIndex="price"
          render={(p: number) => formatPrice(p)}
          width={120}
        />
        <Table.Column
          title="במחירון"
          dataIndex="show_in_pricelist"
          width={90}
          render={(v: boolean) =>
            v ? <Tag icon={<CheckOutlined />} color="success">כן</Tag>
              : <Tag icon={<CloseOutlined />} color="default">לא</Tag>
          }
        />
        <Table.Column
          title="פעיל"
          dataIndex="is_active"
          width={80}
          render={(v: boolean) =>
            v ? <Tag color="green">פעיל</Tag> : <Tag color="red">לא פעיל</Tag>
          }
        />
        <Table.Column
          title="עודכן"
          dataIndex="updated_at"
          render={(d: string) => formatDate(d)}
          width={140}
        />
        <Table.Column
          title="פעולות"
          width={100}
          render={(_: unknown, record: AestheticProduct) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
