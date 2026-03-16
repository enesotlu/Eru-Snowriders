export default function MountainIcon({ className = "w-12 h-12", strokeWidth = "1.5" }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth={strokeWidth} 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z"/>
    </svg>
  );
}
