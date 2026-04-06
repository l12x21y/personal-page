import React from 'react';
import { Contact } from '../types.ts';
import MailIcon from './icons/MailIcon.tsx';
import PhoneIcon from './icons/PhoneIcon.tsx';
import GithubIcon from './icons/GithubIcon.tsx';
import EditableInput from './common/EditableInput.tsx';
import EditableTextarea from './common/EditableTextarea.tsx';

interface ContactSectionProps {
  contact: Contact;
  onUpdateContact: (field: keyof Contact, value: string) => void;
  isViewMode?: boolean;
}

const ContactSection: React.FC<ContactSectionProps> = ({ contact, onUpdateContact, isViewMode }) => {
  const primaryEmail = (contact.email || '')
    .split('|')
    .map(p => p.trim())
    .find(p => p.includes('2353274'))
    || (contact.email || '').split('|').map(p => p.trim()).find(Boolean)
    || '2353274@tongji.edu.cn';

  return (
    <section id="contact" className="pt-10 pb-12 border-t border-gray-200">
      <div className="text-center max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        <EditableTextarea
            value={contact.intro}
            onChange={(value) => onUpdateContact('intro', value)}
            ariaLabel="Contact intro"
            className="text-lg text-gray-700 mb-8 text-center"
            isViewMode={isViewMode}
        />
        {isViewMode ? (
          <div className="flex items-center justify-center gap-6">
            <a
              href={`mailto:${primaryEmail}`}
              className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-[#c8dfea] bg-white/80 text-gray-700 hover:text-black hover:bg-white transition-colors"
              aria-label="Email 2353274"
              title="Email"
            >
              <MailIcon className="w-5 h-5" />
            </a>
            <a
              href={`tel:${contact.phone}`}
              className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-[#c8dfea] bg-white/80 text-gray-700 hover:text-black hover:bg-white transition-colors"
              aria-label="Phone"
              title="Phone"
            >
              <PhoneIcon className="w-5 h-5" />
            </a>
            {contact.github ? (
              <a
                href={contact.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-[#c8dfea] bg-white/80 text-gray-700 hover:text-black hover:bg-white transition-colors"
                aria-label="GitHub"
                title="GitHub"
              >
                <GithubIcon className="w-5 h-5" />
              </a>
            ) : null}
          </div>
        ) : (
          <div className="space-y-3 max-w-md mx-auto">
            <EditableInput
              value={contact.email}
              onChange={(v) => onUpdateContact('email', v)}
              className="text-gray-600 text-center"
              ariaLabel="Email"
              isViewMode={isViewMode}
            />
            <EditableInput
              value={contact.phone}
              onChange={(v) => onUpdateContact('phone', v)}
              className="text-gray-600 text-center"
              ariaLabel="Phone Number"
              isViewMode={isViewMode}
            />
            <EditableInput
              value={contact.github || ''}
              onChange={(v) => onUpdateContact('github', v)}
              className="text-gray-600 text-center"
              ariaLabel="GitHub"
              isViewMode={isViewMode}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default ContactSection;