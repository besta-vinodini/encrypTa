# <img src="./logo.png" alt="EncrypTa Logo" width="100%" />

# EncrypTa - The Future of Password Management

**EncrypTa** is a state-of-the-art, full-stack password management solution designed for maximum security and seamless user experience. Built with a robust Spring Boot backend and a dynamic React frontend, it empowers users to securely store, manage, and access their sensitive credentials with confidence.

---

## ✨ Key Features

- 🔐 **Military-Grade Security**: Leverages Spring Security and advanced encryption patterns to protect your data.
- 🚀 **Lightning Fast UI**: A polished, responsive React-based dashboard for effortless password management.
- 🛡️ **User Authentication**: Secure registration and login flow with session persistence.
- 🛠️ **Full CRUD Operations**: Create, Read, Update, and Delete passwords with ease.
- 🎨 **Premium Aesthetics**: Modern dark-mode interface with intuitive micro-interactions.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18
- **Routing**: React Router DOM (v6)
- **Styling**: Vanilla CSS with modern HSL palettes
- **Utilities**: Axios for API calls, React Hot Toast for notifications, React Icons

### Backend
- **Framework**: Spring Boot 4.0.1
- **Language**: Java 17
- **Security**: Spring Security Crypto
- **ORM**: Spring Data JPA (Hibernate)
- **Persistence**: MySQL

---

## 🚀 Getting Started

### Prerequisites
- **Java**: JDK 17 or higher
- **Node.js**: v18.x or higher
- **Database**: MySQL 8.x

### 1. Database Setup
Create a MySQL database named `user_registration`:
```sql
CREATE DATABASE user_registration;
```

### 2. Backend Configuration
Update `Backend/demo (2)/demo/src/main/resources/application.properties` with your MySQL credentials:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/user_registration
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD
```

### 3. Run Backend
Navigate to the backend directory and run:
```bash
./mvnw spring-boot:run
```

### 4. Run Frontend
Navigate to `Frontend/encrypta-ui` and run:
```bash
npm install
npm start
```

---

## 🔌 API Reference

| Method | Endpoint | Purpose |
| :--- | :--- | :--- |
| `POST` | `/api/users/register` | Register a new user |
| `POST` | `/api/users/login` | Authenticate user |
| `POST` | `/api/passwords` | Add a new password entry |
| `GET` | `/api/passwords/user/{userId}` | Retrieve all passwords for a user |
| `PUT` | `/api/passwords/{id}` | Update an existing password |
| `DELETE` | `/api/passwords/{id}` | Remove a password entry |

---

## 📁 Project Structure

```text
EncrypTa-Full-Stack-main/
├── Backend/          # Spring Boot Application
│   └── demo (2)/     # Project Root
├── Frontend/         # React Application
│   └── encrypta-ui/  # UI Source Code
├── logo.png          # Branding Assets
└── passAPIs.doc      # API Documentation Reference
```

---

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
