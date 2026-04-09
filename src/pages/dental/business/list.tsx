import { useList, useUpdate } from "@refinedev/core";
import { Form, Input, Button, Card, Spin, notification } from "antd";
import { useEffect } from "react";

const { TextArea } = Input;

export const DentalBusinessList = () => {
  const [form] = Form.useForm();

  const { data, isLoading } = useList({
    resource: "dental_business_info",
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
      { resource: "dental_business_info", id: record.id as string, values },
      { onSuccess: () => notification.success({ message: "נשמר בהצלחה" }) }
    );
  };

  if (isLoading) return <Spin style={{ margin: 40 }} />;

  return (
    <Card
      title="מידע על העסק — מרפאת שיניים"
      style={{ maxWidth: 720, margin: "0 auto" }}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item label="שם העסק" name="business_name">
          <Input placeholder="לדוגמה: מרפאת שיניים חנאנל" />
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
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isSaving} size="large">
            שמור
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};
