import React from 'react';
import ReactDOM from 'react-dom/client';

import {
  ArrowUpRight,
  Code2,
  Layers3,
  Smartphone,
  Sparkles,
  MoveRight,
  Menu,
  X,
  Check
} from 'lucide-react';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate
} from 'react-router-dom';

import './styles.css';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ClientDashboard from './pages/client/ClientDashboard';
import AdminRequests from "./admin/pages/AdminRequests";
import AdminLogin from './admin/pages/AdminLogin';
import AdminDashboard from './admin/pages/AdminDashboard';
import AdminClients from './admin/pages/AdminClients';
import AdminProjects from './admin/pages/AdminProjects';
import ProtectedAdminRoute from './admin/components/ProtectedAdminRoute';
import ProtectedClientRoute from "./pages/client/ProtectedClientRoute";

gsap.registerPlugin(ScrollTrigger);


/* =========================================================
   DATA
========================================================= */

const capabilities = [
  {
    num: '01',
    icon: Code2,
    title: 'Web & Software',
    text:
      'Fast, reliable websites, web applications and custom software built around real business needs.'
  },
  {
    num: '02',
    icon: Layers3,
    title: 'Digital Products',
    text:
      'From early product thinking to interfaces and production-ready experiences that can scale.'
  },
  {
    num: '03',
    icon: Smartphone,
    title: 'Mobile Experiences',
    text:
      'Thoughtful mobile products with clear flows, strong usability and a consistent brand experience.'
  },
  {
    num: '04',
    icon: Sparkles,
    title: 'UI / UX',
    text:
      'Simple, polished interfaces designed to make complex products feel natural.'
  }
];


const principles = [
  {
    num: '01',
    symbol: '—',
    title: 'Purpose before decoration',
    text:
      'Every interaction and visual choice should serve a reason beyond simply looking good.'
  },
  {
    num: '02',
    symbol: '◇',
    title: 'Systems over patches',
    text:
      'We prefer structures that stay understandable when requirements, content and priorities change.'
  },
  {
    num: '03',
    symbol: '•',
    title: 'Finish is part of the product',
    text:
      'Performance, edge states and the details between screens matter as much as the main flow.'
  }
];


const workSteps = [
  {
    num: '01',
    symbol: '◌',
    title: 'Listen',
    text:
      'Goals, constraints and context come first. We learn what matters before deciding what should be made.'
  },
  {
    num: '02',
    symbol: '◇',
    title: 'Frame',
    text:
      'Priorities, scope and direction are aligned into a practical path forward.'
  },
  {
    num: '03',
    symbol: '+',
    title: 'Make',
    text:
      'The experience and system take shape through focused iterations instead of one giant handoff.'
  },
  {
    num: '04',
    symbol: '✓',
    title: 'Refine',
    text:
      'We test the important details, tighten the experience and prepare it for release.'
  }
];


const whyFaldren = [
  {
    symbol: '↗',
    title: 'Direct',
    text:
      'Decisions stay close to the work, so momentum is not lost between conversations and execution.'
  },
  {
    symbol: '◉',
    title: 'Context-led',
    text:
      'The path follows the actual problem rather than forcing every project through the same template.'
  },
  {
    symbol: '◇',
    title: 'Considered',
    text:
      'Trade-offs are made deliberately, with attention to what matters now and what can wait.'
  },
  {
    symbol: '∞',
    title: 'Adaptable',
    text:
      'Direction can evolve as new information appears without losing sight of the core objective.'
  }
];




/* =========================================================
   APP
========================================================= */

