import { useTable, List, DeleteButton, EditButton } from "@refinedev/antd";
import { Table, Tag, Space, Popover, Checkbox, Button } from "antd";
import { CheckOutlined, CloseOutlined, SettingOutlined } from "@ant-design/icons";
import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { Doctor } from "../../interfaces";

type ColKey = "specialty" | "gender" | "experience" | "education" | "languages" | "working_hours" | "accepting_new_patients";

const COLUMN_DEFS: { key: ColKey; label: string; defaultVisible: boolean }[] = [
  { key: "specialty",              label: "תחום",            defaultVisible: true  },
  { key: "gender",                 label: "מגדר",            defaultVisible: true  },
  { key: "experience",             label: "ניסיון",          defaultVisible: true  },
  { key: "education",              label: "השכלה",           defaultVisible: false },
  { key: "languages",              label: "שפות",            defaultVisible: true  },
  { key: "working_hours",          label: "ימים ושעות",      defaultVisible: true  },
  { key: "accepting_new_patients", label: "מקבל מטופלים",   defaultVisible: true  },
];

export const DoctorList = () => {
  const navigate = useNavigate();
  const { tableProps } = useTable<Doctor>({
    resource: "doctors",
    sorters: { initial: [{ field: "name", order: "asc" }] },
  });

  const [visibleCols, setVisibleCols] = useState<Set<ColKey>>(
    new Set(COLUMN_DEFS.filter((c) => c.defaultVisible).map((c) => c.key))
  );
  const toggleCol = useCallback((key: ColKey, checked: boolean) => {
    setVisibleCols((prev) => { const n = new Set(prev); checked ? n.add(key) : n.delete(key); return n; });
  }, []);
  const vis = (key: ColKey) => visibleCols.has(key);

  const colVisibilityContent = (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 160 }}>
      {COLUMN_DEFS.map((col) => (
        <Checkbox key={col.key} checked={visibleCols.has(col.key)} onChange={(e) => toggleCol(col.key, e.target.checked)}>
          {col.label}
        </Checkbox>
      ))}
    </div>
  );

  const columns = useMemo(() => [
    { key: "name", title: "שם", dataIndex: "name", width: 150 },
    vis("specialty") && { key: "specialty", title: "תחום", dataIndex: "specialty", width: 140 },
    vis("gender") && { key: "gender", title: "מגדר", dataIndex: "gender", width: 80 },
    vis("experience") && { key: "experience", title: "ניסיון", dataIndex: "experience", width: 130 },
    vis("education") && { key: "education", title: "השכלה", dataIndex: "education", width: 160 },
    vis("languages") && { key: "languages", title: "שפות", dataIndex: "languages", width: 130 },
    vis("working_hours") && {
      key: "working_hours", title: "ימים ושעות", dataIndex: "working_hours", width: 160,
      render: (text: string) => (
        <div style={{ maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={text}>{text}</div>
      ),
    },
    vis("accepting_new_patients") && {
      key: "accepting_new_patients", title: "מקבל מטופלים", dataIndex: "accepting_new_patients", width: 130,
      render: (v: boolean) =>
        v ? <Tag icon={<CheckOutlined />} color="success">כן</Tag>
          : <Tag icon={<CloseOutlined />} color="default">לא</Tag>,
    },
    {
      key: "actions", title: "פעולות", width: 90,
      render: (_: unknown, record: Doctor) => (
        <Space>
          <EditButton hideText size="small" recordItemId={record.id} />
          <DeleteButton hideText size="small" recordItemId={record.id} />
        </Space>
      ),
    },
  ].filter(Boolean), [visibleCols]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <List
      title="רופאים"
      createButtonProps={{ children: "הוסף רופא" }}
      headerButtons={({ defaultButtons }) => (
        <>
          {defaultButtons}
          <Popover content={colVisibilityContent} title="הצג עמודות" trigger="click" placement="bottomLeft">
            <Button icon={<SettingOutlined />}>עמודות</Button>
          </Popover>
        </>
      )}
    >
      <Table
        {...tableProps}
        rowKey="id"
        columns={columns as any}
        scroll={{ x: "max-content" }}
        onRow={(record: Doctor) => ({
          onClick: (e) => {
            const target = e.target as HTMLElement;
            if (target.closest("button") || target.closest(".ant-btn")) return;
            navigate(`/doctors/edit/${record.id}`);
          },
          style: { cursor: "pointer" },
        })}
      />
    </List>
  );
};
