import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, InputNumber, Switch, Space } from "antd";

const { TextArea } = Input;

export const AestheticProductEdit = () => {
  const { formProps, saveButtonProps } = useForm({ resource: "aesthetic_products" });

  return (
    <Edit title="עריכת מוצר — אסתטיקה" saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item label="מוצר" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="סוג טיפול" name="treatment_type">
          <Input placeholder="לדוגמה: שני איזורים, אזור אחד..." />
        </Form.Item>
        <Form.Item label="הסבר" name="description">
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item label="מחיר (₪)" name="price" rules={[{ required: true }]}>
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
        <Space size={32}>
          <Form.Item label="הצג במחירון" name="show_in_pricelist" valuePropName="checked">
            <Switch checkedChildren="כן" unCheckedChildren="לא" />
          </Form.Item>
          <Form.Item label="מוצר פעיל" name="is_active" valuePropName="checked">
            <Switch checkedChildren="פעיל" unCheckedChildren="לא פעיל" />
          </Form.Item>
        </Space>
      </Form>
    </Edit>
  );
};