function App() {
  const navigate = useNavigate();

  // existing code...
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const appRef = React.useRef(null);
  const lenisRef = React.useRef(null);


  /* =======================================================
     NAVIGATION
  ======================================================= */

  const go = (id) => {

    const element = document.getElementById(id);

    if (!element) return;


    if (lenisRef.current) {

      lenisRef.current.scrollTo(element, {
        offset: -72,
        duration: 1.25
      });

    } else {

      element.scrollIntoView({
        behavior: 'smooth'
      });

    }


    setMenuOpen(false);
  };


  const goTop = () => {

    if (lenisRef.current) {

      lenisRef.current.scrollTo(0, {
        duration: 1.2
      });

    } else {

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });

    }

  };


  /* =======================================================
     MAIN MOTION SYSTEM
  ======================================================= */

  React.useLayoutEffect(() => {

    /* =====================================================
       LENIS
    ===================================================== */

    const lenis = new Lenis({

      duration: 1.15,

      smoothWheel: true,

      wheelMultiplier: 0.88,

      touchMultiplier: 1

    });


    lenisRef.current = lenis;


    lenis.on(
      'scroll',
      ScrollTrigger.update
    );


    const lenisTicker = (time) => {

      lenis.raf(time * 1000);

    };


    gsap.ticker.add(lenisTicker);

    gsap.ticker.lagSmoothing(0);



    const mm = gsap.matchMedia();



    const ctx = gsap.context(() => {


      /* ===================================================
         HERO INTRO
         The loader is handled independently by index.html.
      =================================================== */

      const heroTimeline = gsap.timeline({
        delay: 1.35,
        defaults: {
          ease: 'power4.out'
        }
      });

      heroTimeline
        .from('.nav-wrap', {
          y: -28,
          opacity: 0,
          duration: 0.8
        })
        .from(
          '.hero-eyebrow',
          {
            y: 24,
            opacity: 0,
            duration: 0.7
          },
          '-=0.42'
        )
        .from(
          '.hero-word',
          {
            yPercent: 115,
            duration: 1.05,
            stagger: 0.1,
            ease: 'power4.out'
          },
          '-=0.34'
        )
        .from(
          '.hero-copy',
          {
            y: 38,
            opacity: 0,
            duration: 0.85
          },
          '-=0.65'
        )
        .from(
          '.hero-actions',
          {
            y: 30,
            opacity: 0,
            duration: 0.78
          },
          '-=0.58'
        )
        .from(
          '.hero-stage',
          {
            scale: 0.72,
            rotate: -13,
            opacity: 0,
            duration: 1.25,
            ease: 'expo.out'
          },
          '-=0.92'
        )
        .from(
          '.stage-label',
          {
            opacity: 0,
            scale: 0.72,
            stagger: 0.1,
            duration: 0.6
          },
          '-=0.48'
        )
        .from(
          '.hero-scroll',
          {
            opacity: 0,
            y: 16,
            duration: 0.6
          },
          '-=0.38'
        );


      /* ===================================================
         HERO — SCROLL DEPTH
      =================================================== */

      gsap.to(
        '.hero-content',
        {

          y: -150,

          opacity: 0.12,

          ease: 'none',

          scrollTrigger: {

            trigger: '.hero',

            start: 'top top',

            end: 'bottom top',

            scrub: 1.1

          }

        }
      );


      gsap.to(
        '.hero-stage',
        {

          y: -125,

          rotate: 9,

          scale: 1.12,

          ease: 'none',

          scrollTrigger: {

            trigger: '.hero',

            start: 'top top',

            end: 'bottom top',

            scrub: 1.25

          }

        }
      );


      gsap.to(
        '.hero-grid',
        {

          y: 90,

          opacity: 0,

          ease: 'none',

          scrollTrigger: {

            trigger: '.hero',

            start: 'top top',

            end: 'bottom top',

            scrub: 1

          }

        }
      );


      gsap.to(
        '.hero-scroll-line span',
        {

          scaleY: 0,

          transformOrigin:
            'bottom',

          ease: 'none',

          scrollTrigger: {

            trigger: '.hero',

            start: 'top top',

            end: '65% top',

            scrub: true

          }

        }
      );



      /* ===================================================
         CAPABILITIES INTRO
      =================================================== */

      gsap.from(
        '.capabilities-head .section-kicker',
        {

          y: 30,

          opacity: 0,

          duration: 0.75,

          scrollTrigger: {

            trigger:
              '.capabilities-head',

            start:
              'top 78%'

          }

        }
      );


      gsap.from(
        '.capabilities-title-line > span',
        {

          yPercent: 110,

          stagger: 0.12,

          duration: 1,

          ease: 'power4.out',

          scrollTrigger: {

            trigger:
              '.capabilities-title',

            start:
              'top 78%'

          }

        }
      );


      gsap.from(
        '.capabilities-description',
        {

          y: 45,

          opacity: 0,

          duration: 0.9,

          scrollTrigger: {

            trigger:
              '.capabilities-head',

            start:
              'top 72%'

          }

        }
      );



      /* ===================================================
         SERVICES — AUTOPLAY CAROUSEL
         No wheel hijacking. No pinning. No fake scroll height.
      =================================================== */

      mm.add(
        '(min-width: 901px)',
        () => {

          const viewport =
            document.querySelector('.capabilities-viewport');

          const track =
            document.querySelector('.capabilities-track');

          const cards =
            Array.from(
              document.querySelectorAll('.service-card')
            );


          if (
            !viewport ||
            !track ||
            cards.length === 0
          ) {
            return;
          }


          let currentIndex = 0;
          let isVisible = false;
          let isPaused = false;


          const getGap = () => {

            const styles =
              window.getComputedStyle(track);

            return (
              parseFloat(styles.columnGap) ||
              parseFloat(styles.gap) ||
              24
            );

          };


          const getStep = () => {

            const cardWidth =
              cards[0].getBoundingClientRect().width;

            return cardWidth + getGap();

          };


          const getMaxIndex = () => {

            const step =
              getStep();

            const maxMove =
              Math.max(
                0,
                track.scrollWidth -
                viewport.clientWidth
              );

            return Math.max(
              0,
              Math.ceil(
                maxMove / step
              )
            );

          };


          const moveTo = (
            index,
            immediate = false
          ) => {

            const maxIndex =
              getMaxIndex();

            currentIndex =
              Math.max(
                0,
                Math.min(
                  index,
                  maxIndex
                )
              );


            const step =
              getStep();

            const maxMove =
              Math.max(
                0,
                track.scrollWidth -
                viewport.clientWidth
              );

            const x =
              Math.min(
                currentIndex * step,
                maxMove
              );


            gsap.to(
              track,
              {
                x: -x,

                duration:
                  immediate
                    ? 0
                    : 0.95,

                ease:
                  'power3.inOut',

                overwrite:
                  true
              }
            );


            cards.forEach(
              (card, cardIndex) => {

                const active =
                  cardIndex === currentIndex;


                card.classList.toggle(
                  'is-active',
                  active
                );

              }
            );

          };


          
         /* ===================================================
   MOUSE DRAG — DESKTOP
=================================================== */

let isDragging = false;
let dragStartX = 0;
let dragStartTranslate = 0;

const getMaxMove = () => {
  return Math.max(
    0,
    track.scrollWidth - viewport.clientWidth
  );
};

const clampX = (x) => {
  return Math.max(
    -getMaxMove(),
    Math.min(0, x)
  );
};

const handlePointerDown = (e) => {
  isDragging = true;

  dragStartX = e.clientX;

  dragStartTranslate =
    Number(gsap.getProperty(track, 'x')) || 0;

  gsap.killTweensOf(track);

  viewport.setPointerCapture(e.pointerId);

  viewport.style.cursor = 'grabbing';
};

const handlePointerMove = (e) => {
  if (!isDragging) return;

  const distance =
    e.clientX - dragStartX;

  const newX =
    clampX(
      dragStartTranslate + distance
    );

  gsap.set(track, {
    x: newX
  });
};

const handlePointerUp = (e) => {
  if (!isDragging) return;

  isDragging = false;

  try {
    viewport.releasePointerCapture(
      e.pointerId
    );
  } catch {}

  viewport.style.cursor = 'grab';

  const currentX =
    Number(gsap.getProperty(track, 'x')) || 0;

  const step = getStep();

  const maxMove = getMaxMove();

  let nearestIndex =
    Math.round(
      Math.abs(currentX) / step
    );

  nearestIndex =
    Math.max(
      0,
      Math.min(
        nearestIndex,
        Math.ceil(maxMove / step)
      )
    );

  moveTo(nearestIndex);
};

viewport.addEventListener(
  'pointerdown',
  handlePointerDown
);

viewport.addEventListener(
  'pointermove',
  handlePointerMove
);

viewport.addEventListener(
  'pointerup',
  handlePointerUp
);

viewport.addEventListener(
  'pointercancel',
  handlePointerUp
);
          /*
            Initial position
          */
          moveTo(0, true);


          /*
            Only autoplay while services are visible.
          */

          const observer =
            new IntersectionObserver(
              ([entry]) => {

                isVisible =
                  entry.isIntersecting &&
                  entry.intersectionRatio >= 0.45;

              },
              {
                threshold: [
                  0,
                  0.45,
                  1
                ]
              }
            );


          observer.observe(viewport);


          /*
            Hover = pause
          */

          const pause = () => {
            isPaused = true;
          };


          const resume = () => {
            isPaused = false;
          };


          viewport.addEventListener(
            'mouseenter',
            pause
          );


          viewport.addEventListener(
            'mouseleave',
            resume
          );


          /*
            Autoplay
          */

          const timer =
            window.setInterval(
              () => {

                if (
                  !isVisible ||
                  isPaused
                ) {
                  return;
                }


                const maxIndex =
                  getMaxIndex();


                if (maxIndex <= 0) {
                  return;
                }


                if (
                  currentIndex >=
                  maxIndex
                ) {

                  moveTo(0);

                } else {

                  moveTo(
                    currentIndex + 1
                  );

                }

              },
              3200
            );


          /*
            Resize safety
          */

          const handleResize = () => {
            moveTo(
              Math.min(
                currentIndex,
                getMaxIndex()
              ),
              true
            );
          };


          window.addEventListener(
            'resize',
            handleResize
          );


          return () => {

            observer.disconnect();

            window.clearInterval(
              timer
            );

            viewport.removeEventListener(
              'mouseenter',
              pause
            );

            viewport.removeEventListener(
              'mouseleave',
              resume
            );

            window.removeEventListener(
              'resize',
              handleResize
            );

            viewport.removeEventListener(
  'pointerdown',
  handlePointerDown
);

viewport.removeEventListener(
  'pointermove',
  handlePointerMove
);

viewport.removeEventListener(
  'pointerup',
  handlePointerUp
);

viewport.removeEventListener(
  'pointercancel',
  handlePointerUp
);

            gsap.killTweensOf(
              track
            );

          };

        }
      );


      /* ===================================================
         MOBILE / TABLET
         Normal vertical service list
      =================================================== */

      mm.add(
        '(max-width: 900px)',
        () => {

          gsap.from(
            '.service-card',
            {
              y: 55,

              opacity: 0,

              stagger: 0.1,

              duration: 0.8,

              ease:
                'power3.out',

              scrollTrigger: {
                trigger:
                  '.capabilities-track',

                start:
                  'top 82%',

                once:
                  true
              }
            }
          );

        }
      );


      /* ===================================================
         HOW WE WORK
      =================================================== */

      gsap.from(
        '.process-title-line > span',
        {
          yPercent: 110,
          stagger: 0.1,
          duration: 1,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: '.process-title',
            start: 'top 80%'
          }
        }
      );


      gsap.from(
        '.process-intro-copy',
        {
          y: 40,
          opacity: 0,
          duration: 0.9,
          scrollTrigger: {
            trigger: '.process-head',
            start: 'top 76%'
          }
        }
      );


      gsap.utils
        .toArray('.process-step')
        .forEach((step) => {

          gsap.from(
            step.querySelector('.process-step-inner'),
            {
              y: 46,
              opacity: 0,
              duration: 0.85,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: step,
                start: 'top 84%'
              }
            }
          );


          gsap.from(
            step.querySelector('.process-step-line'),
            {
              scaleX: 0,
              transformOrigin: 'left',
              duration: 1,
              ease: 'power3.inOut',
              scrollTrigger: {
                trigger: step,
                start: 'top 88%'
              }
            }
          );

        });


      /* ===================================================
         WHY FALDREN
      =================================================== */

      gsap.from(
        '.why-title-line > span',
        {
          yPercent: 110,
          stagger: 0.1,
          duration: 1,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: '.why-title',
            start: 'top 80%'
          }
        }
      );


      gsap.from(
        '.why-card',
        {
          y: 70,
          opacity: 0,
          stagger: 0.1,
          duration: 0.9,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: '.why-grid',
            start: 'top 82%'
          }
        }
      );



      /* ===================================================
         APPROACH SECTION — CINEMATIC WIPE
      =================================================== */

      gsap.fromTo(
        '.approach-section',

        {

          clipPath:
            'inset(8% 2% 8% 2% round 32px)',

          scale: 0.97

        },

        {

          clipPath:
            'inset(0% 0% 0% 0% round 0px)',

          scale: 1,

          ease: 'none',

          scrollTrigger: {

            trigger:
              '.approach-section',

            start:
              'top 94%',

            end:
              'top 38%',

            scrub: 1

          }

        }
      );


      gsap.to(
        '.approach-ghost',
        {

          xPercent: -14,

          ease: 'none',

          scrollTrigger: {

            trigger:
              '.approach-section',

            start:
              'top bottom',

            end:
              'bottom top',

            scrub: 1.5

          }

        }
      );


      gsap.from(
        '.approach-kicker',
        {

          y: 25,

          opacity: 0,

          duration: 0.75,

          scrollTrigger: {

            trigger:
              '.approach-intro',

            start:
              'top 78%'

          }

        }
      );


      gsap.from(
        '.approach-title-line > span',
        {

          yPercent: 110,

          duration: 1,

          stagger: 0.11,

          ease:
            'power4.out',

          scrollTrigger: {

            trigger:
              '.approach-title',

            start:
              'top 78%'

          }

        }
      );


      gsap.from(
        '.approach-description',
        {

          opacity: 0,

          y: 45,

          duration: 0.9,

          scrollTrigger: {

            trigger:
              '.approach-intro',

            start:
              'top 72%'

          }

        }
      );



      /* ===================================================
         PRINCIPLE ROWS
      =================================================== */

      const principleRows =
        gsap.utils.toArray(
          '.principle'
        );


      principleRows.forEach(
        (row) => {

          gsap.from(
            row.querySelector(
              '.principle-inner'
            ),
            {

              y: 45,

              opacity: 0,

              duration: 0.9,

              ease:
                'power3.out',

              scrollTrigger: {

                trigger:
                  row,

                start:
                  'top 82%'

              }

            }
          );


          gsap.from(
            row.querySelector(
              '.principle-line'
            ),
            {

              scaleX: 0,

              transformOrigin:
                'left',

              duration: 1.1,

              ease:
                'power3.inOut',

              scrollTrigger: {

                trigger:
                  row,

                start:
                  'top 86%'

              }

            }
          );

        }
      );



      /* ===================================================
         CONTACT
      =================================================== */

      gsap.from(
        '.contact-title-line > span',
        {

          yPercent: 110,

          stagger: 0.1,

          duration: 1,

          ease:
            'power4.out',

          scrollTrigger: {

            trigger:
              '.contact-title',

            start:
              'top 80%'

          }

        }
      );


      gsap.from(
        '.contact-copy > p',
        {

          y: 45,

          opacity: 0,

          duration: 0.9,

          scrollTrigger: {

            trigger:
              '.contact-copy',

            start:
              'top 75%'

          }

        }
      );


      gsap.from(
        '.contact-note',
        {

          x: -45,

          opacity: 0,

          stagger: 0.12,

          duration: 0.8,

          scrollTrigger: {

            trigger:
              '.contact-notes',

            start:
              'top 82%'

          }

        }
      );


      gsap.from(
        '.project-form-wrap',
        {

          y: 90,

          x: 55,

          rotate: 2.5,

          scale: 0.95,

          opacity: 0,

          duration: 1.3,

          ease:
            'power4.out',

          scrollTrigger: {

            trigger:
              '.project-form-wrap',

            start:
              'top 80%'

          }

        }
      );


      gsap.from(
        '.form-field',
        {

          y: 24,

          opacity: 0,

          stagger: 0.065,

          duration: 0.65,

          scrollTrigger: {

            trigger:
              '.project-form',

            start:
              'top 83%'

          }

        }
      );



      /* ===================================================
         FOOTER
      =================================================== */

      gsap.from(
        '.footer-word-mask span',
        {

          yPercent: 110,

          duration: 1.1,

          ease:
            'power4.out',

          scrollTrigger: {

            trigger:
              '.footer-brand',

            start:
              'top 92%',

            end:
              'top 58%',

            scrub: 1

          }

        }
      );


      gsap.from(
        '.footer-meta',
        {

          y: 25,

          opacity: 0,

          duration: 0.8,

          scrollTrigger: {

            trigger:
              '.footer-meta',

            start:
              'top 94%'

          }

        }
      );



      /* ===================================================
         DESKTOP POINTER INTERACTIONS
      =================================================== */

      mm.add(
        '(min-width: 901px) and (pointer: fine)',
        () => {


          /* -----------------------------------------------
             HERO 3D FOLLOW
          ----------------------------------------------- */

          const hero =
            document.querySelector(
              '.hero'
            );

          const orbWrap =
            document.querySelector(
              '.hero-orb-wrap'
            );


          if (
            hero &&
            orbWrap
          ) {

            const xTo =
              gsap.quickTo(
                orbWrap,
                'x',
                {
                  duration: 0.9,
                  ease:
                    'power3.out'
                }
              );


            const yTo =
              gsap.quickTo(
                orbWrap,
                'y',
                {
                  duration: 0.9,
                  ease:
                    'power3.out'
                }
              );


            const rotationX =
              gsap.quickTo(
                orbWrap,
                'rotationX',
                {
                  duration: 0.9,
                  ease:
                    'power3.out'
                }
              );


            const rotationY =
              gsap.quickTo(
                orbWrap,
                'rotationY',
                {
                  duration: 0.9,
                  ease:
                    'power3.out'
                }
              );


            const moveHero =
              (event) => {

                const rect =
                  hero.getBoundingClientRect();


                const px =
                  (
                    event.clientX
                    - rect.left
                  )
                  / rect.width
                  - 0.5;


                const py =
                  (
                    event.clientY
                    - rect.top
                  )
                  / rect.height
                  - 0.5;


                xTo(
                  px * 42
                );

                yTo(
                  py * 28
                );

                rotationY(
                  px * 9
                );

                rotationX(
                  py * -7
                );

              };


            const resetHero =
              () => {

                xTo(0);

                yTo(0);

                rotationX(0);

                rotationY(0);

              };


            hero.addEventListener(
              'mousemove',
              moveHero
            );

            hero.addEventListener(
              'mouseleave',
              resetHero
            );


            return () => {

              hero.removeEventListener(
                'mousemove',
                moveHero
              );

              hero.removeEventListener(
                'mouseleave',
                resetHero
              );

            };

          }

        }
      );



      /* ===================================================
         MAGNETIC BUTTONS
      =================================================== */

      mm.add(
        '(min-width: 901px) and (pointer: fine)',
        () => {

          const buttons =
            document.querySelectorAll(
              '.magnetic'
            );


          const cleanup = [];


          buttons.forEach(
            (button) => {

              const move =
                (event) => {

                  const rect =
                    button.getBoundingClientRect();


                  const x =
                    event.clientX
                    - rect.left
                    - rect.width / 2;


                  const y =
                    event.clientY
                    - rect.top
                    - rect.height / 2;


                  gsap.to(
                    button,
                    {

                      x: x * 0.16,

                      y: y * 0.2,

                      duration: 0.35,

                      ease:
                        'power3.out',

                      overwrite: true

                    }
                  );

                };


              const leave =
                () => {

                  gsap.to(
                    button,
                    {

                      x: 0,

                      y: 0,

                      duration: 0.7,

                      ease:
                        'elastic.out(1, .35)'

                    }
                  );

                };


              button.addEventListener(
                'mousemove',
                move
              );

              button.addEventListener(
                'mouseleave',
                leave
              );


              cleanup.push(
                () => {

                  button.removeEventListener(
                    'mousemove',
                    move
                  );

                  button.removeEventListener(
                    'mouseleave',
                    leave
                  );

                }
              );

            }
          );


          return () => {

            cleanup.forEach(
              fn => fn()
            );

          };

        }
      );



      /* ===================================================
         CUSTOM CURSOR
      =================================================== */

      mm.add(
        '(min-width: 901px) and (pointer: fine)',
        () => {

          document.body.classList.add(
            'has-custom-cursor'
          );


          const dot =
            document.querySelector(
              '.cursor-dot'
            );

          const ring =
            document.querySelector(
              '.cursor-ring'
            );


          if (!dot || !ring) {
            return;
          }


          gsap.set(
            [dot, ring],
            {
              xPercent: -50,
              yPercent: -50
            }
          );


          const dotX =
            gsap.quickTo(
              dot,
              'x',
              {
                duration: 0.08
              }
            );

          const dotY =
            gsap.quickTo(
              dot,
              'y',
              {
                duration: 0.08
              }
            );


          const ringX =
            gsap.quickTo(
              ring,
              'x',
              {
                duration: 0.42,
                ease:
                  'power3.out'
              }
            );

          const ringY =
            gsap.quickTo(
              ring,
              'y',
              {
                duration: 0.42,
                ease:
                  'power3.out'
              }
            );


          const mouseMove =
            (event) => {

              dotX(
                event.clientX
              );

              dotY(
                event.clientY
              );

              ringX(
                event.clientX
              );

              ringY(
                event.clientY
              );

            };


          window.addEventListener(
            'mousemove',
            mouseMove
          );


          const interactive =
            document.querySelectorAll(
              'button, a, .service-card, .process-step, .why-card, .principle'
            );


          const fieldElements =
            document.querySelectorAll(
              'input, textarea, select'
            );


          const listeners = [];


          interactive.forEach(
            element => {

              const enter =
                () => {

                  gsap.to(
                    ring,
                    {
                      scale: 1.65,
                      duration: 0.3
                    }
                  );

                  gsap.to(
                    dot,
                    {
                      scale: 0.45,
                      duration: 0.3
                    }
                  );

                };


              const leave =
                () => {

                  gsap.to(
                    ring,
                    {
                      scale: 1,
                      duration: 0.3
                    }
                  );

                  gsap.to(
                    dot,
                    {
                      scale: 1,
                      duration: 0.3
                    }
                  );

                };


              element.addEventListener(
                'mouseenter',
                enter
              );

              element.addEventListener(
                'mouseleave',
                leave
              );


              listeners.push(
                [
                  element,
                  enter,
                  leave
                ]
              );

            }
          );


          fieldElements.forEach(
            element => {

              const enter =
                () => {

                  gsap.to(
                    [dot, ring],
                    {
                      opacity: 0,
                      duration: 0.2
                    }
                  );

                };


              const leave =
                () => {

                  gsap.to(
                    [dot, ring],
                    {
                      opacity: 1,
                      duration: 0.2
                    }
                  );

                };


              element.addEventListener(
                'mouseenter',
                enter
              );

              element.addEventListener(
                'mouseleave',
                leave
              );


              listeners.push(
                [
                  element,
                  enter,
                  leave
                ]
              );

            }
          );


          return () => {

            document.body.classList.remove(
              'has-custom-cursor'
            );


            window.removeEventListener(
              'mousemove',
              mouseMove
            );


            listeners.forEach(
              ([
                element,
                enter,
                leave
              ]) => {

                element.removeEventListener(
                  'mouseenter',
                  enter
                );

                element.removeEventListener(
                  'mouseleave',
                  leave
                );

              }
            );

          };

        }
      );



      if (
        document.fonts &&
        document.fonts.ready
      ) {

        document.fonts.ready.then(
          () => {

            ScrollTrigger.refresh();

          }
        );

      }


    }, appRef);



    return () => {

      mm.revert();

      ctx.revert();

      gsap.ticker.remove(
        lenisTicker
      );

      lenis.destroy();

      lenisRef.current = null;

    };

  }, []);



  /* =======================================================
     FORM
  ======================================================= */

  const handleSubmit = (event) => {

    event.preventDefault();


    /*
      SUPABASE / BACKEND LATER
    */


    setSubmitted(true);

    event.currentTarget.reset();


    setTimeout(
      () => {

        setSubmitted(false);

      },
      6000
    );

  };



  /* =======================================================
     JSX
  ======================================================= */

  return (

    <div
      ref={appRef}
      className="site-shell"
    >


      {/* CUSTOM CURSOR */}

      <div
        className="cursor-dot"
        aria-hidden="true"
      />

      <div
        className="cursor-ring"
        aria-hidden="true"
      />



      {/* ===================================================
          NAV
      =================================================== */}

      <header className="nav-wrap">

        <nav className="nav container">


          <button
            className="brand"
            onClick={goTop}
          >
            FALDREN
          </button>


          <div className="nav-links desktop-nav">


            <button
              onClick={() =>
                go('capabilities')
              }
            >
              Capabilities
            </button>


            <button
              onClick={() =>
                go('process')
              }
            >
              Process
            </button>


            <button
              onClick={() =>
                go('approach')
              }
            >
              Approach
            </button>


            <button
  className="nav-cta magnetic"
  onClick={() => navigate("/login")}
>
  Start a project
  <ArrowUpRight size={15} />
</button>

          </div>


          <button
            className="menu-btn"
            onClick={() =>
              setMenuOpen(
                value => !value
              )
            }
            aria-label="Toggle navigation"
          >

            {
              menuOpen
                ? <X />
                : <Menu />
            }

          </button>

        </nav>


        {
          menuOpen && (

            <div className="mobile-menu">

              <button
                onClick={() =>
                  go('capabilities')
                }
              >
                Capabilities
              </button>

              <button
                onClick={() =>
                  go('process')
                }
              >
                Process
              </button>

              <button
                onClick={() =>
                  go('approach')
                }
              >
                Approach
              </button>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/login");
                }}
              >
                Start a project
              </button>

            </div>

          )
        }

      </header>



      <main>


        {/* =================================================
            HERO
        ================================================= */}

        <section className="hero container">


          <div
            className="hero-grid"
            aria-hidden="true"
          >
            <i />
            <i />
            <i />
            <i />
          </div>


          <div className="hero-content">


            <div className="hero-eyebrow">

              <span className="dot" />

              Independent technology company

            </div>


            <h1 className="hero-title">

              <span className="hero-line">
                <span className="hero-word">
                  We build
                </span>
              </span>

              <span className="hero-line">
                <span className="hero-word">
                  technology that
                </span>
              </span>

              <span className="hero-line">
                <span className="hero-word">
                  feels <em>inevitable.</em>
                </span>
              </span>

            </h1>


            <p className="hero-copy">

              FALDREN creates modern software,
              digital products and experiences
              for companies that want to move
              with clarity.

            </p>


            <div className="hero-actions">


              <button
  className="primary-btn magnetic"
  onClick={() => navigate("/login")}
