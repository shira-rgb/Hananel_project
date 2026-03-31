import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, InputNumber } from "antd";

const { TextArea } = Input;

export const DentalDoctorEdit = () => {
  const { formProps, saveButtonProps } = useForm({ resource: "dental_doctor_profile" });

  return (
    <Edit title="עריכת סעיף — פרופיל רופא" saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item label="כותרת הסעיף" name="section_title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="תוכן" name="content" rules={[{ required: true }]}>
          <TextArea rows={8} />
        </Form.Item>
        <Form.Item label="סדר תצוגה" name="display_order">
          <InputNumber min={0} style={{ width: 120 }} />
        </Form.Item>
      </Form>
    </Edit>
  );
};
