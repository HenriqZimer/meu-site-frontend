/**
 * Composable modernizado para animações de scroll
 * Integrado com o novo sistema de animações
 */

import type { AnimationType } from "./useAnimations";

export interface ScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  animationType?: AnimationType;
  delay?: number;
  once?: boolean;
}

export const useScrollAnimation = () => {
  const defaultOptions: ScrollAnimationOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
    animationType: "fadeUp",
    delay: 0,
    once: true,
  };

  const observeElements = (customOptions?: ScrollAnimationOptions) => {
    // @ts-expect-error - import.meta.client is available in Nuxt runtime
    if (import.meta.client) {
      const options = { ...defaultOptions, ...customOptions };

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const element = entry.target as HTMLElement;

              // Aplicar delay se especificado
              const delay =
                options.delay || parseInt(element.dataset.delay || "0");

              setTimeout(() => {
                element.classList.remove("animate-initial");
                element.classList.add("animate-visible");

                // Adicionar classe de animação específica se especificada
                const animationType =
                  element.dataset.animation || options.animationType;
                if (animationType) {
                  element.classList.add(`animate-${animationType}`);
                }
              }, delay);

              // Se é 'once', parar de observar após animar
              if (options.once) {
                observer.unobserve(element);
              }
            }
          });
        },
        {
          threshold: options.threshold,
          rootMargin: options.rootMargin,
        }
      );

      // Observar elementos com diferentes seletores
      const selectors = [
        ".animate-on-scroll",
        ".animate-initial",
        "[data-animate]",
      ];

      selectors.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el) => {
          // Adicionar classe inicial se não existir
          if (!el.classList.contains("animate-initial")) {
            el.classList.add("animate-initial");
          }
          observer.observe(el);
        });
      });

      return observer;
    }
  };

  // Função para animar elementos específicos
  const animateElement = (
    element: HTMLElement,
    animationType: AnimationType = "fadeUp",
    delay: number = 0
  ) => {
    setTimeout(() => {
      element.classList.remove("animate-initial");
      element.classList.add("animate-visible", `animate-${animationType}`);
    }, delay);
  };

  // Função para animar sequência de elementos (stagger)
  const animateSequence = (
    elements: HTMLElement[] | NodeListOf<HTMLElement>,
    animationType: AnimationType = "fadeUp",
    staggerDelay: number = 100
  ) => {
    Array.from(elements).forEach((element, index) => {
      animateElement(element, animationType, index * staggerDelay);
    });
  };

  // Função para reset de animações
  const resetAnimations = (selector: string = ".animate-visible") => {
    // @ts-expect-error - import.meta.client is available in Nuxt runtime
    if (import.meta.client) {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        element.classList.remove("animate-visible");
        element.classList.add("animate-initial");
        // Remover classes de animação
        element.className = element.className
          .replace(/animate-\w+/g, "")
          .trim();
      });
    }
  };

  return {
    observeElements,
    animateElement,
    animateSequence,
    resetAnimations,
  };
};
