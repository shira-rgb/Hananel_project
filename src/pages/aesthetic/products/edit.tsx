import { Edit, useForm, DeleteButton } from "@refinedev/antd";
import { Form, Input, InputNumber, Switch, Space, Divider, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";

const { TextArea } = Input;

export const AestheticProductEdit = () => {
  const navigate = useNavigate();
  const { formProps, saveButtonProps, id } = useForm({ resource: "aesthetic_products" });

  return (
    <Edit
      title="עריכת מוצר — אסתטיקה"
      saveButtonProps={saveButtonProps}
      headerButtons={({ defaultButtons }) => (
        <>
          {defaultButtons}
          <DeleteButton
            resource="aesthetic_products"
            recordItemId={id as string}
            onSuccess={() => navigate("/aesthetic/products")}
          />
        </>
      )}
    >
      <Form {...formProps} layout="vertical">

        <Divider orientation="left">זהות המוצר</Divider>
        <Form.Item label="מוצר" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="סוג טיפול" name="treatment_type">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="אזור בגוף" name="body_area">
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="מחיר (₪)" name="price" rules={[{ required: true }]}>
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Divider orientation="left">תיאור הטיפול</Divider>
        <Form.Item label="הסבר על המוצר" name="product_description">
          <TextArea rows={3} />
        </Form.Item>
        <Form.Item label="איך הטיפול עובד" name="how_it_works">
          <TextArea rows={4} />
        </Form.Item>

        <Divider orientation="left">למי מתאים ולמי לא</Divider>
        <Form.Item label="מתי פונים לטיפול" name="indications">
          <TextArea rows={3} />
        </Form.Item>
        <Form.Item label="גילאים מתאימים" name="suitable_ages">
          <Input />
        </Form.Item>
        <Form.Item label="למי הטיפול לא מתאים" name="contraindications">
          <TextArea rows={4} />
        </Form.Item>

        <Divider orientation="left">פרטים טכניים</Divider>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="זמן הטיפול" name="treatment_duration">
              <Input />
            </Form.Item>
          </Col>
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
        </Row>
        <Form.Item label="זמן החלמה" name="recovery_time">
          <Input />
        </Form.Item>

        <Divider orientation="left">לאחר הטיפול</Divider>
        <Form.Item label="הוראות לאחר הטיפול" name="post_treatment_instructions">
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item label="מתי לפנות לקליניקה לאחר טיפול (מצבי חרום)" name="when_to_contact_clinic">
          <TextArea rows={3} />
        </Form.Item>

        <Divider orientation="left">מידע נוסף</Divider>
        <Form.Item label="מיתוסים נפוצים" name="common_myths">
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item label="שאלות ותשובות" name="faq">
          <TextArea rows={5} />
        </Form.Item>
        <Form.Item label="הסבר (מידע נוסף כללי)" name="description">
          <TextArea rows={4} />
        </Form.Item>

        <Divider orientation="left">הגדרות</Divider>
        <Space size={32}>
          <Form.Item label="הצג במחירון" name="show_in_pricelist" valuePropName="checked">
            <Switch checkedChildren="כן" unCheckedChildren="לא" />
          </Form.Item>
          <Form.Item label="מוצר פעיל" name="is_active" valuePropName="checked">
            <Switch checkedChildren="פעיל" unCheckedChildren="לא פעיל" />
          </Form.Item>
        </Space>

      </Form>
    </Edit>
  );
};
