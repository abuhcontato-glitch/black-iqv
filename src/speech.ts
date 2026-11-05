import {discoveryAnswerLimit} from './discovery.ts';
export type SpeechResult={isFinal:boolean;length:number;[index:number]:{transcript:string}};
export type SpeechResults={length:number;[index:number]:SpeechResult};
export type SpeechResultEvent={results:SpeechResults};
export type SpeechErrorEvent={error:string};
export type Recognition={
 lang:string;continuous:boolean;interimResults:boolean;maxAlternatives:number;
 onstart:(()=>void)|null;onresult:((event:SpeechResultEvent)=>void)|null;
 onerror:((event:SpeechErrorEvent)=>void)|null;onend:(()=>void)|null;
 start:()=>void;stop:()=>void;abort:()=>void;
};
export type RecognitionConstructor=new()=>Recognition;
export function recognitionConstructor():RecognitionConstructor|null{
 if(typeof window==='undefined')return null;
 const target=window as unknown as {SpeechRecognition?:RecognitionConstructor;webkitSpeechRecognition?:RecognitionConstructor};
 return target.SpeechRecognition??target.webkitSpeechRecognition??null;
}
// Rebuild the current recognition session from all results, rather than appending
// repeated interim/final events. The text present before starting stays intact.
export function dictationText(base:string,results:SpeechResults,limit=discoveryAnswerLimit){
 const parts:string[]=[];let interim=false;
 for(let i=0;i<results.length;i++){const result=results[i];if(result?.[0]?.transcript){parts.push(result[0].transcript.trim());if(!result.isFinal)interim=true;}}
 const speech=parts.filter(Boolean).join(' ').replace(/\s+/g,' ').trim();
 const text=speech?`${base}${base&&!/\s$/.test(base)?'\n':''}${speech}`:base;
 return {text:text.slice(0,limit),interim,truncated:text.length>limit};
}
export function speechErrorMessage(error:string){
 const messages:Record<string,string>={
  'not-allowed':'Microfone não autorizado. Permita o acesso ao microfone nas configurações deste site no navegador e tente novamente.',
  'service-not-allowed':'O serviço de voz não foi autorizado por este navegador. Confira as permissões ou tente no Chrome ou Edge atualizado.',
  'audio-capture':'Não foi possível acessar o microfone. Confira se ele está conectado e disponível para o navegador.',
  'network':'O serviço de transcrição ficou indisponível. Confira a conexão e tente novamente; o texto já escrito foi preservado.',
  'no-speech':'Não foi detectada fala. Aproxime o microfone e toque em Ditar resposta para tentar novamente.',
  'language-not-supported':'O reconhecimento em português não está disponível neste navegador. Tente outro navegador ou use o ditado do teclado.',
  'aborted':'Ditado interrompido. O texto já escrito foi preservado.'
 };
 return messages[error]??'Não foi possível continuar o ditado. O texto já escrito foi preservado. Tente novamente ou use o teclado.';
}
