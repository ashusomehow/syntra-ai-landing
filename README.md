# Syntra.ai Landing Page

A modern, responsive landing page for Syntra.ai - an AI-powered productivity assistant that transforms your workflow through intelligent automation.

## 🚀 Features

### Interactive UI/UX
- **Dynamic Text Animation**: Animated hero heading with cycling words ("listening", "acting", "managing")
- **Scroll-Triggered Animations**: Smooth fade-in animations for the "How Syntra Works" flowchart
- **Interactive FAQ Section**: Expandable questions with smooth transitions
- **Waitlist Functionality**: Email collection with form validation and success states

### Modern Design
- **Premium Theme**: Off-white and off-black color scheme for a minimalist, modern look
- **Poppins Font**: Clean, professional typography
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Smooth Animations**: CSS transitions and keyframe animations throughout

### Key Sections
1. **Hero Section**: Compelling headline with animated text and waitlist CTA
2. **Why Choose Syntra.ai**: Benefits and value propositions
3. **How Syntra Works**: Interactive 5-step flowchart with scroll animations
4. **Testimonials**: User feedback and social proof
5. **FAQ Section**: Expandable questions and answers
6. **Final CTA**: Secondary waitlist signup opportunity

## 🛠️ Technologies Used

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/ui**: Modern UI component library
- **React Hooks**: State management and side effects
- **Intersection Observer API**: Scroll-triggered animations
- **Google Fonts**: Poppins font family

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/syntra-ai-landing.git
   cd syntra-ai-landing
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎨 Customization

### Colors
The theme uses a custom off-white and off-black palette defined in `app/globals.css`:
- Background: Off-white (#fafafa)
- Text: Off-black (#1a1a1a)
- Accents: Various gray shades

### Fonts
- Primary: Poppins (imported from Google Fonts)
- Weights: 300, 400, 500, 600, 700, 800, 900

### Animations
- Hero text animation: 2.5s visibility, 0.3s transition
- Flowchart animations: 700ms duration with ease-out timing
- FAQ transitions: 200ms duration

## 📱 Responsive Design

The landing page is fully responsive with breakpoints:
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically on every push

### Other Platforms
- **Netlify**: Connect your GitHub repository
- **GitHub Pages**: Use the `gh-pages` branch
- **AWS Amplify**: Connect your repository for automatic deployments

## 📄 Project Structure

```
syntra-ai-landing/
├── app/
│   ├── globals.css          # Global styles and CSS variables
│   ├── layout.tsx           # Root layout component
│   └── page.tsx             # Main landing page
├── components/
│   ├── ui/                  # Shadcn/ui components
│   ├── auth-guard.tsx       # Authentication guard
│   ├── testimonials.tsx     # Testimonials component
│   └── theme-provider.tsx   # Theme context provider
├── contexts/
│   └── auth-context.tsx     # Authentication context
├── hooks/
│   ├── use-mobile.tsx       # Mobile detection hook
│   └── use-toast.ts         # Toast notification hook
├── lib/
│   └── utils.ts             # Utility functions
└── public/                  # Static assets
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Shadcn/ui** for the beautiful UI components
- **Tailwind CSS** for the utility-first styling approach
- **Next.js** for the amazing React framework
- **Google Fonts** for the Poppins font family

## 📞 Contact

For questions or support, please reach out to the development team.

---

**Syntra.ai** - Transforming productivity through intelligent automation.
