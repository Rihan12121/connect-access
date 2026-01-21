import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/context/LanguageContext';

const ThemeToggle = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { language } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="icon-btn text-header-foreground/70 hover:text-header-foreground p-2 relative">
          <Sun className={`w-5 h-5 transition-all ${resolvedTheme === 'dark' ? 'scale-0 rotate-90' : 'scale-100 rotate-0'}`} />
          <Moon className={`w-5 h-5 absolute inset-0 m-auto transition-all ${resolvedTheme === 'dark' ? 'scale-100 rotate-0' : 'scale-0 -rotate-90'}`} />
          <span className="sr-only">Toggle theme</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[160px]">
        <DropdownMenuItem 
          onClick={() => setTheme('light')}
          className={theme === 'light' ? 'bg-primary/10 text-primary' : ''}
        >
          <Sun className="w-4 h-4 mr-2" />
          {language === 'de' ? 'Hell' : 'Light'}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme('dark')}
          className={theme === 'dark' ? 'bg-primary/10 text-primary' : ''}
        >
          <Moon className="w-4 h-4 mr-2" />
          {language === 'de' ? 'Dunkel' : 'Dark'}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme('system')}
          className={theme === 'system' ? 'bg-primary/10 text-primary' : ''}
        >
          <Monitor className="w-4 h-4 mr-2" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeToggle;
