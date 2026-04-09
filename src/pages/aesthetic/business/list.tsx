import { useList, useUpdate } from "@refinedev/core";
import { Form, Input, Button, Card, Spin, notification, Descriptions, Space } from "antd";
import { EditOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

const { TextArea } = Input;

export const AestheticBusinessList = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  const { data, isLoading } = useList({
    resource: "aesthetic_business_info",
    pagination: { pageSize: 1 },
  });

  const { mutate: update, isLoading: isSaving } = useUpdate();
  const record = data?.data?.[0];

  useEffect(() => {
    if (record) form.setFieldsValue(record);
  }, [record, form]);

  const onFinish = (values: Record<string, unknown>) => {
    if (!record?.id) return;
    update(
      { resource: "aesthetic_business_info", id: record.id as string, values },
      {
        onSuccess: () => {
          notification.success({ message: "נשמר בהצלחה" });
          setIsEditing(false);
        },
      }
    );
  };

  const onCancel = () => {
    if (record) form.setFieldsValue(record);
    setIsEditing(false);
  };

  if (isLoading) return <Spin style={{ margin: 40 }} />;

  return (
    <Card
      title="מידע על העסק — קליניקת אסתטיקה"
      style={{ maxWidth: 720, margin: "0 auto" }}
      extra={
        !isEditing ? (
          <Button icon={<EditOutlined />} onClick={() => setIsEditing(true)}>
            עריכה
          </Button>
        ) : (
          <Space>
            <Button onClick={onCancel} icon={<CloseOutlined />}>
              ביטול
            </Button>
            <Button
              type="primary"
              icon={<CheckOutlined />}
              loading={isSaving}
              onClick={() => form.submit()}
            >
              שמור
            </Button>
          </Space>
        )
      }
    >
      {!isEditing ? (
        <Descriptions column={1} bordered size="middle">
          <Descriptions.Item label="שם העסק">{record?.business_name || "—"}</Descriptions.Item>
          <Descriptions.Item label="אודות" style={{ whiteSpace: "pre-wrap" }}>{record?.about || "—"}</Descriptions.Item>
          <Descriptions.Item label="שעות פעילות" style={{ whiteSpace: "pre-wrap" }}>{record?.working_hours || "—"}</Descriptions.Item>
          <Descriptions.Item label="כתובת העסק">{record?.address || "—"}</Descriptions.Item>
          <Descriptions.Item label="לינק להגעה בוויז">{record?.waze_link || "—"}</Descriptions.Item>
          <Descriptions.Item label="מספר טלפון">{record?.phone || "—"}</Descriptions.Item>
          <Descriptions.Item label="הערות" style={{ whiteSpace: "pre-wrap" }}>{record?.notes || "—"}</Descriptions.Item>
        </Descriptions>
      ) : (
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item label="שם העסק" name="business_name">
            <Input placeholder="לדוגמה: קליניקת חנאנל" />
          </Form.Item>
          <Form.Item label="אודות" name="about">
            <TextArea rows={5} placeholder="תיאור העסק, ערכים, מה מייחד אתכם..." />
          </Form.Item>
          <Form.Item label="שעות פעילות" name="working_hours">
            <TextArea rows={3} placeholder="לדוגמה: ראשון–חמישי 09:00–19:00, שישי 09:00–14:00" />
          </Form.Item>
          <Form.Item label="כתובת העסק" name="address">
            <Input placeholder="לדוגמה: רחוב הרצל 12, תל אביב" />
          </Form.Item>
          <Form.Item label="לינק להגעה בוויז" name="waze_link">
            <Input placeholder="https://waze.com/ul/..." />
          </Form.Item>
          <Form.Item label="מספר טלפון" name="phone">
            <Input placeholder="לדוגמה: 052-1234567" />
          </Form.Item>
          <Form.Item label="הערות" name="notes">
            <TextArea rows={3} placeholder="כל מידע נוסף רלוונטי..." />
          </Form.Item>
        </Form>
      )}
    </Card>
  );
};
