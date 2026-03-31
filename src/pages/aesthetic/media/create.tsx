import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Select } from "antd";
import { MediaUpload } from "../../../components/MediaUpload";

const { TextArea } = Input;

export const AestheticMediaCreate = () => {
  const { formProps, saveButtonProps, form } = useForm({ resource: "aesthetic_media" });

  return (
    <Create title="הוספת מדיה — קליניקת אסתטיקה" saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="העלאת קובץ"
          name="file_url"
          rules={[{ required: true, message: "חובה להעלות קובץ" }]}
        >
          <MediaUpload
            onUploadComplete={({ file_url, file_name, file_type, mime_type, file_size_bytes }) => {
              form.setFieldsValue({ file_url, file_name, file_type, mime_type, file_size_bytes });
            }}
          />
        </Form.Item>
        <Form.Item name="file_name" hidden><Input /></Form.Item>
        <Form.Item name="file_type" hidden><Input /></Form.Item>
        <Form.Item name="mime_type" hidden><Input /></Form.Item>
        <Form.Item name="file_size_bytes" hidden><Input /></Form.Item>
        <Form.Item label="שימוש" name="usage_type">
          <Select
            placeholder="למה משמש הקובץ?"
            options={[
              { label: "הסבר מוצר", value: "product_explanation" },
              { label: "דוגמת לקוח", value: "client_example" },
              { label: "אחר", value: "other" },
            ]}
          />
        </Form.Item>
        <Form.Item label="הסבר" name="description">
          <TextArea rows={3} placeholder="הסבר קצר על הקובץ הזה..." />
        </Form.Item>
      </Form>
    </Create>
  );
};
