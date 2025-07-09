# Library Management System

A full-stack Library Management System built with **Spring Boot (Java)** for the backend and **React** for the frontend.  
It allows users to browse and borrow books, while admins manage the library. Includes authentication, OTP verification, fine tracking, and SMS reminders.

---

##  Features

- 🧑‍💼 User registration & login (JWT-based)
- 🔐 Role-based access (Admin/User)
- 📚 Browse, borrow, and return books
- 📅 SMS reminders 2 days before due date (via Twilio)
- 💸 Fine for late returns
- 🔁 Password reset via OTP (SMS)
- ⛔ Block login after 5 failed attempts
- 📊 Admin dashboard for book statistics

---

##  Tech Stack

| Layer     | Technology               |
|-----------|--------------------------|
| Frontend  | React, React Bootstrap   |
| Backend   | Spring Boot (Java)       |
| Database  | MySQL                    |
| Auth      | JWT                      |
| SMS API   | Twilio                   |

---

##  Project Setup

### Backend (Spring Boot)

1. Clone the repository:
   ```bash
   
   git clone https://github.com/JeffinVThomas/library-management-system.git
   cd library-management-system/backend
   
2.Configure application.properties:

spring.datasource.username=your_mysql_username
spring.datasource.password=your_mysql_password
twilio.account.sid=your_twilio_sid
twilio.auth.token=your_twilio_token
twilio.phone.number=+91XXXXXXXXXX
jwt.secret=your_secure_jwt_secret

3.Run the backend:

./mvnw spring-boot:run

💻 Frontend (React)

1.Navigate to the frontend directory:

cd ../frontend

2.Install dependencies:

npm install

3.Start the frontend app:

npm start

🗂️ Database Setup (MySQL)

1.Create the database manually:

CREATE DATABASE Library_Management_DB;

2.Spring Boot will auto-generate all tables using JPA (ddl-auto=update).

📁 Folder Structure

library-management-system/
├── backend/         # Spring Boot backend
│   ├── controller/
│   ├── service/
│   ├── repository/
│   ├── model/
│   ├── config/
├── frontend/        # React frontend
│   ├── pages/
│   ├── components/
│   └── styling/

👤 Author

Jeffin V Thomas
Fresher Java Developer | Spring Boot | React | MySQL

⭐️ Support
If you find this project helpful, give it a ⭐ on GitHub and share it with others!
