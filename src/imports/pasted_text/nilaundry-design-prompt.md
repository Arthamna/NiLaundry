# UI/UX DESIGN GENERATION PROMPT — NiLaundry Management System

Act as a Senior Product Designer, Senior UX Designer, Design System Architect, and SaaS Dashboard Specialist.

Design a complete high-fidelity UI system for a multi-branch laundry management platform called **NiLaundry**.

Create polished desktop-first interfaces with responsive mobile adaptations for customer-facing screens.

The design should look like a modern SaaS product similar to:

* Stripe Dashboard
* Linear
* Notion
* Shopify Admin
* Clerk Dashboard
* Uber Delivery Management

Avoid generic student-project layouts.

The application is intended for daily operational use and must prioritize speed, readability, operational monitoring, and data-driven decision making.

---

# VISUAL STYLE

Theme:

Modern SaaS Dashboard

Primary Color:

Laundry Teal / Emerald

* #0F766E
* #14B8A6
* #2DD4BF

Neutral Palette:

* White
* Slate 50
* Slate 100
* Slate 200
* Slate 500
* Slate 700
* Slate 900

Success:

Green

Warning:

Amber

Danger:

Red

Info:

Blue

---

# TYPOGRAPHY

Font:

Inter

Hierarchy:

* Page Title
* Section Title
* Card Heading
* Body Text
* Caption

Design must have:

* Strong visual hierarchy
* Comfortable spacing
* Large KPI cards
* Readable data tables
* Clear CTA buttons

---

# DESIGN SYSTEM

Create reusable components:

Navigation:

* Sidebar
* Collapsible Sidebar
* Top Navigation
* Breadcrumb

Inputs:

* Search Bar
* Select Dropdown
* Multi Select
* Date Range Picker
* Status Filter Chips

Data Display:

* Stat Cards
* KPI Cards
* Data Tables
* Charts
* Timeline
* Progress Tracker
* Activity Feed

Feedback:

* Toast
* Empty State
* Success State
* Error State
* Confirmation Dialog

Overlays:

* Modal
* Drawer
* Detail Panel

Badges:

* Active
* Processing
* Completed
* Pending
* Failed
* Paid
* Unpaid

---

# GLOBAL LAYOUT

Desktop Layout

Left Sidebar:

* Dashboard
* Orders
* Customers
* Couriers
* Payments
* Vouchers
* Notifications
* Analytics
* Settings

Top Bar:

* Search
* Notifications
* Branch Selector
* User Profile

Content Area:

* KPI Section
* Filters
* Data Visualization
* Data Table

---

# ORDER STATUS COLORS

MENUNGGU_PICKUP

Gray Badge

PICKUP

Blue Badge

DIPROSES

Amber Badge

DICUCI

Cyan Badge

DISETRIKA

Purple Badge

QC

Indigo Badge

SIAP_DIKIRIM

Orange Badge

DIKIRIM

Teal Badge

SELESAI

Green Badge

DIBATALKAN

Red Badge

---

# CUSTOMER EXPERIENCE

The customer interface should be mobile-first.

Use bottom navigation:

* Home
* Orders
* Voucher
* Notifications
* Profile

---

# FRAME 01 — CUSTOMER HOME DASHBOARD

Purpose:

Customer overview.

Layout:

Top Section:

* Greeting
* Membership Status
* Active Voucher Count

KPI Cards:

* Active Orders
* Completed Orders
* Saved Discounts

Section:

Active Order Tracker

Show:

* Order Number
* Current Status
* Progress Timeline
* Estimated Completion

Section:

Recent Notifications

Section:

Active Vouchers

Floating CTA:

Create New Order

Mobile Version Required

---

# FRAME 02 — CUSTOMER SEARCH & PROFILE

Purpose:

Customer profile and order history.

Layout:

Profile Card:

* Name
* Phone
* Email
* Address

Tabs:

* Order History
* Vouchers
* Reviews

Search Area:

Search customer by:

* Name
* Phone Number

Table:

Order History

Columns:

* Order ID
* Date
* Status
* Total Payment

---

# FRAME 03 — ORDER DETAIL

Purpose:

Complete order tracking.

Layout:

Header:

Order Number

Status Badge

Timeline Component:

* Pickup Assigned
* Pickup Completed
* Processing
* Washing
* Ironing
* QC
* Delivery
* Completed

Card:

Laundry Services

Columns:

* Service Name
* Quantity
* Unit
* Subtotal

Payment Card:

* Payment Method
* Payment Status
* Total Amount

Courier Card:

* Courier Name
* Vehicle
* Delivery Timeline

---

# FRAME 04 — NOTIFICATIONS INBOX

