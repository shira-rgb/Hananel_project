import { Edit, useForm } from "@refinedev/antd";
import { useDelete, useList, useNavigation } from "@refinedev/core";
import { Button, Form, Input, Popconfirm, Select, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { MediaUpload } from "../../../components/MediaUpload";
import type { AestheticProduct } from "../../../interfaces";
import { removeMediaFile } from "../../../utils/storage";

const { TextArea } = Input;

export const AestheticMediaEdit = () => {
  const { formProps, saveButtonProps, form, queryResult } = useForm({
    resource: "aesthetic_media",
    successNotification: () => ({
      message: "נשמר בהצלחה",
      type: "success",
    }),
  });
  const record = queryResult?.data?.data;
  const { mutate: deleteRecord, isLoading: deleting } = useDelete();
  const { list } = useNavigation();

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
    ["product_id", "usage_type", "description", "file_url"].forEach((k) => {
      if (cleaned[k] === undefined) cleaned[k] = null;
    });
    return formProps.onFinish?.(cleaned);
  };

  const handleDeleteRecord = () => {
    if (!record?.id) return;
    deleteRecord(
      { resource: "aesthetic_media", id: record.id },
      {
        onSuccess: async () => {
          await removeMediaFile(record.file_url).catch(() => undefined);
          message.success("הרשומה נמחקה");
          list("aesthetic_media");
        },
        onError: () => {
          message.error("שגיאה במחיקת הרשומה");
        },
      }
    );
  };

  const handleFileOnlyRemove = async (publicUrl?: string) => {
    await removeMediaFile(publicUrl).catch(() => undefined);
    form.setFieldsValue({ file_url: null });
    message.success("המדיה נמחקה");
  };

  return (
    <Edit
      title="עריכת מדיה — קליניקת אסתטיקה"
      saveButtonProps={saveButtonProps}
      headerButtons={({ defaultButtons }) => (
        <>
          {defaultButtons}
          <Popconfirm
            title="מחיקת רשומה"
            description="האם את/ה בטוח/ה שברצונך למחוק את כל הרשומה? פעולה זו תמחק את שם הקובץ, ההסבר, הקישור למוצר והקובץ עצמו. אין אפשרות לבטל."
            okText="מחק"
            cancelText="ביטול"
            okButtonProps={{ danger: true }}
            onConfirm={handleDeleteRecord}
          >
            <Button danger icon={<DeleteOutlined />} loading={deleting}>
              מחק רשומה
            </Button>
          </Popconfirm>
        </>
      )}
    >
      <Form {...formProps} layout="vertical" onFinish={handleFinish}>
        <Form.Item label="קובץ" name="file_url">
          <MediaUpload
            initialUrl={record?.file_url}
            initialFileName={record?.file_name}
            onUploadComplete={({ file_url, file_type, mime_type, file_size_bytes }) => {
              form.setFieldsValue({ file_url, file_type, mime_type, file_size_bytes });
            }}
            onFileRemove={handleFileOnlyRemove}
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
