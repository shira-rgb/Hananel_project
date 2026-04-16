import { Create, useForm } from "@refinedev/antd";
import { useList } from "@refinedev/core";
import { Form, Input, InputNumber, Select, Switch, Space } from "antd";
import type { AestheticProduct } from "../../../interfaces";

const { TextArea } = Input;

export const AestheticFollowupCreate = () => {
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
    <Create title="הוספת הודעת פולואפ — אסתטיקה" saveButtonProps={saveButtonProps}>
      <Form
        {...formProps}
        layout="vertical"
        initialValues={{ is_active: true, delay_value: 1, delay_unit: "days", timing_type: "after" }}
      >
        <Form.Item label="מוצר מקושר (בחירה מרובה)" name="treatment_types">
          <Select
            mode="multiple"
            options={productOptions}
            placeholder="בחרי מוצרים רלוונטיים להודעה זו..."
            allowClear
          />
        </Form.Item>
        <Form.Item
          label="תוכן ההודעה"
          name="message_text"
          rules={[{ required: true, message: "חובה להכניס תוכן" }]}
        >
          <TextArea rows={5} placeholder="שלום {שם_לקוח}, רצינו לוודא שהכל בסדר אחרי הטיפול..." />
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
              { label: "אחרי טיפול / פנייה", value: "after" },
              { label: "לפני פגישה (תזכורת)", value: "before" },
            ]}
          />
        </Form.Item>

        <Form.Item shouldUpdate={(p, c) => p.timing_type !== c.timing_type} noStyle>
          {({ getFieldValue }) => {
            const timing = getFieldValue("timing_type") || "after";
            return (
              <Space size={16} align="start" wrap>
                <Form.Item
                  label={timing === "before" ? "שלח לפני" : "שלח אחרי"}
                  name="delay_value"
                  rules={[{ required: true }]}
                >
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
                <span style={{ lineHeight: "32px", paddingTop: 30 }}>
                  {timing === "before" ? "לפני הפגישה" : "אחרי הטיפול"}
                </span>
              </Space>
            );
          }}
        </Form.Item>

        <Form.Item label="הודעה פעילה" name="is_active" valuePropName="checked">
          <Switch checkedChildren="פעיל" unCheckedChildren="כבוי" />
        </Form.Item>
      </Form>
    </Create>
  );
};
