import { Edit, useForm } from "@refinedev/antd";
import { Form, Input } from "antd";

const { TextArea } = Input;

export const AestheticClientEdit = () => {
  const { formProps, saveButtonProps } = useForm({ resource: "aesthetic_clients" });

  return (
    <Edit title="עריכת לקוח — אסתטיקה" saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item label="שם מלא" name="full_name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="טלפון" name="phone">
          <Input />
        </Form.Item>
        <Form.Item label="אימייל" name="email">
          <Input />
        </Form.Item>
        <Form.Item label="הערות" name="notes">
          <TextArea rows={4} />
        </Form.Item>
      </Form>
    </Edit>
  );
};
