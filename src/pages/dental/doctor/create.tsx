import { Create, useForm } from "@refinedev/antd";
import { Form, Input, InputNumber } from "antd";

const { TextArea } = Input;

export const DentalDoctorCreate = () => {
  const { formProps, saveButtonProps } = useForm({ resource: "dental_doctor_profile" });

  return (
    <Create title="הוספת סעיף — פרופיל רופא" saveButtonProps={saveButtonProps}>
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
  );
};
