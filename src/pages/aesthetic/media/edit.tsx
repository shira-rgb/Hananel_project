import { Edit, useForm } from "@refinedev/antd";
import { useList } from "@refinedev/core";
import { Form, Input, Select } from "antd";
import { MediaUpload } from "../../../components/MediaUpload";
import type { AestheticProduct } from "../../../interfaces";

const { TextArea } = Input;

export const AestheticMediaEdit = () => {
  const { formProps, saveButtonProps, form, queryResult } = useForm({ resource: "aesthetic_media" });
  const record = queryResult?.data?.data;

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

  // AntD Select returns undefined when cleared. Refine update would skip undefined fields.
  // Force null on optional fields so DB clears them.
  const handleFinish = (values: Record<string, unknown>) => {
    const cleaned: Record<string, unknown> = { ...values };
    ["product_id", "usage_type", "description"].forEach((k) => {
      if (cleaned[k] === undefined) cleaned[k] = null;
    });
    return formProps.onFinish?.(cleaned);
  };

  return (
    <Edit title="עריכת מדיה — קליניקת אסתטיקה" saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical" onFinish={handleFinish}>
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
