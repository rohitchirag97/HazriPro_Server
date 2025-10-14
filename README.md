# HazriPro Backend

A comprehensive attendance management system backend built with Node.js, Express, TypeScript, and Prisma. Designed for both web and mobile applications with cloud deployment support.

## 🚀 Features

### Core Functionality
- **Employee Management**: Complete CRUD operations for employees with face recognition support
- **Company Management**: Multi-tenant company support with role-based access
- **Department Management**: Organize employees by departments
- **Shift Management**: Flexible shift scheduling with overnight shift support
- **Attendance Tracking**: 
  - Real-time check-in/check-out functionality
  - Manual attendance marking with status management
  - Automatic overtime and late hours calculation
  - Half-day and full-day status tracking
  - Timezone-aware attendance processing

### Authentication & Security
- **OTP-based Authentication**: Phone number verification with secure OTP
- **Dual Authentication Support**: 
  - Web apps: HTTP-only cookies (automatic)
  - Mobile apps: Authorization headers (localStorage)
- **JWT Token Management**: Secure token generation and validation
- **Redis Session Storage**: Scalable session management
- **Role-based Access Control**: SUPER_ADMIN, ADMIN, EMPLOYEE roles

### Cloud & Infrastructure
- **Cloud-Ready**: Optimized for cloud deployment
- **Health Monitoring**: Comprehensive health check endpoints
- **Docker Support**: Multi-stage builds with production optimization
- **Database Migrations**: Automated schema management
- **Environment Configuration**: Flexible environment-based settings

## 🛠️ Tech Stack

- **Runtime**: Node.js 20+
- **Framework**: Express.js 5.x
- **Language**: TypeScript 5.x
- **Database**: PostgreSQL with Prisma ORM
- **Cache**: Redis for session management
- **Authentication**: JWT with bcrypt
- **Date Handling**: date-fns with timezone support
- **Cloud Storage**: AWS S3 for face recognition data
- **Containerization**: Docker with multi-stage builds

## 📋 Prerequisites

- Node.js (v20 or higher)
- PostgreSQL database (local or cloud)
- Redis instance (local or cloud)
- npm or yarn package manager

## 🔧 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/rohitchirag97/HazriPro_Server.git
cd HazriPro_Server
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/hazripro_db"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="your-super-secret-jwt-key"

# Application
NODE_ENV="development"
PORT=8000
TZ="Asia/Kolkata"

# AWS S3 (for face recognition)
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_REGION="your-aws-region"
AWS_BUCKET_NAME="your-s3-bucket-name"
```

### 4. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# (Optional) Seed the database
npx prisma db seed
```

### 5. Start Development Server
```bash
npm run dev
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/              # Configuration files
│   │   ├── prisma.ts        # Prisma client setup
│   │   ├── redis.ts         # Redis configuration
│   │   └── time.ts          # Timezone utilities
│   ├── controller/          # Route controllers
│   │   ├── attendance.controller.ts
│   │   ├── auth.controller.ts
│   │   ├── company.controller.ts
│   │   ├── department.controller.ts
│   │   ├── employee.controller.ts
│   │   └── shift.controller.ts
│   ├── middleware/          # Express middleware
│   │   └── auth.middleware.ts
│   ├── routes/              # API routes
│   │   ├── attendance.route.ts
│   │   ├── auth.route.ts
│   │   ├── company.route.ts
│   │   ├── department.route.ts
│   │   ├── employee.route.ts
│   │   ├── health.route.ts
│   │   └── shift.route.ts
│   ├── services/            # Business logic
│   │   ├── attendance.service.ts
│   │   ├── aws.service.ts
│   │   ├── jwt.service.ts
│   │   └── token.service.ts
│   ├── types/               # TypeScript definitions
│   │   └── global.d.ts
│   └── server.ts            # Application entry point
├── prisma/
│   ├── migrations/          # Database migrations
│   └── schema.prisma        # Database schema
├── dist/                    # Compiled JavaScript
├── Dockerfile               # Development Docker image
├── Dockerfile.prod          # Production Docker image
├── docker-compose.yml       # Local development setup
├── .dockerignore           # Docker ignore file
├── package.json
├── tsconfig.json
└── README.md
```

## 🗄️ Database Schema

### Core Models

#### Company
- Multi-tenant company management
- Unique slug for identification
- Timestamps for audit trail

#### Employee
- Personal information (name, phone)
- Role-based access (SUPER_ADMIN, ADMIN, EMPLOYEE)
- Face recognition support (faceId, faceUrl)
- Department and shift associations
- Company relationship

#### Attendance
- Daily attendance tracking
- Status management (PRESENT, ABSENT, HALF_DAY, LEAVE, HOLIDAY, WEEKEND)
- Time tracking (inTime, outTime)
- Overtime calculation (overtimeHours, lateHours, earlyHours)
- Employee and company relationships

#### Department & Shift
- Organizational structure
- Flexible shift definitions
- Overnight shift support

### Key Features
- **Face Recognition**: AWS S3 integration for secure image storage
- **Flexible Shifts**: Support for overnight and custom shift patterns
- **Timezone Support**: Global timezone handling with date-fns-tz
- **Audit Trail**: Comprehensive timestamps and tracking

## 🔌 API Endpoints

### Health Check
- `GET /api/v1/health` - Comprehensive health check (database, Redis, API status)
- `GET /api/v1/health/simple` - Simple health check (for load balancers)

### Authentication
- `POST /api/v1/auth/send-otp` - Send OTP to phone number
- `POST /api/v1/auth/verify-otp` - Verify OTP and get token (sets cookie for web)
- `POST /api/v1/auth/logout` - Logout user (clears cookie and Redis token)
- `GET /api/v1/auth/me` - Get current user info

