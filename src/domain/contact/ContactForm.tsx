import { useEffect, useRef, useState, type FormEvent } from 'react';
import { createPortal } from 'react-dom';
import type { ContactFormProps } from '@/domain/contact/types';
import { CONTACT } from '@/infrastructure/lib/constants';
import { cn } from '@/infrastructure/lib/utils/helpers';
import '@/infrastructure/styles/contact.css';

interface FormState {
  name: string;
  email: string;
  message: string;
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

function WhatsappIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35zM12.04 2.5a9.52 9.52 0 0 0-8.13 14.4l-1.35 4.93 5.06-1.33a9.53 9.53 0 1 0 4.42-17.99zm0 17.4a7.86 7.86 0 0 1-4-1.1l-.29-.17-2.96.78.79-2.89-.19-.3a7.88 7.88 0 1 1 6.65 3.68z" />
    </svg>
  );
}

export default function ContactForm({
  endpoint,
  successMessage = CONTACT.successMessage,
  errorMessage = CONTACT.errorMessage,
}: ContactFormProps) {
  const [form, setForm] = useState<FormState>({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [whatsappActive, setWhatsappActive] = useState(false);
  const [mounted, setMounted] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
    const element = cardRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) setWhatsappActive(entry.isIntersecting);
      },
      { threshold: 0.2 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const validate = (): boolean => {
    const next: Partial<FormState> = {};
    if (!form.name.trim()) next.name = 'El nombre es obligatorio';
    if (!form.email.trim()) next.email = 'El email es obligatorio';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Email inválido';
    if (!form.message.trim()) next.message = 'Cuéntanos sobre tu proyecto';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus('submitting');

    try {
      if (endpoint) {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (!response.ok) throw new Error('Request failed');
      } else {
        await new Promise((resolve) => setTimeout(resolve, 800));
      }
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  const whatsappHref = `https://wa.me/${CONTACT.whatsapp.phone}?text=${encodeURIComponent(
    CONTACT.whatsapp.message,
  )}`;

  return (
    <section id="contact" className="section-padding section-surface">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div ref={cardRef} className="contact-card">
          <header className="mb-8 text-center">
            <p className="mb-2 text-sm uppercase tracking-widest text-accent">{CONTACT.label}</p>
            <h2 className="contact-card__title">{CONTACT.title}</h2>
            <p className="contact-card__subtitle">{CONTACT.subtitle}</p>
            <p className="contact-card__mail">
              {CONTACT.mailText}{' '}
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <div className={cn('contact-field-wrap', errors.name && 'contact-field-wrap--error')}>
                <input
                  type="text"
                  aria-label={CONTACT.fields.name}
                  placeholder={CONTACT.fields.name}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="contact-field"
                  aria-invalid={!!errors.name}
                />
              </div>
              {errors.name && <p className="contact-error">{errors.name}</p>}
            </div>

            <div>
              <div className={cn('contact-field-wrap', errors.email && 'contact-field-wrap--error')}>
                <input
                  type="email"
                  aria-label={CONTACT.fields.email}
                  placeholder={CONTACT.fields.email}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="contact-field"
                  aria-invalid={!!errors.email}
                />
              </div>
              {errors.email && <p className="contact-error">{errors.email}</p>}
            </div>

            <div>
              <div
                className={cn('contact-field-wrap', errors.message && 'contact-field-wrap--error')}
              >
                <textarea
                  rows={5}
                  aria-label={CONTACT.fields.message}
                  placeholder={CONTACT.fields.message}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="contact-field contact-field--textarea"
                  aria-invalid={!!errors.message}
                />
              </div>
              {errors.message && <p className="contact-error">{errors.message}</p>}
            </div>

            <button type="submit" disabled={status === 'submitting'} className="contact-submit">
              {status === 'submitting' ? CONTACT.sendingText : CONTACT.submitText}
            </button>

            {status === 'success' && (
              <p className="contact-status contact-status--success" role="status">
                {successMessage}
              </p>
            )}
            {status === 'error' && (
              <p className="contact-status contact-status--error" role="alert">
                {errorMessage}
              </p>
            )}
          </form>
        </div>
      </div>

      {mounted &&
        createPortal(
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className={cn('contact-whatsapp-fab', whatsappActive && 'is-active')}
            aria-hidden={!whatsappActive}
            tabIndex={whatsappActive ? 0 : -1}
          >
            <WhatsappIcon />
            {CONTACT.whatsapp.label}
          </a>,
          document.body,
        )}
    </section>
  );
}
