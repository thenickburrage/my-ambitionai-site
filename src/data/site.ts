// Site configuration
export const site = {
  name: 'Pixel Studio',
  tagline: 'Creative Digital Agency',
  description: 'We craft bold digital experiences that captivate audiences and drive results.',
  url: '/',
  email: 'hello@pixelstudio.com',
  phone: '(555) 987-6543',
  address: {
    street: '456 Creative Ave, Suite 200',
    city: 'Los Angeles',
    state: 'CA',
    zip: '90028',
  },
  logo: {
    src: '/assets/img/logo.svg',
    srcLight: '/assets/img/logo-light.svg',
    alt: 'Pixel Studio',
  },
};

// Navigation
export interface NavItem {
  text: string;
  url: string;
  children?: NavItem[];
}

export const nav: NavItem[] = [
  { text: 'Work', url: '/work' },
  { text: 'Services', url: '/services' },
  { text: 'About', url: '/about' },
  { text: 'Contact', url: '/contact' },
];

// Header configuration
export const header = {
  darkMode: true,
  cta: { text: 'Start a Project', url: '/contact' },
};

// Social links
export const socialLinks = [
  {
    name: 'Twitter',
    url: '#',
    icon: '<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>',
  },
  {
    name: 'Instagram',
    url: '#',
    icon: '<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>',
  },
  {
    name: 'LinkedIn',
    url: '#',
    icon: '<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>',
  },
  {
    name: 'Dribbble',
    url: '#',
    icon: '<path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.025-8.04 6.4 1.73 1.358 3.92 2.166 6.29 2.166 1.42 0 2.77-.29 4-.816zm-11.62-2.58c.232-.4 3.045-5.055 8.332-6.765.135-.045.27-.084.405-.12-.26-.585-.54-1.167-.832-1.74C7.17 11.775 2.206 11.71 1.756 11.7l-.004.312c0 2.633.998 5.037 2.634 6.855zm-2.42-8.955c.46.008 4.683.026 9.477-1.248-1.698-3.018-3.53-5.558-3.8-5.928-2.868 1.35-5.01 3.99-5.676 7.17zM9.6 2.052c.282.38 2.145 2.914 3.822 6 3.645-1.365 5.19-3.44 5.373-3.702-1.81-1.61-4.19-2.586-6.795-2.586-.825 0-1.63.1-2.4.285zm10.335 3.483c-.218.29-1.935 2.493-5.724 4.04.24.49.47.985.68 1.486.08.18.15.36.22.53 3.41-.43 6.8.26 7.14.33-.02-2.42-.88-4.64-2.31-6.38z"/>',
  },
];

// Services
export interface Service {
  icon: string;
  title: string;
  description: string;
  features?: string[];
}

export const services: Service[] = [
  {
    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />',
    title: 'Web Design',
    description: 'Beautiful, responsive websites that convert visitors into customers.',
    features: ['Custom Design', 'Responsive Development', 'CMS Integration', 'SEO Optimization'],
  },
  {
    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />',
    title: 'Mobile Apps',
    description: 'Native and cross-platform apps that users love to use.',
    features: ['iOS & Android', 'React Native', 'UI/UX Design', 'App Store Launch'],
  },
  {
    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />',
    title: 'Brand Identity',
    description: 'Memorable brands that stand out and tell your story.',
    features: ['Logo Design', 'Brand Guidelines', 'Visual Identity', 'Brand Strategy'],
  },
  {
    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />',
    title: 'Digital Marketing',
    description: 'Data-driven campaigns that grow your business.',
    features: ['Social Media', 'Content Strategy', 'PPC Advertising', 'Analytics & Reporting'],
  },
];

// Portfolio projects
export interface Project {
  slug: string;
  title: string;
  client: string;
  category: string;
  year: number;
  thumbnail: string;
  images?: string[];
  description: string;
  challenge?: string;
  solution?: string;
  results?: string[];
  services: string[];
  featured?: boolean;
}

