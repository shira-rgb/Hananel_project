import { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Space,
  Button,
  Modal,
  Form,
  Input,
  Popconfirm,
  message,
  Avatar,
  Tooltip,
} from "antd";
// Tooltip kept for toolbar refresh button
import {
  UserAddOutlined,
  ReloadOutlined,
  DeleteOutlined,
  StopOutlined,
  CheckCircleOutlined,
  MailOutlined,
  CrownOutlined,
  UserOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { supabaseClient } from "../../supabaseClient";
import { formatDate } from "../../utils/formatters";
import { PageShell } from "../../components/PageShell";

interface DirectoryRow {
  id: string;
  email: string | null;
  full_name: string | null;
  is_active: boolean;
  is_banned: boolean;
  is_confirmed: boolean;
  invited_by: string | null;
  created_at: string;
  updated_at: string;
  last_sign_in_at: string | null;
  invited_at: string | null;
}

const FN_PATH = "/functions/v1/manage-users";

async function callManageUsers(payload: Record<string, unknown>) {
  const { data: sessionRes } = await supabaseClient.auth.getSession();
  const token = sessionRes?.session?.access_token;
  if (!token) throw new Error("not_authenticated");

  const url =
    (import.meta.env.VITE_SUPABASE_URL as string).replace(/\/$/, "") + FN_PATH;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      apikey: import.meta.env.VITE_SUPABASE_ANON_KEY as string,
    },
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body?.error || `HTTP ${res.status}`);
  }
  return body;
}

const initialsFor = (row: DirectoryRow) => {
  const name = row.full_name || row.email || "";
  const parts = name.split(/[ @.]/).filter(Boolean);
  return ((parts[0]?.[0] || "?") + (parts[1]?.[0] || "")).toUpperCase();
};

