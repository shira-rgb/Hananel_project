import { useTable, List, DeleteButton, EditButton } from "@refinedev/antd";
import { Table, Space } from "antd";
import type { AestheticClient } from "../../../interfaces";
import { formatDate } from "../../../utils/formatters";

export const AestheticClientList = () => {
  const { tableProps } = useTable<AestheticClient>({
    resource: "aesthetic_clients",
    sorters: { initial: [{ field: "full_name", order: "asc" }] },
  });

  return (
    <List title="לקוחות — קליניקת אסתטיקה" createButtonProps={{ children: "הוסף לקוח" }}>
      <Table {...tableProps} rowKey="id">
        <Table.Column title="שם מלא" dataIndex="full_name" />
        <Table.Column title="טלפון" dataIndex="phone" render={(v: string) => v || "-"} />
        <Table.Column title="אימייל" dataIndex="email" render={(v: string) => v || "-"} />
        <Table.Column title="הערות" dataIndex="notes" ellipsis render={(v: string) => v || "-"} />
        <Table.Column
          title="נוסף"
          dataIndex="created_at"
          render={(d: string) => formatDate(d)}
          width={140}
        />
        <Table.Column
          title="פעולות"
          width={100}
          render={(_: unknown, record: AestheticClient) => (
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