>
  START A PROJECT
  <MoveRight size={18} />
</button>


              <button
                className="text-btn"
                onClick={() =>
                  go('capabilities')
                }
              >
                Explore what we do
              </button>

            </div>

          </div>



          {/* HERO OBJECT */}

          <div className="hero-stage">

            <span className="stage-label stage-label-a">
              DESIGN
            </span>

            <span className="stage-label stage-label-b">
              ENGINEERING
            </span>

            <span className="stage-label stage-label-c">
              PRODUCT
            </span>


            <div className="hero-orb-wrap">

              <div className="hero-orb">

                <div className="orbit orbit-outer">
                  <span />
                </div>

                <div className="orbit orbit-middle">
                  <span />
                </div>

                <div className="orbit orbit-inner">
                  <span />
                </div>


                <div className="orb-core">
                  F
                </div>


                <div className="orb-copy">
                  FALDREN / SYSTEM 01
                </div>

              </div>

            </div>

          </div>



          <div className="hero-scroll">

            <span>
              SCROLL
            </span>

            <div className="hero-scroll-line">
              <span />
            </div>

          </div>

        </section>



        {/* =================================================
            CAPABILITIES
        ================================================= */}

        <section
          id="capabilities"
          className="capabilities-section"
        >

          <div className="capabilities-pin">


            <div className="container capabilities-head">


              <div>

                <div className="section-kicker">
                  Capabilities
                </div>


                <h2 className="capabilities-title">

                  <span className="capabilities-title-line">
                    <span>From idea to</span>
                  </span>

                  <span className="capabilities-title-line">
                    <span>working product.</span>
                  </span>

                </h2>

              </div>


              <p className="capabilities-description">

                We combine product thinking,
                interface design and engineering
                to turn ambitious ideas into
                useful technology.

              </p>

            </div>



            <div className="capabilities-viewport">

              <div className="capabilities-track">


                 {capabilities.map(({ title, text }) => (

  <article
    className="service-card"
    key={title}
  >

    <div className="service-card-head">

      <h3>
        {title}
      </h3>

      <ArrowUpRight
        size={28}
        strokeWidth={1.5}
      />

    </div>

    <p>
      {text}
    </p>

    <div className="service-card-line" />

  </article>

))}

              </div>

            </div>

          </div>

        </section>



        {/* =================================================
            HOW WE WORK
        ================================================= */}

        <section
          id="process"
          className="process-section"
        >

          <div className="container process-head">

            <div>

              <div className="section-kicker">
                How we work
              </div>

              <h2 className="process-title">

                <span className="process-title-line">
                  <span>Four moves.</span>
                </span>

                <span className="process-title-line">
                  <span>One direction.</span>
                </span>

              </h2>

            </div>

            <p className="process-intro-copy">
              A project moves through four deliberate stages,
              with the right decisions made at the right time.
            </p>

          </div>


          <div className="container process-list">

            {workSteps.map(({ num, symbol, title, text }) => (

              <article
                className="process-step"
                key={num}
              >

                <div className="process-step-line" />

                <div className="process-step-inner">

                  <div className="process-step-mark">
                    <span className="process-step-symbol">
                      {symbol}
                    </span>
                    <span className="process-step-num">
                      {num}
                    </span>
                  </div>

                  <h3>
                    {title}
                  </h3>

                  <p>
                    {text}
                  </p>

                  <ArrowUpRight
                    size={18}
                    strokeWidth={1.5}
                  />

                </div>

              </article>

            ))}

          </div>

        </section>



        {/* =================================================
            WHY FALDREN
        ================================================= */}

        <section
          id="why"
          className="why-section"
        >

          <div className="container why-head">

            <div className="section-kicker light">
              Why FALDREN
            </div>

            <h2 className="why-title">

              <span className="why-title-line">
                <span>Working together</span>
              </span>

              <span className="why-title-line">
                <span>should feel</span>
              </span>

              <span className="why-title-line accent">
                <span>simple, deliberate, useful.</span>
              </span>

            </h2>

          </div>


          <div className="container why-grid">

            {whyFaldren.map(({ symbol, title, text }) => (

              <article
                className="why-card"
                key={title}
              >

                <span className="why-symbol">
                  {symbol}
                </span>

                <h3>
                  {title}
                </h3>

                <p>
                  {text}
                </p>

              </article>

            ))}

          </div>

        </section>




        {/* =================================================
            APPROACH
        ================================================= */}

        <section
          id="approach"
          className="approach-section"
        >


          <div
            className="approach-ghost"
            aria-hidden="true"
          >
            FALDREN
          </div>


          <div className="container approach-content">


            <div className="approach-intro">


              <div>

                <div className="section-kicker light approach-kicker">
                  How we think
                </div>


                <h2 className="approach-title">

                  <span className="approach-title-line">
                    <span>Every decision</span>
                  </span>

                  <span className="approach-title-line">
                    <span>should earn its place.</span>
                  </span>

                </h2>

              </div>


              <p className="approach-description">

                Our point of view is practical:
                keep what serves the product, remove what distracts
                and treat the details as part of the outcome.

              </p>

            </div>



            <div className="principles">


              {principles.map(
                ({
                  num,
                  symbol,
                  title,
                  text
                }) => (

                  <article
                    className="principle"
                    key={num}
                  >

                    <div className="principle-line" />


                    <div className="principle-inner">

                      <div className="principle-mark">
                        <span className="principle-symbol">
                          {symbol}
                        </span>
                        <span className="principle-num">
                          {num}
                        </span>
                      </div>

                      <h3>
                        {title}
                      </h3>

                      <p>
                        {text}
                      </p>

                      <ArrowUpRight
                        size={18}
                      />

                    </div>

                  </article>

                )
              )}

            </div>

          </div>

        </section>



        {/* =================================================
    CONTACT
================================================= */}

