import { useState } from "react";
import { Upload, Button, Progress, Alert, Typography } from "antd";
import { UploadOutlined, CheckCircleOutlined } from "@ant-design/icons";
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
}

export const MediaUpload = ({ onUploadComplete, initialUrl, initialFileName }: MediaUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; url: string } | null>(
    initialUrl && initialFileName ? { name: initialFileName, url: initialUrl } : null
  );

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

      <Upload {...uploadProps}>
        <Button icon={<UploadOutlined />} loading={uploading} size="large" style={{ width: "100%" }}>
          {uploadedFile ? "החלף קובץ" : "בחר קובץ להעלאה"}
        </Button>
      </Upload>

      {uploading && (
        <Progress percent={progress} style={{ marginTop: 8 }} />
      )}
    </div>
  );
};
