import { Create, useForm } from "@refinedev/antd";
import { Form, Input, InputNumber, Switch, Space } from "antd";

const { TextArea } = Input;

export const DentalProductCreate = () => {
  const { formProps, saveButtonProps } = useForm({ resource: "dental_products" });

  return (
    <Create title="הוספת מוצר/טיפול — מרפאת שיניים" saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical" initialValues={{ show_in_pricelist: true, is_active: true }}>
        <Form.Item label="מוצר" name="name" rules={[{ required: true }]}>
          <Input placeholder="לדוגמה: ציפוי שיניים, השתלה, ייעוץ פה ולסת..." />
        </Form.Item>
        <Form.Item label="סוג טיפול" name="treatment_type">
          <Input placeholder="לדוגמה: ציפוי קרמי, השתלה בסיסית..." />
        </Form.Item>
        <Form.Item label="הסבר" name="description">
          <TextArea rows={4} placeholder="הסבר על הטיפול לשימוש הבוט..." />
        </Form.Item>
        <Form.Item label="מחיר (₪)" name="price" rules={[{ required: true }]}>
          <InputNumber min={0} style={{ width: "100%" }} placeholder="0" />
        </Form.Item>
        <Space size={32}>
          <Form.Item label="הצג במחירון" name="show_in_pricelist" valuePropName="checked">
            <Switch checkedChildren="כן" unCheckedChildren="לא" />
          </Form.Item>
          <Form.Item label="פעיל" name="is_active" valuePropName="checked">
            <Switch checkedChildren="פעיל" unCheckedChildren="לא פעיל" />
          </Form.Item>
        </Space>
      </Form>
    </Create>
  );
};
