import { Create, useForm } from "@refinedev/antd";
import { Form, Input, InputNumber } from "antd";
import { PageShell } from "../../../components/PageShell";

const { TextArea } = Input;

export const DentalDoctorCreate = () => {
  const { formProps, saveButtonProps } = useForm({ resource: "dental_doctor_profile" });

  return (
    <PageShell
      business="dental"
      title="הוספת סעיף לפרופיל הרופא"
      subtitle="הוספת סעיף חדש לפרופיל הרופא — הסבר, חוות דעת, לוחות זמנים, עלויות."
    >
    <Create title="" breadcrumb={false} saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical" initialValues={{ display_order: 0 }}>
        <Form.Item label="כותרת הסעיף" name="section_title" rules={[{ required: true, message: "חובה להכניס כותרת" }]}>
          <Input placeholder='לדוגמה: "הסבר על הרופאה", "עלות הייעוץ", "לוח זמנים"...' />
        </Form.Item>
        <Form.Item label="תוכן" name="content" rules={[{ required: true, message: "חובה להכניס תוכן" }]}>
          <TextArea
            rows={8}
            placeholder="כתבי כאן את כל המידע הרלוונטי — הסבר על הרופאה, חוות דעת, לוח זמנים, עלויות וכו'..."
          />
        </Form.Item>
        <Form.Item label="סדר תצוגה" name="display_order">
          <InputNumber min={0} style={{ width: 120 }} />
        </Form.Item>
      </Form>
    </Create>
    </PageShell>
  );
};