### Company Management
- `GET /api/v1/company` - Get company details
- `PUT /api/v1/company` - Update company information

### Employee Management
- `GET /api/v1/employee` - Get all employees
- `POST /api/v1/employee` - Create new employee
- `PUT /api/v1/employee/:id` - Update employee
- `DELETE /api/v1/employee/:id` - Delete employee

### Attendance Management
- `POST /api/v1/attendance/checkin` - Check-in attendance
- `POST /api/v1/attendance/checkout` - Check-out attendance
- `POST /api/v1/attendance/manual` - Manual attendance marking

### Department Management
- `GET /api/v1/department` - Get all departments
- `POST /api/v1/department` - Create department
- `PUT /api/v1/department/:id` - Update department
- `DELETE /api/v1/department/:id` - Delete department

### Shift Management
- `GET /api/v1/shift` - Get all shifts
- `POST /api/v1/shift` - Create shift
- `PUT /api/v1/shift/:id` - Update shift
- `DELETE /api/v1/shift/:id` - Delete shift

## ⚙️ Configuration

### Authentication Support
The API supports dual authentication methods for different client types:

#### Web Applications
- Tokens are automatically stored in HTTP-only cookies
- Browsers automatically send cookies with requests
- More secure against XSS attacks
- No additional code needed for token management

#### Mobile Applications
- Tokens are stored in localStorage/AsyncStorage
- Must be sent in `Authorization: Bearer <token>` header
- Provides more control over token management
- Better for mobile app state management

### Timezone Support
- Built-in timezone handling with `date-fns-tz`
- Default timezone: "Asia/Kolkata"
- Configurable via `TZ` environment variable
- Automatic timezone conversion for attendance tracking

### Face Recognition
- AWS S3 integration for secure image storage
- Automatic image processing and storage
- Face ID generation for attendance verification
- Scalable cloud storage solution

### Health Monitoring
Comprehensive health check system for production monitoring:

- **Comprehensive Health Check** (`/api/v1/health`):
  - Database connectivity status
  - Redis connectivity status
  - API uptime and version info
  - Environment details
  - Returns 200 for healthy, 503 for unhealthy

- **Simple Health Check** (`/api/v1/health/simple`):
  - Lightweight endpoint for load balancers
  - Quick API availability check
  - Always returns 200 if API is running

## 🚀 Deployment

### Cloud Deployment (Recommended)

#### 1. Set up Cloud Services
- **PostgreSQL**: AWS RDS, Google Cloud SQL, Azure Database
- **Redis**: AWS ElastiCache, Google Cloud Memorystore, Azure Cache

#### 2. Configure Environment Variables
```env
DATABASE_URL="postgresql://username:password@your-cloud-db:5432/hazripro_db"
REDIS_URL="redis://your-cloud-redis:6379"
JWT_SECRET="your-super-secret-jwt-key"
NODE_ENV="production"
PORT=8000
TZ="Asia/Kolkata"
```

#### 3. Deploy with Docker
```bash
# Build production image
docker build -f Dockerfile.prod -t hazripro-backend .

# Run container
docker run -p 8000:8000 --env-file .env hazripro-backend
```

#### 4. Run Database Migrations
```bash
npx prisma migrate deploy
```

### Local Development

#### Using Docker Compose
```bash
# Start development environment
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

#### Manual Setup
```bash
# Install dependencies
npm install

# Build application
npm run build

# Start production server
npm start
```

## 🔒 Security Features

- **HTTP-only Cookies**: Prevents XSS attacks on web clients
- **JWT Token Security**: Secure token generation and validation
- **Password Hashing**: bcrypt for secure password storage
- **CORS Protection**: Configurable cross-origin resource sharing
- **Input Validation**: Comprehensive request validation
- **SQL Injection Protection**: Prisma ORM prevents SQL injection
- **Rate Limiting**: Built-in request rate limiting
- **Environment Security**: Secure environment variable handling

## 📱 Client Integration Examples

### Web Application (React/Next.js)
```javascript
// OTP Verification (automatic cookie handling)
const response = await fetch('/api/v1/auth/verify-otp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include', // Important for cookies
  body: JSON.stringify({ phone, otp })
});

// API calls (automatic cookie handling)
const userData = await fetch('/api/v1/auth/me', {
  credentials: 'include'
});
```

### Mobile Application (React Native)
```javascript
// OTP Verification
const response = await fetch('/api/v1/auth/verify-otp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ phone, otp })
});

const { token } = await response.json();
await AsyncStorage.setItem('authToken', token);

// API calls with Authorization header
const userData = await fetch('/api/v1/auth/me', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

## 🧪 Testing

### Health Check Testing
```bash
# Test comprehensive health check
curl http://localhost:8000/api/v1/health

# Test simple health check
curl http://localhost:8000/api/v1/health/simple
```

### API Testing
```bash
# Test OTP flow
curl -X POST http://localhost:8000/api/v1/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "+1234567890"}'

# Test attendance check-in
curl -X POST http://localhost:8000/api/v1/attendance/checkin \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"employeeId": "employee-id"}'
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write comprehensive tests
- Update documentation for new features
- Follow conventional commit messages
- Ensure all health checks pass

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Rohit Chirag** - *Initial work* - [rohitchirag97](https://github.com/rohitchirag97)

## 🙏 Acknowledgments

- **Prisma Team** - Excellent ORM and database toolkit
- **Express.js Community** - Robust web framework
- **date-fns Team** - Comprehensive date manipulation library
- **AWS** - Cloud services and infrastructure
- **Node.js Community** - Runtime and ecosystem

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation and API endpoints
- Review the health check endpoints for system status

---

**Built with ❤️ for modern attendance management**