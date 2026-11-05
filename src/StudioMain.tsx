import '@fontsource/bodoni-moda/400.css';
import '@fontsource/bodoni-moda/400-italic.css';
import '@fontsource/bodoni-moda/600.css';
import '@fontsource/manrope/400.css';
import '@fontsource/manrope/500.css';
import '@fontsource/manrope/600.css';
import '@fontsource/jetbrains-mono/400.css';
import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, HashRouter, Routes, Route, useLocation, useParams, Link } from 'react-router-dom';
import Index from './studio/routes/index';
import Films from './studio/routes/filmes.index';
import FilmPage from './studio/routes/filmes.$filmId';
import { OptionB, OptionBFilm } from './studio/routes/opcao-b';
import Visual from './studio/routes/linguagem-visual';
import Production from './studio/routes/producao';
import { SiteHeader } from './studio/components/site-header';
import { getFilm } from './studio/data/campaign';
import './studio/styles.css';
function FilmRoute() { const {filmId} = useParams(); return getFilm(filmId ?? '') ? <FilmPage key={filmId}/> : <NotFound/>; }
function NotFound() { return <main className="mx-auto min-h-screen max-w-7xl px-5 pt-32"><h1 className="font-display text-5xl">Página não encontrada.</h1><Link to="/" className="mt-8 inline-block text-primary">Voltar à campanha</Link></main>; }
function ScrollReset() { const {pathname} = useLocation(); useEffect(()=>{ window.scrollTo(0,0); document.title = 'BLACK IQV — Director’s Cut | ABUHSCA × E3'; },[pathname]); return null; }
const Router = import.meta.env.BASE_URL === '/' ? BrowserRouter : HashRouter;
createRoot(document.getElementById('root')!).render(<React.StrictMode><Router><ScrollReset/><SiteHeader/><Routes><Route path="/" element={<Index/>}/><Route path="/construcel" element={<Index/>}/><Route path="/opcao-b" element={<OptionB/>}/><Route path="/opcao-b/filmes/:filmId" element={<OptionBFilm/>}/><Route path="/filmes" element={<Films/>}/><Route path="/filmes/:filmId" element={<FilmRoute/>}/><Route path="/linguagem-visual" element={<Visual/>}/><Route path="/producao" element={<Production/>}/><Route path="*" element={<NotFound/>}/></Routes></Router></React.StrictMode>);
