import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { io, Socket } from 'socket.io-client';
import { Users, Send, LinkIcon, Check, ArrowLeft, PartyPopper, Film } from 'lucide-react';
import { partyAPI } from '../services/api';
import useAuth from '../hooks/useAuth';

interface ChatMessage {
  id: string;
  name?: string;
  text: string;
  at: number;
  system?: boolean;
}

const PartyPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [members, setMembers] = useState<string[]>([]);
  const [draft, setDraft] = useState('');
  const [copied, setCopied] = useState(false);
  const [socketError, setSocketError] = useState('');
  const socketRef = useRef<Socket | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['party', id],
    queryFn: () => partyAPI.getParty(id!),
    enabled: !!id,
    retry: false,
    staleTime: Infinity
  });
  const party = data?.party;

  useEffect(() => {
    if (!loading && !user) navigate('/sign');
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user || !party || !id) return;

    const socket = io('/', { withCredentials: true });
    socketRef.current = socket;

    socket.on('connect', () => socket.emit('party:join', { roomId: id }));
    socket.on('party:history', ({ messages: history }: { messages: ChatMessage[] }) => setMessages(history));
    socket.on('party:message', (message: ChatMessage) => setMessages(prev => [...prev, message]));
    socket.on('party:state', (state: { members: string[] }) => setMembers(state.members));
    socket.on('party:error', ({ message }: { message: string }) => setSocketError(message));

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user, party, id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || !socketRef.current) return;
    socketRef.current.emit('party:message', { text });
    setDraft('');
  };

  const copyInvite = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setSocketError('Could not copy the link — copy it from the address bar');
    }
  };

  if (loading || !user) return null;

  if (isLoading) {
    return (
      <div className="mt-16 min-h-screen bg-[#0d1b3e] flex items-center justify-center">
        <p className="text-white/40 text-[14px]">Joining the party...</p>
      </div>
    );
  }

  if (isError || !party) {
    return (
      <div className="mt-16 min-h-screen bg-[#0d1b3e] flex items-center justify-center px-5">
        <div className="text-center">
          <div className="w-14 h-14 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center mx-auto mb-4">
            <PartyPopper size={22} className="text-white/30" />
          </div>
          <p className="text-[16px] font-bold text-white mb-1.5">This party is over</p>
          <p className="text-[13px] text-white/40 mb-6">The room doesn't exist or the server restarted.</p>
          <Link to="/" className="inline-flex items-center gap-2 bg-white text-[#134686] text-[13.5px] font-bold py-2.5 px-5 rounded-lg hover:bg-[#ddeaff] transition-all">
            Back to WatchWise
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-16 h-[calc(100vh-64px)] bg-[#0d1b3e] flex flex-col">
      {/* Header */}
      <div className="relative flex-shrink-0 overflow-hidden border-b border-white/[0.08]">
        {party.backdropPath && (
          <img
            src={`https://image.tmdb.org/t/p/w780${party.backdropPath}`}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-25"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d1b3e] via-[#0d1b3e]/80 to-[#0d1b3e]/40" />
        <div className="relative z-10 px-[4%] py-5 flex items-center gap-4">
          <button onClick={() => navigate(`/movie/${party.movieId}`)} className="flex items-center gap-1.5 text-white/50 hover:text-white text-[13px] transition-colors cursor-pointer bg-transparent border-none">
            <ArrowLeft size={15} />
          </button>
          <div className="w-11 h-16 rounded-md overflow-hidden flex-shrink-0 bg-[#112055] flex items-center justify-center">
            {party.posterPath ? (
              <img src={`https://image.tmdb.org/t/p/w92${party.posterPath}`} alt="" className="w-full h-full object-cover" />
            ) : (
              <Film size={16} className="text-white/25" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <PartyPopper size={14} className="text-[#6ea8fe]" />
              <span className="text-[11px] font-bold tracking-[1px] uppercase text-[#6ea8fe]">Watch Party</span>
            </div>
            <h1 className="text-[19px] font-bold text-white truncate">{party.movieTitle}</h1>
            <p className="text-[12px] text-white/40">Hosted by {party.hostName}</p>
          </div>
          <button
            onClick={copyInvite}
            className="flex items-center gap-2 bg-white text-[#134686] text-[13px] font-bold py-2.5 px-4 rounded-lg cursor-pointer hover:bg-[#ddeaff] transition-all flex-shrink-0"
          >
            {copied ? <Check size={14} /> : <LinkIcon size={14} />}
            {copied ? 'Copied!' : 'Copy Invite Link'}
          </button>
        </div>
      </div>

      {/* Members */}
      <div className="flex-shrink-0 px-[4%] py-2.5 border-b border-white/[0.06] flex items-center gap-2.5 overflow-x-auto">
        <Users size={13} className="text-white/35 flex-shrink-0" />
        {members.length === 0 ? (
          <span className="text-[12px] text-white/35">Connecting...</span>
        ) : (
          members.map(name => (
            <span key={name} className="flex items-center gap-1.5 px-2.5 py-1 bg-[#6ea8fe]/10 border border-[#6ea8fe]/25 rounded-full text-[12px] font-semibold text-[#6ea8fe] whitespace-nowrap">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
              {name}
            </span>
          ))
        )}
      </div>

      {/* Chat */}
      <div className="flex-1 overflow-y-auto px-[4%] py-5 flex flex-col gap-2.5">
        {socketError && (
          <p className="text-[13px] text-red-400 bg-red-500/10 border border-red-500/25 rounded-lg px-4 py-2.5">{socketError}</p>
        )}
        {messages.map(message =>
          message.system ? (
            <p key={message.id} className="text-center text-[11.5px] text-white/30 py-0.5">{message.text}</p>
          ) : (
            <div key={message.id} className={`max-w-[70%] ${message.name === user.firstName ? 'self-end' : 'self-start'}`}>
              <div className={`px-3.5 py-2.5 rounded-2xl ${
                message.name === user.firstName
                  ? 'bg-[#6ea8fe] text-[#0d1b3e] rounded-br-md'
                  : 'bg-white/[0.07] border border-white/[0.08] text-white rounded-bl-md'
              }`}>
                {message.name !== user.firstName && (
                  <p className="text-[11px] font-bold text-[#6ea8fe] mb-0.5">{message.name}</p>
                )}
                <p className="text-[13.5px] leading-[1.5] break-words">{message.text}</p>
              </div>
              <p className={`text-[10px] text-white/25 mt-1 ${message.name === user.firstName ? 'text-right' : ''}`}>
                {new Date(message.at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
              </p>
            </div>
          )
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="flex-shrink-0 px-[4%] py-4 border-t border-white/[0.08] flex gap-3">
        <input
          value={draft}
          onChange={e => setDraft(e.target.value)}
          maxLength={500}
          placeholder={`Chat about ${party.movieTitle}...`}
          className="flex-1 bg-white/[0.05] border border-white/10 text-white text-[14px] px-4 py-3 rounded-xl outline-none placeholder-white/25 focus:border-[#6ea8fe]/55 transition-all font-sans"
        />
        <button
          type="submit"
          disabled={!draft.trim()}
          className="flex items-center justify-center w-12 rounded-xl bg-white text-[#134686] cursor-pointer hover:bg-[#ddeaff] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Send size={17} />
        </button>
      </form>
    </div>
  );
};

export default PartyPage;
