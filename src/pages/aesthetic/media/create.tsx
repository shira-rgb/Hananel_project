import { Create, useForm } from "@refinedev/antd";
import { useList } from "@refinedev/core";
import { Form, Input, Select } from "antd";
import { MediaUpload } from "../../../components/MediaUpload";
import type { AestheticProduct } from "../../../interfaces";

const { TextArea } = Input;

export const AestheticMediaCreate = () => {
  const { formProps, saveButtonProps, form } = useForm({ resource: "aesthetic_media" });

  const { data: productsData } = useList<AestheticProduct>({
    resource: "aesthetic_products",
    filters: [{ field: "is_active", operator: "eq", value: true }],
    pagination: { pageSize: 200 },
    sorters: [{ field: "name", order: "asc" }],
  });

  const productOptions = (productsData?.data || []).map((p) => ({
    label: p.treatment_type ? `${p.name} — ${p.treatment_type}` : p.name,
    value: p.id,
  }));

  return (
    <Create title="הוספת מדיה — קליניקת אסתטיקה" saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="העלאת קובץ"
          name="file_url"
          rules={[{ required: true, message: "חובה להעלות קובץ" }]}
        >
          <MediaUpload
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
        <Form.Item
          label="טיפול / מוצר מקושר"
          name="product_id"
          tooltip="בחירת טיפול/מוצר מהקטלוג. הסוכן ישתמש במדיה זו כשידובר על אותו טיפול."
        >
          <Select
            options={productOptions}
            placeholder="בחרי טיפול/מוצר מהקטלוג..."
            allowClear
            showSearch
            optionFilterProp="label"
          />
        </Form.Item>
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
