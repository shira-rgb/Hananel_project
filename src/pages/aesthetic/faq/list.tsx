import { useTable, List, DeleteButton, EditButton } from "@refinedev/antd";
import { Table, Tag, Space } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import type { AestheticFAQ } from "../../../interfaces";

export const AestheticFAQList = () => {
  const navigate = useNavigate();
  const { tableProps } = useTable<AestheticFAQ>({
    resource: "aesthetic_faq",
    sorters: { initial: [{ field: "category", order: "asc" }] },
  });

  return (
    <List title="שאלות ותשובות — קליניקת אסתטיקה" createButtonProps={{ children: "הוסף שאלה" }}>
      <Table
        {...tableProps}
        rowKey="id"
        onRow={(record: AestheticFAQ) => ({
          onClick: (e) => {
            const target = e.target as HTMLElement;
            if (target.closest("button") || target.closest(".ant-btn")) return;
            navigate(`/aesthetic/faq/edit/${record.id}`);
          },
          style: { cursor: "pointer" },
        })}
      >
        <Table.Column title="קטגוריה" dataIndex="category" width={150} />
        <Table.Column title="שאלה" dataIndex="question" />
        <Table.Column
          title="תשובה"
          dataIndex="answer"
          render={(text: string) => (
            <div style={{ maxWidth: 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={text}>
              {text}
            </div>
          )}
        />
        <Table.Column
          title="פעיל"
          dataIndex="is_active"
          width={80}
          render={(v: boolean) =>
            v ? <Tag icon={<CheckOutlined />} color="success">כן</Tag>
              : <Tag icon={<CloseOutlined />} color="default">לא</Tag>
          }
        />
        <Table.Column
          title="פעולות"
          width={100}
          render={(_: unknown, record: AestheticFAQ) => (
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
