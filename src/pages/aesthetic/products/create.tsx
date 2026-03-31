import { Create, useForm } from "@refinedev/antd";
import { Form, Input, InputNumber, Switch, Space } from "antd";

const { TextArea } = Input;

export const AestheticProductCreate = () => {
  const { formProps, saveButtonProps } = useForm({ resource: "aesthetic_products" });

  return (
    <Create title="הוספת מוצר — אסתטיקה" saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical" initialValues={{ show_in_pricelist: true, is_active: true }}>
        <Form.Item label="שם מוצר" name="name" rules={[{ required: true, message: "חובה להכניס שם" }]}>
          <Input placeholder="לדוגמה: בוטוקס, פילר, מזותרפיה..." />
        </Form.Item>
        <Form.Item label="הסבר" name="description">
          <TextArea rows={4} placeholder="הסבר על המוצר לשימוש הבוט..." />
        </Form.Item>
        <Form.Item label="מחיר (₪)" name="price" rules={[{ required: true, message: "חובה להכניס מחיר" }]}>
          <InputNumber min={0} style={{ width: "100%" }} placeholder="0" />
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
    </Create>
  );
};
