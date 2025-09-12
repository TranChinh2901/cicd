# Stratos Project - CI/CD Setup Guide

## 🎯 Tổng quan
Dự án này sử dụng React (Frontend) + Node.js/Express (Backend) với MongoDB. CI/CD pipeline tự động build, push Docker images và deploy lên server khi có code mới push lên branch `main`.

## 📋 Yêu cầu trước khi bắt đầu

### 1. Tài khoản cần thiết
- ✅ Tài khoản GitHub + repository chứa source code
- ✅ Tài khoản Docker Hub để lưu Docker images
- ✅ Server (VPS/Cloud): Ubuntu 20.04/22.04 đã cài Docker & Docker Compose

### 2. Cài đặt trên Server
```bash
# Cài Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Cài Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Kiểm tra
docker --version
docker-compose --version
```

## 🔧 Cấu hình GitHub Secrets

Vào GitHub Repository → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

### Secrets cần thiết:

#### 🐳 Docker Hub
- `DOCKER_USERNAME` → username Docker Hub của bạn
- `DOCKER_PASSWORD` → password Docker Hub của bạn

#### 🖥️ Server SSH
- `SERVER_HOST` → IP server của bạn (ví dụ: `123.45.67.89`)
- `SERVER_USERNAME` → username SSH (ví dụ: `ubuntu`, `root`)
- `SERVER_SSH_KEY` → Private SSH Key (nội dung file `~/.ssh/id_rsa`)

#### 🗄️ Database & Environment
- `MONGODB_URI` → MongoDB connection string (ví dụ: `mongodb://localhost:27017/stratos_db`)
- `JWT_SECRET` → JWT secret key để mã hóa token
- `GOOGLE_API_KEY` → Google API key (nếu sử dụng)

#### 🐳 Docker Compose Production
- `DOCKER_COMPOSE_PRODUCTION` → Nội dung file docker-compose cho production (xem bên dưới)

## 📝 Docker Compose cho Production

**Secret name**: `DOCKER_COMPOSE_PRODUCTION`
**Content**:
```yaml
version: '3.8'

services:
  # Frontend Service
  frontend:
    image: YOUR_DOCKER_USERNAME/stratos-frontend:latest
    container_name: stratos-frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - app-network
    restart: always
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:80/"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 30s

  # Backend Service
  backend:
    image: YOUR_DOCKER_USERNAME/stratos-backend:latest
    container_name: stratos-backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - PORT=5000
      - MONGODB_URI=mongodb://localhost:27017/stratos_db
      - JWT_SECRET=your-super-secret-jwt-key
      - GOOGLE_API_KEY=your-google-api-key
    networks:
      - app-network
    restart: always
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:5000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 30s
    volumes:
      - ./logs:/app/logs

networks:
  app-network:
    driver: bridge
```

**⚠️ Lưu ý**: Thay thế `YOUR_DOCKER_USERNAME` bằng username Docker Hub thực của bạn.

## 🚀 Chuẩn bị Server

### 1. Tạo thư mục project trên server
```bash
ssh user@your-server-ip
mkdir -p /home/$USER/stratos-project
cd /home/$USER/stratos-project
```

### 2. Cấu hình SSH Key
```bash
# Trên máy local, tạo SSH key nếu chưa có
ssh-keygen -t rsa -b 4096 -C "your-email@example.com"

# Copy public key lên server
ssh-copy-id user@your-server-ip

# Hoặc thủ công:
cat ~/.ssh/id_rsa.pub | ssh user@server-ip "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

## 📦 Deploy lần đầu

### 1. Push code lên GitHub
```bash
git add .
git commit -m "Add CI/CD setup with Docker"
git push origin main
```

### 2. Kiểm tra GitHub Actions
- Vào GitHub Repository → tab **Actions**
- Xem workflow **"Stratos Project CI/CD Pipeline"** chạy
- Đợi pipeline hoàn thành (build → push → deploy)

### 3. Kiểm tra trên server
```bash
# SSH vào server
ssh user@your-server-ip

# Vào thư mục project
cd /home/$USER/stratos-project

# Kiểm tra containers đang chạy
docker ps

# Kiểm tra logs
docker-compose logs frontend
docker-compose logs backend
```

## 🌐 Truy cập ứng dụng

- **Frontend**: `http://your-server-ip` (port 80)
- **Backend API**: `http://your-server-ip:5000`

## 🔍 Troubleshooting

### Lỗi thường gặp:

#### 1. Container không start được
```bash
# Xem logs chi tiết
docker-compose logs frontend
docker-compose logs backend

# Restart containers
docker-compose restart
```

#### 2. Không connect được database
- Kiểm tra MongoDB URI trong secrets
- Đảm bảo MongoDB đang chạy trên server
- Kiểm tra firewall/security groups

#### 3. SSH connection failed
- Kiểm tra SERVER_HOST, SERVER_USERNAME
- Đảm bảo SSH key đúng format (private key, không có passphrase)
- Test SSH connection thủ công: `ssh user@server-ip`

#### 4. Docker build failed
- Kiểm tra Dockerfile syntax
- Đảm bảo package.json valid
- Xem logs chi tiết trong GitHub Actions

## 📊 Monitoring

### Kiểm tra health của services:
```bash
# Health check endpoints
curl http://localhost:80/  # Frontend
curl http://localhost:5000/api/health  # Backend

# Resource usage
docker stats

# Disk usage
docker system df
```

## 🔄 Cập nhật ứng dụng

Chỉ cần push code mới lên branch `main`:
```bash
git add .
git commit -m "Update feature XYZ"
git push origin main
```

Pipeline sẽ tự động:
1. Build Docker images mới
2. Push lên Docker Hub
3. Deploy lên production server
4. Restart containers với images mới

---

## 📝 Ghi chú
- Pipeline chỉ deploy khi push lên branch `main`
- Thời gian deploy: ~5-10 phút
- Containers tự restart khi server reboot
- Logs được lưu trong `./logs` directory
