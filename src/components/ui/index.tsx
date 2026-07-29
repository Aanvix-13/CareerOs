/**
 * CareerOS Design System — Shared UI Components
 *
 * These components implement the global design system tokens defined in globals.css.
 * Use these instead of inline Tailwind classes to ensure consistency across
 * Marketing Website, User Dashboard and Admin Dashboard.
 */

'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';
type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';

// ─── Button ───────────────────────────────────────────────────────────────────

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  as?: 'button' | 'a';
  href?: string;
}

const buttonSizeClasses: Record<ButtonSize, string> = {
  sm: 'text-xs px-4 py-2 rounded-xl gap-1.5',
  md: 'text-sm px-6 py-3 rounded-[14px] gap-2',
  lg: 'text-base px-8 py-4 rounded-[14px] gap-2.5',
};

const buttonVariantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[#6D5EF5] text-white font-bold hover:bg-[#5B4BE6] active:bg-[#4A3CCB] ' +
    'shadow-[0_4px_14px_rgba(109,94,245,0.25)] hover:shadow-[0_6px_20px_rgba(109,94,245,0.35)] ' +
    'hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0',
  secondary:
    'bg-white text-[#111827] font-bold border border-[#E5E7EB] hover:bg-[#F8FAFC] hover:border-[#D1D5DB] ' +
    'hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0',
  ghost:
    'bg-transparent text-[#6D5EF5] font-bold hover:bg-[#F3F1FF] ' +
    'disabled:opacity-50 disabled:cursor-not-allowed',
  danger:
    'bg-[#EF4444] text-white font-bold hover:bg-[#DC2626] ' +
    'shadow-[0_4px_14px_rgba(239,68,68,0.2)] hover:shadow-[0_6px_20px_rgba(239,68,68,0.3)] ' +
    'hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      iconRight,
      children,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const base =
      'inline-flex items-center justify-center transition-all duration-200 font-[--font-sans] select-none outline-none focus-visible:ring-2 focus-visible:ring-[#6D5EF5] focus-visible:ring-offset-2';
    const classes = `${base} ${buttonVariantClasses[variant]} ${buttonSizeClasses[size]} ${className}`;

    return (
      <button ref={ref} className={classes} disabled={disabled || loading} {...props}>
        {loading ? (
          <Loader2 className="animate-spin" style={{ width: size === 'sm' ? 14 : 16, height: size === 'sm' ? 14 : 16 }} />
        ) : icon ? (
          <span className="shrink-0">{icon}</span>
        ) : null}
        {children}
        {iconRight && !loading && <span className="shrink-0">{iconRight}</span>}
      </button>
    );
  }
);
Button.displayName = 'Button';

// ─── Card ─────────────────────────────────────────────────────────────────────

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  padding?: 'sm' | 'md' | 'lg' | 'none';
}

const cardPaddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export const Card: React.FC<CardProps> = ({
  hoverable = false,
  padding = 'md',
  children,
  className = '',
  ...props
}) => {
  const base =
    'bg-white border border-[#E5E7EB] rounded-[24px] shadow-[0_2px_8px_rgba(15,23,42,0.05)]';
  const hoverClass = hoverable
    ? 'transition-all duration-[250ms] hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)] cursor-pointer'
    : '';
  return (
    <div className={`${base} ${hoverClass} ${cardPaddingClasses[padding]} ${className}`} {...props}>
      {children}
    </div>
  );
};

// ─── Badge ────────────────────────────────────────────────────────────────────

