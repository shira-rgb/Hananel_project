import { Create, useForm } from "@refinedev/antd";
import { Form, Input, InputNumber } from "antd";
import { PageShell } from "../../../components/PageShell";

const { TextArea } = Input;

export const AestheticBusinessCreate = () => {
  const { formProps, saveButtonProps } = useForm({ resource: "aesthetic_business_info" });

  return (
    <PageShell
      business="aesthetic"
      title="הוספת סעיף מידע"
      subtitle="הוספת סעיף חדש למידע על העסק שיהיה זמין לסוכן."
    >
    <Create title="" breadcrumb={false} saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical" initialValues={{ display_order: 0 }}>
        <Form.Item label="כותרת הסעיף" name="section_title" rules={[{ required: true, message: "חובה להכניס כותרת" }]}>
          <Input placeholder='לדוגמה: שעות פתיחה, כתובת, אודות הקליניקה...' />
        </Form.Item>
        <Form.Item label="תוכן" name="content" rules={[{ required: true, message: "חובה להכניס תוכן" }]}>
          <TextArea rows={8} placeholder="הכנסי את המידע הרלוונטי כאן..." />
        </Form.Item>
        <Form.Item label="סדר תצוגה" name="display_order">
          <InputNumber min={0} style={{ width: 120 }} />
        </Form.Item>
      </Form>
    </Create>
    </PageShell>
  );
};