Purpose:

Customer notification center.

Layout:

Search Notification

Filter:

* All
* Unread
* Read

List Item:

* Icon
* Title
* Message Preview
* Timestamp

Unread notifications highlighted.

---

# FRAME 05 — VOUCHER CENTER

Purpose:

Voucher management.

Layout:

Voucher Cards

Display:

* Voucher Code
* Discount Value
* Expiry Date
* Remaining Quota

Action:

Apply Voucher

Show:

Active
Used
Expired

Tabs

---

# FRAME 06 — REVIEW & RATING

Purpose:

Customer review submission.

Layout:

Rating Component:

5 Stars

Form:

* Review Text
* Upload Image

History Section:

Previous Reviews

Average Rating Summary

---

# FRAME 07 — OPERATIONAL DASHBOARD

Target:

Laundry Staff

Purpose:

Operational monitoring.

Top KPI:

* Incoming Orders
* Orders Processing
* Orders Completed Today
* Active Couriers

Charts:

* Orders Per Hour
* Processing Capacity

Table:

Active Orders

Columns:

* Order ID
* Customer
* Branch
* Status
* Deadline

---

# FRAME 08 — ORDER QUEUE

Purpose:

Queue management.

Layout:

Priority Queue Table

Filters:

* Status
* Branch
* Date
* Priority

Columns:

* Order ID
* Customer
* Service Count
* Estimated Finish
* Priority Level

Sticky Action Buttons:

* Process
* Assign
* Update Status

---

# FRAME 09 — UPDATE ORDER STATUS DRAWER

Purpose:

Quick operational action.

Right Side Drawer.

Fields:

* Current Status
* New Status
* Estimated Completion

Buttons:

* Save
* Cancel

Show order summary above form.

---

# FRAME 10 — PAYMENT DETAIL & AUDIT

Purpose:

Payment monitoring.

KPI Cards:

* Paid Orders
* Unpaid Orders
* Failed Payments

Filters:

* Payment Method
* Status
* Branch

Table:

* Invoice
* Customer
* Method
* Amount
* Status
* Date

---

# FRAME 11 — COURIER & DELIVERY MONITOR

Purpose:

Courier monitoring.

KPI:

* Active Couriers
* Deliveries Today
* Pickup Tasks

Table:

* Courier
* Vehicle
* Active Task
* Status
* Delivery Count

Map Widget:

Courier Locations

---

# FRAME 12 — MANAGEMENT OVERVIEW

Purpose:

Executive Dashboard.

Large KPI Cards:

* Revenue Today
* Revenue This Month
* Orders Today
* Average Rating
* Active Customers

Charts:

* Revenue Trend
* Order Trend

---

# FRAME 13 — SERVICES ANALYTICS

Purpose:

Service performance analysis.

Charts:

* Top Services
* Service Usage Trend
* Revenue By Service

Table:

Service Ranking

---

# FRAME 14 — EMPLOYEE WORKLOAD

Purpose:

Employee productivity.

Heatmap:

Employee Load

Table:

* Employee
* Branch
* Active Orders
* Completed Orders
* Performance Score

---

# FRAME 15 — REVIEW ANALYTICS

Purpose:

Customer satisfaction monitoring.

Charts:

* Rating Distribution
* Monthly Rating Trend

Review Feed:

* Customer
* Rating
* Comment

Sentiment Indicators

---

# FRAME 16 — BRANCH PERFORMANCE

Purpose:

Branch comparison.

KPI:

* Revenue
* Orders
* Ratings

Charts:

Comparison by Branch

Table:

Branch Ranking

---

# FRAME 17 — PAYMENT METHOD REPORT

Purpose:

Payment analysis.

Pie Chart:

* QRIS
* Debit
* Cash

Trend Chart:

Payment Volume

Table:

Payment Transactions

---

# FRAME 18 — BRANCH & COURIER MONITORING

Purpose:

Logistics monitoring.

Cards:

Top Couriers

Top Branches

Charts:

Delivery Performance

Table:

* Courier
* Vehicle
* Pickup Count
* Delivery Count
* Success Rate

---

# RESPONSIVE REQUIREMENTS

Generate:

1 Desktop Layout (1440px)

1 Tablet Layout (1024px)

1 Mobile Layout (390px)

Customer pages must have dedicated mobile screens.

---

# FINAL OUTPUT

Generate all frames as high-fidelity UI mockups.

Include:

* Realistic dummy data
* Modern SaaS styling
* Design system consistency
* Auto Layout
* Component Variants
* Proper spacing system
* Light mode
* Premium enterprise appearance

All frames should be presentation-ready and suitable for direct import into Figma.
