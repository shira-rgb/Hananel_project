import { Create, useForm } from "@refinedev/antd";
import { Form, Input, InputNumber, Switch, Space, Divider, Row, Col } from "antd";

const { TextArea } = Input;

export const AestheticProductCreate = () => {
  const { formProps, saveButtonProps } = useForm({ resource: "aesthetic_products" });

  return (
    <Create title="הוספת מוצר — אסתטיקה" saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical" initialValues={{ show_in_pricelist: true, is_active: true }}>

        <Divider orientation="left">זהות המוצר</Divider>
        <Form.Item label="מוצר" name="name" rules={[{ required: true, message: "חובה להכניס שם" }]}>
          <Input placeholder="לדוגמה: בוטוקס, פילר, מזותרפיה..." />
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="סוג טיפול" name="treatment_type">
              <Input placeholder="לדוגמה: 2 אזורים, שרירי לעיסה..." />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="אזור בגוף" name="body_area">
              <Input placeholder="לדוגמה: שליש פנים עליון, בית השחי..." />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="מחיר (₪)" name="price" rules={[{ required: true, message: "חובה להכניס מחיר" }]}>
          <InputNumber min={0} style={{ width: "100%" }} placeholder="0" />
        </Form.Item>

        <Divider orientation="left">תיאור הטיפול</Divider>
        <Form.Item label="הסבר על המוצר" name="product_description">
          <TextArea rows={3} placeholder="תיאור קצר של מה הטיפול עושה ומה הפתרון שהוא נותן..." />
        </Form.Item>
        <Form.Item label="איך הטיפול עובד" name="how_it_works">
          <TextArea rows={4} placeholder="תיאור שלבי הטיפול..." />
        </Form.Item>

        <Divider orientation="left">למי מתאים ולמי לא</Divider>
        <Form.Item label="מתי פונים לטיפול" name="indications">
          <TextArea rows={3} placeholder="באילו מצבים לקוחות פונים למוצר זה? לדוגמה: נפיחות באזור, קושי בלעיסה, רצון להחליק קמטים..." />
        </Form.Item>
        <Form.Item label="גילאים מתאימים" name="suitable_ages">
          <Input placeholder="לדוגמה: מגיל 16 עם הורה, מגיל 18 ללא ליווי" />
        </Form.Item>
        <Form.Item label="למי הטיפול לא מתאים" name="contraindications">
          <TextArea rows={4} placeholder="הריון, מחלות, אלרגיות..." />
        </Form.Item>

        <Divider orientation="left">פרטים טכניים</Divider>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="זמן הטיפול" name="treatment_duration">
              <Input placeholder="לדוגמה: 5 דקות" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="זמן לתוצאות" name="results_timeline">
              <Input placeholder="לדוגמה: מתחיל 5 ימים, מלא 14 ימים" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="משך ההשפעה" name="effect_duration">
              <Input placeholder="לדוגמה: 3-6 חודשים" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="זמן החלמה" name="recovery_time">
          <Input placeholder="לדוגמה: 24 שעות" />
        </Form.Item>

        <Divider orientation="left">לאחר הטיפול</Divider>
        <Form.Item label="הוראות לאחר הטיפול" name="post_treatment_instructions">
          <TextArea rows={4} placeholder="מה אסור/מותר לאחר הטיפול..." />
        </Form.Item>
        <Form.Item label="מתי לפנות לקליניקה לאחר טיפול (מצבי חרום)" name="when_to_contact_clinic">
          <TextArea rows={3} placeholder="תסמינים חריגים שמצריכים פנייה דחופה..." />
        </Form.Item>

        <Divider orientation="left">מידע נוסף</Divider>
        <Form.Item label="מיתוסים נפוצים" name="common_myths">
          <TextArea rows={4} placeholder="אמונות שגויות נפוצות לגבי הטיפול..." />
        </Form.Item>
        <Form.Item label="שאלות ותשובות" name="faq">
          <TextArea rows={5} placeholder="האם זה כואב? כמה זמן זה מחזיק?..." />
        </Form.Item>
        <Form.Item label="תופעות לוואי" name="side_effects">
          <TextArea rows={4} placeholder="תופעות לוואי נפוצות, פחות שכיחות ונדירות..." />
        </Form.Item>
        <Form.Item label="מידע נוסף" name="description">
          <TextArea rows={4} placeholder="כל מידע נוסף שלא נכנס לשאר השדות..." />
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
    </Create>
  );
};
