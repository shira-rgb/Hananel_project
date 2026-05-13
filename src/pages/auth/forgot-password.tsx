import { Input, Button, Card, Alert, Form } from "antd";
import { useState } from "react";
import { MailOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { authProvider } from "../../authProvider";

export const ForgotPasswordPage = () => {
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { email: string }) => {
    setError("");
    setLoading(true);
    try {
      const result: { success: boolean; error?: { message?: string } } =
        await authProvider.forgotPassword!(values);
      if (result?.success) {
        setSent(true);
      } else {
        setError(result?.error?.message || "שליחה נכשלה");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #1a0e2e 0%, #3d1738 45%, #0a3838 100%)",
      }}
    >
      <Card
        style={{
          width: 400,
          borderRadius: 20,
          boxShadow: "0 30px 80px rgba(0,0,0,0.4)",
        }}
        styles={{ body: { padding: "40px 36px" } }}
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <h2 style={{ margin: 0, color: "#2D2438", fontSize: 22, fontWeight: 700 }}>
            איפוס סיסמה
          </h2>
          <p style={{ margin: "6px 0 0", color: "#7C6B8B", fontSize: 13 }}>
            נשלח לך מייל עם קישור לאיפוס
          </p>
        </div>

        {sent ? (
          <Alert
            type="success"
            showIcon
            message="המייל נשלח"
            description="בדקי את תיבת הדואר. אם לא הגיע תוך כמה דקות — בדקי גם בספאם."
            style={{ borderRadius: 10 }}
          />
        ) : (
          <>
            {error && (
              <Alert
                type="error"
                message={error}
                style={{ marginBottom: 16, borderRadius: 10 }}
                showIcon
              />
            )}
            <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
              <Form.Item
                label="מייל"
                name="email"
                rules={[
                  { required: true, message: "חובה להכניס מייל" },
                  { type: "email", message: "כתובת מייל לא תקינה" },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="example@email.com"
                  size="large"
                  autoFocus
                  autoComplete="email"
                />
              </Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                loading={loading}
                style={{ borderRadius: 10, height: 46, fontWeight: 600 }}
              >
                שלח לי קישור איפוס
              </Button>
            </Form>
          </>
        )}

        <div style={{ marginTop: 16, textAlign: "center" }}>
          <Link to="/login" style={{ color: "#7C6B8B", fontSize: 13 }}>
            <ArrowRightOutlined /> חזרה לכניסה
          </Link>
        </div>
      </Card>
    </div>
  );
};