export const UsersPage = () => {
  const [rows, setRows] = useState<DirectoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [actingId, setActingId] = useState<string | null>(null);
  const [form] = Form.useForm();

  const load = async () => {
    setLoading(true);
    const [{ data: dir, error }, { data: meRes }] = await Promise.all([
      supabaseClient
        .from("user_directory")
        .select("*")
        .order("created_at", { ascending: false }),
      supabaseClient.auth.getUser(),
    ]);
    setLoading(false);
    if (error) {
      message.error("טעינה נכשלה: " + error.message);
      return;
    }
    setRows((dir || []) as DirectoryRow[]);
    setCurrentUserId(meRes?.user?.id ?? null);
  };

  useEffect(() => {
    load();
  }, []);

  const onInvite = async (values: { email: string; full_name?: string }) => {
    setInviting(true);
    try {
      await callManageUsers({
        action: "invite",
        email: values.email.trim().toLowerCase(),
        full_name: values.full_name?.trim() || null,
        redirect_to: `${window.location.origin}/auth/set-password`,
      });
      message.success(`הזמנה נשלחה ל-${values.email}`);
      setInviteOpen(false);
      form.resetFields();
      load();
    } catch (e) {
      message.error("הזמנה נכשלה: " + (e as Error).message);
    } finally {
      setInviting(false);
    }
  };

  const onResend = async (row: DirectoryRow) => {
    if (!row.email) return;
    setActingId(row.id);
    try {
      await callManageUsers({
        action: "resend_invite",
        email: row.email,
        redirect_to: `${window.location.origin}/auth/set-password`,
      });
      message.success("הזמנה נשלחה שוב");
    } catch (e) {
      message.error("שליחה נכשלה: " + (e as Error).message);
    } finally {
      setActingId(null);
    }
  };

  const onToggleActive = async (row: DirectoryRow) => {
    setActingId(row.id);
    try {
      await callManageUsers({
        action: row.is_active && !row.is_banned ? "disable" : "enable",
        user_id: row.id,
      });
      message.success(row.is_active && !row.is_banned ? "המשתמש הושבת" : "המשתמש הופעל");
      load();
    } catch (e) {
      message.error("פעולה נכשלה: " + (e as Error).message);
    } finally {
      setActingId(null);
    }
  };

  const onDelete = async (row: DirectoryRow) => {
    setActingId(row.id);
    try {
      await callManageUsers({ action: "delete", user_id: row.id });
      message.success("המשתמש נמחק");
      load();
    } catch (e) {
      message.error("מחיקה נכשלה: " + (e as Error).message);
    } finally {
      setActingId(null);
    }
  };

  const columns = [
    {
      key: "person",
      title: "שם",
      render: (_: unknown, r: DirectoryRow) => (
        <Space size={12} align="center">
          <Avatar
            size={40}
            style={{
              background: "linear-gradient(135deg, #5b4b6e, #7a6788)",
              color: "#fff",
              fontWeight: 600,
            }}
          >
            {initialsFor(r) || <UserOutlined />}
          </Avatar>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontWeight: 600, fontSize: 14, color: "#2a2236" }}>
              {r.full_name || r.email?.split("@")[0] || "—"}
              {currentUserId === r.id && (
                <Tag
                  color="purple"
                  style={{
                    marginInlineStart: 8,
                    borderRadius: 999,
                    fontSize: 10,
                    padding: "0 8px",
                  }}
                >
                  זה את/ה
                </Tag>
              )}
            </span>
            <span style={{ fontSize: 12, color: "#7a6b78" }}>
              <MailOutlined style={{ marginInlineEnd: 4 }} />
              {r.email || "—"}
            </span>
          </div>
        </Space>
      ),
    },
    {
      key: "role",
      title: "תפקיד",
      width: 130,
      render: () => (
        <Tag
          icon={<CrownOutlined />}
          style={{
            background: "#fef3c7",
            border: "1px solid #fcd34d",
            color: "#92400e",
            borderRadius: 999,
            padding: "2px 12px",
            fontWeight: 500,
          }}
        >
          owner
        </Tag>
      ),
    },
    {
      key: "status",
      title: "סטטוס",
      width: 160,
      render: (_: unknown, r: DirectoryRow) => {
        if (!r.is_confirmed) {
          return (
            <Tag
              style={{
                background: "#fff7ed",
                border: "1px solid #fed7aa",
                color: "#9a3412",
                borderRadius: 999,
                padding: "2px 12px",
                fontWeight: 500,
              }}
            >
              ממתין/ה לאישור הזמנה
            </Tag>
          );
        }
        if (r.is_banned || !r.is_active) {
          return (
            <Tag
              icon={<StopOutlined />}
              style={{
                background: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#991b1b",
                borderRadius: 999,
                padding: "2px 12px",
                fontWeight: 500,
              }}
            >
              מושבת
            </Tag>
          );
        }
        return (
          <Tag
            icon={<CheckCircleOutlined />}
            style={{
              background: "#dcfce7",
              border: "1px solid #86efac",
              color: "#166534",
              borderRadius: 999,
              padding: "2px 12px",
              fontWeight: 500,
            }}
          >
            פעיל/ה
          </Tag>
        );
      },
    },
    {
      key: "last_sign_in",
      title: "כניסה אחרונה",
      width: 160,
      render: (_: unknown, r: DirectoryRow) =>
        r.last_sign_in_at ? (
          <span style={{ fontSize: 12, color: "#3a2e36" }}>
            {formatDate(r.last_sign_in_at)}
          </span>
        ) : (
          <span style={{ color: "#a89aa3", fontSize: 12 }}>טרם נכנס/ה</span>
        ),
    },
    {
      key: "created_at",
      title: "נוסף בתאריך",
      width: 140,
      render: (_: unknown, r: DirectoryRow) => (
        <span style={{ fontSize: 12, color: "#7a6b78" }}>
          {formatDate(r.created_at)}
        </span>
      ),
    },
    {
      key: "actions",
      title: "פעולות",
      width: 220,
      render: (_: unknown, r: DirectoryRow) => {
        const isMe = currentUserId === r.id;
        const isActive = r.is_active && !r.is_banned;
        const baseBtn = {
          height: 28,
          borderRadius: 8,
          padding: "0 10px",
          fontSize: 12,
          fontWeight: 500,
        } as const;
        return (
          <Space size={6} wrap={false}>
            {!r.is_confirmed && (
              <Button
                size="small"
                icon={<SendOutlined />}
                loading={actingId === r.id}
                onClick={() => onResend(r)}
                title="שלח הזמנה שוב"
                style={{
                  ...baseBtn,
                  borderColor: "#fcd34d",
                  color: "#92400e",
                  background: "#fef3c7",
                }}
              >
                שלח שוב
              </Button>
            )}
            <Popconfirm
              title={isActive ? "להשבית את המשתמש?" : "להפעיל את המשתמש שוב?"}
              description={
                isActive
                  ? "המשתמש לא יוכל להיכנס למערכת עד הפעלה מחדש."
                  : "המשתמש יוכל להיכנס שוב למערכת."
              }
              okText={isActive ? "השבת" : "הפעל"}
              cancelText="ביטול"
              okButtonProps={{ danger: isActive }}
              onConfirm={() => onToggleActive(r)}
              disabled={isMe}
            >
              <Button
                size="small"
                icon={isActive ? <StopOutlined /> : <CheckCircleOutlined />}
                loading={actingId === r.id}
                disabled={isMe}
                title={
                  isMe
                    ? "אי אפשר להשבית את עצמך"
                    : isActive
                    ? "השבת"
                    : "הפעל"
                }
                style={
                  isMe
                    ? baseBtn
                    : isActive
                    ? {
                        ...baseBtn,
                        borderColor: "#fbbf24",
                        color: "#a16207",
                        background: "#fffbeb",
                      }
                    : {
                        ...baseBtn,
                        borderColor: "#86efac",
                        color: "#166534",
                        background: "#dcfce7",
                      }
                }
              >
                {isActive ? "השבת" : "הפעל"}
              </Button>
            </Popconfirm>
            <Popconfirm
              title="למחוק את המשתמש?"
              description={
                <div style={{ maxWidth: 280 }}>
                  פעולה זו תמחק את המשתמש לצמיתות מ-Supabase Auth ולא ניתן לבטלה.
                  כדי לאפשר גישה שוב צריך לשלוח הזמנה חדשה.
                </div>
              }
              okText="מחק לצמיתות"
              cancelText="ביטול"
              okButtonProps={{ danger: true }}
              onConfirm={() => onDelete(r)}
              disabled={isMe}
            >
              <Button
                size="small"
                icon={<DeleteOutlined />}
                loading={actingId === r.id}
                disabled={isMe}
                title={isMe ? "אי אפשר למחוק את עצמך" : "מחק"}
                style={
                  isMe
                    ? baseBtn
                    : {
                        ...baseBtn,
                        borderColor: "#fca5a5",
                        color: "#991b1b",
                        background: "#fef2f2",
                      }
                }
              >
                מחק
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <PageShell
      business="neutral"
      eyebrow="ניהול גישה"
      title="ניהול משתמשים"
      subtitle="הזמנת משתמשים חדשים, השבתה ומחיקה. כל משתמש מקבל מייל הזמנה ומגדיר סיסמה אישית."
      toolbar={
        <Space>
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={() => setInviteOpen(true)}
            style={{ borderRadius: 12, fontWeight: 600 }}
          >
            הזמן משתמש חדש
          </Button>
          <Tooltip title="רענון">
            <Button
              icon={<ReloadOutlined />}
              onClick={load}
              loading={loading}
              style={{ borderRadius: 12 }}
            />
          </Tooltip>
        </Space>
      }
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          padding: 8,
          border: "1px solid #e2dcec",
          boxShadow:
            "0 1px 0 rgba(0,0,0,0.02), 0 8px 28px -16px rgba(60,40,90,0.1)",
        }}
      >
        <Table
          dataSource={rows}
          rowKey="id"
          columns={columns as never}
          loading={loading}
          pagination={{ pageSize: 25, position: ["bottomCenter"] }}
          scroll={{ x: "max-content" }}
          locale={{
            emptyText: (
              <div style={{ padding: 40, color: "#7a6b78" }}>
                עדיין אין משתמשים. לחצי "הזמן משתמש חדש" כדי להתחיל.
              </div>
            ),
          }}
        />
      </div>

      <Modal
        title="הזמנת משתמש חדש"
        open={inviteOpen}
        onCancel={() => {
          setInviteOpen(false);
          form.resetFields();
        }}
        footer={null}
        destroyOnClose
        centered
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onInvite}
          requiredMark={false}
          style={{ marginTop: 12 }}
        >
          <Form.Item
            label="מייל"
            name="email"
            rules={[
              { required: true, message: "חובה להכניס מייל" },
              { type: "email", message: "מייל לא תקין" },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="user@example.com"
              autoFocus
              size="large"
            />
          </Form.Item>
          <Form.Item label="שם מלא (לא חובה)" name="full_name">
            <Input placeholder="לדוגמה: יפית כהן" size="large" />
          </Form.Item>
          <div
            style={{
              background: "#f6f3fb",
              border: "1px solid #e2dcec",
              borderRadius: 10,
              padding: "10px 14px",
              fontSize: 12,
              color: "#5b4b6e",
              marginBottom: 16,
            }}
          >
            יישלח מייל הזמנה עם קישור להגדרת סיסמה. הקישור תקף 24 שעות.
          </div>
          <Space style={{ width: "100%", justifyContent: "flex-end" }}>
            <Button
              onClick={() => {
                setInviteOpen(false);
                form.resetFields();
              }}
            >
              ביטול
            </Button>
            <Button type="primary" htmlType="submit" loading={inviting}>
              שלח הזמנה
            </Button>
          </Space>
        </Form>
      </Modal>
    </PageShell>
  );
};
