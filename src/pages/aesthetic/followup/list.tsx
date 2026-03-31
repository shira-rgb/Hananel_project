import { useTable, List, DeleteButton, EditButton } from "@refinedev/antd";
import { Table, Tag, Space } from "antd";
import type { AestheticFollowupMessage } from "../../../interfaces";
import { delayUnitLabel } from "../../../utils/formatters";

export const AestheticFollowupList = () => {
  const { tableProps } = useTable<AestheticFollowupMessage>({
    resource: "aesthetic_followup_messages",
    meta: { select: "*, aesthetic_products(name)" },
    sorters: { initial: [{ field: "created_at", order: "desc" }] },
  });

  return (
    <List title="הודעות פולואפ — קליניקת אסתטיקה" createButtonProps={{ children: "הוסף הודעה" }}>
      <Table {...tableProps} rowKey="id">
        <Table.Column
          title="מוצר"
          dataIndex={["aesthetic_products", "name"]}
          render={(name: string) => name ? <Tag color="purple">{name}</Tag> : <Tag>כללי</Tag>}
        />
        <Table.Column
          title="תוכן ההודעה"
          dataIndex="message_text"
          ellipsis
          render={(text: string) => (
            <div style={{ maxWidth: 320, whiteSpace: "pre-line", direction: "rtl" }}>{text}</div>
          )}
        />
        <Table.Column
          title="שליחה"
          render={(_: unknown, record: AestheticFollowupMessage) => (
            <Tag color="blue">
              {record.delay_value} {delayUnitLabel(record.delay_unit)} אחרי טיפול
            </Tag>
          )}
          width={180}
        />
        <Table.Column
          title="פעיל"
          dataIndex="is_active"
          width={80}
          render={(v: boolean) => v ? <Tag color="green">פעיל</Tag> : <Tag color="red">כבוי</Tag>}
        />
        <Table.Column
          title="פעולות"
          width={100}
          render={(_: unknown, record: AestheticFollowupMessage) => (
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
