import { Edit, useForm, DeleteButton } from "@refinedev/antd";
import { Form, Input, Select, Switch, Divider } from "antd";
import { useNavigate } from "react-router-dom";

const { TextArea } = Input;

export const DoctorEdit = () => {
  const navigate = useNavigate();
  const { formProps, saveButtonProps, id } = useForm({ resource: "doctors" });

  return (
    <Edit
      title="עריכת רופא"
      saveButtonProps={saveButtonProps}
      headerButtons={({ defaultButtons }) => (
        <>
          {defaultButtons}
          <DeleteButton
            resource="doctors"
            recordItemId={id as string}
            onSuccess={() => navigate("/doctors")}
          />
        </>
      )}
    >
      <Form {...formProps} layout="vertical">

        <Divider orientation="left">פרטי הרופא</Divider>
        <Form.Item label="שם" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="תחום" name="specialty">
          <Input />
        </Form.Item>
        <Form.Item label="מגדר" name="gender">
          <Select allowClear>
            <Select.Option value="זכר">זכר</Select.Option>
            <Select.Option value="נקבה">נקבה</Select.Option>
            <Select.Option value="אחר">אחר</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="ניסיון" name="experience">
          <Input />
        </Form.Item>
        <Form.Item label="השכלה / תואר" name="education">
          <Input />
        </Form.Item>
        <Form.Item label="שפות" name="languages">
          <Input />
        </Form.Item>
        <Form.Item label="ימים ושעות פעילות" name="working_hours">
          <TextArea rows={3} />
        </Form.Item>
        <Form.Item label="מקבל/ת מטופלים חדשים" name="accepting_new_patients" valuePropName="checked">
          <Switch checkedChildren="כן" unCheckedChildren="לא" />
        </Form.Item>
        <Form.Item label="מידע נוסף" name="additional_info">
          <TextArea rows={4} />
        </Form.Item>

        <Divider orientation="left">חוות דעת — במידה ורלוונטי</Divider>
        <Form.Item label="הסבר על החוות דעת" name="consultation_description">
          <TextArea rows={3} />
        </Form.Item>
        <Form.Item label="לוחות זמנים" name="consultation_schedule">
          <TextArea rows={2} />
        </Form.Item>
        <Form.Item label="עלות" name="consultation_cost">
          <Input />
        </Form.Item>
        <Form.Item label="מידע נוסף — חוות דעת" name="consultation_notes">
          <TextArea rows={3} />
        </Form.Item>

      </Form>
    </Edit>
  );
};
