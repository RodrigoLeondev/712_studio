import { useState, type FormEvent } from 'react';
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

export default function ContactForm({
  endpoint,
  successMessage = CONTACT.successMessage,
  errorMessage = CONTACT.errorMessage,
}: ContactFormProps) {
  const [form, setForm] = useState<FormState>({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errors, setErrors] = useState<Partial<FormState>>({});

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

  return (
    <section id="contact" className="section-padding section-surface">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="contact-card glass-surface">
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
    </section>
  );
}
