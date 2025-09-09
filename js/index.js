// GSAP & LENIS INIT
gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

if (window.innerWidth > 1240) {
  const lenis = new Lenis();

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);
}

// GLOBAL ANIMATIONS
$(function () {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const heading = entry.target;

          // Split the heading into lines
          const splitText = new SplitType(heading, { types: "lines" });
          const lines = splitText.lines;

          // Animate with GSAP
          gsap.fromTo(
            lines,
            {
              y: 30,
              rotation: 30,
            },
            {
              y: 0,
              rotation: 0,
              // autoAlpha: 1,
              ease: "easeInOutExpo",
              duration: 0.6,
              stagger: 0.05,
            }
          );

          // Unobserve after animation is triggered once
          obs.unobserve(heading);
        }
      });
    },
    {
      threshold: 0, // Adjust as needed
    }
  );

  // Apply to all h1 and h2 elements
  document.querySelectorAll("h1, h2:not(.no-anim)").forEach((heading) => {
    observer.observe(heading);
  });
});

$(function () {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const $element = $(element);

          // Prevent retriggering
          if (
            !$element.hasClass("typewriter-initialized") &&
            $element.is(":not(#right-here)")
          ) {
            $element.addClass("typewriter-initialized active"); // Add active class

            const originalText = $element.text();
            $element.text("");

            const typewriter = new Typewriter(element, {
              cursor: "|",
            });

            typewriter
              .changeDelay(40)
              .typeString(originalText)
              .pauseFor(1000)
              .callFunction(() => {
                const cursor = element.querySelector(".Typewriter__cursor");
                if (cursor) {
                  cursor.style.display = "none";
                }
              })
              .start();
          }

          obs.unobserve(element); // Stop observing once triggered
        }
      });
    },
    {
      threshold: 0.1, // Trigger when 10% of element is visible
    }
  );

  $(".typewriter-box h3, span.typewriter-box, h6.typewriter-box").each(
    function () {
      observer.observe(this);
    }
  );
});
// GLOBAL ANIMATIONS END

let resizeTimeout;

function debounceResize(callback, delay = 300) {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(callback, delay);
}

function killAllAnimations() {
  // Kill all ScrollTriggers
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

  // Kill all GSAP tweens and timelines
  gsap.globalTimeline.clear();
  gsap.killTweensOf("*");

  // Optional: remove classes or reset styles if needed
  document
    .querySelectorAll(".typewriter-initialized, .active, .landed, .poured")
    .forEach((el) => {
      el.classList.remove(
        "typewriter-initialized",
        "active",
        "landed",
        "poured"
      );
    });
}

window.addEventListener("resize", () => {
  debounceResize(() => {
    if (window.innerWidth > 1240) {
      // killAllAnimations(); // Uncomment if needed
      window.location.reload(); // Or reinitialize scripts
    }
  }, 300);
});

// FIRST SECTION ANIMATIONS
$(function () {
  // Create pin for the hero section
  ScrollTrigger.create({
    trigger: ".pinned-hero",
    start: "top top",
    end: "+=1000",
    pin: true,
  });

  // Make the SVG visible and sized appropriately
  const svg = document.getElementById("motion-path");
  svg.setAttribute("width", "100vw");
  svg.setAttribute("height", "90%");
  svg.setAttribute("viewBox", "0 0 1500 500"); // Adjusted to encompass all paths

  // Configuration for sugar animations
  const sugarAnimations = [
    {
      element: "#sugar2",
      path: "#sugar-curve-1",
      delay: -0.2, // Delayed start
    },
    {
      element: "#sugar3",
      path: "#sugar-curve-2",
      delay: -0.2,
    },
    {
      element: "#sugar4",
      path: "#sugar-curve-2",
      delay: 0,
    },
    {
      element: "#sugar5",
      path: "#sugar-curve-3",
      delay: -0.15,
    },
    {
      element: "#sugar6",
      path: "#sugar-curve-3",
      delay: 0.1, // Delayed start after sugar5
    },
    {
      element: "#sugar7",
      path: "#sugar-curve-4",
      delay: 0, // Delayed start after sugar5
    },
  ];

  // Set up animations for each sugar element
  sugarAnimations.forEach((config) => {
    const element = document.querySelector(config.element);

    // Hide initially
    gsap.set(element, {
      scale: 0.8, // Optional: Scale the sugar images if needed
      autoAlpha: 0,
    });

    // Calculate delay based on scroll progress
    const delayedStart = `top+=${config.delay * 1000} top`;

    // Create animation timeline with individual scroll trigger for each element
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".pin-spacer:has(.pinned-hero)",
        start: delayedStart, // Different start position based on delay
        end: "+=600",
        scrub: true,
      },
    });

    // Fade in
    tl.to(element, {
      autoAlpha: 1,
      duration: 0.1,
    });

    // Animate along the path from beginning to end
    tl.to(
      element,
      {
        motionPath: {
          path: config.path,
          align: config.path,
          start: 0, // Always start at beginning of path
          end: 1, // End at end of path
          alignOrigin: [0.5, 0.5],
        },
        ease: "none",
        duration: 0.8,
      },
      0
    );
  });
});

