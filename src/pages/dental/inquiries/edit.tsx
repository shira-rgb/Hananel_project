import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Select, DatePicker } from "antd";
import dayjs from "dayjs";

const { TextArea } = Input;

export const DentalInquiryEdit = () => {
  const { formProps, saveButtonProps, queryResult } = useForm({
    resource: "dental_inquiries",
  });

  const record: any = queryResult?.data?.data;

  return (
    <Edit title="עריכת פנייה — מרפאת שיניים" saveButtonProps={saveButtonProps}>
      <Form
        {...formProps}
        layout="vertical"
        initialValues={
          record
            ? {
                ...record,
                inquiry_date: record.inquiry_date ? dayjs(record.inquiry_date) : undefined,
              }
            : undefined
        }
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
          <Input />
        </Form.Item>
        <Form.Item label="טלפון" name="phone">
          <Input />
        </Form.Item>
        <Form.Item label="מאיפה הגיע/ה? (מקור)" name="source">
          <Input />
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
    </Edit>
  );
};
