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
// SECOND SECTION ANIMATIONS
$(document).ready(function () {
  // Initialize the horizontal scroll
  function initHorizontalScroll() {
    const $container = $(".overflow-container");
    const $pinnedSection = $(".pinned-horizontal-section");
    const totalWidth = $pinnedSection.outerWidth() - $(window).width();

    // Create a ScrollTrigger for the main horizontal scroll
    let scrollTrigger = ScrollTrigger.create({
      trigger: $container[0],
      start: "top top",
      end: `+=${totalWidth}`,
      pin: true,
      scrub: 1,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        // Move the pinned section horizontally
        gsap.set($pinnedSection, {
          x: -totalWidth * self.progress,
        });

        // Move #teh-tarik-aneh right by 30vw as scroll progresses
        gsap.set("#teh-tarik-aneh", {
          x: 35 * self.progress + "vw",
        });
      },
    });
  }
  initHorizontalScroll();
});

// SECOND SECTION ANIMATIONS END
// THIRD SECTION ANIMATIONS
$(function () {
  function animateParallax(id, xAmount, yAmount, rotate) {
    gsap.to(id, {
      x: xAmount,
      y: yAmount,
      rotation: rotate,
      scale: "1.1",
      scrollTrigger: {
        trigger: ".national-importance",
        start: "top top",
        end: "50% 30%",
        scrub: true,
      },
      ease: "easeOutExpo",
    });
  }

  animateParallax(".national-green-mountain", "-15vw");
  animateParallax(".national-blue-mountain", "14vw");
  animateParallax(
    ".yellow-mountain-container .motorbike",
    "220%",
    "-120%",
    "-10deg"
  );
  ScrollTrigger.create({
    trigger: ".national-importance",
    start: "50% 90%", // When top of element hits bottom 20% of viewport
    toggleClass: { targets: ".national-importance", className: "active" },
    markers: false, // Set to true for debugging
    onEnter: () => $(".national-importance").addClass("active"),
    onLeaveBack: () => $(".national-importance").removeClass("active"),
  });
});

// THIRD SECTION ANIMATIONS END
// FOURTH SECTION ANIMATIONS
$(function () {
  function movingLeaves(id, xAmount, yAmount) {
    gsap.from(id, {
      x: xAmount,
      y: yAmount,
      rotate: "30deg",
      scale: "1.1",
      scrollTrigger: {
        trigger: ".pouring-cup-container",
        start: "top 80%",
        end: "bottom 50%",
        scrub: true,
      },
      ease: "easeInOutExpo",
    });
  }

  // Animate leaves
  movingLeaves("#pouring-leaf-1", "-53vw", "-43vw");
  movingLeaves("#pouring-leaf-2", "-48vw", "-64.5vw");
  movingLeaves("#pouring-leaf-3", "-36vw", "-47.5vw");
  movingLeaves("#pouring-leaf-4", "-23vw", "-35vw");
  movingLeaves("#pouring-leaf-5", "-20vw", "-27vw");
  movingLeaves("#pouring-leaf-6", "-16.3vw", "-32.8vw");
  movingLeaves("#pouring-leaf-7", "-5vw", "-46vw");
  movingLeaves("#pouring-leaf-8", "-3vw", "-28vw");
  movingLeaves("#pouring-leaf-9", "7.5vw", "-37.5vw");
  movingLeaves("#pouring-leaf-10", "13vw", "-38vw");
  movingLeaves("#pouring-leaf-11", "18vw", "-44vw");

  // Delay control for class toggle
  let canAddPoured = true;
  let pouredRemovedAt = null;

  const cupTween = gsap.fromTo(
    ".pouring-cup-container",
    {
      rotate: -24,
      transformOrigin: "bottom left",
    },
    {
      rotate: -55,
      ease: "easeInOutExpo",
      scrollTrigger: {
        trigger: ".pouring-cup-container",
        start: "bottom 90%",
        end: "bottom 50%",
        scrub: true,
        onUpdate: (self) => {
          const el = document.querySelector(".stream-container");

          if (self.progress === 1) {
            const now = Date.now();
            // Wait 1s after removal before re-adding
            if (
              canAddPoured &&
              (!pouredRemovedAt || now - pouredRemovedAt >= 1000)
            ) {
              el.classList.add("poured");
            }
          }

          if (self.progress < 1 && el.classList.contains("poured")) {
            el.classList.remove("poured");
            pouredRemovedAt = Date.now();
            canAddPoured = false;
            // Unlock re-adding after 1s
            setTimeout(() => {
              canAddPoured = true;
            }, 1000);
          }
        },
      },
    }
  );
});

