import { Input, Button, Card, Alert, Form } from "antd";
import { useEffect, useState } from "react";
import { LockOutlined } from "@ant-design/icons";
import { supabaseClient } from "../../supabaseClient";

export const SetPasswordPage = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  // Supabase invite/recovery links land here with a session in URL hash
  // (#access_token=...). The supabase-js client picks it up automatically
  // when detectSessionInUrl is true (default).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabaseClient.auth.getSession();
      if (cancelled) return;
      if (data?.session?.user) {
        setReady(true);
        setEmail(data.session.user.email ?? null);
      } else {
        setError("הקישור פג תוקף או לא תקין. בקשי מהמנהלת לשלוח שוב.");
        setReady(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const onFinish = async (values: { password: string; confirm: string }) => {
    setError("");
    if (values.password !== values.confirm) {
      setError("הסיסמאות לא תואמות");
      return;
    }
    if (values.password.length < 8) {
      setError("סיסמה חייבת להיות לפחות 8 תווים");
      return;
    }
    setLoading(true);
    const { error: updErr } = await supabaseClient.auth.updateUser({
      password: values.password,
    });
    setLoading(false);
    if (updErr) {
      setError(updErr.message);
      return;
    }
    window.location.href = "/";
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
          width: 420,
          borderRadius: 20,
          boxShadow: "0 30px 80px rgba(0,0,0,0.4)",
        }}
        styles={{ body: { padding: "40px 36px" } }}
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🔐</div>
          <h2 style={{ margin: 0, color: "#2D2438", fontSize: 22, fontWeight: 700 }}>
            הגדרת סיסמה
          </h2>
          {email && (
            <p style={{ margin: "6px 0 0", color: "#7C6B8B", fontSize: 13 }}>
              {email}
            </p>
          )}
        </div>

        {error && (
          <Alert
            type="error"
            message={error}
            style={{ marginBottom: 16, borderRadius: 10 }}
            showIcon
          />
        )}

        {ready && (
          <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
            <Form.Item
              label="סיסמה חדשה"
              name="password"
              rules={[
                { required: true, message: "חובה להכניס סיסמה" },
                { min: 8, message: "לפחות 8 תווים" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="לפחות 8 תווים"
                size="large"
                autoFocus
                autoComplete="new-password"
              />
            </Form.Item>
            <Form.Item
              label="אימות סיסמה"
              name="confirm"
              rules={[{ required: true, message: "חובה לאשר את הסיסמה" }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="הקלידי שוב"
                size="large"
                autoComplete="new-password"
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
              שמור והיכנס
            </Button>
          </Form>
        )}
      </Card>
    </div>
  );
};
