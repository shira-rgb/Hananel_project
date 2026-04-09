import { useTable, List, DeleteButton, EditButton } from "@refinedev/antd";
import { Table, Tag, Space } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import type { Doctor } from "../../interfaces";

export const DoctorList = () => {
  const navigate = useNavigate();
  const { tableProps } = useTable<Doctor>({
    resource: "doctors",
    sorters: { initial: [{ field: "name", order: "asc" }] },
  });

  return (
    <List title="רופאים" createButtonProps={{ children: "הוסף רופא" }}>
      <Table
        {...tableProps}
        rowKey="id"
        scroll={{ x: "max-content" }}
        onRow={(record: Doctor) => ({
          onClick: (e) => {
            const target = e.target as HTMLElement;
            if (target.closest("button") || target.closest(".ant-btn")) return;
            navigate(`/doctors/edit/${record.id}`);
          },
          style: { cursor: "pointer" },
        })}
      >
        <Table.Column title="שם" dataIndex="name" width={140} />
        <Table.Column title="תחום" dataIndex="specialty" width={140} />
        <Table.Column title="מגדר" dataIndex="gender" width={80} />
        <Table.Column title="ניסיון" dataIndex="experience" width={120} />
        <Table.Column title="השכלה" dataIndex="education" width={160} />
        <Table.Column title="שפות" dataIndex="languages" width={130} />
        <Table.Column title="קליניקה / סניף" dataIndex="clinic_branch" width={130} />
        <Table.Column title="ימים ושעות" dataIndex="working_hours" width={160}
          render={(text: string) => (
            <div style={{ maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={text}>
              {text}
            </div>
          )}
        />
        <Table.Column
          title="מקבל מטופלים"
          dataIndex="accepting_new_patients"
          width={120}
          render={(v: boolean) =>
            v ? <Tag icon={<CheckOutlined />} color="success">כן</Tag>
              : <Tag icon={<CloseOutlined />} color="default">לא</Tag>
          }
        />
        <Table.Column
          title="פעולות"
          width={90}
          render={(_: unknown, record: Doctor) => (
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
