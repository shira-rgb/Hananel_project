import { Input, Button, Card, Alert, Form } from "antd";
import { useState } from "react";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { authProvider } from "../../authProvider";

export const LoginPage = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values: { email: string; password: string }) => {
    setError("");
    setLoading(true);
    try {
      const result: { success: boolean; error?: { message?: string } } =
        await authProvider.login!(values);
      if (result?.success) {
        window.location.href = "/";
      } else {
        setError(result?.error?.message || "סיסמה שגויה");
      }
    } catch (e) {
      setError((e as { message?: string })?.message || "שגיאה בהתחברות");
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
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -120,
          insetInlineStart: -120,
          width: 380,
          height: 380,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(173,78,156,0.45) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -160,
          insetInlineEnd: -100,
          width: 420,
          height: 420,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(13,110,110,0.4) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <Card
        style={{
          width: 400,
          borderRadius: 20,
          boxShadow: "0 30px 80px rgba(0,0,0,0.4)",
          position: "relative",
        }}
        styles={{ body: { padding: "40px 36px" } }}
      >
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>✨🦷</div>
          <h2 style={{ margin: 0, color: "#2D2438", fontSize: 24, fontWeight: 700 }}>
            דשבורד חננאל
          </h2>
          <p style={{ margin: "6px 0 0", color: "#7C6B8B", fontSize: 13 }}>
            קליניקת אסתטיקה ומרפאת שיניים
          </p>
        </div>

        {error && (
          <Alert
            type="error"
            message={error}
            style={{ marginBottom: 16, borderRadius: 10 }}
            showIcon
          />
        )}

        <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
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

          <Form.Item
            label="סיסמה"
            name="password"
            rules={[{ required: true, message: "חובה להכניס סיסמה" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="הסיסמה שלך"
              size="large"
              autoComplete="current-password"
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
            כניסה
          </Button>
        </Form>

        <div style={{ marginTop: 16, textAlign: "center" }}>
          <Link
            to="/auth/forgot-password"
            style={{ color: "#7C6B8B", fontSize: 13 }}
          >
            שכחתי סיסמה
          </Link>
        </div>
      </Card>
    </div>
  );
};
