import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Select } from "antd";
import { MediaUpload } from "../../../components/MediaUpload";

const { TextArea } = Input;

export const AestheticMediaEdit = () => {
  const { formProps, saveButtonProps, form, queryResult } = useForm({ resource: "aesthetic_media" });
  const record = queryResult?.data?.data;

  return (
    <Edit title="עריכת מדיה — קליניקת אסתטיקה" saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item label="קובץ" name="file_url" rules={[{ required: true, message: "חובה להעלות קובץ" }]}>
          <MediaUpload
            initialUrl={record?.file_url}
            initialFileName={record?.file_name}
            onUploadComplete={({ file_url, file_type, mime_type, file_size_bytes }) => {
              form.setFieldsValue({ file_url, file_type, mime_type, file_size_bytes });
            }}
          />
        </Form.Item>
        <Form.Item
          label="שם לקובץ"
          name="file_name"
          rules={[{ required: true, message: "חובה לתת שם לקובץ" }]}
        >
          <Input placeholder='לדוגמה: "לפני ואחרי בוטוקס - מרץ 2026"' />
        </Form.Item>
        <Form.Item name="file_type" hidden><Input /></Form.Item>
        <Form.Item name="mime_type" hidden><Input /></Form.Item>
        <Form.Item name="file_size_bytes" hidden><Input /></Form.Item>
        <Form.Item label="שימוש" name="usage_type">
          <Select
            options={[
              { label: "הסבר מוצר", value: "product_explanation" },
              { label: "דוגמת לקוח", value: "client_example" },
              { label: "אחר", value: "other" },
            ]}
          />
        </Form.Item>
        <Form.Item label="הסבר" name="description">
          <TextArea rows={3} />
        </Form.Item>
      </Form>
    </Edit>
  );
};
