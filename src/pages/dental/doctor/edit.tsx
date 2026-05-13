import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, InputNumber } from "antd";
import { PageShell } from "../../../components/PageShell";

const { TextArea } = Input;

export const DentalDoctorEdit = () => {
  const { formProps, saveButtonProps } = useForm({ resource: "dental_doctor_profile" });

  return (
    <PageShell
      business="dental"
      title="עריכת סעיף בפרופיל הרופא"
      subtitle="עדכון סעיף בפרופיל הרופא."
    >
    <Edit title="" breadcrumb={false} saveButtonProps={saveButtonProps}>
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
    </PageShell>
  );
};
