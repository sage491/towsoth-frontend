import { useState, useEffect } from 'react';
import { Copy, Check, Mail, RefreshCw, Clock, AlertCircle, ExternalLink } from 'lucide-react';
import { JoiningLinkData, buildJoiningUrl, formatExpiryTime, getTimeRemaining } from '../../utils/joiningLinkUtils';
import { useToast } from '../../contexts/ToastContext';

interface JoiningLinkDisplayProps {
  linkData: JoiningLinkData;
  studentName: string;
  studentEmail?: string; // Add optional email prop
  onRegenerate: () => void;
  onSendEmail: () => void;
}

export function JoiningLinkDisplay({
  linkData,
  studentName,
  studentEmail,
  onRegenerate,
  onSendEmail,
}: JoiningLinkDisplayProps) {
  const { success, error: showError } = useToast();
  const [copied, setCopied] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining(linkData.expiresAt));
  
  const joiningUrl = buildJoiningUrl(linkData.token);
  
  // Update countdown every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(getTimeRemaining(linkData.expiresAt));
    }, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [linkData.expiresAt]);
  
  // Copy to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(joiningUrl);
      setCopied(true);
      success('Joining link copied to clipboard');
      
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      showError('Failed to copy link');
    }
  };
  
  // Send via email
  const handleSendEmail = () => {
    onSendEmail();
    success(`Joining link sent to ${studentName}`);
  };
  
  // Regenerate link
  const handleRegenerate = () => {
    if (confirm('Are you sure you want to regenerate this joining link? The old link will become invalid.')) {
      onRegenerate();
      success('New joining link generated successfully');
    }
  };
  
  const isExpired = timeRemaining.isExpired;
  const isAlmostExpired = !isExpired && timeRemaining.days === 0 && timeRemaining.hours < 24;
  const hasEmail = studentEmail && studentEmail.trim() !== '';
  
  return (
    <div className="bg-white border border-[#e5e7eb] p-4 sm:p-6 space-y-4 sm:space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="text-[14px] sm:text-[15px] text-[#111827] mb-1">Student Joining Link</h3>
          <p className="text-[11px] sm:text-[12px] text-[#6b7280]">
            Share this link with {studentName} to complete enrollment
          </p>
        </div>
        
        {/* Status Badge */}
        <div className={`px-3 py-1.5 text-[11px] border self-start sm:self-auto ${
          isExpired 
            ? 'bg-[#fee2e2] border-[#ef4444] text-[#991b1b]'
            : linkData.isUsed
            ? 'bg-[#d1fae5] border-[#10b981] text-[#065f46]'
            : isAlmostExpired
            ? 'bg-[#fef3c7] border-[#fbbf24] text-[#92400e]'
            : 'bg-[#dbeafe] border-[#3b82f6] text-[#1e40af]'
        }`}>
          {isExpired ? 'Expired' : linkData.isUsed ? 'Used' : 'Active'}
        </div>
      </div>
      
      {/* Expiry Warning */}
      {isExpired && (
        <div className="bg-[#fee2e2] border-l-4 border-[#ef4444] p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-[#991b1b] flex-shrink-0" />
          <div>
            <p className="text-[13px] text-[#991b1b]">
              This joining link has expired. Click "Regenerate Link" to create a new one.
            </p>
          </div>
        </div>
      )}
      
      {isAlmostExpired && !isExpired && (
        <div className="bg-[#fef3c7] border-l-4 border-[#fbbf24] p-4 flex items-start gap-3">
          <Clock className="w-5 h-5 text-[#92400e] flex-shrink-0" />
          <div>
            <p className="text-[13px] text-[#92400e]">
              This link will expire soon. Consider regenerating if the student hasn't joined yet.
            </p>
          </div>
        </div>
      )}
      
      {/* Joining URL */}
      <div className="space-y-2">
        <label className="block text-[13px] text-[#374151]">Joining URL</label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={joiningUrl}
            readOnly
            className="flex-1 px-4 py-2.5 bg-[#f9fafb] border border-[#d1d5db] text-[13px] text-[#111827] select-all focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)]"
          />
          <button
            onClick={handleCopy}
            className="px-4 py-2.5 bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white text-[13px] transition-colors flex items-center gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Link Details Grid */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#f3f4f6]">
        <div>
          <p className="text-[11px] text-[#9ca3af] uppercase tracking-wider mb-1">Created</p>
          <p className="text-[13px] text-[#111827]">
            {new Date(linkData.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </p>
        </div>
        
        <div>
          <p className="text-[11px] text-[#9ca3af] uppercase tracking-wider mb-1">Expires</p>
          <p className={`text-[13px] ${isExpired ? 'text-[#dc2626]' : isAlmostExpired ? 'text-[#f59e0b]' : 'text-[#111827]'}`}>
            {new Date(linkData.expiresAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </p>
        </div>
        
        <div>
          <p className="text-[11px] text-[#9ca3af] uppercase tracking-wider mb-1">Time Left</p>
          <p className={`text-[13px] ${isExpired ? 'text-[#dc2626]' : isAlmostExpired ? 'text-[#f59e0b]' : 'text-[#111827]'}`}>
            {formatExpiryTime(linkData.expiresAt)}
          </p>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 pt-4 border-t border-[#f3f4f6]">
        <button
          onClick={handleSendEmail}
          disabled={isExpired || linkData.isUsed || !hasEmail}
          title={!hasEmail ? 'No email address provided' : hasEmail ? `Send to ${studentEmail}` : ''}
          className="flex-1 px-4 py-2.5 bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white text-[13px] font-normal hover:font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:font-normal"
        >
          <Mail className="w-4 h-4" />
          <span className="hidden sm:inline">Send via Email</span>
          <span className="sm:hidden">Send Email</span>
        </button>
        
        <button
          onClick={handleRegenerate}
          className="flex-1 px-4 py-2.5 border border-[#d1d5db] hover:border-[#9ca3af] text-[#374151] hover:text-[#111827] text-[13px] font-normal hover:font-semibold transition-all flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Regenerate Link
        </button>
        
        <a
          href={joiningUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2.5 border border-[#d1d5db] hover:border-[#9ca3af] text-[#374151] hover:text-[#111827] text-[13px] font-normal hover:font-semibold transition-all flex items-center justify-center gap-2 sm:justify-start"
        >
          <ExternalLink className="w-4 h-4" />
          Preview
        </a>
      </div>
      
      {/* Email Info */}
      {hasEmail ? (
        <div className="bg-[#dbeafe] border border-[#3b82f6] p-3 flex items-center gap-3">
          <Mail className="w-4 h-4 text-[#1e40af] flex-shrink-0" />
          <p className="text-[12px] text-[#1e40af]">
            Email will be sent to: <strong>{studentEmail}</strong>
          </p>
        </div>
      ) : (
        <div className="bg-[#fef3c7] border border-[#fbbf24] p-3 flex items-center gap-3">
          <AlertCircle className="w-4 h-4 text-[#92400e] flex-shrink-0" />
          <p className="text-[12px] text-[#92400e]">
            No email address provided. You can copy the link manually or add an email address to enable email sending.
          </p>
        </div>
      )}
    </div>
  );
}