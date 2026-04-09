import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Select, Switch } from "antd";

const { TextArea } = Input;

export const DoctorCreate = () => {
  const { formProps, saveButtonProps } = useForm({ resource: "doctors" });

  return (
    <Create title="הוספת רופא" saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical" initialValues={{ accepting_new_patients: true }}>
        <Form.Item label="שם" name="name" rules={[{ required: true, message: "חובה להכניס שם" }]}>
          <Input placeholder='לדוגמה: ד"ר כהן מירב' />
        </Form.Item>
        <Form.Item label="תחום" name="specialty">
          <Input placeholder="לדוגמה: אסתטיקה, שיניים, פה ולסת..." />
        </Form.Item>
        <Form.Item label="מגדר" name="gender">
          <Select placeholder="בחרי מגדר" allowClear>
            <Select.Option value="זכר">זכר</Select.Option>
            <Select.Option value="נקבה">נקבה</Select.Option>
            <Select.Option value="אחר">אחר</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="ניסיון" name="experience">
          <Input placeholder="לדוגמה: 12 שנים בתחום האסתטיקה" />
        </Form.Item>
        <Form.Item label="השכלה / תואר" name="education">
          <Input placeholder="לדוגמה: MD, מומחה בכירורגיה פלסטית" />
        </Form.Item>
        <Form.Item label="שפות" name="languages">
          <Input placeholder="לדוגמה: עברית, אנגלית, ערבית" />
        </Form.Item>
        <Form.Item label="קליניקה / סניף" name="clinic_branch">
          <Input placeholder="לדוגמה: סניף תל אביב" />
        </Form.Item>
        <Form.Item label="ימים ושעות פעילות" name="working_hours">
          <TextArea rows={3} placeholder="לדוגמה: ראשון–חמישי 09:00–18:00, שישי 09:00–13:00" />
        </Form.Item>
        <Form.Item label="מקבל/ת מטופלים חדשים" name="accepting_new_patients" valuePropName="checked">
          <Switch checkedChildren="כן" unCheckedChildren="לא" />
        </Form.Item>
        <Form.Item label="מידע נוסף" name="additional_info">
          <TextArea rows={5} placeholder="כל מידע רלוונטי נוסף — התמחויות, אישורים, הערות..." />
        </Form.Item>
      </Form>
    </Create>
  );
};
