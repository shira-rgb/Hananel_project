import type { ThemeConfig } from "antd";

export const theme: ThemeConfig = {
  token: {
    colorPrimary: "#7C6B8B",
    colorSuccess: "#52c41a",
    colorWarning: "#faad14",
    colorError: "#ff4d4f",
    colorInfo: "#4A90B8",
    borderRadius: 8,
    fontFamily: "'Heebo', 'Arial', sans-serif",
    fontSize: 14,
    colorBgContainer: "#ffffff",
    colorBgLayout: "#f5f3f7",
  },
  components: {
    Layout: {
      siderBg: "#2D2438",
      triggerBg: "#3D3048",
    },
    Menu: {
      darkItemBg: "#2D2438",
      darkSubMenuItemBg: "#241E30",
      darkItemSelectedBg: "#7C6B8B",
      darkItemHoverBg: "#3D3048",
    },
    Card: {
      borderRadiusLG: 12,
    },
    Button: {
      borderRadius: 8,
    },
  },
};
