import { Input, Button, Card, Alert } from "antd";
import { useState } from "react";
import { LockOutlined } from "@ant-design/icons";
import { authProvider } from "../../authProvider";

export const LoginPage = () => {
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const doLogin = async () => {
    setError("");
    const pwd = password.trim();
    if (!pwd) {
      setError("חובה להכניס סיסמה");
      return;
    }
    setLoading(true);
    try {
      const result: any = await authProvider.login!({ username: "admin", password: pwd });
      if (result?.success) {
        window.location.href = "/";
      } else {
        setError("סיסמה שגויה, נסי שוב");
      }
    } catch (e) {
      setError("שגיאה בהתחברות");
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

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 6, fontWeight: 500 }}>סיסמה</label>
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="הכניסי סיסמה"
            size="large"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onPressEnter={doLogin}
          />
        </div>

        <Button
          type="primary"
          onClick={doLogin}
          block
          size="large"
          loading={loading}
          style={{ borderRadius: 8, height: 44, fontWeight: 600 }}
        >
          כניסה
        </Button>
      </Card>
    </div>
  );
};
