import React, { useState } from 'react';
import { Copy, Check, ExternalLink, Link2 } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { getShareableLink, copyToClipboard } from '../../utils/helpers';

export const ShareLinkModal = ({ isOpen, onClose, schedule }) => {
  const [copied, setCopied] = useState(false);

  if (!schedule) return null;

  const shareableUrl = getShareableLink(schedule.linkToken);

  const handleCopy = async () => {
    const success = await copyToClipboard(shareableUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share Invitation Link">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <p style={{ fontSize: '0.92rem' }}>
          Share this unique booking link with your students or attendees. They will be able to choose an available time slot and submit meeting requests.
        </p>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Public Booking URL</label>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input
              type="text"
              readOnly
              value={shareableUrl}
              className="form-input"
              style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}
            />
            <Button
              variant={copied ? 'success' : 'primary'}
              onClick={handleCopy}
              icon={copied ? Check : Copy}
            >
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
          <Button
            variant="secondary"
            icon={ExternalLink}
            onClick={() => window.open(shareableUrl, '_blank')}
          >
            Preview Booking Page
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ShareLinkModal;
