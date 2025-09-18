import { Building2, Globe } from 'lucide-react';

export const SearchHeader = () => {
  return (
    <div className="text-center animate-fade-in">
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="p-3 bg-gradient-primary rounded-2xl shadow-medium">
          <Building2 className="h-8 w-8 text-white" />
        </div>
        <Globe className="h-6 w-6 text-business-accent" />
      </div>
      
      <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
        Global Business Registry
      </h1>
      
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
        Search through millions of legally registered companies worldwide. 
        Access comprehensive business data from official government registries.
      </p>
      
      <div className="mt-6 flex items-center justify-center gap-8 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-business-success rounded-full"></div>
          <span>Real-time Data</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-business-primary rounded-full"></div>
          <span>Official Registries</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-business-accent rounded-full"></div>
          <span>Global Coverage</span>
        </div>
      </div>
    </div>
  );
};