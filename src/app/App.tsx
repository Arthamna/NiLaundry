import { useState } from "react";
import { RouteKey, Sidebar } from "./components/layout/Shell";
import { DashboardPage } from "./pages/DashboardPage";
import { OrderDetailDrawer, OrdersPage } from "./pages/OrdersPage";
import { CustomersPage } from "./pages/CustomersPage";
import { CouriersPage } from "./pages/CouriersPage";
import { PaymentsPage } from "./pages/PaymentsPage";
import { VouchersPage } from "./pages/VouchersPage";
import { NotificationsPage } from "./pages/NotificationsPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { CustomerPortalPage } from "./pages/CustomerPortalPage";

export default function App() {
  const [route, setRoute] = useState<RouteKey>("dashboard");
  const [openOrder, setOpenOrder] = useState<string | null>(null);

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900" style={{ fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif" }}>
      <Sidebar route={route} onNavigate={(r) => { setRoute(r); setOpenOrder(null); }} />
      <main className="flex h-screen min-w-0 flex-1 flex-col">
        {route === "dashboard"      && <DashboardPage />}
        {route === "orders"         && <OrdersPage onOpenOrder={setOpenOrder} />}
        {route === "customers"      && <CustomersPage />}
        {route === "couriers"       && <CouriersPage />}
        {route === "payments"       && <PaymentsPage />}
        {route === "vouchers"       && <VouchersPage />}
        {route === "notifications"  && <NotificationsPage />}
        {route === "analytics"      && <AnalyticsPage />}
        {route === "settings"       && <SettingsPage />}
        {route === "customer-portal" && <CustomerPortalPage />}
      </main>

      {openOrder && <OrderDetailDrawer orderId={openOrder} onClose={() => setOpenOrder(null)} />}
    </div>
  );
}
