import { Edit, useForm, DeleteButton } from "@refinedev/antd";
import { Form, Input, InputNumber, Switch, Space, Divider, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";

const { TextArea } = Input;

export const DentalProductEdit = () => {
  const navigate = useNavigate();
  const { formProps, saveButtonProps, id } = useForm({ resource: "dental_products" });

  return (
    <Edit
      title="עריכת מוצר/טיפול — מרפאת שיניים"
      saveButtonProps={saveButtonProps}
      headerButtons={({ defaultButtons }) => (
        <>
          {defaultButtons}
          <DeleteButton
            resource="dental_products"
            recordItemId={id as string}
            onSuccess={() => navigate("/dental/products")}
          />
        </>
      )}
    >
      <Form {...formProps} layout="vertical">

        <Divider orientation="left">זהות הטיפול</Divider>
        <Form.Item label="שם הטיפול" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="סוג טיפול" name="treatment_type">
          <Input />
        </Form.Item>
        <Form.Item label="מחיר (₪)" name="price" rules={[{ required: true }]}>
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Divider orientation="left">תיאור הטיפול</Divider>
        <Form.Item label="מי הרופא/ים המבצעים את הטיפול" name="doctors">
          <Input />
        </Form.Item>
        <Form.Item label="איך הטיפול עובד" name="how_it_works">
          <TextArea rows={4} />
        </Form.Item>

        <Divider orientation="left">למי מתאים ולמי לא</Divider>
        <Form.Item label="מתי לקוחות פונים לטיפול" name="indications">
          <TextArea rows={3} />
        </Form.Item>
        <Form.Item label="גילאים מתאימים" name="suitable_ages">
          <Input />
        </Form.Item>
        <Form.Item label="למי הטיפול לא מתאים / התוויות נגד" name="contraindications">
          <TextArea rows={3} />
        </Form.Item>

        <Divider orientation="left">פרטים טכניים</Divider>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="מספר ביקורים נדרשים" name="num_visits">
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="משך הטיפול" name="treatment_duration">
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="האם נדרשת הרדמה" name="requires_anesthesia">
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="זמן לתוצאות" name="results_timeline">
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="משך ההשפעה" name="effect_duration">
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="זמן החלמה" name="recovery_time">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left">לאחר הטיפול</Divider>
        <Form.Item label="הוראות לאחר הטיפול" name="post_treatment_instructions">
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item label="באילו מצבים פונים למרפאה לאחר טיפול (חירום)" name="when_to_contact_clinic">
          <TextArea rows={3} />
        </Form.Item>
        <Form.Item label="תופעות לוואי" name="side_effects">
          <TextArea rows={3} />
        </Form.Item>

        <Divider orientation="left">מידע נוסף</Divider>
        <Form.Item label="שאלות נפוצות" name="faq">
          <TextArea rows={5} />
        </Form.Item>
        <Form.Item label="מידע חשוב" name="important_info">
          <TextArea rows={3} />
        </Form.Item>
        <Form.Item label="מידע נוסף" name="description">
          <TextArea rows={3} />
        </Form.Item>

        <Divider orientation="left">הגדרות</Divider>
        <Space size={32}>
          <Form.Item label="הצג במחירון" name="show_in_pricelist" valuePropName="checked">
            <Switch checkedChildren="כן" unCheckedChildren="לא" />
          </Form.Item>
          <Form.Item label="טיפול פעיל" name="is_active" valuePropName="checked">
            <Switch checkedChildren="פעיל" unCheckedChildren="לא פעיל" />
          </Form.Item>
        </Space>

      </Form>
    </Edit>
  );
};
