import React, { useMemo } from 'react';
import { BoardNote } from '../types';
import { Lightbulb, Info, CheckCircle, CheckSquare, Square, PenTool } from 'lucide-react';

interface Props {
  note: BoardNote;
  isCompleted: boolean;
  onToggleComplete: () => void;
  onClose: () => void;
}

export const BoardNoteViewer: React.FC<Props> = ({ note, isCompleted, onToggleComplete, onClose }) => {
  
  // PARSER ENGINE
  const parsedContent = useMemo(() => {
    if (!note.content) return [];
    
    // Split by tags but keep the tags in the array
    const parts = note.content.split(/(\[H1\]|\[INT\]|\[B\]|\[FIG\]|\[TIP\])/g);
    const elements: React.ReactNode[] = [];
    
    let currentTag = 'DEFAULT';

    parts.forEach((part, index) => {
      const trimmed = part.trim();
      if (!trimmed) return;

      if (['[H1]', '[INT]', '[B]', '[FIG]', '[TIP]'].includes(trimmed)) {
        currentTag = trimmed;
        return;
      }

      // Render based on currentTag
      switch (currentTag) {
        case '[H1]': // MAIN HEADING
          elements.push(
            <h1 key={index} className="text-2xl md:text-3xl font-black text-slate-900 mb-4 mt-6 border-b-4 border-blue-600 pb-2 inline-block">
              {trimmed}
            </h1>
          );
          break;
        
        case '[INT]': // INTRODUCTION
          elements.push(
            <div key={index} className="bg-slate-50 border-l-4 border-slate-400 p-4 mb-6 text-slate-700 italic text-lg leading-relaxed rounded-r-xl">
              {trimmed}
            </div>
          );
          break;

        case '[B]': // BODY (Bullets/Numbers)
            // Auto-detect numbered list
            const lines = trimmed.split('\n').filter(l => l.trim());
            const listItems = lines.map((line, idx) => {
                const isNumbered = /^\d+\./.test(line.trim());
                const cleanLine = line.replace(/^\d+\.|^[-•]/, '').trim();
                return (
                    <li key={idx} className="mb-3 pl-2 text-slate-800 text-base md:text-lg leading-relaxed">
                        <span className="font-bold text-slate-400 mr-2">{isNumbered ? line.split('.')[0]+'.' : '•'}</span>
                        {cleanLine}
                    </li>
                );
            });
            elements.push(
                <ul key={index} className="mb-6 space-y-1">
                    {listItems}
                </ul>
            );
            break;

        case '[FIG]': // FIGURE / DIAGRAM
          elements.push(
            <div key={index} className="bg-blue-50 border-2 border-blue-200 border-dashed rounded-xl p-6 mb-6 flex flex-col items-center text-center">
                <PenTool className="text-blue-500 mb-2" size={32} />
                <h4 className="font-bold text-blue-800 uppercase text-xs mb-2">Visual Aid Suggestion</h4>
                <p className="text-blue-900 font-medium font-mono text-sm">{trimmed}</p>
            </div>
          );
          break;

        case '[TIP]': // EXAM TIP
          elements.push(
            <div key={index} className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 mb-6 shadow-sm flex gap-4">
                <div className="bg-yellow-100 p-2 h-fit rounded-full text-yellow-600">
                    <Lightbulb size={24} />
                </div>
                <div>
                    <h4 className="font-bold text-yellow-800 uppercase text-xs mb-1">Exam Tip / Golden Key</h4>
                    <p className="text-slate-700 font-bold">{trimmed}</p>
                </div>
            </div>
          );
          break;

        default: // DEFAULT TEXT
          elements.push(
            <p key={index} className="mb-4 text-slate-700 text-lg leading-relaxed">
              {trimmed}
            </p>
          );
      }
    });

    return elements;
  }, [note.content]);

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col animate-in slide-in-from-bottom-4">
      {/* HEADER */}
      <div className="bg-white border-b border-slate-200 p-4 flex justify-between items-center shadow-sm z-10">
        <div>
            <span className="text-[10px] font-black uppercase text-blue-600 tracking-widest bg-blue-50 px-2 py-1 rounded">Board Exam Special</span>
            <h2 className="text-lg font-bold text-slate-900 truncate max-w-[200px] md:max-w-md">{note.title}</h2>
        </div>
        <button onClick={onClose} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 text-slate-600 font-bold text-xs">
            Close ✕
        </button>
      </div>

      {/* CONTENT SCROLL */}
      <div className="flex-1 overflow-y-auto p-6 md:p-12 bg-white max-w-4xl mx-auto w-full">
         <div className="prose prose-lg max-w-none">
             {parsedContent}
         </div>
         
         {/* SPACER */}
         <div className="h-20"></div>
      </div>

      {/* FOOTER TRACKER */}
      <div className="border-t border-slate-200 p-4 bg-slate-50 flex justify-center pb-8">
          <button 
            onClick={onToggleComplete}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl shadow-lg transition-all transform active:scale-95 ${
                isCompleted 
                ? 'bg-green-600 text-white' 
                : 'bg-white text-slate-600 border-2 border-slate-300 hover:border-green-400'
            }`}
          >
              {isCompleted ? <CheckCircle size={28} className="animate-bounce" /> : <Square size={28} />}
              <span className="text-lg font-bold">
                  {isCompleted ? 'Routine Completed!' : 'Mark Routine as Completed'}
              </span>
          </button>
      </div>
    </div>
  );
};
