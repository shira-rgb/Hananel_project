import { Create, useForm } from "@refinedev/antd";
import { Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import { PageShell } from "../../../components/PageShell";

const { TextArea } = Input;

export const AestheticClientCreate = () => {
  const navigate = useNavigate();
  const { formProps, saveButtonProps } = useForm({
    resource: "aesthetic_clients",
    redirect: false,
    meta: { select: "*" },
    successNotification: false,
    onMutationSuccess: (data) => {
      message.success("הלקוחה נוספה בהצלחה");
      const inner = (data as { data?: { id?: string } })?.data;
      const id = inner?.id || (data as { id?: string })?.id;
      if (id) navigate(`/aesthetic/clients/edit/${id}`);
      else navigate("/aesthetic/contacts");
    },
    onMutationError: (e) => {
      message.error("שמירה נכשלה: " + (e?.message || ""));
    },
  });

  return (
    <PageShell
      business="aesthetic"
      title="הוספת לקוחה"
      subtitle="הוספת לקוחה חדשה למאגר. לאחר השמירה תועברי לעמוד העריכה להשלמת פרטים."
    >
    <Create
      title=""
      breadcrumb={false}
      saveButtonProps={{ ...saveButtonProps, children: "שמור והמשך לעריכה" }}
    >
      <Form {...formProps} layout="vertical">
        <Form.Item label="שם פרטי" name="first_name" rules={[{ required: true, message: "חובה להכניס שם פרטי" }]}>
          <Input placeholder="שם פרטי" />
        </Form.Item>
        <Form.Item label="שם משפחה" name="last_name">
          <Input placeholder="שם משפחה" />
        </Form.Item>
        <Form.Item label="טלפון" name="normalized_phone">
          <Input placeholder="972XXXXXXXXX או 05X-XXXXXXX" />
        </Form.Item>
        <Form.Item label="מייל" name="email">
          <Input type="email" placeholder="example@email.com" />
        </Form.Item>
        <Form.Item label="הערות" name="notes">
          <TextArea rows={4} placeholder="מידע נוסף על הלקוח/ה..." />
        </Form.Item>
      </Form>
    </Create>
    </PageShell>
  );
};