// TEH TARIK SHAKE
$(function () {
  const $target = $(".monkey-container");

  // Set transformOrigin once (no need to repeat it in every keyframe)
  gsap.set($target, { transformOrigin: "center bottom" });

  const shakeTween = gsap.to($target, {
    duration: 2,
    keyframes: [{ rotation: 1 }, { rotation: -1 }, { rotation: 0 }],
    repeat: -1,
    repeatDelay: 0,
    ease: "none",
    paused: true,
  });

  let scrollStopTimeout = null;
  const scrollStopDelay = 150;

  function onScroll() {
    // Only call play() when it isn't already animating
    if (!shakeTween.isActive()) shakeTween.play();

    if (scrollStopTimeout) clearTimeout(scrollStopTimeout);
    scrollStopTimeout = setTimeout(() => {
      // Pause after scrolling stops for a bit
      shakeTween.pause();
    }, scrollStopDelay);
  }

  // Safe Lenis detection (avoids ReferenceError if lenis is undefined)
  const hasLenis =
    typeof window !== "undefined" &&
    typeof window.lenis !== "undefined" &&
    window.lenis &&
    typeof window.lenis.on === "function";

  if (hasLenis) {
    window.lenis.on("scroll", onScroll);
  } else {
    // Passive listener for better performance
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // Optional: pause when tab is hidden (saves cycles)
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      shakeTween.pause();
    }
  });
});

$(function () {
  function animateParallax(id, xAmount, yAmount, rotation) {
    gsap.to(id, {
      x: xAmount,
      y: yAmount,
      rotate: rotation,
      scale: "1.03",
      scrollTrigger: {
        trigger: ".pin-spacer:has(.pinned-hero)",
        start: "top top",
        end: "+=1300",
        scrub: true,
      },
      ease: "easeOutExpo",
    });
  }

  animateParallax("#main-durian-left", "2vw");
  animateParallax("#main-green-durian-left", "1.5vw");
  animateParallax("#main-plant-right", "-5vw");
  animateParallax("#main-green-coconut", "-2vw");
  animateParallax("#lcw", "-3vw", "-5vw");
  animateParallax("#motorbike", "10vw", "0");
  animateParallax("#tapir", "10vw", "8vh", "0.5rad");
  // animateParallax("#myvi", "-5vw", "5%", "0");
  animateParallax("#sugar1", "-15vw", "120vh", "0");
  animateParallax("#sugar8", "10vw", "100vh", "0");
});

gsap.to("#myvi", {
  x: "-5vw",
  y: "5%",
  rotation: 0,
  duration: 2.5, // 2.5s forward + 2.5s back = 5s total
  repeat: -1,
  yoyo: true,
  ease: "easeOutExpo",
  overwrite: true, // in case anything tries to animate it elsewhere
});

// FIRST SECTION ANIMATIONS END

// MENU

// POPUP FUNCTION
$("a[data-popup]").on("click", function (e) {
  e.preventDefault();
  const targetId = $(this).data("popup");
  const $targetPopup = $("#" + targetId);

  // If the target is already active, remove it (toggle off)
  if ($targetPopup.hasClass("active")) {
    $targetPopup.removeClass("active");
  } else {
    // Otherwise, close all and activate the target
    $(".popup").removeClass("active");
    $targetPopup.addClass("active");
  }
});

$(".close-button").on("click", function () {
  $(".popup").removeClass("active");
});
$(document).ready(function () {
  $(".accordion .detail").hide().first().show();
  $(".accordion .title").first().addClass("active");
  $(".accordion .title").on("click", function () {
    const $currentDetail = $(this).next(".detail");
    if ($currentDetail.is(":visible")) {
      return;
    }
    $(".accordion .detail").slideUp();
    $currentDetail.slideDown();
    $(".accordion .title").removeClass("active");
    $(this).addClass("active");
  });
});
$(".menu-container").on("click", function () {
  const type = $(this).attr("class").split(" ").pop(); // Get the type (drinks, food, snacks)
  const $menu = $(`.inner-menu[data-type='${type}']`);

  // Remove active from all containers and inner-menus
  $(".menu-container, .inner-menu").removeClass("active");

  // Add active to clicked container and its corresponding inner-menu
  $(this).addClass("active");
  $menu.addClass("active");
});
