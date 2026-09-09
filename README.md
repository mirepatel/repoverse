# 🌿 Repoverse

### Design × Development

.˚⊹₊⟡⋆

An interactive 3D GitHub repository explorer built with React and Three.js. Transform public GitHub profiles into immersive universes where repositories become planets, shaped by their language, activity, and popularity.

🟢 **[Live Demo](https://repoverse-3d.vercel.app/)**

---

## ✦ Preview

<p align="center">
  <img src="./public/repoverse-screenshot.png" alt="Repoverse Interface" width="600" style="border-radius: 8px;"/>
</p>

₊⊹

---

## ✦ About

Repoverse is a browser-based visualization tool designed to turn the familiar structure of GitHub repositories into an interactive spatial experience. Instead of browsing repositories through a conventional list, it transforms a public GitHub profile into a 3D universe where each repository exists as an individual planet.

The experience combines data-driven visual systems with a minimal interface, allowing users to explore repositories through spatial navigation, profile switching, repository search, and focused repository details.

V2 — **Exploration Era** — expands this idea beyond simply viewing a repository universe. Users can move through the universe more freely, switch GitHub profiles without returning to the landing experience, enter an Exploration Mode with a rocket, and travel into an individual Repository World.

₊⊹

---

## ✦ Features

🌱 **3D Repository Universe** • Visualize public GitHub repositories as interactive planets distributed throughout a dynamic 3D space.  
🌱 **Data-Driven Visuals** • Repository language, activity, popularity, and archived status influence planetary appearance and behaviour.  
🌱 **Interactive Exploration** • Rotate, zoom, navigate, and explore the universe through an immersive spatial environment.  
🌱 **Repository Search** • Quickly find repositories by name, description, language, or topic with keyboard shortcut support.  
🌱 **Profile Search** • Explore GitHub profiles using either a username or a direct GitHub profile URL.  
🌱 **Profile Switching** • Switch between GitHub profiles directly from the universe without returning to the landing experience.  
🌱 **Repository Insights** • Select any planet to reveal focused repository information including stars, forks, language, topics, and GitHub links.  
🌱 **Profile Exploration** • Explore public GitHub profiles with profile statistics, repository counts, followers, languages, and total stars.  
🌱 **Exploration Mode** • Enter a dedicated exploration experience with a subtle rocket navigation element for travelling through the universe.  
🌱 **Repository World** • Enter an individual repository's own 3D environment for a more focused exploration experience.  
🌱 **Shareable Universes** • Every explored GitHub profile has its own shareable URL for directly revisiting or sharing a repository universe.  

₊⊹

---

## ✦ Tech

![React](https://img.shields.io/badge/React-0f172a?style=flat&logo=react&logoColor=white&labelColor=0f172a) •
![Three.js](https://img.shields.io/badge/Three.js-0f172a?style=flat&logo=threedotjs&logoColor=white&labelColor=0f172a) •
![React Three Fiber](https://img.shields.io/badge/React_Three_Fiber-0f172a?style=flat&logo=react&logoColor=white&labelColor=0f172a) •
![Vite](https://img.shields.io/badge/Vite-0f172a?style=flat&logo=vite&logoColor=white&labelColor=0f172a) •
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-0f172a?style=flat&logo=tailwindcss&logoColor=white&labelColor=0f172a) •
![JavaScript](https://img.shields.io/badge/JavaScript-0f172a?style=flat&logo=javascript&logoColor=white&labelColor=0f172a)

₊⊹

---

## ✦ Architecture

```text
repoverse/
├── package.json
├── package-lock.json
├── vercel.json
├── index.html
├── README.md
├── LICENSE
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── components/
    │   ├── 3d/
    │   │   ├── ExplorationRocket.jsx
    │   │   ├── RepositoryNode.jsx
    │   │   ├── RepositoryWorld.jsx
    │   │   ├── Universe.jsx
    │   │   └── UniverseCore.jsx
    │   ├── landing/
    │   │   └── LandingHero.jsx
    │   ├── ProfilePopover.jsx
    │   ├── RepoPanel.jsx
    │   └── ui/
    │       ├── badge.jsx
    │       ├── button.jsx
    │       ├── card.jsx
    │       └── separator.jsx
    ├── lib/
    │   ├── github.js
    │   └── repositoryVisuals.js
    └── data/
        └── repositories.js
```

₊⊹

---

## ✦ Credits

* **Inspiration** • Inspired by the idea of transforming conventional GitHub repository browsing into a more visual and immersive spatial experience.
* **V2 — Exploration Era** • Expanded Repoverse from a 3D repository visualizer into a more purposeful exploration experience with profile switching, Exploration Mode, and Repository World.
* **Horizon** • Future iterations may introduce deeper repository intelligence, richer Repository World interactions, and additional ways to visualize GitHub activity.

₊⊹

---

## ✦ Connect

[LinkedIn](https://www.linkedin.com/in/mirepatel) • [Portfolio](https://mirepatel.framer.website/) • [Email](mailto:mirepatel@gmail.com)

---

**C**ode

**C**reativity

**C**ontinuous Learning

•··
