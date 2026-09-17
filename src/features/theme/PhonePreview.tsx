import { useState, type CSSProperties } from 'react';
import {
  Check,
  UserRound,
  Smile,
  Baby,
  Heart,
  ArrowLeft,
  Signal,
  Wifi,
  BatteryFull,
} from 'lucide-react';
import type { ImageTheme } from './colors';
import '@fontsource/bebas-neue/400.css';

interface PreviewStyle extends CSSProperties {
  '--phone-primary': string;
  '--phone-end': string;
  '--phone-on-primary': string;
  '--phone-bg': string;
  '--phone-card': string;
  '--phone-selection': string;
  '--phone-text': string;
  '--phone-muted': string;
  '--phone-border': string;
}
interface PhonePreviewProps {
  theme: ImageTheme;
  image: string;
  reference: boolean;
}
const recipients = [
  { name: 'Pour moi', icon: UserRound },
  { name: 'Un homme', icon: UserRound },
  { name: 'Une femme', icon: Heart },
  { name: 'Un enfant', icon: Baby },
  { name: 'Un ado', icon: Smile },
];
export default function PhonePreview({ theme, image, reference }: PhonePreviewProps) {
  const [recipient, setRecipient] = useState('Pour moi');
  const [confirmed, setConfirmed] = useState(false);
  const style: PreviewStyle = {
    '--phone-primary': theme.primary,
    '--phone-end': theme.primaryEnd,
    '--phone-on-primary': theme.onPrimary,
    '--phone-bg': theme.background,
    '--phone-card': theme.surface,
    '--phone-selection': theme.selection,
    '--phone-text': theme.text,
    '--phone-muted': theme.muted,
    '--phone-border': theme.border,
  };
  function goBack() {
    setConfirmed(false);
    setRecipient('Pour moi');
  }
  function confirm() {
    setConfirmed(!confirmed);
  }
  return (
    <div className="theme-phone" style={style}>
      <div className="phone-hero">
        <img
          className={reference ? 'phone-reference' : 'phone-upload'}
          src={image}
          alt="Visuel de l’événement"
        />
        {!reference && (
          <>
            <div className="phone-status" aria-hidden="true">
              <span>9:41</span>
              <span>
                <Signal size={14} />
                <Wifi size={14} />
                <BatteryFull size={17} />
              </span>
            </div>
            <div className="phone-hero-title">
              <span>Une attention pour chacun</span>
              <strong>Le cadeau parfait</strong>
            </div>
          </>
        )}
      </div>
      <div className="phone-content">
        <div className="phone-question">
          <span>Pour</span>
          <h2>
            Qui cherchez-vous
            <br />
            un cadeau ?
          </h2>
        </div>
        <div className="phone-options" role="radiogroup" aria-label="Destinataire du cadeau">
          {recipients.map(({ name, icon: Icon }) => (
            <label className="phone-option" key={name} data-selected={recipient === name}>
              <input
                type="radio"
                name="theme-recipient"
                value={name}
                checked={recipient === name}
                onChange={() => {
                  setRecipient(name);
                  setConfirmed(false);
                }}
              />
              <span className="phone-person">
                <Icon size={20} />
              </span>
              <span>{name}</span>
              <span className="phone-radio">{recipient === name && <Check size={13} />}</span>
            </label>
          ))}
        </div>
        {confirmed && (
          <p className="phone-confirmation" role="status">
            <Check size={15} /> Choix confirmé : {recipient.toLowerCase()}.
          </p>
        )}
      </div>
      <footer className="phone-footer">
        <button className="phone-back" onClick={goBack}>
          <ArrowLeft size={14} /> Retour
        </button>
        <button className="phone-next" onClick={confirm}>
          {confirmed ? 'Modifier' : 'Suivant'}
        </button>
      </footer>
      <div className="phone-home-indicator" aria-hidden="true" />
    </div>
  );
}
