# 🚀 Getting Started

Welcome to **Clarity**. Let's get your sanctuary set up.

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your machine:
- **Node.js** (v18 or higher recommended)
- **npm** (usually comes with Node.js)
- **Git**

## 🛠️ Installation

Follow these steps to get Clarity running locally.

### 1. Clone the Repository

```bash
git clone https://github.com/0hitaka0/productivity.git
cd productivity
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

We use SQLite for simplicity. Initialize the database with Prisma:

```bash
# Generate Prisma Client
npx prisma generate

# Create the database file (dev.db)
npx prisma db push
```

### 4. Environment Configuration

Create a `.env` file in the root directory. You can copy the example:

```bash
cp .env.example .env
```

**Required Variables**:
Open `.env` and generate a secret for `NEXTAUTH_SECRET`. You can do this by running:
```bash
openssl rand -base64 32
```
Paste the output into your `.env` file:
```env
NEXTAUTH_SECRET="your-generated-secret-here"
```

> [!NOTE]
> Google Calendar integration requires additional setup. See the [Architecture](./architecture.md) section for details on obtaining Google Client IDs if you need that feature.

### 5. Run the Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser. You should see the stars aligning! ✨

## 🏁 Quick Start Guide

Once the app is running:

1.  **Sign Up**: Click "Sign Up" on the landing page.
2.  **Explore**: You'll be greeted by your dashboard.
3.  **Set an Intention**: Try adding a "Daily Intention" if available, or simply navigate to the **Journal** to write your first reflection.

---
**Next Steps:** Check out the [User Guide](./user-guide.md) to master your tasks and habits.
