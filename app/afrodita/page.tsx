"use client"

import { useState } from "react"
import { ArrowLeft, Check, Link2, MessageCircle, Search, Send, ShoppingBag, Sparkles, X } from "lucide-react"
import Link from "next/link"

const suggestions = ["Buscar unas Nike", "Cotizar un link", "Ver mis pedidos"]

export default function AfroditaPage() {
  const [messages, setMessages] = useState([
    { from: "afrodita", text: "Hola, soy Afrodita. Te ayudo a encontrar productos de USA y calcular cuánto pagarías en RD." },
  ])
  const [input, setInput] = useState("")

  function sendMessage(value = input) {
    const clean = value.trim()
    if (!clean) return
    setMessages((current) => [
      ...current,
      { from: "user", text: clean },
      { from: "afrodita", text: clean.toLowerCase().includes("nike") ? "Perfecto. ¿Buscas sneakers para mujer, hombre o niño? También dime tu talla y presupuesto." : "Claro. Puedo ayudarte con eso. Pega el link del producto o dime qué estás buscando." },
    ])
    setInput("")
  }

  return (
    <main className="min-h-screen bg-[#f4f8fc] text-[#071b45]">
      <div className="mx-auto flex min-h-screen max-w-md flex-col bg-white shadow-[0_0_40px_rgba(7,27,69,0.12)]">
        <header className="flex items-center justify-between border-b border-[#e8edf4] px-4 py-3">
          <Link href="/" aria-label="Volver al inicio" className="flex size-9 items-center justify-center rounded-full bg-[#f1f6fb]"><ArrowLeft className="size-4" /></Link>
          <div className="flex items-center gap-2">
            <img src="/afrodita-avatar.png" alt="Afrodita" className="size-9 rounded-full object-cover ring-2 ring-[#d7edff] animate-[pulse_3s_ease-in-out_infinite]" />
            <div><p className="text-sm font-black">Afrodita</p><p className="text-[10px] text-[#2380bd]">Asistente USALINK</p></div>
          </div>
          <button type="button" aria-label="Más opciones" className="flex size-9 items-center justify-center rounded-full bg-[#f1f6fb]"><Sparkles className="size-4" /></button>
        </header>

        <section className="bg-[#071b45] px-5 pb-5 pt-6 text-white">
          <div className="flex items-center gap-4">
            <img src="/afrodita-avatar.png" alt="Retrato de Afrodita" className="size-20 rounded-[24px] object-cover ring-4 ring-white/15 animate-[pulse_3s_ease-in-out_infinite]" />
            <div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8dd5ff]">Tu guía de compras</p><h1 className="mt-1 text-2xl font-black tracking-tight">Compra mejor.<br />Pregunta a Afrodita.</h1></div>
          </div>
          <p className="mt-4 text-sm leading-6 text-white/75">Encuentra productos, compara opciones y entiende tu cotización antes de pagar.</p>
        </section>

        <section className="flex-1 space-y-4 overflow-auto px-4 py-5" aria-live="polite">
          {messages.map((message, index) => <div key={`${message.from}-${index}`} className={`flex items-end gap-2 ${message.from === "user" ? "justify-end" : "justify-start"}`}>
            {message.from === "afrodita" && <img src="/afrodita-avatar.png" alt="" className="size-7 rounded-full object-cover animate-[pulse_3s_ease-in-out_infinite]" />}
            <div className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-5 ${message.from === "user" ? "rounded-br-md bg-[#2473b8] text-white" : "rounded-bl-md bg-[#f0f5fa] text-[#263b55]"}`}>{message.text}</div>
          </div>)}
          {messages.length === 1 && <div className="flex flex-wrap gap-2 pl-9">{suggestions.map((suggestion) => <button key={suggestion} type="button" onClick={() => sendMessage(suggestion)} className="rounded-full border border-[#cfe5f5] px-3 py-2 text-xs font-semibold text-[#2473b8]">{suggestion}</button>)}</div>}
        </section>

        <div className="border-t border-[#e8edf4] bg-white px-4 pb-5 pt-3">
          <div className="flex items-center gap-2 rounded-2xl border border-[#dce8f2] bg-[#f8fbfd] p-1.5 focus-within:border-[#2473b8]">
            <button type="button" aria-label="Pegar enlace" className="flex size-10 items-center justify-center rounded-xl text-[#2473b8]"><Link2 className="size-4" /></button>
            <input value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.nativeEvent.isComposing && event.keyCode !== 229) sendMessage() }} placeholder="Escríbele a Afrodita..." className="min-w-0 flex-1 bg-transparent px-1 text-sm outline-none" />
            <button type="button" aria-label="Enviar mensaje" onClick={() => sendMessage()} className="flex size-10 items-center justify-center rounded-xl bg-[#071b45] text-white"><Send className="size-4" /></button>
          </div>
          <p className="mt-3 text-center text-[10px] text-[#8b98aa]">Afrodita confirma precios con USALINK antes de cobrar.</p>
        </div>
      </div>
    </main>
  )
}
