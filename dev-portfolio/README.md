# dev-portfolio · Monorepo

Monorepo de presentación de Diego Ballesteros Fernández — _Junior Backend Developer_.

Alberga varios proyectos bajo un mismo techo, gestionados con **npm workspaces +
Turborepo**. Los nuevos proyectos se incorporan como `apps/*`.

## Estructura

```
dev-portfolio/
├── apps/
│   ├── portfolio/      # Landing estilo terminal/CMD (Next.js 16) · puerto 3000
│   └── gastronomada/   # App gastronómica con auth/foro/buzón (Next.js 16) · puerto 3001
├── packages/           # Código compartido (vacío por ahora)
├── turbo.json          # Pipeline de Turborepo
└── package.json        # Workspaces + scripts raíz
```

### Roadmap del monorepo

- [x] `apps/portfolio` — landing/portfolio
- [x] `apps/gastronomada` — proyecto migrado al monorepo
- [x] Turborepo + npm workspaces
- [ ] `apps/*` — tercer proyecto (pendiente)
- [ ] `packages/ui`, `packages/config` — extraer lo compartido

## Desarrollo

Todo desde la raíz del monorepo; Turbo orquesta los workspaces:

```bash
npm install                  # instala todas las apps (node_modules hoisteado)
npm run dev                  # arranca ambas apps (portfolio:3000 + gastronomada:3001)
npm run dev:portfolio        # solo portfolio
npm run dev:gastronomada     # solo gastronomada
npm run build                # build de producción de todas las apps
npm run lint                 # lint de todas las apps
```

Las apps se enlazan entre sí por URL (variables `NEXT_PUBLIC_PORTFOLIO_URL` /
`NEXT_PUBLIC_GASTRONOMADA_URL`, con los puertos de desarrollo como valor por defecto;
ver el `.env.example` de cada app para producción).
