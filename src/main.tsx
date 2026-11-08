import { Luxuosa } from './Luxuosa';
import { Portfolio } from './Portfolio';
import { ProposalFaq } from './ProposalFaq';
import { ConstrucelOnboarding } from './Onboarding';
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, HashRouter, Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { ArrowUpRight, ArrowDown, ArrowRight, Menu, X, MoveUpRight } from 'lucide-react';
import { proposal, sections } from './config';
import { SectionTape } from './SectionTape';
import { CommercialProvider } from './CommercialContext';
import { ProposalPaths } from './ProposalPaths';
import { FreelanceBlock } from './FreelanceBlock';
import { expirationDate } from './dates';
import './styles.css';
import { SprintPage, SprintCheckout } from './Sprint';
import { TractionPage } from './TractionOffer';
import { EntryOffer } from './EntryOffer';
import { MediaGallery } from './MediaGallery';
import { ModuleShowcase } from './ModuleShowcase';
import { JourneySection } from './Journey';
import { EcosystemSection } from './Technology';
import { InvestmentSection, MaratonaCheckout } from './Investment';
import { AboutSection, MethodologySection, SectionLink } from './Presentation';

function Wordmark() { return <Link to="/construcel" className="wordmark" aria-label="ABUHSCA, início">abuhsca<span>®</span><small>AGÊNCIA CRIATIVA</small></Link>; }
function Header({portal=false}:{portal?:boolean}) {
  const [open, setOpen] = useState(false);
  return <header className="header"><Wordmark/><nav aria-label="Navegação principal" className={open ? 'navigation open' : 'navigation'}>{(portal?[['A apresentação','proposta'],['Quem sou eu','quem-sou'],['As propostas','escolha-proposta']]:[['A proposta','proposta'],['A metodologia','metodologia'],['A operação','coracao'],['A jornada','jornada']]).map(([label,id]) => <SectionLink key={id} id={id} onNavigate={() => setOpen(false)}>{label}</SectionLink>)}<Link to="/construcel/onboarding" onClick={() => setOpen(false)}>ONBOARDING</Link><SectionLink id={portal?'escolha-proposta':'investimento'} className="nav-cta" onNavigate={() => setOpen(false)}>{portal?'Escolher proposta':'Vamos construir'} <ArrowUpRight size={15}/></SectionLink></nav><button className="menu-button" aria-label={open ? 'Fechar menu' : 'Abrir menu'} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button></header>;
}
function Validity() {
  const [now, setNow] = useState(Date.now());
  const expiry = expirationDate(proposal.presentedAt, proposal.validityMonths);
  useEffect(() => { if (!expiry) return; const id = window.setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(id); }, [expiry?.getTime()]);
  if (!expiry) return <div className="validity"><span className="status-dot"/><div><strong>UMA PROPOSTA. O SEU PRÓXIMO PASSO.</strong><p>Validade: 3 meses após a apresentação.<br/>Data de apresentação a confirmar.</p></div></div>;
  const remaining = Math.max(0, expiry.getTime() - now);
  return <div className="validity"><span className="status-dot"/><div><strong>{remaining ? 'CONDIÇÕES VÁLIDAS ATÉ' : 'PROPOSTA EXPIRADA'}</strong><p>{remaining ? expiry.toLocaleDateString('pt-BR', {timeZone:'America/Sao_Paulo'}) : 'As condições precisam ser reconfirmadas.'}</p>{remaining > 0 && <p className="countdown">{Math.floor(remaining/86400000)}d {Math.floor(remaining/3600000)%24}h {Math.floor(remaining/60000)%60}m {Math.floor(remaining/1000)%60}s</p>}</div></div>;
}
function Hero({maratona=false}:{maratona?:boolean}) {return <section id="proposta" className="hero hero-centered"><div className="hero-topline"><span><span className="status-dot"/> PROPOSTA EXCLUSIVA · {proposal.client.toUpperCase()}</span><span>ESTRATÉGIA + CRIATIVIDADE + TECNOLOGIA</span></div><div className="hero-grid"><div className="hero-copy"><div className="hero-client-brand">{proposal.logoPath ? <img src={`${import.meta.env.BASE_URL}${proposal.logoPath}`} alt="Construcel" className="hero-client-logo"/> : <span className="hero-client-name">Construcel<span>.</span></span>}</div><p className="eyebrow">ANA PAULA, ESTA PROPOSTA FOI<br/>DESENVOLVIDA EXCLUSIVAMENTE PARA VOCÊ.</p><h1>{maratona?'MARATONA':'PROPOSTA'}<br/><span>{maratona?'OPERAÇÃO 360°.':'COMERCIAL.'}</span></h1><div className="partnership"><span>ABUHSCA</span><span className="times">×</span><span>CONSTRUCEL<span className="brand-dot">.</span></span></div><p className="hero-description">Uma proposta para transformar estratégia, marketing, tecnologia e vendas em uma operação integrada de crescimento.</p><SectionLink className="primary-button" id="quem-sou">Conheça o próximo capítulo <ArrowUpRight size={20}/></SectionLink><Validity/></div></div><div className="hero-bottom"><SectionLink id="quem-sou"><span className="scroll-circle"><ArrowDown size={16}/></span> ROLE PARA DESCOBRIR</SectionLink><span>DO BRANDING <span className="text-white">À PERFORMANCE.</span></span><span>01 — {maratona?String(sections.length).padStart(2,'0'):'02'}</span></div></section>;}
function PhasePlaceholder({section,index}:{section:typeof sections[number];index:number}) { return <section id={section.id} className="phase-section"><div className="section-number">{String(index+1).padStart(2,'0')} / {String(sections.length).padStart(2, '0')}</div><div className="phase-content"><p className="eyebrow">{section.pillar}</p><h2>{section.title}</h2><p className="pending">{section.id==='cerebro' ? 'IMPLANTAÇÃO PREVISTA · EVOLUÇÃO CONFORME PLANEJAMENTO' : section.id==='coracao' ? 'IMPLANTAÇÃO PREVISTA · DESENVOLVIMENTO PROGRESSIVO' : 'DESENVOLVIMENTO PROGRESSIVO · CONFORME CRONOGRAMA'}</p>{section.id==='coracao'&&<ModuleShowcase/>}<MediaGallery section={section.id}/></div><MoveUpRight className="section-arrow" size={30}/></section>;}
function PageFooter(){return <footer><Wordmark/><p>ABUHSCA × CONSTRUCEL<br/><span>Do branding à performance.</span></p><Link to="/construcel">Escolher outra proposta →</Link></footer>;}
function Landing() { return <><Header portal/><main id="conteudo"><Hero/><div className="cn-contract-callout"><p><strong>O SPRINT já está contratado.</strong>Reunião inicial: 09/11/2026 às 11h, online pelo Google Meet.</p><Link to="/construcel/onboarding">Acessar ONBOARDING <ArrowUpRight size={17}/></Link></div><SectionTape/><AboutSection methodologyTarget="escolha-proposta" total={2}/><SectionTape/><ProposalPaths/><SectionTape/><FreelanceBlock/></main><PageFooter/></>;}
function MaratonaPage(){useEffect(()=>{window.scrollTo({top:0,behavior:'instant'});},[]);return <><Header/><main id="conteudo" data-proposal="maratona"><Hero maratona/><SectionTape/><div className="phase-notice"><span className="status-dot"/><span>PROPOSTA MARATONA</span><p>Mockups demonstrativos. Entregas, quantidades e condições conforme esta proposta e o escopo contratual.</p></div><AboutSection/><SectionTape/><MethodologySection/>{sections.slice(3).map((section,i)=><React.Fragment key={section.id}><SectionTape/>{section.id==='integracoes'?<EcosystemSection/>:section.id==='jornada'?<JourneySection/>:section.id==='investimento'?<InvestmentSection/>:<PhasePlaceholder section={section} index={i+3}/>}</React.Fragment>)}<ProposalFaq plan="maratona"/></main><PageFooter/></>;}
const isConstrucelEntry = Boolean(document.documentElement.dataset.entryRoute);
const AppRouter = isConstrucelEntry || import.meta.env.BASE_URL !== '/' ? HashRouter : BrowserRouter;
const entryRoute = document.documentElement.dataset.entryRoute || '/construcel';
const construcelEntry = new URL('construcel/', new URL(import.meta.env.BASE_URL, window.location.origin)).pathname;
// A dedicated HTML entry keeps each application's styles and routing independent.
if (window.location.pathname.startsWith(construcelEntry) && !window.location.hash) {
  window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#${entryRoute}`);
}
function ConstrucelRouteMeta() {
  const { pathname } = useLocation();
  useEffect(() => {
    document.title = pathname.includes('onboarding') ? 'Onboarding SPRINT | ABUHSCA × Construcel' : 'ABUHSCA × Construcel';
  }, [pathname]);
  return null;
}
function App() { return <AppRouter><ConstrucelRouteMeta/><CommercialProvider><SectionLink className="skip-link" id="conteudo">Pular para conteúdo</SectionLink><Routes><Route path="/" element={<Navigate to={entryRoute} replace/>}/><Route path="/construcel" element={<Landing/>}/><Route path="/luxuosa" element={<Luxuosa/>}/><Route path="/portfolio/casa-do-patriota" element={<Portfolio/>}/><Route path="/construcel/base" element={<EntryOffer plan="base"/>}/><Route path="/construcel/arranque" element={<EntryOffer plan="arranque"/>}/><Route path="/construcel/contratacao/base" element={<MaratonaCheckout/>}/><Route path="/construcel/contratacao/arranque" element={<MaratonaCheckout/>}/><Route path="/construcel/sprint" element={<SprintPage/>}/><Route path="/construcel/tracao" element={<TractionPage/>}/><Route path="/construcel/maratona" element={<MaratonaPage/>}/><Route path="/construcel/contratacao/tracao" element={<MaratonaCheckout/>}/><Route path="/construcel/contratacao/maratona" element={<MaratonaCheckout/>}/><Route path="/construcel/contratacao/sprint" element={<SprintCheckout/>}/><Route path="/construcel/onboarding" element={<ConstrucelOnboarding/>}/><Route path="/onboarding" element={<ConstrucelOnboarding/>}/><Route path="*" element={<main className="route-state"><h1>Página não encontrada.</h1><Link to="/construcel">Voltar à proposta</Link></main>}/></Routes></CommercialProvider></AppRouter>;}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
