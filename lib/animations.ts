// Variantes de animaciones reutilizables para transiciones
export const pageVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeInOut",
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

// Clases de Tailwind para animaciones suaves
export const transitionClasses = {
  fadeIn: "transition-opacity duration-300 ease-in-out",
  slideIn: "transition-all duration-300 ease-in-out",
  scaleIn: "transition-transform duration-300 ease-in-out",
  all: "transition-all duration-300 ease-in-out",
};

// Estilos CSS personalizados para animaciones rápidas
export const animationStyles = `
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideInDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeInScale {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .animate-fadeIn {
    animation: fadeIn 0.3s ease-in-out;
  }

  .animate-slideInUp {
    animation: slideInUp 0.4s ease-in-out;
  }

  .animate-slideInDown {
    animation: slideInDown 0.4s ease-in-out;
  }

  .animate-fadeInScale {
    animation: fadeInScale 0.3s ease-in-out;
  }

  .page-enter {
    animation: fadeInScale 0.3s ease-out;
  }

  .page-exit {
    animation: fadeIn 0.2s ease-in reverse;
  }

  .tab-transition {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
`;
