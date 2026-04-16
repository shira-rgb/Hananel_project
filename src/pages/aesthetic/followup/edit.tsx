import { Edit, useForm } from "@refinedev/antd";
import { useList } from "@refinedev/core";
import { Form, Input, InputNumber, Select, Switch, Space } from "antd";
import type { AestheticProduct } from "../../../interfaces";

const { TextArea } = Input;

export const AestheticFollowupEdit = () => {
  const { formProps, saveButtonProps } = useForm({ resource: "aesthetic_followup_messages" });

  const { data: productsData } = useList<AestheticProduct>({
    resource: "aesthetic_products",
    filters: [{ field: "is_active", operator: "eq", value: true }],
    pagination: { pageSize: 100 },
  });

  const productOptions = (productsData?.data || []).map((p) => {
    const label = p.treatment_type ? `${p.name} — ${p.treatment_type}` : p.name;
    return { label, value: label };
  });

  return (
    <Edit title="עריכת הודעת פולואפ — אסתטיקה" saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item label="מוצר מקושר (בחירה מרובה)" name="treatment_types">
          <Select mode="multiple" options={productOptions} allowClear />
        </Form.Item>

        <Form.Item label="תוכן ההודעה" name="message_text" rules={[{ required: true }]}>
          <TextArea rows={5} />
        </Form.Item>

        <Form.Item
          label="סוג תזמון"
          name="timing_type"
          rules={[{ required: true }]}
          tooltip="'אחרי' = שולח כמה זמן אחרי פנייה/טיפול | 'לפני' = תזכורת לפני פגישה שנקבעה"
        >
          <Select
            style={{ maxWidth: 260 }}
            options={[
              { label: "הודעת פולואפ לאחר טיפול", value: "after" },
              { label: "הודעת תזכורת לפני טיפול", value: "before" },
            ]}
          />
        </Form.Item>

        <Form.Item shouldUpdate={(p, c) => p.timing_type !== c.timing_type} noStyle>
          {({ getFieldValue }) => {
            const timing = getFieldValue("timing_type") || "after";
            return (
              <Form.Item label={timing === "before" ? "שלח תזכורת לפני הטיפול" : "שלח פולואפ אחרי הטיפול"} required>
                <Space.Compact>
                  <Form.Item name="delay_value" rules={[{ required: true }]} noStyle>
                    <InputNumber min={1} style={{ width: 100 }} />
                  </Form.Item>
                  <Form.Item name="delay_unit" rules={[{ required: true }]} noStyle>
                    <Select
                      style={{ width: 120 }}
                      options={[
                        { label: "שעות", value: "hours" },
                        { label: "ימים", value: "days" },
                        { label: "שבועות", value: "weeks" },
                      ]}
                    />
                  </Form.Item>
                </Space.Compact>
              </Form.Item>
            );
          }}
        </Form.Item>

        <Form.Item label="הודעה פעילה" name="is_active" valuePropName="checked">
          <Switch checkedChildren="פעיל" unCheckedChildren="כבוי" />
        </Form.Item>
      </Form>
    </Edit>
  );
};
