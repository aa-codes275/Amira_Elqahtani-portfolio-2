// Amira Al-Qahtani — Portfolio interactions
// ===== صور/شعارات الشركات — عدّل الروابط من هنا فقط =====
const CARD_LOGOS = {
  "01": "assets/5767200296466584620_109.jpg",   // مكتب أميرة القحطاني للخدمات العامة
  "02": "assets/5767200296466584617_120.jpg",    // منصة الشركات والموظفين
  "03": "assets/5767200296466584618_121.jpg",      // Amira Luxury Parfums
  "04": "assets/5767200296466584619_120.jpg",     // Gardenia
};
document.querySelectorAll(".card-logo").forEach((img) => {
  const url = CARD_LOGOS[img.dataset.logo];
  if (url) img.src = url;
});

(function () {
  const nav = document.getElementById("nav");
  const links = document.getElementById("navLinks");
  const burger = document.getElementById("burger");
  const progress = document.getElementById("progress");
  const toTop = document.getElementById("toTop");

  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle("scrolled", y > 40);
    toTop.classList.toggle("show", y > 600);
    const h = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  burger.addEventListener("click", () => links.classList.toggle("open"));
  links.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => links.classList.remove("open")));

  // reveal on scroll
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add("in"), i * 90);
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  // counters
  const cio = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const to = parseInt(el.dataset.to, 10);
        const start = performance.now();
        const step = (now) => {
          const p = Math.min((now - start) / 1400, 1);
          el.textContent = Math.floor(to * (1 - Math.pow(1 - p, 3))).toLocaleString("ar-EG");
          if (p < 1) requestAnimationFrame(step);
          else el.textContent = to.toLocaleString("ar-EG") + (to >= 60 ? "+" : "");
        };
        requestAnimationFrame(step);
        cio.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );
  document.querySelectorAll(".count").forEach((c) => cio.observe(c));

  /* ---------- video player: autoplay muted + auto-next + user sound control ---------- */
  const VIDEOS = [
    { src: "assets/gardenia-1.mp4", title: "جاردينيا · لقطات من الميدان", sub: "مقطع ١" },
    { src: "assets/gardenia-2.mp4", title: "جاردينيا · تنفيذ المشاريع", sub: "مقطع ٢" },
  ];
  const stage = document.getElementById("stageVideo");
  const stageTitle = document.getElementById("stageTitle");
  const playlist = document.getElementById("playlist");
  const playBtn = document.getElementById("playBtn");
  const muteBtn = document.getElementById("muteBtn");
  const vol = document.getElementById("vol");
  let index = 0;

  if (stage) {
    playlist.innerHTML = VIDEOS.map(
      (v, i) => `<button class="thumb${i === 0 ? " active" : ""}" data-i="${i}">
        <video src="${v.src}#t=0.5" muted preload="metadata"></video>
        <span><b>${v.title}</b><span>${v.sub}</span></span>
      </button>`
    ).join("");

    const load = (i, autoplay = true) => {
      index = (i + VIDEOS.length) % VIDEOS.length;
      stage.src = VIDEOS[index].src;
      stageTitle.textContent = VIDEOS[index].title;
      playlist.querySelectorAll(".thumb").forEach((t, k) => t.classList.toggle("active", k === index));
      if (autoplay) stage.play().catch(() => {});
    };

    stage.addEventListener("ended", () => load(index + 1));
    stage.addEventListener("play", () => (playBtn.textContent = "❚❚"));
    stage.addEventListener("pause", () => (playBtn.textContent = "▶"));
    stage.addEventListener("click", () => (stage.paused ? stage.play() : stage.pause()));

    playBtn.addEventListener("click", () => (stage.paused ? stage.play() : stage.pause()));
    document.getElementById("nextBtn").addEventListener("click", () => load(index + 1));
    document.getElementById("prevBtn").addEventListener("click", () => load(index - 1));

    const syncSound = () => {
      muteBtn.textContent = stage.muted || stage.volume === 0 ? "🔇" : "🔊";
      vol.value = stage.muted ? 0 : stage.volume;
    };
    muteBtn.addEventListener("click", () => {
      stage.muted = !stage.muted;
      if (!stage.muted && stage.volume === 0) stage.volume = 0.8;
      syncSound();
    });
    vol.addEventListener("input", () => {
      stage.volume = Number(vol.value);
      stage.muted = Number(vol.value) === 0;
      syncSound();
    });
    playlist.addEventListener("click", (e) => {
      const btn = e.target.closest(".thumb");
      if (btn) load(Number(btn.dataset.i));
    });
    syncSound();
    stage.play().catch(() => {});
  }

  /* ---------- lightbox for images ---------- */
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightboxImg");
  document.querySelectorAll(".zoom img").forEach((img) =>
    img.addEventListener("click", () => {
      lbImg.src = img.src;
      lb.style.display = "grid";
    })
  );
  lb.addEventListener("click", () => (lb.style.display = "none"));
  document.addEventListener("keydown", (e) => e.key === "Escape" && (lb.style.display = "none"));

  // contact form -> stored locally, visible in admin.html
  const form = document.getElementById("contactForm");
  const note = document.getElementById("formNote");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      data.date = new Date().toLocaleString("ar-EG");
      const all = JSON.parse(localStorage.getItem("amira_orders") || "[]");
      all.unshift(data);
      localStorage.setItem("amira_orders", JSON.stringify(all));
      form.reset();
      note.textContent = "تم استلام طلبك ✅ سيتم التواصل معك على 0573866384 أو gardeniaaa44@gmail.com";
    });
  }

  document.getElementById("year").textContent = new Date().getFullYear();
})();
