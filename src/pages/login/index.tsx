import { useLogin } from "@refinedev/core";
import { Form, Input, Button, Card, Alert } from "antd";
import { useState } from "react";
import { LockOutlined } from "@ant-design/icons";

export const LoginPage = () => {
  const { mutate: login, isLoading } = useLogin();
  const [error, setError] = useState("");

  const onFinish = ({ password }: { password: string }) => {
    setError("");
    login(
      { username: "admin", password },
      {
        onError: () => setError("סיסמה שגויה, נסי שוב"),
      }
    );
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #2D2438 0%, #4A3D5C 50%, #7C6B8B 100%)",
      }}
    >
      <Card
        style={{ width: 360, borderRadius: 16, boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}
        styles={{ body: { padding: "36px" } }}
      >
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>✨</div>
          <h2 style={{ margin: 0, color: "#2D2438", fontSize: 22, fontWeight: 700 }}>
            חנאנל
          </h2>
          <p style={{ margin: "6px 0 0", color: "#7C6B8B", fontSize: 13 }}>
            קליניקת אסתטיקה ומרפאת שיניים
          </p>
        </div>

        {error && (
          <Alert type="error" message={error} style={{ marginBottom: 16 }} showIcon />
        )}

        <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
          <Form.Item
            label="סיסמה"
            name="password"
            rules={[{ required: true, message: "חובה להכניס סיסמה" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="הכניסי סיסמה"
              size="large"
              autoFocus
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={isLoading}
              style={{ borderRadius: 8, height: 44, fontWeight: 600 }}
            >
              כניסה
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
