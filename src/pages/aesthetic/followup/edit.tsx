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
          <Select
            mode="multiple"
            options={productOptions}
            allowClear
          />
        </Form.Item>
        <Form.Item label="תוכן ההודעה" name="message_text" rules={[{ required: true }]}>
          <TextArea rows={5} />
        </Form.Item>
        <Space size={16} align="start">
          <Form.Item label="שלח אחרי" name="delay_value" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: 100 }} />
          </Form.Item>
          <Form.Item name="delay_unit" label=" " rules={[{ required: true }]}>
            <Select
              style={{ width: 120 }}
              options={[
                { label: "שעות", value: "hours" },
                { label: "ימים", value: "days" },
                { label: "שבועות", value: "weeks" },
              ]}
            />
          </Form.Item>
        </Space>
        <Form.Item label="הודעה פעילה" name="is_active" valuePropName="checked">
          <Switch checkedChildren="פעיל" unCheckedChildren="כבוי" />
        </Form.Item>
      </Form>
    </Edit>
  );
};