// FOURTH SECTION ANIMATIONS END
// FIFTH SECTION ANIMATIONS
$(function () {
  const floatSettings = [
    {
      selector: ".humbly-priced .pink-box",
      y: "-1vw",
      x: "2vw",
      rotation: -1.5,
    },
    {
      selector: ".humbly-priced .yellow-box",
      y: "1vw",
      x: "-1vw",
      rotation: -12,
    },
    {
      selector: ".humbly-priced .lightgreen-box",
      y: "-0.5vw",
      x: "1.5vw",
      rotation: -0.8,
    },
  ];
  floatSettings.forEach((config) => {
    const elements = $(config.selector);
    elements.each(function () {
      const el = $(this);
      const floatAnim = gsap.to(el, {
        y: `+=${config.y}`,
        x: `+=${config.x}`,
        rotation: `+=${config.rotation}`,
        scale: 1.01,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        duration: 3,
        paused: true,
      });
      let scrollTimeout;
      ScrollTrigger.create({
        trigger: ".humbly-priced",
        start: "top 80%",
        end: "bottom top",
        onUpdate: () => {
          if (!floatAnim.isActive()) {
            floatAnim.play();
          }
          clearTimeout(scrollTimeout);
          scrollTimeout = setTimeout(() => {
            floatAnim.pause();
          }, 500);
        },
        onLeave: () => floatAnim.pause(),
        onLeaveBack: () => floatAnim.pause(),
      });
    });
  });
});

$(function () {
  gsap.to(".rotating-teh-tarik", {
    rotate: -15,
    x: 2,
    scale: 1.1,
    ease: "none",
    scrollTrigger: {
      trigger: ".humbly-priced",
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
  });
});

// FIFTH SECTION ANIMATIONS END
// SIXTH SECTION ANIMATIONS
$(function () {
  gsap.from(".television-card", {
    y: "-56vw",
    ease: "bounce.out",
    duration: 1.5,
    stagger: -0.2,
    scrollTrigger: {
      trigger: ".television-section",
      start: "top bottom",
      end: "bottom top",
      toggleActions: "play none none none", // Play once on enter
    },
  });
});

// SIXTH SECTION ANIMATIONS END
// SEVENTH SECTION ANIMATIONS
$(function () {
  const triggerSection = document.querySelector(".drink-like-no-other");
  gsap.from("img.floating-cup", {
    y: "-100vh",
    ease: "easeIn",
    duration: 1.5,
    scrollTrigger: {
      trigger: triggerSection,
      start: "top bottom",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        if (
          self.progress === 1 &&
          !triggerSection.classList.contains("landed")
        ) {
          triggerSection.classList.add("landed");
        } else if (
          self.progress < 1 &&
          triggerSection.classList.contains("landed")
        ) {
          triggerSection.classList.remove("landed");
        }
      },
    },
  });
});

// SEVENTH SECTION ANIMATIONS END
// EIGHTH SECTION ANIMATIONS
$(function () {
  const yValue = window.innerWidth < 1240 ? "20vh" : "80vh";

  gsap.from(".gold-standard .bottom-portion .parallax-bg", {
    y: yValue,
    ease: "easeIn",
    duration: 1.5,
    scrollTrigger: {
      trigger: ".gold-standard .bottom-portion",
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
  });
});

// EIGHTH SECTION ANIMATIONS END
// NINTH SECTION ANIMATIONS
$(function () {
  const yValue = window.innerWidth < 1240 ? 2 : 5;
  const $cards = $(".staggered-card");
  const totalCards = $cards.length;
  const middleIndex = Math.floor(totalCards / 2);
  const spacing = yValue; // horizontal spacing in vw
  const scrollDistance = "+=5000";

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".five-gen",
      start: "top top",
      end: scrollDistance,
      scrub: true,
      pin: true,
    },
  });

  $cards.each(function (i) {
    const $card = $(this);
    const offsetFromCenter = i - middleIndex;

    // Generate a random y offset between -2vh and 2vh
    const randomY = (Math.random() * 4 - 2).toFixed(2); // value between -2 and 2

    tl.fromTo(
      $card,
      {
        y: "100vh",
        x: "0vw",
      },
      {
        y: `${randomY}vh`,
        x: `${offsetFromCenter * spacing}vw`,
        duration: 1,
        ease: "power5.in",
      },
      i * 0.7
    );
  });

  gsap.fromTo(
    ".staggered-cards-container",
    {
      y: "5%", // The `circles` div starts at 5% of its height on the y-axis
    },
    {
      y: "-5%", // And ends at -5% of its height on the y-axis
      ease: "none",
      scrollTrigger: {
        trigger: ".five-gen",
        start: "top top",
        end: scrollDistance,
        scrub: true,
      },
    }
  );
});

