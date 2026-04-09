import { Edit, useForm, DeleteButton } from "@refinedev/antd";
import { Form, Input, InputNumber } from "antd";
import { useNavigate } from "react-router-dom";

const { TextArea } = Input;

export const DentalBusinessEdit = () => {
  const navigate = useNavigate();
  const { formProps, saveButtonProps, id } = useForm({ resource: "dental_business_info" });

  return (
    <Edit
      title="עריכת סעיף — מידע על העסק"
      saveButtonProps={saveButtonProps}
      headerButtons={({ defaultButtons }) => (
        <>
          {defaultButtons}
          <DeleteButton
            resource="dental_business_info"
            recordItemId={id as string}
            onSuccess={() => navigate("/dental/business")}
          />
        </>
      )}
    >
      <Form {...formProps} layout="vertical">
        <Form.Item label="כותרת הסעיף" name="section_title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="תוכן" name="content" rules={[{ required: true }]}>
          <TextArea rows={8} />
        </Form.Item>
        <Form.Item label="סדר תצוגה" name="display_order">
          <InputNumber min={0} style={{ width: 120 }} />
        </Form.Item>
      </Form>
    </Edit>
  );
};