<section
  id="contact"
  className="contact-section"
>
  <div className="container contact-center">

    <div className="contact-copy contact-copy-center">

      <div className="section-kicker light">
        Start a project
      </div>

      <h2 className="contact-title">

        <span className="contact-title-line">
          <span>Have something</span>
        </span>

        <span className="contact-title-line">
          <span>worth building?</span>
        </span>

      </h2>

      <p className="contact-description">
        Tell us what you're working on. We'll understand the idea,
        your requirements and how FALDREN can help bring it to life.
      </p>

      <div className="contact-notes">

        <div className="contact-note">
          <span>01</span>
          <p>Share your idea</p>
        </div>

        <div className="contact-note">
          <span>02</span>
          <p>We understand the requirements</p>
        </div>

        <div className="contact-note">
          <span>03</span>
          <p>We discuss the next step</p>
        </div>

      </div>

      <button
        className="start-connection-btn magnetic"
        onClick={() => navigate("/login")}
      >
        START CONNECTION
        <ArrowUpRight size={17} />
      </button>

    </div>

  </div>
</section>
</main>

      {/* ===================================================
          FOOTER
      =================================================== */}

      <footer className="footer">

        <div className="container">


          <div className="footer-brand">

            <div className="footer-word-mask">
              <span>FALDREN</span>
            </div>

          </div>


          <div className="footer-meta">

            <span>
              Technology / Products / Design
            </span>

            <span>
              India · Building for the world
            </span>

            <span>
              © {new Date().getFullYear()} FALDREN
            </span>

          </div>

        </div>

      </footer>

    </div>

  );

}


