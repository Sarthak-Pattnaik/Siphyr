interface Props {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white';
}

export default function LoadingSpinner({ size = 'md', color = 'primary' }: Props) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const colorClasses = {
    primary: 'border-primary-500',
    white: 'border-white'
  };

  return (
    <div className={`animate-spin rounded-full border-2 border-t-transparent ${sizeClasses[size]} ${colorClasses[color]}`} />
  );
}
