import { useState } from 'react';
import { motion} from 'motion/react';
import { 
  HelpCircle, 
  Mail, 
  MessageSquare, 
  AlertCircle, 
  Bug, 
  Lightbulb,
  Send,
  Phone,
  Clock,
  CheckCircle2
} from 'lucide-react';
import Sidebar from './Sidebar';

export default function Support({ onLogout }) {
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    priority: 'medium'
  });

  const supportCategories = [
    {
      id: 'general',
      label: 'General Support',
      icon: HelpCircle,
      color: 'cyan',
      description: 'General questions and assistance'
    },
    {
      id: 'technical',
      label: 'Technical Issue',
      icon: AlertCircle,
      color: 'red',
      description: 'Report technical problems'
    },
    {
      id: 'bug',
      label: 'Bug Report',
      icon: Bug,
      color: 'orange',
      description: 'Report software bugs'
    },
    {
      id: 'feature',
      label: 'Feature Request',
      icon: Lightbulb,
      color: 'yellow',
      description: 'Suggest new features'
    },
  ];

  const faqItems = [
    {
      question: 'How do I reset my password?',
      answer: 'Go to Settings > Security and click on "Update Password" to change your password.'
    },
    {
      question: 'How to assign operators to machines?',
      answer: 'Navigate to the Operator Assignment page and use the drag-and-drop interface to assign operators.'
    },
    {
      question: 'What are the system requirements?',
      answer: 'Modern web browser (Chrome, Firefox, Safari, Edge) with internet connection.'
    },
    {
      question: 'How do I export production reports?',
      answer: 'Go to Dashboard and click on the export button in the analytics section.'
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Support request submitted:', formData);
    alert('Support request submitted successfully!');
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 200 + 50,
              height: Math.random() * 200 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: i % 2 === 0 
                ? 'radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(251, 191, 36, 0.08) 0%, transparent 70%)',
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: Math.random() * 15 + 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Sidebar */}
      <Sidebar onLogout={onLogout} />

      {/* Main Content */}
      <div className="flex-1 overflow-auto relative z-10">
        <div className="max-w-[1400px] mx-auto px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-white to-yellow-400 bg-clip-text text-transparent relative inline-block"
            >
              Support Center
              <motion.div
                className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-cyan-500 to-yellow-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: 0.3, duration: 0.8 }}
              />
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-slate-400"
            >
              We're here to help! Get support for your AtomOne Technologies system
            </motion.p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {/* Contact Info Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="backdrop-blur-xl bg-gradient-to-br from-cyan-500/10 to-[#1e293b]/60 border border-cyan-500/30 rounded-2xl p-6 h-full hover:border-cyan-500/50 transition-all group"
            >
              <motion.div 
                className="w-14 h-14 rounded-xl bg-cyan-500/20 flex items-center justify-center mb-4 relative group-hover:scale-110 transition-transform"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <div className="absolute inset-0 bg-cyan-500 rounded-xl blur-md opacity-30" />
                <Mail className="w-7 h-7 text-cyan-400 relative z-10" />
              </motion.div>
              <h3 className="text-xl font-semibold text-cyan-400 mb-2">Email Support</h3>
              <p className="text-slate-400 text-sm mb-3">Send us your queries anytime</p>
              <a href="mailto:support@atomone.in" className="text-cyan-300 hover:text-cyan-200 transition-colors">
                support@atomone.in
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="backdrop-blur-xl bg-gradient-to-br from-yellow-500/10 to-[#1e293b]/60 border border-yellow-500/30 rounded-2xl p-6 h-full hover:border-yellow-500/50 transition-all group"
            >
              <motion.div 
                className="w-14 h-14 rounded-xl bg-yellow-500/20 flex items-center justify-center mb-4 relative group-hover:scale-110 transition-transform"
                whileHover={{ rotate: -360 }}
                transition={{ duration: 0.6 }}
              >
                <div className="absolute inset-0 bg-yellow-500 rounded-xl blur-md opacity-30" />
                <Phone className="w-7 h-7 text-yellow-400 relative z-10" />
              </motion.div>
              <h3 className="text-xl font-semibold text-yellow-400 mb-2">Phone Support</h3>
              <p className="text-slate-400 text-sm mb-3">Call us for immediate assistance</p>
              <a href="tel:+919876543210" className="text-yellow-300 hover:text-yellow-200 transition-colors">
                +91 98765 43210
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="backdrop-blur-xl bg-gradient-to-br from-green-500/10 to-[#1e293b]/60 border border-green-500/30 rounded-2xl p-6 h-full hover:border-green-500/50 transition-all group"
            >
              <motion.div 
                className="w-14 h-14 rounded-xl bg-green-500/20 flex items-center justify-center mb-4 relative group-hover:scale-110 transition-transform"
                animate={{
                  boxShadow: ["0 0 0 0 rgba(34, 197, 94, 0)", "0 0 0 10px rgba(34, 197, 94, 0)", "0 0 0 0 rgba(34, 197, 94, 0)"]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="absolute inset-0 bg-green-500 rounded-xl blur-md opacity-30" />
                <Clock className="w-7 h-7 text-green-400 relative z-10" />
              </motion.div>
              <h3 className="text-xl font-semibold text-green-400 mb-2">Response Time</h3>
              <p className="text-slate-400 text-sm mb-3">Average response time</p>
              <p className="text-green-300 text-lg font-semibold">Within 2 hours</p>
            </motion.div>
          </div>

          {/* Support Form with Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="backdrop-blur-xl bg-gradient-to-br from-[#1e293b]/80 to-[#1e293b]/60 border border-cyan-500/30 rounded-2xl p-8"
          >
            {/* Category Tabs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              {supportCategories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <motion.button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 rounded-xl border transition-all flex items-center justify-center gap-2 ${
                      selectedCategory === cat.id
                        ? 'bg-gradient-to-r from-cyan-500/20 to-yellow-500/20 border-cyan-500/50 text-cyan-400'
                        : 'bg-[#0f172a]/50 border-slate-700 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium hidden md:inline">{cat.label}</span>
                  </motion.button>
                );
              })}
            </div>

            {/* Category Description */}
            <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20 mb-6">
              <p className="text-cyan-300">
                {supportCategories.find(c => c.id === selectedCategory)?.description}
              </p>
            </div>

            {/* Support Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-slate-300 mb-2 block text-sm font-medium">Your Name</label>
                  <input 
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full bg-[#0f172a]/50 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-300 mb-2 block text-sm font-medium">Email Address</label>
                  <input 
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                    className="w-full bg-[#0f172a]/50 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 mb-2 block text-sm font-medium">Subject</label>
                <input 
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="Brief description of your issue"
                  className="w-full bg-[#0f172a]/50 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
                  required
                />
              </div>

              <div>
                <label className="text-slate-300 mb-2 block text-sm font-medium">Priority Level</label>
                <div className="grid grid-cols-3 gap-3">
                  {['low', 'medium', 'high'].map((priority) => (
                    <motion.button
                      key={priority}
                      type="button"
                      onClick={() => setFormData({ ...formData, priority })}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-3 rounded-lg border transition-all capitalize ${
                        formData.priority === priority
                          ? priority === 'high'
                            ? 'bg-red-500/20 border-red-500/50 text-red-400'
                            : priority === 'medium'
                            ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400'
                            : 'bg-green-500/20 border-green-500/50 text-green-400'
                          : 'bg-[#0f172a]/50 border-slate-700 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      {priority}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-slate-300 mb-2 block text-sm font-medium">Message</label>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Please describe your issue in detail..."
                  rows={6}
                  className="w-full bg-[#0f172a]/50 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all resize-none"
                  required
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white py-4 rounded-lg text-lg font-semibold flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/30 transition-all"
              >
                <Send className="w-5 h-5" />
                Send Support Request
              </motion.button>
            </form>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <h2 className="text-2xl font-bold text-slate-200 mb-6 flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-cyan-400" />
              Frequently Asked Questions
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {faqItems.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="backdrop-blur-xl bg-gradient-to-br from-[#1e293b]/80 to-[#1e293b]/60 border border-slate-700/30 rounded-2xl p-6 hover:border-cyan-500/30 transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-slate-200 mb-2 group-hover:text-cyan-400 transition-colors">
                        {faq.question}
                      </h3>
                      <p className="text-slate-400 text-sm leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