// NINTH SECTION ANIMATIONS END
// TENTH SECTION ANIMATIONS
$(function () {
  const $eyeballs = $(".eyeball");

  $(document).on("mousemove", function (e) {
    $eyeballs.each(function () {
      const $eye = $(this);
      const $iris = $eye.find(".iris");

      const eyeOffset = $eye.offset();
      const eyeCenterX = eyeOffset.left + $eye.width() / 2;
      const eyeCenterY = eyeOffset.top + $eye.height() / 2;

      const dx = e.pageX - eyeCenterX;
      const dy = e.pageY - eyeCenterY;

      // Calculate angle and distance
      const angle = Math.atan2(dy, dx);
      const distance = Math.min(5, Math.hypot(dx, dy) / 10); // Limit how far the iris can go

      const moveX = Math.cos(angle) * distance;
      const moveY = Math.sin(angle) * distance;

      $iris.css("transform", `translate(${moveX}px, ${moveY}px)`);
    });
  });
});

$(function () {
  ScrollTrigger.create({
    trigger: ".touching-hands",
    start: "top top",
    end: "+=1300",
    scrub: true,
  });
  function moveHands(id, xAmount, yAmount, rotation) {
    gsap.from(id, {
      x: xAmount,
      y: yAmount,
      rotate: rotation,
      scale: "1.03",
      scrollTrigger: {
        trigger: ".touching-hands",
        start: "top 80%",
        end: "top center",
        scrub: true,
      },
      ease: "easeOutExpo",
    });
  }

  moveHands(".left.hand", "-20vw");
  moveHands(".right.hand", "20vw");

  function scaleStar() {
    const scrollSettings = {
      trigger: ".touching-hands",
      start: "top center",
      end: "bottom bottom",
      scrub: true,
    };
    gsap.to(".touching-star", {
      scale: 14,
      scrollTrigger: scrollSettings,
      ease: "expo.in",
    });
    gsap.to(".touching-star path", {
      fill: "#d6322f",
      scrollTrigger: scrollSettings,
      ease: "expo.in",
    });
  }
  scaleStar();
});

$(function () {
  const yValue = window.innerWidth < 1240 ? "-20vh" : "-40vh";
  function chilliMoveY() {
    gsap.to(".chilli-teh", {
      y: yValue,
      scrollTrigger: {
        trigger: ".exploding-lady",
        start: "center bottom",
        end: "bottom bottom",
        scrub: true,
      },
      ease: "easeInOutExpo",
    });
  }
  chilliMoveY();
});

// TENTH SECTION ANIMATIONS END
// ELEVENTH SECTION ANIMATIONS
$(function () {
  const root = document.querySelector(".teh-tarik-malaysian");

  // Get the actual text content
  const textPath = root.querySelector("#textpath");
  const text = textPath.textContent.trim();

  // Calculate text width using canvas
  const textPathLength = getTextWidth(text) * 1;

  // Calculate final offset percentage
  const pathLength = root.querySelector("#path").getTotalLength();
  const finalOffset = -((textPathLength * 100) / pathLength);

  gsap.to(textPath, {
    attr: { startOffset: finalOffset + "0%" }, // Here we are targeting an attribute value, not a CSS property
    ease: "none", // Linear movement
    scrollTrigger: {
      trigger: ".teh-tarik-malaysian",
      start: "top top",
      end: "+=2000",
      pin: ".teh-tarik-malaysian",
      scrub: true, // Progresses with the scroll
    },
  });

  // UTIL METHOD
  function getTextWidth(text) {
    const canvas =
      getTextWidth.canvas ||
      (getTextWidth.canvas = document.createElement("canvas"));
    const context = canvas.getContext("2d");
    const computedStyle = window.getComputedStyle(
      document.querySelector("#textpath")
    );
    context.font = computedStyle.font;

    return context.measureText(text).width;
  }
});

