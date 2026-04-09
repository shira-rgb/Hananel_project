import { Create, useForm } from "@refinedev/antd";
import { Form, Input, InputNumber, Switch, Space, Divider, Row, Col } from "antd";

const { TextArea } = Input;

export const DentalProductCreate = () => {
  const { formProps, saveButtonProps } = useForm({ resource: "dental_products" });

  return (
    <Create title="הוספת מוצר/טיפול — מרפאת שיניים" saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical" initialValues={{ show_in_pricelist: true, is_active: true }}>

        <Divider orientation="left">זהות הטיפול</Divider>
        <Form.Item label="שם הטיפול" name="name" rules={[{ required: true, message: "חובה להכניס שם" }]}>
          <Input placeholder="לדוגמה: ציפוי שיניים, השתלה, הלבנה..." />
        </Form.Item>
        <Form.Item label="סוג טיפול" name="treatment_type">
          <Input placeholder="לדוגמה: ציפוי קרמי, השתלה בסיסית..." />
        </Form.Item>
        <Form.Item label="מחיר (₪)" name="price" rules={[{ required: true, message: "חובה להכניס מחיר" }]}>
          <InputNumber min={0} style={{ width: "100%" }} placeholder="0" />
        </Form.Item>

        <Divider orientation="left">תיאור הטיפול</Divider>
        <Form.Item label="מי הרופא/ים המבצעים את הטיפול" name="doctors">
          <Input placeholder='לדוגמה: ד"ר כהן, כל רופאי המרפאה...' />
        </Form.Item>
        <Form.Item label="איך הטיפול עובד" name="how_it_works">
          <TextArea rows={4} placeholder="תיאור שלבי הטיפול מרגע ההגעה ועד הסיום..." />
        </Form.Item>

        <Divider orientation="left">למי מתאים ולמי לא</Divider>
        <Form.Item label="מתי לקוחות פונים לטיפול" name="indications">
          <TextArea rows={3} placeholder="באילו מצבים / תסמינים לקוחות מגיעים לטיפול זה..." />
        </Form.Item>
        <Form.Item label="גילאים מתאימים" name="suitable_ages">
          <Input placeholder="לדוגמה: מגיל 18, מגיל 16 עם הורה..." />
        </Form.Item>
        <Form.Item label="למי הטיפול לא מתאים / התוויות נגד" name="contraindications">
          <TextArea rows={3} placeholder="הריון, מחלות, מצבים רפואיים מסוימים..." />
        </Form.Item>

        <Divider orientation="left">פרטים טכניים</Divider>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="מספר ביקורים נדרשים" name="num_visits">
              <Input placeholder="לדוגמה: ביקור אחד, 2–3 ביקורים..." />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="משך הטיפול" name="treatment_duration">
              <Input placeholder="לדוגמה: 45 דקות, שעה..." />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="האם נדרשת הרדמה" name="requires_anesthesia">
              <Input placeholder="לדוגמה: כן, הרדמה מקומית / לא נדרש..." />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="זמן לתוצאות" name="results_timeline">
              <Input placeholder="לדוגמה: מיידי, תוך שבוע..." />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="משך ההשפעה" name="effect_duration">
              <Input placeholder="לדוגמה: קבוע, 2–3 שנים..." />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="זמן החלמה" name="recovery_time">
              <Input placeholder="לדוגמה: יום, שבוע..." />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left">לאחר הטיפול</Divider>
        <Form.Item label="הוראות לאחר הטיפול" name="post_treatment_instructions">
          <TextArea rows={4} placeholder="מה אסור/מותר לאחר הטיפול, מה לצפות..." />
        </Form.Item>
        <Form.Item label="באילו מצבים פונים למרפאה לאחר טיפול (חירום)" name="when_to_contact_clinic">
          <TextArea rows={3} placeholder="תסמינים חריגים שמצריכים פנייה דחופה..." />
        </Form.Item>
        <Form.Item label="תופעות לוואי" name="side_effects">
          <TextArea rows={3} placeholder="תופעות לוואי נפוצות, פחות שכיחות ונדירות..." />
        </Form.Item>

        <Divider orientation="left">מידע נוסף</Divider>
        <Form.Item label="שאלות נפוצות" name="faq">
          <TextArea rows={5} placeholder="האם זה כואב? כמה זמן זה מחזיק? האם צריך מספר ביקורים?..." />
        </Form.Item>
        <Form.Item label="מידע חשוב" name="important_info">
          <TextArea rows={3} placeholder="דברים חשובים שהלקוח צריך לדעת לפני הטיפול..." />
        </Form.Item>
        <Form.Item label="מידע נוסף" name="description">
          <TextArea rows={3} placeholder="כל מידע נוסף שלא נכנס לשאר השדות..." />
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
    </Create>
  );
};