export const projects: Project[] = [
  {
    slug: 'nova-fintech',
    title: 'Nova Fintech Rebrand',
    client: 'Nova Financial',
    category: 'Branding',
    year: 2024,
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
    description: 'Complete brand overhaul for a leading fintech startup, positioning them as the future of personal banking.',
    challenge: 'Nova needed to stand out in a crowded fintech market while maintaining trust and professionalism.',
    solution: 'We created a bold, modern identity that balances innovation with reliability through a refined color palette and geometric design system.',
    results: ['200% increase in app downloads', '45% boost in brand recognition', 'Featured in TechCrunch'],
    services: ['Brand Identity', 'Web Design', 'Mobile App'],
    featured: true,
  },
  {
    slug: 'wellness-app',
    title: 'Mindful Wellness App',
    client: 'Mindful Inc.',
    category: 'Mobile App',
    year: 2024,
    thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop',
    description: 'A meditation and wellness app designed to help users build healthy daily habits.',
    challenge: 'Create an engaging yet calming experience that encourages daily usage without feeling overwhelming.',
    solution: 'We designed a minimal, intuitive interface with gentle animations and a soothing color palette that promotes relaxation.',
    results: ['500K+ downloads in first month', '4.8 star rating', '72% daily active users'],
    services: ['UI/UX Design', 'Mobile Development', 'Brand Identity'],
    featured: true,
  },
  {
    slug: 'urban-eats',
    title: 'Urban Eats Platform',
    client: 'Urban Eats',
    category: 'Web Design',
    year: 2024,
    thumbnail: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop',
    description: 'A food delivery platform connecting local restaurants with hungry customers.',
    challenge: 'Build a platform that serves both restaurant owners and customers with different needs and goals.',
    solution: 'We created a dual-sided marketplace with distinct experiences optimized for each user type.',
    results: ['150 restaurant partners', '$2M GMV in 6 months', '35% month-over-month growth'],
    services: ['Web Design', 'Development', 'Digital Marketing'],
    featured: true,
  },
  {
    slug: 'eco-fashion',
    title: 'Eco Fashion E-commerce',
    client: 'GreenThread',
    category: 'E-commerce',
    year: 2023,
    thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop',
    description: 'An e-commerce experience for a sustainable fashion brand.',
    services: ['Web Design', 'Development', 'Brand Identity'],
  },
  {
    slug: 'tech-conference',
    title: 'TechSummit 2024',
    client: 'TechSummit',
    category: 'Web Design',
    year: 2023,
    thumbnail: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
    description: 'Event website and branding for a major technology conference.',
    services: ['Web Design', 'Brand Identity', 'Digital Marketing'],
  },
  {
    slug: 'fitness-tracker',
    title: 'FitPro Dashboard',
    client: 'FitPro',
    category: 'Web App',
    year: 2023,
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
    description: 'A comprehensive fitness tracking dashboard for gym owners.',
    services: ['UI/UX Design', 'Development'],
  },
];

// Team members
export interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    dribbble?: string;
  };
}

export const team: TeamMember[] = [
  {
    name: 'Alex Rivera',
    role: 'Founder & Creative Director',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    bio: 'With 15+ years in design, Alex leads our creative vision and ensures every project exceeds expectations.',
    social: { twitter: '#', linkedin: '#', dribbble: '#' },
  },
  {
    name: 'Sarah Chen',
    role: 'Head of Design',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    bio: 'Sarah brings brands to life through thoughtful design systems and beautiful user experiences.',
    social: { twitter: '#', linkedin: '#', dribbble: '#' },
  },
  {
    name: 'Marcus Johnson',
    role: 'Lead Developer',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    bio: 'Marcus turns designs into reality with clean, performant code and cutting-edge technologies.',
    social: { twitter: '#', linkedin: '#' },
  },
  {
    name: 'Emily Park',
    role: 'Strategy Director',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    bio: 'Emily ensures our creative work drives real business results through data-driven strategies.',
    social: { linkedin: '#' },
  },
];

// Testimonials
export interface Testimonial {
  name: string;
  role: string;
  company: string;
  image?: string;
  text: string;
}

export const testimonials: Testimonial[] = [
  {
    name: 'David Kim',
    role: 'CEO',
    company: 'Nova Financial',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    text: "Pixel Studio transformed our brand completely. They didn't just design a logo—they created an entire identity that resonates with our customers and sets us apart from competitors.",
  },
  {
    name: 'Lisa Thompson',
    role: 'Founder',
    company: 'Mindful Inc.',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop',
    text: 'Working with Pixel Studio was a game-changer. Their attention to detail and understanding of user experience helped us create an app that users genuinely love.',
  },
  {
    name: 'Michael Torres',
    role: 'Marketing Director',
    company: 'Urban Eats',
    image: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop',
    text: "The team at Pixel Studio exceeded all expectations. They delivered a platform that's not only beautiful but has directly contributed to our rapid growth.",
  },
];

// Stats
export const stats = [
  { value: '150+', label: 'Projects Delivered' },
  { value: '50+', label: 'Happy Clients' },
  { value: '12', label: 'Team Members' },
  { value: '8', label: 'Years Experience' },
];

// Awards
export const awards = [
  { name: 'Awwwards Site of the Day', year: 2024 },
  { name: 'CSS Design Awards', year: 2024 },
  { name: 'FWA of the Month', year: 2023 },
  { name: 'Webby Awards Honoree', year: 2023 },
];
