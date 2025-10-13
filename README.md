# HazriPro Backend

A comprehensive attendance management system backend built with Node.js, Express, TypeScript, and Prisma.

## 🚀 Features

- **Employee Management**: Complete CRUD operations for employees
- **Company Management**: Multi-tenant company support
- **Department Management**: Organize employees by departments
- **Shift Management**: Flexible shift scheduling
- **Attendance Tracking**: 
  - Check-in/Check-out functionality
  - Manual attendance marking
  - Overtime and late hours calculation
  - Half-day and full-day status tracking
- **Authentication**: JWT-based authentication system
- **Database**: PostgreSQL with Prisma ORM
- **Time Zone Support**: Built-in timezone handling for global teams

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT
- **Date Handling**: date-fns, date-fns-tz
- **Cloud Storage**: AWS S3 (for face recognition data)

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn package manager

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rohitchirag97/HazriPro_Server.git
   cd HazriPro_Server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/hazripro_db"
   JWT_SECRET="your-jwt-secret-key"
   TZ="Asia/Kolkata"
   AWS_ACCESS_KEY_ID="your-aws-access-key"
   AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
   AWS_REGION="your-aws-region"
   AWS_BUCKET_NAME="your-s3-bucket-name"
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma migrate dev
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   │   ├── prisma.ts    # Prisma client setup
│   │   ├── redis.ts     # Redis configuration
│   │   └── time.ts      # Timezone utilities
│   ├── controller/      # Route controllers
│   │   ├── attendance.controller.ts
│   │   ├── auth.controller.ts
│   │   ├── company.controller.ts
│   │   ├── department.controller.ts
│   │   ├── employee.controller.ts
│   │   └── shift.controller.ts
│   ├── middleware/      # Express middleware
│   │   └── auth.middleware.ts
│   ├── routes/          # API routes
│   │   ├── attendance.route.ts
│   │   ├── auth.route.ts
│   │   ├── company.route.ts
│   │   ├── department.route.ts
│   │   ├── employee.route.ts
│   │   └── shift.route.ts
│   ├── services/        # Business logic
│   │   ├── attendance.service.ts
│   │   ├── aws.service.ts
│   │   └── jwt.service.ts
│   ├── types/           # TypeScript type definitions
│   │   └── global.d.ts
│   └── server.ts        # Application entry point
├── prisma/
│   ├── migrations/      # Database migrations
│   └── schema.prisma    # Database schema
├── dist/                # Compiled JavaScript
├── package.json
├── tsconfig.json
└── README.md
```

## 🗄️ Database Schema

### Core Models

- **Company**: Multi-tenant company management
- **Department**: Organizational departments
- **Shift**: Work shift definitions
- **Employee**: Employee information with face recognition support
- **Attendance**: Daily attendance tracking with overtime calculation

### Key Features

- **Face Recognition**: AWS S3 integration for face image storage
- **Flexible Shifts**: Support for overnight shifts
- **Attendance Status**: PRESENT, ABSENT, HALF_DAY, LEAVE, HOLIDAY, WEEKEND
- **Time Tracking**: Automatic overtime, late hours, and early departure calculation

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Company Management
- `GET /api/company` - Get company details
- `PUT /api/company` - Update company information

### Employee Management
- `GET /api/employee` - Get all employees
- `POST /api/employee` - Create new employee
- `PUT /api/employee/:id` - Update employee
- `DELETE /api/employee/:id` - Delete employee

### Attendance Management
- `POST /api/attendance/checkin` - Check-in attendance
- `POST /api/attendance/checkout` - Check-out attendance
- `POST /api/attendance/manual` - Manual attendance marking

### Department Management
- `GET /api/department` - Get all departments
- `POST /api/department` - Create department
- `PUT /api/department/:id` - Update department
- `DELETE /api/department/:id` - Delete department

### Shift Management
- `GET /api/shift` - Get all shifts
- `POST /api/shift` - Create shift
- `PUT /api/shift/:id` - Update shift
- `DELETE /api/shift/:id` - Delete shift

## ⚙️ Configuration

### Timezone Support
The application supports multiple timezones with `date-fns-tz`. Default timezone is set to "Asia/Kolkata" but can be configured via environment variables.

### Face Recognition
AWS S3 integration for storing and managing employee face images for attendance verification.

## 🚀 Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Run database migrations in production**
   ```bash
   npx prisma migrate deploy
   ```

3. **Start the production server**
   ```bash
   npm start
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Rohit Chirag** - *Initial work* - [rohitchirag97](https://github.com/rohitchirag97)

## 🙏 Acknowledgments

- Prisma team for the excellent ORM
- Express.js community
- date-fns for robust date handling
- AWS for cloud services integration
