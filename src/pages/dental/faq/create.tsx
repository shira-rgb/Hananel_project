import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Switch } from "antd";

const { TextArea } = Input;

export const DentalFAQCreate = () => {
  const { formProps, saveButtonProps } = useForm({ resource: "dental_faq" });

  return (
    <Create title="הוספת שאלה — מרפאת שיניים" saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical" initialValues={{ is_active: true }}>
        <Form.Item label="קטגוריה" name="category">
          <Input placeholder='לדוגמה: שתלים, יישור שיניים, כתרים...' />
        </Form.Item>
        <Form.Item label="שאלה" name="question" rules={[{ required: true, message: "חובה להכניס שאלה" }]}>
          <Input placeholder="מה השאלה הנפוצה?" />
        </Form.Item>
        <Form.Item label="תשובה" name="answer" rules={[{ required: true, message: "חובה להכניס תשובה" }]}>
          <TextArea rows={6} placeholder="הכנסי את התשובה המלאה כאן..." />
        </Form.Item>
        <Form.Item label="פעיל" name="is_active" valuePropName="checked">
          <Switch checkedChildren="פעיל" unCheckedChildren="לא פעיל" />
        </Form.Item>
      </Form>
    </Create>
  );
};
