import {discoveryAnswerLimit} from './discovery';
import {useEffect,useRef,useState} from 'react';
import {Mic,Square,LoaderCircle} from 'lucide-react';
import {dictationText,recognitionConstructor,speechErrorMessage,type Recognition} from './speech';

let activeDictation:{cancel:(message:string)=>void}|null=null;
export function VoiceTextarea({id,label,value,onChange,enabled=true}:{id:string;label:string;value:string;onChange:(value:string)=>void;enabled?:boolean}){
 const [phase,setPhase]=useState<'idle'|'starting'|'listening'|'stopping'>('idle'),[message,setMessage]=useState(''),[interim,setInterim]=useState(false);
 const engine=useRef<Recognition|null>(null),run=useRef(0),mounted=useRef(false),valueRef=useRef(value),changeRef=useRef(onChange),owner=useRef<{cancel:(message:string)=>void}|null>(null);
 const supported=Boolean(recognitionConstructor())&&window.isSecureContext;
 useEffect(()=>{valueRef.current=value;changeRef.current=onChange;},[value,onChange]);
 function disconnect(){run.current++;const recognition=engine.current;engine.current=null;if(activeDictation===owner.current)activeDictation=null;owner.current=null;if(recognition){recognition.onstart=null;recognition.onresult=null;recognition.onerror=null;recognition.onend=null;try{recognition.abort();}catch{}}}
 function cancel(text:string){disconnect();if(mounted.current){setPhase('idle');setInterim(false);setMessage(text);}}
 useEffect(()=>{mounted.current=true;const hide=()=>{if(engine.current)cancel('Microfone encerrado ao sair desta página. O texto foi preservado.');};const visibility=()=>{if(document.hidden)hide();};document.addEventListener('visibilitychange',visibility);window.addEventListener('pagehide',hide);return()=>{mounted.current=false;document.removeEventListener('visibilitychange',visibility);window.removeEventListener('pagehide',hide);disconnect();};},[]);
 useEffect(()=>{if(!enabled)cancel('Microfone encerrado. O texto foi preservado.');},[enabled]);
 function start(){
  const Constructor=recognitionConstructor();if(!Constructor||!enabled)return;
  if(engine.current){if(phase==='starting'){cancel('Ditado cancelado. O texto foi preservado.');return;}setPhase('stopping');setMessage('Finalizando a transcrição…');try{engine.current.stop();}catch{cancel('Ditado encerrado. O texto foi preservado.');}return;}
  if(valueRef.current.length>=discoveryAnswerLimit){setMessage('Este campo atingiu 12.000 caracteres. Revise o texto antes de ditar mais.');return;}
  activeDictation?.cancel('Microfone encerrado: você iniciou o ditado em outro campo. O texto foi preservado.');
  let recognition:Recognition;try{recognition=new Constructor();}catch{setMessage('Não foi possível iniciar o reconhecimento de voz neste navegador. Use o teclado ou tente outro navegador.');return;}
  const token=++run.current,base=valueRef.current;let failed=false,hasText=false;
  const current=()=>mounted.current&&token===run.current;
  const controller={cancel};owner.current=controller;activeDictation=controller;engine.current=recognition;
  recognition.lang='pt-BR';recognition.continuous=true;recognition.interimResults=true;recognition.maxAlternatives=1;
  recognition.onstart=()=>{if(!current())return;setPhase('listening');setMessage('Ouvindo em português. A transcrição aparece no campo abaixo.');};
  recognition.onresult=event=>{if(!current())return;const result=dictationText(base,event.results);hasText=result.text!==base;valueRef.current=result.text;changeRef.current(result.text);setInterim(result.interim);if(result.truncated){cancel('Limite de 12.000 caracteres atingido. O ditado parou; revise o texto deste campo.');return;}setMessage(result.interim?'Transcrevendo… o texto pode ser ajustado pelo reconhecimento.':'Texto transcrito. Continue falando ou toque em Parar microfone.');};
  recognition.onerror=event=>{if(!current())return;failed=true;setMessage(speechErrorMessage(event.error));setInterim(false);setPhase('idle');run.current++;engine.current=null;if(activeDictation===controller)activeDictation=null;owner.current=null;try{recognition.abort();}catch{}};
  recognition.onend=()=>{if(!current())return;engine.current=null;if(activeDictation===controller)activeDictation=null;owner.current=null;setPhase('idle');setInterim(false);if(!failed)setMessage(hasText?'Ditado encerrado. Revise a transcrição; toque em Ditar resposta para acrescentar mais.':'O microfone parou sem transcrever. Toque em Ditar resposta para tentar novamente.');};
  setPhase('starting');setMessage('Iniciando microfone… autorize o acesso se o navegador pedir.');setInterim(false);
  try{recognition.start();}catch{cancel('Não foi possível iniciar o microfone. Confira a permissão e tente novamente.');}
 }
 const recording=phase!=='idle';
 return <div className={`discovery-voice ${recording?'is-recording':''}`}><div className="discovery-voice-toolbar"><button type="button" className="discovery-mic" disabled={!supported||!enabled||phase==='stopping'} onClick={start} aria-pressed={recording} aria-label={`${recording?'Parar microfone':'Ditar resposta'}: ${label}`} aria-controls={id}>{phase==='starting'||phase==='stopping'?<LoaderCircle size={17} className="voice-spinner"/>:recording?<Square size={15} fill="currentColor"/>:<Mic size={17}/>}<span>{!supported?'Voz indisponível':phase==='starting'?'Cancelar microfone':phase==='stopping'?'Finalizando…':recording?'Parar microfone':'Ditar resposta'}</span></button><span className="discovery-voice-state">{recording?<><i/>{phase==='starting'?'Aguardando microfone…':phase==='stopping'?'Encerrando microfone…':'Microfone ativo'}{interim?' · transcrevendo':''}</>:'Português · texto editável'}</span></div><textarea id={id} value={value} maxLength={discoveryAnswerLimit} rows={4} placeholder="Digite ou toque no microfone para transcrever a resposta…" aria-describedby={`${id}-voice-status`} onChange={e=>{if(engine.current)cancel('Ditado encerrado para você editar o texto.');valueRef.current=e.target.value;onChange(e.target.value);}}/><p id={`${id}-voice-status`} className="discovery-voice-message" role="status">{!supported?'O reconhecimento de voz não está disponível aqui. Tente no Chrome ou Edge atualizado, ou use o ditado do teclado do celular.':message||'Toque no microfone, fale e pare quando quiser. O texto anterior é preservado.'}</p></div>;
}
