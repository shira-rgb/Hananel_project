import { Edit, useForm, DeleteButton } from "@refinedev/antd";
import { useList } from "@refinedev/core";
import { Form, Select, Input, Switch } from "antd";
import { useNavigate } from "react-router-dom";
import type { AestheticFAQ } from "../../../interfaces";

const { TextArea } = Input;

export const AestheticFAQEdit = () => {
  const navigate = useNavigate();
  const { formProps, saveButtonProps, id } = useForm({ resource: "aesthetic_faq" });

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
    <Edit
      title="עריכת שאלה — אסתטיקה"
      saveButtonProps={saveButtonProps}
      headerButtons={({ defaultButtons }) => (
        <>
          {defaultButtons}
          <DeleteButton
            resource="aesthetic_faq"
            recordItemId={id as string}
            onSuccess={() => navigate("/aesthetic/faq")}
          />
        </>
      )}
    >
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="קטגוריה"
          name="category"
          normalize={(val) => (Array.isArray(val) ? val[0] ?? null : val)}
          getValueProps={(val) => ({ value: val ? [val] : [] })}
        >
          <Select
            mode="tags"
            options={categoryOptions}
            maxCount={1}
            tokenSeparators={[","]}
          />
        </Form.Item>
        <Form.Item label="שאלה" name="question" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="תשובה" name="answer" rules={[{ required: true }]}>
          <TextArea rows={6} />
        </Form.Item>
        <Form.Item label="פעיל" name="is_active" valuePropName="checked">
          <Switch checkedChildren="פעיל" unCheckedChildren="לא פעיל" />
        </Form.Item>
      </Form>
    </Edit>
  );
};
