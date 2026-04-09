import { Authenticated, Refine } from "@refinedev/core";
import { ThemedLayout, ThemedSider, useNotificationProvider } from "@refinedev/antd";
import { dataProvider, liveProvider } from "@refinedev/supabase";
import routerBindings, {
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import React from "react";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { ConfigProvider } from "antd";
import heIL from "antd/locale/he_IL";
import "@refinedev/antd/dist/reset.css";

import { supabaseClient } from "./supabaseClient";
import { authProvider } from "./authProvider";
import { theme } from "./theme";
import "./index.css";

import { LoginPage } from "./pages/login";

// Aesthetic pages
import { AestheticMediaList } from "./pages/aesthetic/media/list";
import { AestheticMediaCreate } from "./pages/aesthetic/media/create";
import { AestheticMediaEdit } from "./pages/aesthetic/media/edit";
import { AestheticProductList } from "./pages/aesthetic/products/list";
import { AestheticProductCreate } from "./pages/aesthetic/products/create";
import { AestheticProductEdit } from "./pages/aesthetic/products/edit";
import { AestheticFollowupList } from "./pages/aesthetic/followup/list";
import { AestheticFollowupCreate } from "./pages/aesthetic/followup/create";
import { AestheticFollowupEdit } from "./pages/aesthetic/followup/edit";
import { AestheticClientList } from "./pages/aesthetic/clients/list";
import { AestheticClientCreate } from "./pages/aesthetic/clients/create";
import { AestheticClientEdit } from "./pages/aesthetic/clients/edit";

// Dental pages
import { DentalMediaList } from "./pages/dental/media/list";
import { DentalMediaCreate } from "./pages/dental/media/create";
import { DentalMediaEdit } from "./pages/dental/media/edit";
import { DentalProductList } from "./pages/dental/products/list";
import { DentalProductCreate } from "./pages/dental/products/create";
import { DentalProductEdit } from "./pages/dental/products/edit";
import { DentalFollowupList } from "./pages/dental/followup/list";
import { DentalFollowupCreate } from "./pages/dental/followup/create";
import { DentalFollowupEdit } from "./pages/dental/followup/edit";
import { DentalClientList } from "./pages/dental/clients/list";
import { DentalClientCreate } from "./pages/dental/clients/create";
import { DentalClientEdit } from "./pages/dental/clients/edit";
import { DentalDoctorList } from "./pages/dental/doctor/list";
import { DentalDoctorCreate } from "./pages/dental/doctor/create";
import { DentalDoctorEdit } from "./pages/dental/doctor/edit";

// FAQ pages
import { AestheticFAQList } from "./pages/aesthetic/faq/list";
import { AestheticFAQCreate } from "./pages/aesthetic/faq/create";
import { AestheticFAQEdit } from "./pages/aesthetic/faq/edit";
import { DentalFAQList } from "./pages/dental/faq/list";
import { DentalFAQCreate } from "./pages/dental/faq/create";
import { DentalFAQEdit } from "./pages/dental/faq/edit";

// Business info pages
import { AestheticBusinessList } from "./pages/aesthetic/business/list";
import { AestheticBusinessCreate } from "./pages/aesthetic/business/create";
import { AestheticBusinessEdit } from "./pages/aesthetic/business/edit";
import { DentalBusinessList } from "./pages/dental/business/list";
import { DentalBusinessCreate } from "./pages/dental/business/create";
import { DentalBusinessEdit } from "./pages/dental/business/edit";

function App() {
  return (
    <BrowserRouter>
      <ConfigProvider
        direction="rtl"
        locale={heIL}
        theme={theme}
      >
        <Refine
          dataProvider={dataProvider(supabaseClient)}
          liveProvider={liveProvider(supabaseClient)}
          authProvider={authProvider}
          routerProvider={routerBindings}
          notificationProvider={useNotificationProvider}
          resources={[
            // ── קליניקת אסתטיקה ──
            {
              name: "aesthetic_section",
              meta: { label: "✨ קליניקת אסתטיקה", route: "aesthetic" },
            },
            {
              name: "aesthetic_media",
              list: "/aesthetic/media",
              create: "/aesthetic/media/create",
              edit: "/aesthetic/media/edit/:id",
              meta: { label: "מדיה", parent: "aesthetic_section" },
            },
            {
              name: "aesthetic_products",
              list: "/aesthetic/products",
              create: "/aesthetic/products/create",
              edit: "/aesthetic/products/edit/:id",
              meta: { label: "מוצרים ומחירון", parent: "aesthetic_section" },
            },
            {
              name: "aesthetic_followup_messages",
              list: "/aesthetic/followup",
              create: "/aesthetic/followup/create",
              edit: "/aesthetic/followup/edit/:id",
              meta: { label: "הודעות פולואפ", parent: "aesthetic_section" },
            },
            {
              name: "aesthetic_clients",
              list: "/aesthetic/clients",
              create: "/aesthetic/clients/create",
              edit: "/aesthetic/clients/edit/:id",
              meta: { label: "לקוחות", parent: "aesthetic_section", hide: true },
            },
            {
              name: "aesthetic_faq",
              list: "/aesthetic/faq",
              create: "/aesthetic/faq/create",
              edit: "/aesthetic/faq/edit/:id",
              meta: { label: "שאלות ותשובות", parent: "aesthetic_section" },
            },
            {
              name: "aesthetic_business_info",
              list: "/aesthetic/business",
              create: "/aesthetic/business/create",
              edit: "/aesthetic/business/edit/:id",
              meta: { label: "מידע על העסק", parent: "aesthetic_section" },
            },
            // ── מרפאת שיניים ──
            {
              name: "dental_section",
              meta: { label: "🦷 מרפאת שיניים", route: "dental" },
            },
            {
              name: "dental_media",
              list: "/dental/media",
              create: "/dental/media/create",
              edit: "/dental/media/edit/:id",
              meta: { label: "מדיה", parent: "dental_section" },
            },
            {
              name: "dental_products",
              list: "/dental/products",
              create: "/dental/products/create",
              edit: "/dental/products/edit/:id",
              meta: { label: "מוצרים ומחירון", parent: "dental_section" },
            },
            {
              name: "dental_followup_messages",
              list: "/dental/followup",
              create: "/dental/followup/create",
              edit: "/dental/followup/edit/:id",
              meta: { label: "הודעות פולואפ", parent: "dental_section" },
            },
            {
              name: "dental_clients",
              list: "/dental/clients",
              create: "/dental/clients/create",
              edit: "/dental/clients/edit/:id",
              meta: { label: "לקוחות", parent: "dental_section", hide: true },
            },
            {
              name: "dental_doctor_profile",
              list: "/dental/doctor",
              create: "/dental/doctor/create",
              edit: "/dental/doctor/edit/:id",
              meta: { label: "פרופיל רופא / פה ולסת", parent: "dental_section" },
            },
            {
              name: "dental_faq",
              list: "/dental/faq",
              create: "/dental/faq/create",
              edit: "/dental/faq/edit/:id",
              meta: { label: "שאלות ותשובות", parent: "dental_section" },
            },
            {
              name: "dental_business_info",
              list: "/dental/business",
              create: "/dental/business/create",
              edit: "/dental/business/edit/:id",
              meta: { label: "מידע על העסק", parent: "dental_section" },
            },
          ]}
          options={{ syncWithLocation: true, warnWhenUnsavedChanges: true }}
        >
          <Routes>
            <Route
              element={
                <Authenticated key="authenticated-layout" fallback={<Navigate to="/login" replace />}>
                  <ThemedLayout
                    Sider={() => (
                      <ThemedSider
                        Title={() => (
                          <div style={{ padding: "16px 12px", color: "#fff", fontWeight: 700, fontSize: 16 }}>
                            חנאנל
                          </div>
                        )}
                        render={({ items, logout }: { items: React.ReactNode; logout: React.ReactNode }) => (
                          <>
                            {items}
                            {logout}
                          </>
                        )}
                      />
                    )}
                  >
                    <Outlet />
                  </ThemedLayout>
                </Authenticated>
              }
            >
              <Route index element={<NavigateToResource resource="aesthetic_media" />} />

              {/* Aesthetic */}
              <Route path="/aesthetic/media" element={<AestheticMediaList />} />
              <Route path="/aesthetic/media/create" element={<AestheticMediaCreate />} />
              <Route path="/aesthetic/media/edit/:id" element={<AestheticMediaEdit />} />

              <Route path="/aesthetic/products" element={<AestheticProductList />} />
              <Route path="/aesthetic/products/create" element={<AestheticProductCreate />} />
              <Route path="/aesthetic/products/edit/:id" element={<AestheticProductEdit />} />

              <Route path="/aesthetic/followup" element={<AestheticFollowupList />} />
              <Route path="/aesthetic/followup/create" element={<AestheticFollowupCreate />} />
              <Route path="/aesthetic/followup/edit/:id" element={<AestheticFollowupEdit />} />

              <Route path="/aesthetic/clients" element={<AestheticClientList />} />
              <Route path="/aesthetic/clients/create" element={<AestheticClientCreate />} />
              <Route path="/aesthetic/clients/edit/:id" element={<AestheticClientEdit />} />

              <Route path="/aesthetic/faq" element={<AestheticFAQList />} />
              <Route path="/aesthetic/faq/create" element={<AestheticFAQCreate />} />
              <Route path="/aesthetic/faq/edit/:id" element={<AestheticFAQEdit />} />

              <Route path="/aesthetic/business" element={<AestheticBusinessList />} />
              <Route path="/aesthetic/business/create" element={<AestheticBusinessCreate />} />
              <Route path="/aesthetic/business/edit/:id" element={<AestheticBusinessEdit />} />

              {/* Dental */}
              <Route path="/dental/media" element={<DentalMediaList />} />
              <Route path="/dental/media/create" element={<DentalMediaCreate />} />
              <Route path="/dental/media/edit/:id" element={<DentalMediaEdit />} />

              <Route path="/dental/products" element={<DentalProductList />} />
              <Route path="/dental/products/create" element={<DentalProductCreate />} />
              <Route path="/dental/products/edit/:id" element={<DentalProductEdit />} />

              <Route path="/dental/followup" element={<DentalFollowupList />} />
              <Route path="/dental/followup/create" element={<DentalFollowupCreate />} />
              <Route path="/dental/followup/edit/:id" element={<DentalFollowupEdit />} />

              <Route path="/dental/clients" element={<DentalClientList />} />
              <Route path="/dental/clients/create" element={<DentalClientCreate />} />
              <Route path="/dental/clients/edit/:id" element={<DentalClientEdit />} />

              <Route path="/dental/doctor" element={<DentalDoctorList />} />
              <Route path="/dental/doctor/create" element={<DentalDoctorCreate />} />
              <Route path="/dental/doctor/edit/:id" element={<DentalDoctorEdit />} />

              <Route path="/dental/faq" element={<DentalFAQList />} />
              <Route path="/dental/faq/create" element={<DentalFAQCreate />} />
              <Route path="/dental/faq/edit/:id" element={<DentalFAQEdit />} />

              <Route path="/dental/business" element={<DentalBusinessList />} />
              <Route path="/dental/business/create" element={<DentalBusinessCreate />} />
              <Route path="/dental/business/edit/:id" element={<DentalBusinessEdit />} />
            </Route>

            <Route path="/login" element={<LoginPage />} />
          </Routes>

          <UnsavedChangesNotifier />
          <DocumentTitleHandler />
        </Refine>
      </ConfigProvider>
    </BrowserRouter>
  );
}

export default App;
