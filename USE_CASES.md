# System Use Case Specifications & Requirement Diagrams

**Project:** Jammu Makrana Transport & Komal Minerals Supplier  
**Architecture:** MERN Web Platform (React 19 SPA, Node.js Express API, MongoDB Atlas)

---

## 1. Master System Use Case Diagram

The following diagram illustrates all primary actors and their interactions across the platform subsystems:

![Master System Use Case Diagram](image/use_case_diagram.png)

> **Image Formats:**
> - [High-Resolution Master Diagram (PNG)](image/use_case_diagram.png)
> - [Scalable Vector Master Diagram (SVG)](image/use_case_diagram.svg)
> - [Interactive Web Viewer](image/index.html)

---

## 2. Requirement 1: Freight Transportation & Logistics Booking

Handles road freight consignment bookings, route validation, vehicle fleet allocation, and status tracking for heavy stone and mineral cargo.

![Requirement 1: Freight Transportation Use Case](image/use_case_transportation.png)

* **Associated Files:** [`client/src/pages/Transportation.jsx`](file:///c:/Users/chand/Desktop/Project/client/src/pages/Transportation.jsx), [`api/routes/orders.js`](file:///c:/Users/chand/Desktop/Project/api/routes/orders.js), [`api/models/Order.js`](file:///c:/Users/chand/Desktop/Project/api/models/Order.js)

### Use Case Specifications

| Use Case ID | Name | Primary Actor | Description & Pre/Post Conditions |
| :--- | :--- | :--- | :--- |
| **UC-TR-01** | **Enter Route & Address Coordinates** | Consignor (Shipper) | User enters sender contact, pickup city/address/PIN, and destination delivery address with state validation. |
| **UC-TR-02** | **Select Mineral Cargo & Tonnage** | Consignor (Shipper) | Consignor inputs freight type (e.g. Makrana Marble slabs, Dolomite, Quartzite, Mineral Powder) and tonnage weight. |
| **UC-TR-03** | **Choose Transport Vehicle Fleet** | Consignor (Shipper) | Selects suitable commercial fleet (Multi-Axle Trailer, Heavy 16-Wheeler, Open Body Truck, Eicher). |
| **UC-TR-04** | **Generate JMT Consignment ID** | System / Consignor | System validates payload, verifies non-empty fields, and assigns a unique tracking identifier (e.g. `JMT-MDN18-4912`). |
| **UC-TR-05** | **Validate Route & Load Capacity** | JMT Fleet Dispatcher | Dispatcher reviews pickup/drop route feasibility, toll permits, interstate regulations, and weight compliance. |
| **UC-TR-06** | **Update Transit Tracking Status** | JMT Fleet Dispatcher | Dispatcher updates shipment state (`new` &rarr; `confirmed` &rarr; `in_transit` &rarr; `completed` &rarr; `cancelled`). |

---

## 3. Requirement 2: Natural Stone Catalogue & B2B Procurement

Enables architects, builders, and marble buyers to inspect natural marble varieties, surface finishes, textures, and request bulk price quotes.

![Requirement 2: Stone Catalogue & Quotes Use Case](image/use_case_catalog.png)

* **Associated Files:** [`client/src/pages/StoneRange.jsx`](file:///c:/Users/chand/Desktop/Project/client/src/pages/StoneRange.jsx), [`client/src/pages/StoneDetail.jsx`](file:///c:/Users/chand/Desktop/Project/client/src/pages/StoneDetail.jsx), [`client/src/pages/StoneProducts.jsx`](file:///c:/Users/chand/Desktop/Project/client/src/pages/StoneProducts.jsx), [`api/routes/stones.js`](file:///c:/Users/chand/Desktop/Project/api/routes/stones.js), [`api/models/Stone.js`](file:///c:/Users/chand/Desktop/Project/api/models/Stone.js)

### Use Case Specifications

| Use Case ID | Name | Primary Actor | Description & Pre/Post Conditions |
| :--- | :--- | :--- | :--- |
| **UC-SC-01** | **Browse Stone Portfolio & Marble Range** | Buyer / Architect | User views curated Makrana marbles (White, Dungri, Kumari, Albeta) and industrial minerals. |
| **UC-SC-02** | **Filter by Applications & Finishes** | Buyer / Architect | Dynamic filtering by usage (Flooring, Cladding, Countertops, Elevation, Temple Work). |
| **UC-SC-03** | **Inspect High-Res Texture & Origin** | Buyer / Architect | Inspects close-up mineral patterns, geological origin, durability, and finishing types (Polished, Honed, Leather). |
| **UC-SC-04** | **Request Stone Quote / Sample** | Buyer / Architect | Submits quotation inquiry with stone of interest pre-filled (`stoneOfInterest: slug`). |
| **UC-SC-05** | **Manage Stone Catalog & Finishes** | Quarry Sales Manager | Komal Minerals administrator manages stone descriptions, categories, specifications, and imagery. |
| **UC-SC-06** | **Review Customer Leads & Quotes** | Quarry Sales Manager | Reviews contact submissions received via `/api/enquiries` and initiates B2B price negotiation. |

---

## 4. Requirement 3: Direct Customer Communication & Quick-Action Support

Provides immediate contact pathways to eliminate friction in high-value marble and freight deals.

* **Associated Files:** [`client/src/components/FloatingWidgets.jsx`](file:///c:/Users/chand/Desktop/Project/client/src/components/FloatingWidgets.jsx), [`client/src/pages/Contact.jsx`](file:///c:/Users/chand/Desktop/Project/client/src/pages/Contact.jsx), [`api/routes/enquiries.js`](file:///c:/Users/chand/Desktop/Project/api/routes/enquiries.js)

| Use Case ID | Name | Actors | Business Action |
| :--- | :--- | :--- | :--- |
| **UC-CC-01** | **Instant WhatsApp Quick-Connect** | Customer, Sales Team | Launches WhatsApp Web / App with pre-drafted context message to the business phone (`+91 94143 11116`). |
| **UC-CC-02** | **One-Touch Phone Call Dialer** | Customer, Logistics Desk | Triggers native `tel:` protocol dialing directly to firm operations. |
| **UC-CC-03** | **Submit General Inquiry / Contact Form** | Customer, Sales Agent | Customer submits name, phone, email, subject, and project requirements; saved to MongoDB with fallback. |

---

## 5. Requirement 4: System Administration & Offline Resiliency

Ensures continuous availability, database health monitoring, and offline catalog browsing.

* **Associated Files:** [`api/lib/db.js`](file:///c:/Users/chand/Desktop/Project/api/lib/db.js), [`api/data/stones.js`](file:///c:/Users/chand/Desktop/Project/api/data/stones.js), [`api/seed.js`](file:///c:/Users/chand/Desktop/Project/api/seed.js)

| Use Case ID | Name | Actors | Function |
| :--- | :--- | :--- | :--- |
| **UC-SA-01** | **Monitor Serverless API & DB Health** | Platform Administrator | Calls `/api/health` endpoint to check Express server status and MongoDB pool connectivity. |
| **UC-SA-02** | **Sync Static Catalogue Fallback** | Platform Administrator | If MongoDB Atlas is unavailable, API automatically delivers offline seed data from `api/data/stones.js`. |
| **UC-SA-03** | **Seed / Upsert MongoDB Atlas Data** | Platform Administrator | Executes `npm run seed` to load or refresh all 10 stone varieties into the cloud database. |

---

## 6. Requirements-to-Implementation Traceability Matrix

| Requirement Domain | Use Cases Covered | Frontend UI Component | Backend Route / Controller | Data Model / Store |
| :--- | :--- | :--- | :--- | :--- |
| **Transportation Booking** | UC-TR-01 through UC-TR-06 | [`Transportation.jsx`](file:///c:/Users/chand/Desktop/Project/client/src/pages/Transportation.jsx) | `POST /api/orders` | [`Order.js`](file:///c:/Users/chand/Desktop/Project/api/models/Order.js) / `__jmtOrders` |
| **Stone & Mineral Catalog** | UC-SC-01 through UC-SC-04 | [`StoneRange.jsx`](file:///c:/Users/chand/Desktop/Project/client/src/pages/StoneRange.jsx), [`StoneDetail.jsx`](file:///c:/Users/chand/Desktop/Project/client/src/pages/StoneDetail.jsx) | `GET /api/stones`, `GET /:slug` | [`Stone.js`](file:///c:/Users/chand/Desktop/Project/api/models/Stone.js) / `api/data/stones.js` |
| **Lead & Quote Intake** | UC-SC-04, UC-CC-03 | [`Contact.jsx`](file:///c:/Users/chand/Desktop/Project/client/src/pages/Contact.jsx), [`FloatingWidgets.jsx`](file:///c:/Users/chand/Desktop/Project/client/src/components/FloatingWidgets.jsx) | `POST /api/enquiries` | [`Enquiry.js`](file:///c:/Users/chand/Desktop/Project/api/models/Enquiry.js) |
| **System Diagnostics** | UC-SA-01, UC-SA-02 | Client API Client (`api.js`) | `GET /api/health` | Mongoose Connection Pool (`db.js`) |
