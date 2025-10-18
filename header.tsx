import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import logoUrl from "@assets/educallis_09_11_2023_12_33_24_1760736963702.png";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <img 
            src={logoUrl} 
            alt="Colégio Educallis" 
            className="h-10 w-auto"
            data-testid="img-logo"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" data-testid="button-credits">
                <Info className="h-4 w-4 mr-2" />
                Créditos
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Equipe de Desenvolvimento</DialogTitle>
                <DialogDescription>
                  Projeto desenvolvido por alunos do Colégio Educallis
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 py-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium" data-testid="text-credit-1">Maria Alice Corrêa Bezerra</p>
                  <p className="text-sm font-medium" data-testid="text-credit-2">Laura Sofia Mendes Cunha</p>
                  <p className="text-sm font-medium" data-testid="text-credit-3">Gabriel Brasil Arruda Castro</p>
                  <p className="text-sm font-medium" data-testid="text-credit-4">Mateus Rocha Mendes</p>
                  <p className="text-sm font-medium" data-testid="text-credit-5">Davi Miguel Farias Costa</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
