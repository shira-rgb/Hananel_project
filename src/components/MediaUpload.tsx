import { useEffect, useState } from "react";
import { Upload, Button, Progress, Alert, Popconfirm, Typography } from "antd";
import { UploadOutlined, CheckCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import type { UploadFile, RcFile } from "antd/es/upload";
import { supabaseClient } from "../supabaseClient";

const { Text } = Typography;

const MAX_VIDEO_SIZE = 15 * 1024 * 1024; // 15MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png"];
const ALLOWED_VIDEO_TYPES = ["video/mp4"];

interface MediaUploadProps {
  onUploadComplete: (values: {
    file_url: string;
    file_name: string;
    file_type: "image" | "video";
    mime_type: string;
    file_size_bytes: number;
  }) => void;
  initialUrl?: string;
  initialFileName?: string;
  onFileRemove?: (publicUrl?: string) => Promise<void> | void;
}

export const MediaUpload = ({
  onUploadComplete,
  initialUrl,
  initialFileName,
  onFileRemove,
}: MediaUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [removing, setRemoving] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; url: string } | null>(
    initialUrl && initialFileName ? { name: initialFileName, url: initialUrl } : null
  );

  useEffect(() => {
    if (initialUrl && initialFileName) {
      setUploadedFile({ name: initialFileName, url: initialUrl });
    } else {
      setUploadedFile(null);
    }
  }, [initialUrl, initialFileName]);

  const validateFile = (file: RcFile): string | null => {
    const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
    const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);

    if (!isImage && !isVideo) {
      return `סוג קובץ לא נתמך (${file.type}). מותר: PNG, JPEG לתמונות או MP4 לסרטונים.`;
    }
    if (isVideo && file.size > MAX_VIDEO_SIZE) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      return `הסרטון גדול מדי (${sizeMB}MB). הגבלת וואצאפ היא 15MB.`;
    }
    return null;
  };

  const handleUpload = async (file: RcFile): Promise<boolean> => {
    setError(null);

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return false;
    }

    setUploading(true);
    setProgress(10);

    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    try {
      setProgress(40);
      const { data, error: uploadError } = await supabaseClient.storage
        .from("media")
        .upload(path, file, { contentType: file.type, upsert: false });

      if (uploadError) throw uploadError;

      setProgress(80);
      const { data: urlData } = supabaseClient.storage.from("media").getPublicUrl(data.path);

      setProgress(100);
      setUploadedFile({ name: file.name, url: urlData.publicUrl });

      const fileType = ALLOWED_IMAGE_TYPES.includes(file.type) ? "image" : "video";
      onUploadComplete({
        file_url: urlData.publicUrl,
        file_name: file.name,
        file_type: fileType,
        mime_type: file.type,
        file_size_bytes: file.size,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "שגיאה בהעלאה";
      setError(`שגיאה בהעלאה: ${message}`);
    } finally {
      setUploading(false);
    }

    return false; // prevent default antd upload behavior
  };

  const handleRemove = async () => {
    if (!uploadedFile) return;
    setRemoving(true);
    try {
      if (onFileRemove) {
        await onFileRemove(uploadedFile.url);
      }
      setUploadedFile(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "שגיאה במחיקה";
      setError(`שגיאה במחיקה: ${msg}`);
    } finally {
      setRemoving(false);
    }
  };

  const uploadProps = {
    beforeUpload: handleUpload,
    showUploadList: false,
    accept: ".jpg,.jpeg,.png,.mp4",
    fileList: [] as UploadFile[],
  };

  return (
    <div>
      <Alert
        type="info"
        showIcon
        style={{ marginBottom: 12 }}
        message="הגבלות וואצאפ"
        description="תמונות: PNG / JPEG בלבד | סרטונים: MP4 בלבד, עד 15MB"
      />

      {error && (
        <Alert
          type="error"
          showIcon
          closable
          message={error}
          style={{ marginBottom: 12 }}
          onClose={() => setError(null)}
        />
      )}

      {uploadedFile && (
        <div style={{ marginBottom: 12, padding: "8px 12px", background: "#f6ffed", borderRadius: 8, border: "1px solid #b7eb8f", display: "flex", alignItems: "center", gap: 8 }}>
          <CheckCircleOutlined style={{ color: "#52c41a" }} />
          <Text style={{ flex: 1 }} ellipsis>{uploadedFile.name}</Text>
        </div>
      )}

      <div style={{ display: "flex", gap: 8 }}>
        <Upload {...uploadProps} style={{ flex: 1 }}>
          <Button icon={<UploadOutlined />} loading={uploading} size="large" style={{ width: "100%" }}>
            {uploadedFile ? "החלף מדיה" : "בחר מדיה להעלאה"}
          </Button>
        </Upload>

        {uploadedFile && onFileRemove && (
          <Popconfirm
            title="מחיקת מדיה"
            description="האם את/ה בטוח/ה שברצונך למחוק את הקובץ? הפרטים האחרים יישמרו."
            okText="מחק"
            cancelText="ביטול"
            okButtonProps={{ danger: true }}
            onConfirm={handleRemove}
          >
            <Button danger icon={<DeleteOutlined />} loading={removing} size="large">
              מחק מדיה
            </Button>
          </Popconfirm>
        )}
      </div>

      {uploading && (
        <Progress percent={progress} style={{ marginTop: 8 }} />
      )}
    </div>
  );
};
