import { useTable, List, DeleteButton, EditButton } from "@refinedev/antd";
import { Table, Space } from "antd";
import type { DentalDoctorProfile } from "../../../interfaces";

export const DentalDoctorList = () => {
  const { tableProps } = useTable<DentalDoctorProfile>({
    resource: "dental_doctor_profile",
    sorters: { initial: [{ field: "display_order", order: "asc" }] },
  });

  return (
    <List title="פרופיל רופא / ייעוץ פה ולסת" createButtonProps={{ children: "הוסף סעיף" }}>
      <Table {...tableProps} rowKey="id">
        <Table.Column title="סדר" dataIndex="display_order" width={70} />
        <Table.Column title="כותרת" dataIndex="section_title" />
        <Table.Column
          title="תוכן"
          dataIndex="content"
          ellipsis
          render={(text: string) => (
            <div style={{ maxWidth: 400, whiteSpace: "pre-line", direction: "rtl" }}>{text}</div>
          )}
        />
        <Table.Column
          title="פעולות"
          width={100}
          render={(_: unknown, record: DentalDoctorProfile) => (
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
