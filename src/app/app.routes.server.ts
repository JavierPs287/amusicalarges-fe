import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'home',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'actualidad',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'calendario',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'infobanda',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'apuntate',
    renderMode: RenderMode.Prerender
  }
];