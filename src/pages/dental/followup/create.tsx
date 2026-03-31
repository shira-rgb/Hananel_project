import { Create, useForm, useSelect } from "@refinedev/antd";
import { Form, Input, InputNumber, Select, Switch, Space } from "antd";
import type { DentalProduct } from "../../../interfaces";

const { TextArea } = Input;

export const DentalFollowupCreate = () => {
  const { formProps, saveButtonProps } = useForm({ resource: "dental_followup_messages" });

  const { selectProps: productSelectProps } = useSelect<DentalProduct>({
    resource: "dental_products",
    optionLabel: "name",
    optionValue: "id",
    filters: [{ field: "is_active", operator: "eq", value: true }],
  });

  return (
    <Create title="הוספת הודעת פולואפ — מרפאת שיניים" saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical" initialValues={{ is_active: true, delay_value: 1, delay_unit: "days" }}>
        <Form.Item label="טיפול מקושר" name="product_id">
          <Select {...productSelectProps} placeholder="בחר טיפול (אופציונלי)" allowClear />
        </Form.Item>
        <Form.Item label="תוכן ההודעה" name="message_text" rules={[{ required: true, message: "חובה להכניס תוכן" }]}>
          <TextArea rows={5} placeholder="שלום {שם_לקוח}, רצינו לוודא שהכל בסדר אחרי הטיפול..." />
        </Form.Item>
        <Space size={16} align="start">
          <Form.Item label="שלח אחרי" name="delay_value" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: 100 }} />
          </Form.Item>
          <Form.Item name="delay_unit" label=" " rules={[{ required: true }]}>
            <Select style={{ width: 120 }} options={[{ label: "שעות", value: "hours" }, { label: "ימים", value: "days" }, { label: "שבועות", value: "weeks" }]} />
          </Form.Item>
          <span style={{ lineHeight: "32px", paddingTop: 30 }}>אחרי הטיפול</span>
        </Space>
        <Form.Item label="הודעה פעילה" name="is_active" valuePropName="checked">
          <Switch checkedChildren="פעיל" unCheckedChildren="כבוי" />
        </Form.Item>
      </Form>
    </Create>
  );
};
