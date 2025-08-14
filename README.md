# Sanjays Pics: Professional Photography Portfolio & Fujifilm EXIF Manager

This is a full featured, dynamic photography portfolio website with custom Fujifilm specific EXIF data parsing, photo and data management, and low overhead deployment.

> **Live Site:** [sanjayspics.com](https://sanjayspics.com)

## Key Technical Focus

**Custom Fujifilm Maker Note EXIF Parser** - Built a proprietary parser that extracts and interprets Fujifilm's undocumented maker note EXIF data, including film simulation modes, color profiles, and custom recipe settings. This reverse-engineered solution processes over 50 unique Fujifilm-specific metadata fields that are typically inaccessible through standard EXIF libraries.

## Tech Stack

**Frontend & Framework:**
- **Next.js 15** - React framework with App Router and Server Components
- **React 19** - Component-based UI with hooks and context
- **TypeScript** - Type-safe development and enhanced code reliability
- **Tailwind CSS** - Utility-first styling with custom design system

**Backend & Database:**
- **PostgreSQL** - Relational database for metadata and user management
- **Prisma ORM** - Type-safe database client with schema management
- **Node.js** - Runtime environment with server actions

**Cloud Services & Infrastructure:**
- **Cloudinary** - Image CDN with optimization and transformation
- **Vercel** - Deployment platform with edge functions
- **Vercel Blob** - File upload intermediary for large image handling

**Authentication & Security:**
- **BetterAuth** - Modern authentication with session management
- **Role-based Access Control** - Secure admin panel protection

**Developer Experience:**
- **ESLint** - Code linting and style enforcement
- **Prisma Studio** - Database management and visualization
- **Custom UI Components** - Built with Radix UI primitives and Shadcn prebuilt components

## Features

### Admin Dashboard
- **Image Management**: Upload, edit, delete, and toggle visibility
- **EXIF Data Visualization**: Complete metadata extraction and display
- **Recipe Management**: Create, edit, and organize Fujifilm camera recipes
- **Batch Operations**: Efficient bulk management tools

### EXIF Data Processing
- **Comprehensive Extraction**: Camera settings, lens data, shooting conditions
- **Fujifilm Specialization**: Film simulation, color chrome effects, grain settings, etc
- **Database Storage**: Structured metadata for advanced filtering and search
- **Performance Optimized**: Efficient parsing with minimal overhead

### Portfolio Features
- **Responsive Gallery**: Optimized viewing across all devices
- **Image Optimization**: Automatic resizing and format conversion
- **Film Simulation Filtering**: Browse images by Fujifilm film modes
- **Lazy Loading**: Progressive image loading for performance

## Installation & Setup

### Prerequisites
- Node.js 22+
- Prisma account
- Cloudinary account
- Vercel account (for deployment - free tier is sufficient)

### Installation

1. **Clone Repo**
    ```bash
    git clone https://github.com/sanjito31/sjayspics.git
    ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Database Setup**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma migrate dev --name init
   
   # Optional: View database using Prisma Studio
   npx prisma studio
   ```

4. **External Service Configuration**
   - **Cloudinary**: Create account and obtain API keys under Settings>API Keys (for more info: [Documentation](https://cloudinary.com/documentation/node_integration))
   - **BetterAuth**: Set up authentication providers. For this project, we have only Email and Password login setup. ([Documentation](https://www.better-auth.com/docs/authentication/email-password))
   - **PostgreSQL**: Create a new database and obtain database connection string from your Prisma dashboard ([Prisma](https://prisma.io/))

5. **Set Up Environment Variables**

    ```bash
    touch .env
    ```

    ```env
    # Database
    DATABASE_URL="prisma+postgres://..."

    # Cloudinary (get from Cloudinary account settings > API keys)
    CLOUDINARY_CLOUD_NAME="your-cloud-name"
    CLOUDINARY_API_KEY="your-api-key"
    CLOUDINARY_API_SECRET="your-api-secret"

    # Authentication
    BETTER_AUTH_SECRET="your-secret" 
    # generate BETTER_AUTH_SECRET at better-auth.com/docs/installation
    BETTER_AUTH_URL="your-domain"

    # Vercel Blob (add on Vercel under "Storage" tab)
    BLOB_READ_WRITE_TOKEN="your-token"
    ```

6. **Development Server**

   ```bash
   # Test locally before deploying
   npm run dev
   ```

7. **Deploy via Git Push**
    ```bash
    git push -u origin main
    ```

### Production Deployment
- Push to GitHub repository
- Connect to Vercel for automatic deployment -> [Deploy to Vercel](https://vercel.com/docs/deployments)
- Configure production environment variables
- Run production migrations


## Architecture Highlights

- **Server Components**: Optimized data fetching with React Server Components
- **Type Safety**: End-to-end TypeScript with Prisma-generated types
- **Performance**: Image optimization pipeline with Cloudinary transformations
- **Scalability**: Edge-optimized deployment with Vercel's global CDN
- **Security**: Secure authentication flow with protected admin routes

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Disclaimer

This project is developed for personal and educational purposes. The Fujifilm EXIF parser is based on publicly available documentation and reverse engineering. Fujifilm is a trademark of FUJIFILM Corporation. This project is not affiliated with or endorsed by FUJIFILM Corporation.