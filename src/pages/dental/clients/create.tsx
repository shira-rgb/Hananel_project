import { Create, useForm } from "@refinedev/antd";
import { Form, Input } from "antd";

const { TextArea } = Input;

export const DentalClientCreate = () => {
  const { formProps, saveButtonProps } = useForm({ resource: "dental_clients" });

  return (
    <Create title="הוספת לקוח — מרפאת שיניים" saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item label="שם מלא" name="full_name" rules={[{ required: true, message: "חובה להכניס שם" }]}>
          <Input placeholder="שם פרטי + משפחה" />
        </Form.Item>
        <Form.Item label="טלפון" name="phone">
          <Input placeholder="05X-XXXXXXX" />
        </Form.Item>
        <Form.Item label="אימייל" name="email">
          <Input placeholder="example@email.com" />
        </Form.Item>
        <Form.Item label="הערות" name="notes">
          <TextArea rows={4} placeholder="מידע נוסף על הלקוח..." />
        </Form.Item>
      </Form>
    </Create>
  );
};
