type IconName = 'logo' | 'logo-mobile' | 'search' | 'play' | 'star' | 'star-large' | 'arrow' | 'calendar' | 'heart' | 'heart-filled' | 'genre' | 'age' | 'menu';
export function Icon({ name, className = '' }: { name: IconName; className?: string }) {
  return <span className={`design-icon ${className}`} aria-hidden="true"><img src={`/assets/figma/${name}.svg`} alt="" /></span>;
}

