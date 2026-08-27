# 🏨 Hotel Property Management System (PMS)

A full-stack Hotel Property Management System developed to manage hotel operations through an Admin Dashboard and Front Desk application.

The system allows hotel administrators and front-desk employees to manage hotels, rooms, room types, employees, reservations, billing, reports, and daily hotel operations.

---

## ✨ Features

### Admin Dashboard
- Hotel management
- Room management
- Room type management
- Employee management
- Roles & permissions
- Reservation management
- Billing & payments
- Reports
- Profile and settings

### Room Management
- Add, edit and delete rooms
- Manage multiple floors
- Assign rooms to hotels
- Assign rooms to room types
- Manage room status
- Track available, occupied, reserved, cleaning and maintenance rooms

### Employee Management
- Add and edit employees
- Assign employees to hotels
- Assign roles
- Manage departments and designations
- Employee account management
- Password management

### Reservation Management
- Search reservations
- Filter by status
- Filter by room type
- Filter by date
- View reservation details
- Check-in
- Check-out
- Cancel reservation
- Export reservations
- Grid/List view

### Front Desk
- Front desk login
- Reservation management
- Guest information
- Room information
- Check-in and check-out operations
- Hotel-specific employee access

---

## 🛠️ Technology Stack

### Backend
- Python
- Django 6.1
- Django REST Framework
- MySQL

### Frontend
- React 19
- Vite
- React Router
- React Icons
- Recharts

### Other
- HTML
- CSS
- Bootstrap
- Git & GitHub

---

## 📁 Project Structure

```text
PMS/
│
├── README.md
├── .gitignore
│
├── pms-admin/
│   ├── manage.py
│   ├── config/
│   ├── accounts/
│   ├── dashboard/
│   ├── hotels/
│   ├── rooms/
│   ├── employees/
│   ├── reservations/
│   ├── billing/
│   ├── reports/
│   ├── settingsapp/
│   ├── templates/
│   └── static/
│
└── pms-app/
    ├── package.json
    ├── public/
    └── src/