/*
  StrictMode intentionally removed here.

  React StrictMode executes effects twice
  in development, which would replay the
  cinematic preloader timeline twice.
*/

ReactDOM
  .createRoot(
    document.getElementById("root")
  )
  .render(
    <BrowserRouter>

      <Routes>

        {/* ================================
            HOMEPAGE
        ================================ */}

        <Route
          path="/"
          element={<App />}
        />

        {/* ================================
    CLIENT LOGIN
================================ */}

<Route
  path="/login"
  element={
    <Login
      onLogin={() => {
        window.location.href = "/client/dashboard";
      }}
      onRegister={() => {
        window.location.href = "/register";
      }}
    />
  }
/>


{/* ================================
    CLIENT REGISTER
================================ */}

<Route
  path="/register"
  element={
    <Register
      onRegister={() => {
        window.location.href = "/login";
      }}
      onLogin={() => {
        window.location.href = "/login";
      }}
    />
  }
/>


{/* ================================
    CLIENT DASHBOARD
================================ */}

{/* ================================
    CLIENT DASHBOARD
================================ */}

<Route
  path="/client/dashboard"
  element={
    <ProtectedClientRoute>
      <ClientDashboard
        onLogout={() => {

          localStorage.removeItem("clientToken");
          localStorage.removeItem("clientName");
          localStorage.removeItem("clientEmail");
          localStorage.removeItem("clientCompany");
          localStorage.removeItem("clientRole");

          window.location.href = "/login";
        }}
      />
    </ProtectedClientRoute>
  }
/>


        {/* ================================
            ADMIN LOGIN
        ================================ */}

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />


        {/* ================================
            ADMIN DASHBOARD
        ================================ */}

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        />


        {/* ================================
            ADMIN CLIENTS
        ================================ */}

        <Route
          path="/admin/clients"
          element={
            <ProtectedAdminRoute>
              <AdminClients />
            </ProtectedAdminRoute>
          }
        />

        <Route
  path="/admin/projects"
  element={
    <ProtectedAdminRoute>
      <AdminProjects />
    </ProtectedAdminRoute>
  }
/>

<Route
  path="/admin/requests"
  element={
    <ProtectedAdminRoute>
      <AdminRequests />
    </ProtectedAdminRoute>
  }
/>


        {/* ================================
            UNKNOWN ROUTE
        ================================ */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );