import { Create, useForm } from "@refinedev/antd";
import { useList } from "@refinedev/core";
import { Form, Select, Input, Switch } from "antd";
import type { AestheticFAQ } from "../../../interfaces";

const { TextArea } = Input;

export const AestheticFAQCreate = () => {
  const { formProps, saveButtonProps } = useForm({ resource: "aesthetic_faq" });

  const { data: faqData } = useList<AestheticFAQ>({
    resource: "aesthetic_faq",
    pagination: { pageSize: 500 },
  });

  const categoryOptions = [
    ...new Set(
      (faqData?.data || []).map((f) => f.category).filter(Boolean)
    ),
  ].map((c) => ({ label: c, value: c }));

  return (
    <Create title="הוספת שאלה — אסתטיקה" saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical" initialValues={{ is_active: true }}>
        <Form.Item
          label="קטגוריה"
          name="category"
          normalize={(val) => (Array.isArray(val) ? val[0] ?? null : val)}
          getValueProps={(val) => ({ value: val ? [val] : [] })}
        >
          <Select
            mode="tags"
            options={categoryOptions}
            placeholder='בחרי קטגוריה קיימת או הוסיפי חדשה...'
            maxCount={1}
            tokenSeparators={[","]}
          />
        </Form.Item>
        <Form.Item label="שאלה" name="question" rules={[{ required: true, message: "חובה להכניס שאלה" }]}>
          <Input placeholder="מה השאלה הנפוצה?" />
        </Form.Item>
        <Form.Item label="תשובה" name="answer" rules={[{ required: true, message: "חובה להכניס תשובה" }]}>
          <TextArea rows={6} placeholder="הכנסי את התשובה המלאה כאן..." />
        </Form.Item>
        <Form.Item label="פעיל" name="is_active" valuePropName="checked">
          <Switch checkedChildren="פעיל" unCheckedChildren="לא פעיל" />
        </Form.Item>
      </Form>
    </Create>
  );
};
