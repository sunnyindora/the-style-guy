"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, Send } from "lucide-react";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
      <p className="text-[11px] tracking-[0.3em] uppercase text-neutral-500 mb-3">Get in Touch</p>
      <h1 className="font-serif-display text-5xl md:text-6xl font-bold mb-8">Contact Us</h1>
      <p className="text-lg text-neutral-700 mb-10 leading-relaxed">
        Have a question, suggestion, or partnership opportunity? We'd love to hear from you.
      </p>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="border border-neutral-200 p-6">
          <Mail className="w-6 h-6 mb-3" />
          <p className="text-xs uppercase tracking-widest text-neutral-500 mb-1">Email</p>
          <p className="font-semibold">hello@thestyleguy.com</p>
        </div>
        <div className="border border-neutral-200 p-6">
          <p className="text-xs uppercase tracking-widest text-neutral-500 mb-1">Press</p>
          <p className="font-semibold">press@thestyleguy.com</p>
        </div>
        <div className="border border-neutral-200 p-6">
          <p className="text-xs uppercase tracking-widest text-neutral-500 mb-1">Partnerships</p>
          <p className="font-semibold">partners@thestyleguy.com</p>
        </div>
      </div>

      {sent ? (
        <div className="bg-neutral-50 border border-neutral-200 p-8 text-center">
          <h3 className="text-2xl font-bold mb-2">Thank you!</h3>
          <p className="text-neutral-600">We've received your message and will get back to you shortly.</p>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("Message sent!");
            setSent(true);
          }}
          className="space-y-6"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">Name</label>
              <input required type="text" className="w-full border-b border-neutral-300 py-2 focus:outline-none focus:border-neutral-900 bg-transparent" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">Email</label>
              <input required type="email" className="w-full border-b border-neutral-300 py-2 focus:outline-none focus:border-neutral-900 bg-transparent" />
            </div>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">Subject</label>
            <input required type="text" className="w-full border-b border-neutral-300 py-2 focus:outline-none focus:border-neutral-900 bg-transparent" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">Message</label>
            <textarea required rows={5} className="w-full border border-neutral-300 p-3 focus:outline-none focus:border-neutral-900 bg-transparent" />
          </div>
          <Button type="submit">
            Send Message <Send className="ml-2 w-4 h-4" />
          </Button>
        </form>
      )}
    </div>
  );
}
