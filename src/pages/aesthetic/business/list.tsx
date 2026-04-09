import { useTable, List, DeleteButton, EditButton } from "@refinedev/antd";
import { Table, Space } from "antd";
import { useNavigate } from "react-router-dom";
import type { AestheticBusinessInfo } from "../../../interfaces";

export const AestheticBusinessList = () => {
  const navigate = useNavigate();
  const { tableProps } = useTable<AestheticBusinessInfo>({
    resource: "aesthetic_business_info",
    sorters: { initial: [{ field: "display_order", order: "asc" }] },
  });

  return (
    <List title="מידע על העסק — קליניקת אסתטיקה" createButtonProps={{ children: "הוסף סעיף" }}>
      <Table
        {...tableProps}
        rowKey="id"
        onRow={(record: AestheticBusinessInfo) => ({
          onClick: (e) => {
            const target = e.target as HTMLElement;
            if (target.closest("button") || target.closest(".ant-btn")) return;
            navigate(`/aesthetic/business/edit/${record.id}`);
          },
          style: { cursor: "pointer" },
        })}
      >
        <Table.Column title="סדר" dataIndex="display_order" width={70} />
        <Table.Column title="כותרת" dataIndex="section_title" />
        <Table.Column
          title="תוכן"
          dataIndex="content"
          render={(text: string) => (
            <div style={{ maxWidth: 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={text}>
              {text}
            </div>
          )}
        />
        <Table.Column
          title="פעולות"
          width={100}
          render={(_: unknown, record: AestheticBusinessInfo) => (
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
