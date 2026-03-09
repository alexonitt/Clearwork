import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { spring } from '../utils/motion';

const buttonVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.02, boxShadow: '0 0 24px rgba(255,255,255,0.15)' },
  tap: { scale: 0.98 },
};

const fillVariants = {
  rest: { x: '-100%' },
  hover: { x: 0 },
};

export function CTAButton({ to, children, primary = false, external }) {
  const content = (
    <motion.span
      className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-white px-6 py-3 text-sm font-medium"
      style={{
        ...(primary ? { backgroundColor: 'white', color: 'black' } : { color: 'white' }),
      }}
      variants={buttonVariants}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      transition={spring.gentle}
    >
      {!primary && (
        <motion.span
          className="absolute inset-0 z-0 rounded-full bg-white"
          variants={fillVariants}
          transition={{ duration: 0.3, ease: [0.65, 0, 0.35, 1] }}
          style={{ transformOrigin: 'left' }}
        />
      )}
      <motion.span
        className="relative z-10"
        variants={
          primary
            ? {}
            : {
                rest: { color: '#fff' },
                hover: { color: '#000', transition: { delay: 0.1 } },
              }
        }
      >
        {children}
      </motion.span>
    </motion.span>
  );

  if (external && typeof to === 'string' && (to.startsWith('http') || to.startsWith('mailto'))) {
    return (
      <a href={to} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return <Link to={to}>{content}</Link>;
}
