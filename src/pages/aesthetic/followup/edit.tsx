import { Edit, useForm, useSelect } from "@refinedev/antd";
import { Form, Input, InputNumber, Select, Switch, Space } from "antd";
import type { AestheticProduct } from "../../../interfaces";

const { TextArea } = Input;

export const AestheticFollowupEdit = () => {
  const { formProps, saveButtonProps } = useForm({ resource: "aesthetic_followup_messages" });

  const { selectProps: productSelectProps } = useSelect<AestheticProduct>({
    resource: "aesthetic_products",
    optionLabel: "name",
    optionValue: "id",
    filters: [{ field: "is_active", operator: "eq", value: true }],
  });

  const { selectProps: treatmentTypeSelectProps } = useSelect<AestheticProduct>({
    resource: "aesthetic_products",
    optionLabel: "name",
    optionValue: "name",
    filters: [{ field: "is_active", operator: "eq", value: true }],
  });

  return (
    <Edit title="עריכת הודעת פולואפ — אסתטיקה" saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item label="מוצר מקושר" name="product_id">
          <Select {...productSelectProps} allowClear />
        </Form.Item>
        <Form.Item label="סוגי טיפול (בחירה מרובה)" name="treatment_types">
          <Select
            {...treatmentTypeSelectProps}
            mode="multiple"
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
