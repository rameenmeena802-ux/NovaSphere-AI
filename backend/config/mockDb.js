import bcrypt from 'bcryptjs';

const salt = bcrypt.genSaltSync(10);
const hashedAdminPassword = bcrypt.hashSync('adminpassword', salt);
const hashedUserPassword = bcrypt.hashSync('userpassword', salt);

const mockStore = {
  users: [
    {
      _id: 'mock_user_admin_id_001',
      name: 'Novasphere Admin',
      email: 'admin@novasphere.ai',
      password: hashedAdminPassword,
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
      createdAt: new Date(),
    },
    {
      _id: 'mock_user_user_id_002',
      name: 'Jane Explorer',
      email: 'user@novasphere.ai',
      password: hashedUserPassword,
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80',
      createdAt: new Date(),
    }
  ],
  projects: [
    {
      _id: 'mock_project_1',
      title: 'Aetheris AI core',
      category: 'AI Agents',
      description: 'Autonomous neural agent capable of orchestrating complex decentralized micro-services and managing automated cloud infrastructure.',
      techStack: ['React', 'Node.js', 'TensorFlow', 'Socket.io'],
      mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      clientLink: 'https://aetheris.novasphere.ai',
      githubLink: 'https://github.com/novasphere/aetheris',
      featured: true,
      createdAt: new Date(),
    },
    {
      _id: 'mock_project_2',
      title: 'Helios Quantum Grid',
      category: 'Quantum Computing',
      description: 'Quantum simulation layer running complex molecular dynamics calculations via distributed client web threads.',
      techStack: ['Three.js', 'WebAssembly', 'Python', 'Go'],
      mediaUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80',
      clientLink: 'https://helios.novasphere.ai',
      githubLink: 'https://github.com/novasphere/helios',
      featured: true,
      createdAt: new Date(),
    },
    {
      _id: 'mock_project_3',
      title: 'Cerebro Synaptic Router',
      category: 'Neural Networks',
      description: 'Real-time multi-agent transformer routing internet queries based on emotional, contextual, and lexical affinity.',
      techStack: ['Next.js', 'PyTorch', 'FastAPI', 'MongoDB'],
      mediaUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80',
      clientLink: 'https://cerebro.novasphere.ai',
      githubLink: 'https://github.com/novasphere/cerebro',
      featured: false,
      createdAt: new Date(),
    }
  ],
  blogs: [
    {
      _id: 'mock_blog_1',
      title: 'The Rise of Symbiotic Intelligence',
      subtitle: 'How multi-agent collectives are redefining autonomous computation.',
      content: 'In the fast-evolving landscape of artificial intelligence, we are moving past monolithic models toward collaborative networks of specialized agents. These multi-agent ecosystems, or "Novasphere collectives", communicate dynamically via high-speed asynchronous messaging backbones to solve problems that exceed the cognitive bandwidth of any single node. This blog outlines the core architecture of our recent Aetheris agent launch...',
      author: 'Novasphere AI Team',
      coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
      tags: ['AI Agents', 'Collective Logic', 'Future Tech'],
      readTime: '4 min read',
      createdAt: new Date(),
    },
    {
      _id: 'mock_blog_2',
      title: 'Quantum Shaders in Web Graphics',
      subtitle: 'Leveraging hardware-accelerated WebGL to display sub-atomic simulations.',
      content: 'Rendering quantum phenomena inside a web browser has historically been limited by client computational speed. By shifting complex state mathematics directly into vertex and fragment shaders, we can visualize multi-dimensional electron clouds in real-time at 60 FPS. Here is how we implemented the shader nodes in our Helios simulator project...',
      author: 'Novasphere Graphics Lab',
      coverImage: 'https://images.unsplash.com/photo-1544256718-3bcf237f3974?auto=format&fit=crop&w=800&q=80',
      tags: ['Web3D', 'WebGL', 'Quantum Simulation'],
      readTime: '6 min read',
      createdAt: new Date(),
    }
  ],
  contacts: [],
  notifications: [
    {
      _id: 'mock_notif_1',
      type: 'system',
      title: 'System Initialized',
      message: 'Novasphere server nodes running successfully on simulation matrix.',
      read: false,
      createdAt: new Date(),
    }
  ]
};

export default mockStore;