// ELEVENTH SECTION ANIMATIONS END
// THIRTHEENTH SECTION ANIMATIONS
$(function () {
  // Pin the whole section
  const yValue = window.innerWidth < 1240 ? "-100vh" : "-70vh";
  const pinning = window.innerWidth < 1240 ? false : true;
  const positioning = window.innerWidth < 1240 ? "80% bottom" : "top top";
  ScrollTrigger.create({
    trigger: ".breaking-text-section",
    start: positioning,
    end: "+=500", // Adjust scroll range as needed
    pin: pinning,
    scrub: true,
  });

  const pairs = [
    ["#breaking-text-1", "-20vw", "-30vh", -5, "center left"],
    ["#breaking-text-2", "-25vw", "-15vh", -10, "bottom left"],
    ["#breaking-text-3", "40vw", "-25vh", 5, "center"],
    ["#breaking-text-4", "-20vw", "-10vh", -30, "center"],
    ["#breaking-text-5", "20vw", "-15vh", 10, "center"],
    ["#breaking-text-6", "-10vw", "-5vh", -50, "center"],
    ["#breaking-text-7", "20vw", "-5vh", 30, "center"],
    [".teh-tarik-with-cap", 0, yValue, 0, "center"],
    [".first.breaking-image", "-40vw", "-20vh", 0, "center"],
    [".second.breaking-image", "30vw", "-10vh", 0, "center"],
    [".third.breaking-image", "-55vw", "-50vh", 0, "center"],
    [".fourth.breaking-image", "25vw", "-110vh", 0, "center"],
    [".fifth.breaking-image", "35vw", "-60vh", 0, "center"],
    [".sixth.breaking-image", "-35vw", "-90vh", 0, "center"],
    [".seventh.breaking-image", "0", "-110vh", 0, "center"],
  ];

  pairs.forEach(([selector, moveX, moveY, rotation, origin]) => {
    gsap.to(selector, {
      x: moveX,
      y: moveY,
      rotate: rotation,
      transformOrigin: origin,
      scrollTrigger: {
        trigger: ".breaking-text-section",
        start: positioning,
        end: "+=500",
        scrub: true,
      },
      ease: "power1.out",
    });
  });
});

// THIRTHEENTH SECTION ANIMATIONS END
// 15TH SECTION ANIMATIONS
$(function () {
  ScrollTrigger.create({
    trigger: ".three-cards-section",
    start: "top top",
    end: "+=2000",
    pin: true,
    pinSpacing: true,
  });
  gsap.to(".red-card", {
    clipPath: "circle(150% at 50% 100%)",
    ease: "power2.inOut",
    scrollTrigger: {
      trigger: ".pin-spacer:has(.three-cards-section)",
      start: "top top",
      end: "33% top",
      scrub: true,
      onUpdate: (self) => {
        if (
          self.progress >= 0.5 &&
          !$(".three-cards-section").hasClass("red-active")
        ) {
          $(".three-cards-section").addClass("red-active");
        } else if (
          self.progress < 0.5 &&
          $(".three-cards-section").hasClass("red-active")
        ) {
          $(".three-cards-section").removeClass("red-active");
        }
      },
    },
  });
  gsap.to(".yellow-card", {
    clipPath: "circle(150% at 50% 100%)",
    ease: "power2.inOut",
    scrollTrigger: {
      trigger: ".pin-spacer:has(.three-cards-section)",
      start: "33% top",
      end: "66% top",
      scrub: true,
      onUpdate: (self) => {
        if (
          self.progress >= 0.5 &&
          !$(".three-cards-section").hasClass("yellow-active")
        ) {
          $(".three-cards-section").addClass("yellow-active");
        } else if (
          self.progress < 0.5 &&
          $(".three-cards-section").hasClass("yellow-active")
        ) {
          $(".three-cards-section").removeClass("yellow-active");
        }
      },
    },
  });
});

// 15TH SECTION ANIMATIONS END
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

// POPUP FUNCTION END
