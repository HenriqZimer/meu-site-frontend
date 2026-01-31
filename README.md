# 🎨 Portfolio Frontend

[![Nuxt](https://img.shields.io/badge/Nuxt-v4.1+-00DC82?logo=nuxt.js&logoColor=white)](https://nuxt.com/)
[![Vue](https://img.shields.io/badge/Vue-v3.5+-4FC08D?logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Vuetify](https://img.shields.io/badge/Vuetify-v3.10+-1867C0?logo=vuetify&logoColor=white)](https://vuetifyjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5.9+-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Pinia](https://img.shields.io/badge/Pinia-Latest-FFD859?logo=pinia&logoColor=black)](https://pinia.vuejs.org/)
[![Vitest](https://img.shields.io/badge/Vitest-Latest-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev/)
[![Cypress](https://img.shields.io/badge/Cypress-Latest-17202C?logo=cypress&logoColor=white)](https://www.cypress.io/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A modern, responsive, and accessible portfolio website built with Nuxt 3, Vue 3, Vuetify, and TypeScript. Features minimalist design, smooth animations, comprehensive testing, and production-ready infrastructure.

## ✨ Features

### 🎯 Core Features
- **Responsive Design** - Optimized for all devices (mobile, tablet, desktop)
- **Minimalist UI** - Clean and professional design focused on content
- **Dark Mode** - Built-in theme support with Vuetify
- **Smooth Animations** - Scroll-triggered animations for enhanced UX
- **SEO Optimized** - Server-side rendering with meta tags and sitemap
- **PWA Ready** - Progressive Web App capabilities
- **Google Maps Integration** - Interactive location display

### 📊 Portfolio Sections
- **Hero Section** - Eye-catching introduction with CTA
- **About** - Professional background and bio
- **Skills** - Technical competencies showcase
- **Projects** - Portfolio items with details
- **Certifications** - Professional certifications display
- **Courses** - Educational background
- **Contact** - Contact form with social links

### 🔄 State Management
- **Pinia Stores** - Centralized state management
- **API Integration** - RESTful backend communication
- **Reactive Data** - Real-time updates and synchronization

### 🧪 Testing & Quality
- **Vitest** - Fast unit and component testing
- **Cypress** - Comprehensive E2E testing
- **Accessibility Tests** - WCAG compliance validation
- **Responsive Tests** - Multi-device testing
- **SEO Tests** - Meta tags and SEO validation
- **ESLint** - Code quality enforcement
- **Prettier** - Automated code formatting

### 📈 Observability
- **Prometheus Metrics** - Application performance monitoring
- **Health Endpoints** - Readiness and liveness checks
- **Analytics Ready** - Google Analytics integration support

### 🚀 DevOps Ready
- **Docker** - Containerized deployment
- **Jenkins CI/CD** - Automated build and deployment pipeline
- **SonarQube** - Code quality analysis
- **Static Site Generation** - Pre-rendered pages for optimal performance

## 📋 Prerequisites

- **Node.js**: v18.14.0+ or v20.0.0+ or v22.0.0+ or v24.0.0+
- **npm**: v8.0.0+
- **Docker**: Latest version (optional, for containerized deployment)
- **Backend API**: Running instance of the portfolio backend

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/HenriqZimer/meu-site.git
cd meu-site-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
NUXT_PUBLIC_API_BASE_URL=http://localhost:5000
NUXT_PUBLIC_API_TIMEOUT=10000

# Application
NUXT_PUBLIC_SITE_URL=https://henriqzimer.com.br
NUXT_PUBLIC_SITE_NAME=Henrique Zimermann
NUXT_PUBLIC_SITE_DESCRIPTION=Portfolio profissional - DevOps Engineer

# Google Maps (optional)
NUXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# Analytics (optional)
NUXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX

# Social Links
NUXT_PUBLIC_GITHUB_URL=https://github.com/HenriqZimer
NUXT_PUBLIC_LINKEDIN_URL=https://linkedin.com/in/yourprofile
NUXT_PUBLIC_EMAIL=contato@henriqzimer.com.br
```

### 4. Start Development Server

```bash
# Development mode with hot-reload
npm run dev

# Preview production build
npm run dev:prod
```

The application will be available at `http://localhost:3000`

### 5. Build for Production

```bash
# Build for production
npm run build

# Generate static site
npm run generate

# Preview production build
npm run preview

# Start production server
npm start
```

## 📁 Project Structure

```
meu-site-frontend/
├── app/
│   ├── assets/
│   │   └── css/                   # Global styles
│   ├── components/
│   │   ├── About.vue             # About section
│   │   ├── Certifications.vue    # Certifications display
│   │   ├── Contact.vue           # Contact form
│   │   ├── Courses.vue           # Courses section
│   │   ├── Footer.vue            # Footer component
│   │   ├── Header.vue            # Navigation header
│   │   ├── Hero.vue              # Hero section
│   │   ├── Portfolio.vue         # Projects showcase
│   │   ├── Skills.vue            # Skills section
│   │   ├── *.spec.ts             # Component tests
│   │   ├── admin/                # Admin panel components
│   │   └── base/                 # Base components
│   ├── composables/
│   │   ├── useNavigation.ts      # Navigation logic
│   │   ├── useResponsive.ts      # Responsive utilities
│   │   ├── useScrollAnimation.ts # Scroll animations
│   │   ├── useSocialLinks.ts     # Social links
│   │   └── *.spec.ts             # Composable tests
│   ├── constants/
│   │   └── index.ts              # Application constants
│   ├── pages/
│   │   ├── index.vue             # Home page
│   │   └── admin/                # Admin pages
│   ├── stores/
│   │   ├── certifications.ts     # Certifications store
│   │   ├── courses.ts            # Courses store
│   │   ├── projects.ts           # Projects store
│   │   ├── skills.ts             # Skills store
│   │   ├── *.spec.ts             # Store tests
│   │   └── admin/                # Admin stores
│   ├── types/
│   │   └── admin.ts              # TypeScript definitions
│   └── app.vue                    # Root component
├── cypress/
│   ├── e2e/
│   │   ├── accessibility.cy.ts   # Accessibility tests
│   │   ├── config-test.cy.ts     # Configuration tests
│   │   ├── home.cy.ts            # Homepage tests
│   │   ├── responsive.cy.ts      # Responsive tests
│   │   └── seo.cy.ts             # SEO tests
│   └── support/
│       ├── commands.ts            # Custom commands
│       └── e2e.ts
├── public/
│   ├── robots.txt                 # Robots configuration
│   └── sitemap.xml                # Sitemap for SEO
├── cypress.config.mjs             # Cypress configuration
├── Dockerfile                      # Docker image definition
├── eslint.config.mjs              # ESLint configuration
├── Jenkinsfile                     # CI/CD pipeline
├── jenkinsPod.yaml                 # Jenkins Kubernetes pod
├── nuxt.config.ts                 # Nuxt configuration
├── package.json                    # Dependencies and scripts
├── sonar-project.properties        # SonarQube config
├── tsconfig.json                   # TypeScript configuration
└── vitest.config.ts                # Vitest configuration
```

## 🔧 NPM Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run dev:prod` | Preview production build |
| `npm run build` | Build for production |
| `npm run build:prod` | Build with production env |
| `npm run generate` | Generate static site |
| `npm run preview` | Preview production build |
| `npm start` | Start production server |
| `npm run test` | Run unit tests |
| `npm run test:unit:watch` | Run tests in watch mode |
| `npm run test:unit:ui` | Run tests with Vitest UI |
| `npm run test:coverage` | Generate coverage report |
| `npm run test:e2e` | Run E2E tests |
| `npm run test:e2e:quick` | Run quick E2E tests |
| `npm run test:e2e:headed` | Open Cypress UI |
| `npm run test:component` | Run component tests |
| `npm run lint` | Lint and fix code |
| `npm run lint:check` | Check linting |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check formatting |
| `npm run security` | Run security audit |

## 🌍 Accessing the Application

After deployment, the application provides:

- **Homepage**: Main portfolio showcase
- **Admin Panel**: `/admin` (if configured with backend)
- **Health Check**: `/api/_health` (Prometheus metrics)
- **Sitemap**: `/sitemap.xml`
- **Robots**: `/robots.txt`

## 🎨 Customization

### Changing Theme Colors

Edit `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  vuetify: {
    theme: {
      themes: {
        light: {
          primary: '#1976D2',
          secondary: '#424242',
          accent: '#82B1FF',
        },
      },
    },
  },
})
```

### Adding New Sections

1. Create component:
```bash
touch app/components/NewSection.vue
```

2. Create test:
```bash
touch app/components/NewSection.spec.ts
```

3. Add to homepage:
```vue
<!-- app/pages/index.vue -->
<template>
  <div>
    <Hero />
    <NewSection />
    <About />
    <!-- ... -->
  </div>
</template>
```

4. Create store (if needed):
```bash
touch app/stores/newSection.ts
touch app/stores/newSection.spec.ts
```

### Configuring SEO

Edit `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  app: {
    head: {
      title: 'Your Name - Portfolio',
      meta: [
        { name: 'description', content: 'Your description' },
        { property: 'og:title', content: 'Your Name' },
        { property: 'og:description', content: 'Your description' },
      ],
    },
  },
})
```

## 🐳 Docker Deployment

### Build Image

```bash
docker build -t portfolio-frontend:latest .
```

### Run Container

```bash
docker run -d \
  -p 3000:3000 \
  -e NUXT_PUBLIC_API_BASE_URL=http://backend:5000 \
  --name portfolio-frontend \
  portfolio-frontend:latest
```

### Docker Compose (Full Stack)

```yaml
version: '3.8'
services:
  frontend:
    build: ./meu-site-frontend
    ports:
      - "3000:3000"
    environment:
      - NUXT_PUBLIC_API_BASE_URL=http://backend:5000
    depends_on:
      - backend
  
  backend:
    build: ./meu-site-backend
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/portfolio
    depends_on:
      - mongo
  
  mongo:
    image: mongo:8
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
```

Run with:
```bash
docker-compose up -d
```

## 🧪 Testing

### Unit Tests

```bash
# Run all unit tests
npm run test

# Watch mode
npm run test:unit:watch

# With UI
npm run test:unit:ui

# With coverage
npm run test:coverage
```

### E2E Tests

```bash
# Run all E2E tests (auto-starts server)
npm run test:e2e

# Quick tests (config + SEO)
npm run test:e2e:quick

# Interactive mode
npm run test:e2e:headed
```

### Coverage Reports

Coverage reports include:
- Component coverage
- Composable coverage
- Store coverage
- Overall line/branch coverage

## 🔐 Security Considerations

### Best Practices Applied
- ✅ XSS protection with Vue sanitization
- ✅ CSRF protection with Nuxt security headers
- ✅ Environment variable validation
- ✅ Dependency vulnerability scanning
- ✅ Content Security Policy (can be configured)
- ✅ HTTPS enforcement in production
- ✅ Secure API communication

### Performance Optimizations
- ✅ Server-side rendering (SSR)
- ✅ Code splitting and lazy loading
- ✅ Image optimization with @nuxt/image
- ✅ Minification and compression
- ✅ Caching strategies
- ✅ Lighthouse score optimization

## 📊 Monitoring

### Prometheus Metrics

Metrics available at `/api/_health`:
- Request duration
- Request count
- Response status codes
- Memory usage
- Event loop lag

### Health Checks

```bash
# Check application health
curl http://localhost:3000/api/_health

# Expected response: 200 OK with metrics
```

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev
```

### Backend Connection Issues

```bash
# Check backend is running
curl http://localhost:5000/health

# Verify API URL
echo $NUXT_PUBLIC_API_BASE_URL

# Check CORS configuration on backend
```

### Build Failures

```bash
# Clear Nuxt cache
rm -rf .nuxt .output

# Clear node modules
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

### Styling Issues

```bash
# Clear Vuetify cache
rm -rf node_modules/.cache

# Reinstall Vuetify
npm install vuetify@latest

# Check for CSS conflicts in browser DevTools
```

## 📚 Documentation

- [Nuxt 3 Documentation](https://nuxt.com/docs)
- [Vue 3 Documentation](https://vuejs.org/guide/)
- [Vuetify Documentation](https://vuetifyjs.com/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev/guide/)

## 🎯 Lighthouse Scores

Target performance metrics:
- **Performance**: 90+
- **Accessibility**: 95+
- **Best Practices**: 95+
- **SEO**: 100

## 🔄 CI/CD Pipeline

The project includes Jenkins pipeline configuration:

```groovy
// Jenkinsfile stages:
1. Install dependencies
2. Lint code
3. Run unit tests
4. Run E2E tests
5. Security audit
6. Build production bundle
7. Build Docker image
8. Push to registry
9. Deploy to environment
```

SonarQube integration for code quality metrics.

## 🤝 Acknowledgments

This project leverages the following amazing technologies:

- [Nuxt 3](https://nuxt.com/) - The Intuitive Vue Framework
- [Vue 3](https://vuejs.org/) - Progressive JavaScript Framework
- [Vuetify](https://vuetifyjs.com/) - Material Design Component Framework
- [Pinia](https://pinia.vuejs.org/) - The Vue Store
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Vitest](https://vitest.dev/) - Next Generation Testing Framework
- [Cypress](https://www.cypress.io/) - E2E Testing Framework
- [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling
- [Docker](https://www.docker.com/) - Containerization Platform

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This is a portfolio project showcasing modern frontend development practices. While production-ready features are implemented, ensure proper configuration and testing for your specific deployment environment.

---

**Built with ❤️ for the Web Development Community**