const badgeVariantClasses: Record<BadgeVariant, string> = {
  primary: 'bg-[#F3F1FF] text-[#6D5EF5]',
  success: 'bg-[#F0FDF4] text-[#166534]',
  warning: 'bg-[#FFFBEB] text-[#92400E]',
  danger:  'bg-[#FEF2F2] text-[#991B1B]',
  info:    'bg-[#EFF6FF] text-[#1E40AF]',
  neutral: 'bg-[#F1F5F9] text-[#4B5563]',
};

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'neutral', children, className = '', dot = false }) => (
  <span
    className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${badgeVariantClasses[variant]} ${className}`}
  >
    {dot && (
      <span
        className="h-1.5 w-1.5 rounded-full shrink-0"
        style={{ backgroundColor: 'currentColor' }}
      />
    )}
    {children}
  </span>
);

// ─── Input ────────────────────────────────────────────────────────────────────

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, iconLeft, iconRight, id, className = '', ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-semibold text-[#111827]">
            {label}
            {props.required && <span className="text-[#EF4444] ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {iconLeft && (
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none">
              {iconLeft}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`
              h-12 w-full bg-white border rounded-xl font-[family-name:var(--font-sans)] text-sm
              text-[#111827] placeholder-[#6B7280] outline-none transition-all duration-200
              ${iconLeft ? 'pl-10' : 'pl-4'} ${iconRight ? 'pr-10' : 'pr-4'}
              ${error
                ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-2 focus:ring-[#EF4444]/20'
                : 'border-[#E5E7EB] focus:border-[#6D5EF5] focus:ring-2 focus:ring-[#6D5EF5]/12'}
              disabled:bg-[#F8FAFC] disabled:text-[#D1D5DB] disabled:cursor-not-allowed
              ${className}
            `}
            {...props}
          />
          {iconRight && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none">
              {iconRight}
            </span>
          )}
        </div>
        {error && <p className="text-xs text-[#EF4444] font-medium">{error}</p>}
        {hint && !error && <p className="text-xs text-[#6B7280]">{hint}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

// ─── Select ───────────────────────────────────────────────────────────────────

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, id, children, className = '', ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-sm font-semibold text-[#111827]">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={`
            h-12 w-full bg-white border rounded-xl px-4 text-sm text-[#111827] outline-none
            transition-all duration-200 cursor-pointer font-[family-name:var(--font-sans)]
            ${error
              ? 'border-[#EF4444] focus:ring-2 focus:ring-[#EF4444]/20'
              : 'border-[#E5E7EB] focus:border-[#6D5EF5] focus:ring-2 focus:ring-[#6D5EF5]/12'}
            disabled:bg-[#F8FAFC] disabled:cursor-not-allowed
            ${className}
          `}
          {...props}
        >
          {children}
        </select>
        {error && <p className="text-xs text-[#EF4444] font-medium">{error}</p>}
        {hint && !error && <p className="text-xs text-[#6B7280]">{hint}</p>}
      </div>
    );
  }
);
Select.displayName = 'Select';

// ─── Textarea ─────────────────────────────────────────────────────────────────

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, id, className = '', ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={textareaId} className="text-sm font-semibold text-[#111827]">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={`
            w-full bg-white border rounded-xl px-4 py-3 text-sm text-[#111827]
            placeholder-[#6B7280] outline-none resize-y transition-all duration-200
            font-[family-name:var(--font-sans)] min-h-[96px]
            ${error
              ? 'border-[#EF4444] focus:ring-2 focus:ring-[#EF4444]/20'
              : 'border-[#E5E7EB] focus:border-[#6D5EF5] focus:ring-2 focus:ring-[#6D5EF5]/12'}
            disabled:bg-[#F8FAFC] disabled:cursor-not-allowed
            ${className}
          `}
          {...props}
        />
        {error && <p className="text-xs text-[#EF4444] font-medium">{error}</p>}
        {hint && !error && <p className="text-xs text-[#6B7280]">{hint}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

// ─── Divider ─────────────────────────────────────────────────────────────────

export const Divider: React.FC<{ className?: string }> = ({ className = '' }) => (
  <hr className={`border-0 h-px bg-[#F1F5F9] my-0 ${className}`} />
);

// ─── Spinner ─────────────────────────────────────────────────────────────────

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
const spinnerSizes = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-8 w-8' };
export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className = '' }) => (
  <Loader2 className={`animate-spin text-[#6D5EF5] ${spinnerSizes[size]} ${className}`} />
);

// ─── Empty State ─────────────────────────────────────────────────────────────

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = '',
}) => (
  <div className={`flex flex-col items-center justify-center text-center py-16 px-6 ${className}`}>
    {icon && (
      <div className="h-14 w-14 rounded-[20px] bg-[#F3F1FF] flex items-center justify-center mb-5 text-[#6D5EF5]">
        {icon}
      </div>
    )}
    <h3 className="text-base font-bold text-[#111827] mb-2">{title}</h3>
    {description && <p className="text-sm text-[#6B7280] mb-6 max-w-sm">{description}</p>}
    {action}
  </div>
);

// ─── Page Header ─────────────────────────────────────────────────────────────

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  breadcrumb?: React.ReactNode;
  className?: string;
}
export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  actions,
  breadcrumb,
  className = '',
}) => (
  <div className={`flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8 ${className}`}>
    <div className="space-y-1">
      {breadcrumb && <div className="text-xs text-[#6B7280] font-semibold mb-1">{breadcrumb}</div>}
      <h1 className="text-2xl font-black text-[#111827] tracking-tight" style={{ fontSize: '24px' }}>{title}</h1>
      {description && <p className="text-sm text-[#6B7280]">{description}</p>}
    </div>
    {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
  </div>
);

// ─── Stat Card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: { value: string; positive: boolean };
  iconColor?: string;
  iconBg?: string;
  className?: string;
}
export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  trend,
  iconColor = 'text-[#6D5EF5]',
  iconBg = 'bg-[#F3F1FF]',
  className = '',
}) => (
  <Card hoverable className={`flex flex-col gap-4 ${className}`}>
    <div className="flex items-start justify-between">
      {icon && (
        <div className={`h-10 w-10 rounded-[12px] ${iconBg} ${iconColor} flex items-center justify-center shrink-0`}>
          {icon}
        </div>
      )}
      {trend && (
        <span
          className={`text-xs font-bold px-2.5 py-1 rounded-full ${
            trend.positive ? 'bg-[#F0FDF4] text-[#166534]' : 'bg-[#FEF2F2] text-[#991B1B]'
          }`}
        >
          {trend.value}
        </span>
      )}
    </div>
    <div>
      <div className="text-2xl font-black text-[#111827]">{value}</div>
      <div className="text-xs font-semibold text-[#6B7280] mt-0.5">{label}</div>
    </div>
  </Card>
);

