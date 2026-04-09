import { Create, useForm } from "@refinedev/antd";
import { Form, Input, InputNumber } from "antd";

const { TextArea } = Input;

export const DentalBusinessCreate = () => {
  const { formProps, saveButtonProps } = useForm({ resource: "dental_business_info" });

  return (
    <Create title="הוספת סעיף — מידע על העסק" saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical" initialValues={{ display_order: 0 }}>
        <Form.Item label="כותרת הסעיף" name="section_title" rules={[{ required: true, message: "חובה להכניס כותרת" }]}>
          <Input placeholder='לדוגמה: שעות פתיחה, כתובת, אודות המרפאה...' />
        </Form.Item>
        <Form.Item label="תוכן" name="content" rules={[{ required: true, message: "חובה להכניס תוכן" }]}>
          <TextArea rows={8} placeholder="הכנסי את המידע הרלוונטי כאן..." />
        </Form.Item>
        <Form.Item label="סדר תצוגה" name="display_order">
          <InputNumber min={0} style={{ width: 120 }} />
        </Form.Item>
      </Form>
    </Create>
  );
};
