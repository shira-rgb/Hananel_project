import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Select, DatePicker } from "antd";
import dayjs from "dayjs";

const { TextArea } = Input;

export const DentalInquiryCreate = () => {
  const { formProps, saveButtonProps } = useForm({
    resource: "dental_inquiries",
  });

  return (
    <Create title="רישום פנייה חדשה — מרפאת שיניים" saveButtonProps={saveButtonProps}>
      <Form
        {...formProps}
        layout="vertical"
        initialValues={{
          inquiry_date: dayjs(),
          status: "inquired",
        }}
        onFinish={(values: any) => {
          const payload = {
            ...values,
            inquiry_date: values.inquiry_date
              ? dayjs(values.inquiry_date).format("YYYY-MM-DD")
              : undefined,
          };
          return formProps.onFinish?.(payload);
        }}
      >
        <Form.Item label="תאריך פנייה" name="inquiry_date" rules={[{ required: true }]}>
          <DatePicker format="DD/MM/YYYY" style={{ width: 220 }} />
        </Form.Item>
        <Form.Item label="שם לקוח/ה" name="full_name">
          <Input placeholder="אופציונלי" />
        </Form.Item>
        <Form.Item label="טלפון" name="phone">
          <Input placeholder="05X-XXXXXXX" />
        </Form.Item>
        <Form.Item label="מאיפה הגיע/ה? (מקור)" name="source" tooltip="טקסט חופשי — פייסבוק, אינסטגרם, המלצה, גוגל...">
          <Input placeholder="למשל: פייסבוק, המלצה של חברה..." />
        </Form.Item>
        <Form.Item label="סטטוס" name="status" rules={[{ required: true }]}>
          <Select
            options={[
              { label: "פנו", value: "inquired" },
              { label: "קבעו פגישה", value: "scheduled" },
              { label: "ממתינים לשיחה חוזרת", value: "callback_requested" },
            ]}
          />
        </Form.Item>
        <Form.Item label="הערות" name="notes">
          <TextArea rows={3} />
        </Form.Item>
      </Form>
    </Create>
  );
};
