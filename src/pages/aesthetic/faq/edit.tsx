import { Edit, useForm, DeleteButton } from "@refinedev/antd";
import { Form, Input, Switch } from "antd";
import { useNavigate } from "react-router-dom";

const { TextArea } = Input;

export const AestheticFAQEdit = () => {
  const navigate = useNavigate();
  const { formProps, saveButtonProps, id } = useForm({ resource: "aesthetic_faq" });

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
        <Form.Item label="קטגוריה" name="category">
          <Input />
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