// ─── Modal ────────────────────────────────────────────────────────────────────

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}
const modalSizeClasses = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' };

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Dialog */}
      <div
        className={`relative w-full ${modalSizeClasses[size]} bg-white rounded-[24px] shadow-[0_20px_60px_rgba(15,23,42,0.15)] border border-[#E5E7EB] ds-animate-scale-in`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        {(title || description) && (
          <div className="px-6 pt-6 pb-4 border-b border-[#F1F5F9]">
            {title && <h2 id="modal-title" className="text-lg font-bold text-[#111827]">{title}</h2>}
            {description && <p className="text-sm text-[#6B7280] mt-1">{description}</p>}
          </div>
        )}
        <div className="p-6">{children}</div>
        {footer && (
          <div className="px-6 pb-6 pt-0 flex items-center justify-end gap-3">{footer}</div>
        )}
      </div>
    </div>
  );
};

// ─── Alert ────────────────────────────────────────────────────────────────────

interface AlertProps {
  variant?: 'success' | 'warning' | 'danger' | 'info';
  title?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}
const alertStyles: Record<string, { container: string; title: string }> = {
  success: { container: 'bg-[#F0FDF4] border-[#BBF7D0]',   title: 'text-[#166534]' },
  warning: { container: 'bg-[#FFFBEB] border-[#FDE68A]',   title: 'text-[#92400E]' },
  danger:  { container: 'bg-[#FEF2F2] border-[#FECACA]',   title: 'text-[#991B1B]' },
  info:    { container: 'bg-[#EFF6FF] border-[#BFDBFE]',   title: 'text-[#1E40AF]' },
};
export const Alert: React.FC<AlertProps> = ({ variant = 'info', title, children, icon, className = '' }) => {
  const styles = alertStyles[variant];
  return (
    <div className={`flex gap-3 border rounded-[16px] p-4 ${styles.container} ${className}`} role="alert">
      {icon && <div className={`shrink-0 ${styles.title}`}>{icon}</div>}
      <div className="flex-1 min-w-0">
        {title && <div className={`text-sm font-bold mb-1 ${styles.title}`}>{title}</div>}
        <div className="text-sm text-[#4B5563]">{children}</div>
      </div>
    </div>
  );
};

// ─── Tabs ─────────────────────────────────────────────────────────────────────

interface Tab { id: string; label: string; icon?: React.ReactNode; count?: number }
interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}
export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange, className = '' }) => (
  <div className={`flex gap-1 border-b border-[#F1F5F9] ${className}`}>
    {tabs.map(tab => (
      <button
        key={tab.id}
        onClick={() => onChange(tab.id)}
        className={`
          relative flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-colors duration-200 outline-none
          ${activeTab === tab.id
            ? 'text-[#6D5EF5] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#6D5EF5] after:rounded-full'
            : 'text-[#6B7280] hover:text-[#111827]'}
        `}
      >
        {tab.icon && <span className="shrink-0">{tab.icon}</span>}
        {tab.label}
        {tab.count !== undefined && (
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-[#F3F1FF] text-[#6D5EF5]' : 'bg-[#F1F5F9] text-[#6B7280]'}`}>
            {tab.count}
          </span>
        )}
      </button>
    ))}
  </div>
);

// ─── Avatar ───────────────────────────────────────────────────────────────────

interface AvatarProps {
  name?: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
const avatarSizes = { sm: 'h-8 w-8 text-xs', md: 'h-10 w-10 text-sm', lg: 'h-12 w-12 text-base' };
export const Avatar: React.FC<AvatarProps> = ({ name, src, size = 'md', className = '' }) => {
  const initials = name
    ? name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '?';
  return (
    <div
      className={`rounded-full overflow-hidden flex items-center justify-center bg-[#F3F1FF] text-[#6D5EF5] font-bold shrink-0 ${avatarSizes[size]} ${className}`}
    >
      {src ? (
        <img src={src} alt={name || 'Avatar'} className="h-full w-full object-cover" />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
};

// ─── Tooltip ─────────────────────────────────────────────────────────────────

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}
const tooltipPlacement = {
  top:    'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left:   'right-full top-1/2 -translate-y-1/2 mr-2',
  right:  'left-full top-1/2 -translate-y-1/2 ml-2',
};
export const Tooltip: React.FC<TooltipProps> = ({ content, children, placement = 'top' }) => (
  <div className="relative group inline-flex">
    {children}
    <div
      className={`
        absolute ${tooltipPlacement[placement]} z-50 px-3 py-1.5 bg-[#111827] text-white text-xs font-medium
        rounded-lg whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100
        transition-opacity duration-150
      `}
      role="tooltip"
    >
      {content}
    </div>
  </div>
);
