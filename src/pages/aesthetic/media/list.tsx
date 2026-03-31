import { useTable, List, DeleteButton, EditButton } from "@refinedev/antd";
import { Table, Tag, Space, Image, Tooltip } from "antd";
import { PlayCircleOutlined, PictureOutlined } from "@ant-design/icons";
import type { AestheticMedia } from "../../../interfaces";
import { formatDate, usageTypeLabel } from "../../../utils/formatters";

export const AestheticMediaList = () => {
  const { tableProps } = useTable<AestheticMedia>({
    resource: "aesthetic_media",
    sorters: { initial: [{ field: "created_at", order: "desc" }] },
  });

  return (
    <List title="מדיה — קליניקת אסתטיקה" createButtonProps={{ children: "העלה קובץ" }}>
      <Table {...tableProps} rowKey="id" scroll={{ x: 600 }}>
        <Table.Column
          title="תצוגה מקדימה"
          dataIndex="file_url"
          width={100}
          render={(url: string, record: AestheticMedia) =>
            record.file_type === "image" ? (
              <Image src={url} width={60} height={60} style={{ objectFit: "cover", borderRadius: 8 }} />
            ) : (
              <Tooltip title="סרטון">
                <div style={{ width: 60, height: 60, borderRadius: 8, background: "#2D2438", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <PlayCircleOutlined style={{ fontSize: 24, color: "#fff" }} />
                </div>
              </Tooltip>
            )
          }
        />
        <Table.Column title="שם קובץ" dataIndex="file_name" ellipsis />
        <Table.Column
          title="סוג"
          dataIndex="file_type"
          width={90}
          render={(type: string) =>
            type === "image"
              ? <Tag icon={<PictureOutlined />} color="purple">תמונה</Tag>
              : <Tag icon={<PlayCircleOutlined />} color="blue">סרטון</Tag>
          }
        />
        <Table.Column title="שימוש" dataIndex="usage_type" render={(t: string) => usageTypeLabel(t)} />
        <Table.Column title="הסבר" dataIndex="description" ellipsis />
        <Table.Column title="תאריך" dataIndex="created_at" render={(d: string) => formatDate(d)} width={140} />
        <Table.Column
          title="פעולות"
          fixed="left"
          width={100}
          render={(_: unknown, record: AestheticMedia) => (
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
